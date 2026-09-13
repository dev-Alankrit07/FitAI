from flask import Blueprint, request, jsonify
from bson import ObjectId
from datetime import datetime

from db.mongodb import db
from config import Config
from utils.auth import token_required


chatbot_bp = Blueprint(
    "chatbot",
    __name__,
    url_prefix="/api/chat"
)


@chatbot_bp.route("", methods=["POST"])
@token_required
def chat():

    data = request.get_json() or {}

    message = data.get("message", "").strip()

    if not message:
        return jsonify({
            "success": False,
            "message": "Message is required."
        }), 400


    if not Config.GEMINI_API_KEY:
        return jsonify({
            "success": False,
            "message": "Gemini AI service is not configured yet."
        }), 503


    try:

        user_id = ObjectId(request.user_id)


        # ==========================================
        # USER PROFILE
        # ==========================================

        user = db.users.find_one({
            "_id": user_id
        })

        if not user:
            return jsonify({
                "success": False,
                "message": "User not found."
            }), 404


        # ==========================================
        # RECENT WORKOUTS
        # ==========================================

        workouts_cursor = db.workouts.find(
            {
                "user_id": user_id
            }
        ).sort(
            "created_at",
            -1
        ).limit(5)


        recent_workouts = []

        for workout in workouts_cursor:

            recent_workouts.append({
                "category":
                    workout.get("category"),

                "workout":
                    workout.get("workout"),

                "sets":
                    workout.get("sets"),

                "reps":
                    workout.get("reps"),

                "weight":
                    workout.get("weight"),

                "duration":
                    workout.get("duration"),

                "created_at":
                    str(workout.get("created_at"))
            })


        # ==========================================
        # RECENT MEALS
        # ==========================================

        meals_cursor = db.diet.find(
            {
                "user_id": user_id
            }
        ).sort(
            "created_at",
            -1
        ).limit(5)


        recent_meals = []

        for meal in meals_cursor:

            recent_meals.append({
                "meal_type":
                    meal.get("meal_type"),

                "food":
                    meal.get("food"),

                "quantity":
                    meal.get("quantity"),

                "created_at":
                    str(meal.get("created_at"))
            })


        # ==========================================
        # TODAY'S WATER
        # ==========================================

        today = datetime.now().strftime(
            "%Y-%m-%d"
        )


        water_cursor = db.water.find({
            "user_id": user_id
        })


        today_water = 0


        for water in water_cursor:

            created_at = water.get(
                "created_at"
            )

            if not created_at:
                continue


            if isinstance(
                created_at,
                datetime
            ):

                water_date = (
                    created_at.strftime(
                        "%Y-%m-%d"
                    )
                )

                if water_date == today:

                    today_water += float(
                        water.get(
                            "amount",
                            0
                        )
                    )


        # ==========================================
        # TODAY'S MOTIVATION
        # ==========================================

        motivation = db.motivation.find_one({
            "user_id": user_id,
            "date": today
        })


        motivation_data = {

            "challenge_title":
                motivation.get(
                    "challenge_title"
                ) if motivation else None,

            "challenge_description":
                motivation.get(
                    "challenge_description"
                ) if motivation else None,

            "challenge_completed":
                motivation.get(
                    "challenge_completed",
                    False
                ) if motivation else False
        }


        # ==========================================
        # CHAT HISTORY / MEMORY
        # ==========================================

        history_cursor = db.chat_history.find(
            {
                "user_id": user_id
            }
        ).sort(
            "created_at",
            -1
        ).limit(10)


        chat_history = list(
            history_cursor
        )


        chat_history.reverse()


        conversation_memory = []


        for chat in chat_history:

            conversation_memory.append(
                f"""
User: {chat.get("message", "")}

FitAI Coach: {chat.get("response", "")}
"""
            )


        conversation_text = (
            "\n".join(
                conversation_memory
            )
            if conversation_memory
            else
            "No previous conversation."
        )


        # ==========================================
        # FITNESS CONTEXT
        # ==========================================

        fitness_context = f"""
FITAI USER PROFILE

Name:
{user.get("name", "User")}

Gender:
{user.get("gender", "Not provided")}

Age:
{user.get("age", "Not provided")}

Height:
{user.get("height", "Not provided")} cm

Weight:
{user.get("weight", "Not provided")} kg

BMI:
{user.get("bmi", "Not calculated")}


RECENT WORKOUTS

{recent_workouts}


RECENT MEALS

{recent_meals}


TODAY'S WATER

{today_water} ml


TODAY'S MOTIVATION

Challenge:
{motivation_data["challenge_title"]}

Description:
{motivation_data["challenge_description"]}

Completed:
{motivation_data["challenge_completed"]}
"""


        # ==========================================
        # GEMINI
        # ==========================================

        from google import genai


        client = genai.Client(
            api_key=Config.GEMINI_API_KEY
        )


        system_instruction = f"""
You are FitAI AI Coach.

You are a friendly, supportive and practical
fitness assistant.

You have access to the user's FitAI data
and recent conversation history.

Use this information to make your answers
personalized and conversational.

IMPORTANT:

- Remember relevant information from the
  previous conversation.
- Understand follow-up questions.
- Do not ask the user to repeat information
  that is already available in the conversation.
- Use the user's FitAI data when relevant.
- Do not invent user information.
- If information is unavailable, say so.

USER'S FITAI DATA:

{fitness_context}


RECENT CONVERSATION:

{conversation_text}


You can help with:

- workouts
- exercise routines
- healthy eating
- hydration
- motivation
- fitness progress
- beginner fitness guidance
- workout planning
- general fitness questions

Keep answers beginner-friendly and practical.

Give concise answers unless the user asks
for a detailed explanation.

Do not diagnose medical conditions.

Do not provide dangerous, extreme or unsafe
fitness advice.

Do not recommend starvation, extreme dieting,
excessive exercise or unsafe weight-loss methods.

If the user has a serious medical concern,
injury or symptoms requiring medical attention,
recommend consulting a qualified healthcare
professional.

You are an AI fitness coach, not a doctor.
"""


        response = client.models.generate_content(

            model=Config.GEMINI_MODEL,

            contents=message,

            config={
                "system_instruction":
                    system_instruction
            }
        )


        answer = response.text


        if not answer:

            return jsonify({
                "success": False,
                "message":
                    "The AI returned an empty response."
            }), 500


        # ==========================================
        # SAVE CHAT HISTORY
        # ==========================================

        db.chat_history.insert_one({

            "user_id":
                user_id,

            "message":
                message,

            "response":
                answer,

            "created_at":
                datetime.utcnow()

        })


        return jsonify({

            "success": True,

            "response":
                answer

        })


    except Exception as error:

        print(
            "Gemini AI error:",
            error
        )


        return jsonify({

            "success": False,

            "message":
                "Unable to contact Gemini AI service."

        }), 500