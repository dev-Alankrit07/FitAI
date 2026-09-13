from flask import Blueprint, request, jsonify
from bson import ObjectId
from datetime import datetime

from db.mongodb import db
from models.motivation import create_motivation_document
from utils.auth import token_required
from utils.helpers import serialize_document


motivation_bp = Blueprint(
    "motivation",
    __name__,
    url_prefix="/api/motivation"
)


# =====================================================
# GET TODAY'S MOTIVATION
# =====================================================

@motivation_bp.route("/today", methods=["GET"])
@token_required
def get_today_motivation():

    if db is None:
        return jsonify({
            "success": False,
            "message": "Database is not connected."
        }), 500

    try:
        user_id = ObjectId(request.user_id)
    except Exception:
        return jsonify({
            "success": False,
            "message": "Invalid user ID."
        }), 401

    today = datetime.now().strftime("%Y-%m-%d")

    motivation = db.motivation.find_one({
        "user_id": user_id,
        "date": today
    })

    if not motivation:
        return jsonify({
            "success": True,
            "exists": False,
            "motivation": None
        })

    return jsonify({
        "success": True,
        "exists": True,
        "motivation": serialize_document(motivation)
    })


# =====================================================
# CREATE TODAY'S MOTIVATION
# =====================================================

@motivation_bp.route("", methods=["POST"])
@token_required
def create_motivation():

    if db is None:
        return jsonify({
            "success": False,
            "message": "Database is not connected."
        }), 500

    try:
        user_id = ObjectId(request.user_id)
    except Exception:
        return jsonify({
            "success": False,
            "message": "Invalid user ID."
        }), 401

    data = request.get_json() or {}

    quote = data.get("quote", "").strip()
    quote_author = data.get("quote_author", "").strip()
    challenge_title = data.get("challenge_title", "").strip()
    challenge_description = data.get(
        "challenge_description",
        ""
    ).strip()

    if not quote:
        return jsonify({
            "success": False,
            "message": "Quote is required."
        }), 400

    if not challenge_title:
        return jsonify({
            "success": False,
            "message": "Challenge title is required."
        }), 400

    today = datetime.now().strftime("%Y-%m-%d")

    existing = db.motivation.find_one({
        "user_id": user_id,
        "date": today
    })

    if existing:
        return jsonify({
            "success": True,
            "message": "Today's motivation already exists.",
            "motivation": serialize_document(existing)
        })

    document = create_motivation_document(
        user_id=user_id,
        date=today,
        quote=quote,
        quote_author=quote_author,
        challenge_title=challenge_title,
        challenge_description=challenge_description,
        challenge_completed=False
    )

    result = db.motivation.insert_one(document)

    created = db.motivation.find_one({
        "_id": result.inserted_id
    })

    return jsonify({
        "success": True,
        "message": "Motivation saved successfully.",
        "motivation": serialize_document(created)
    }), 201


# =====================================================
# COMPLETE TODAY'S CHALLENGE
# =====================================================

@motivation_bp.route(
    "/today/complete",
    methods=["PUT"]
)
@token_required
def complete_today_challenge():

    if db is None:
        return jsonify({
            "success": False,
            "message": "Database is not connected."
        }), 500

    try:
        user_id = ObjectId(request.user_id)
    except Exception:
        return jsonify({
            "success": False,
            "message": "Invalid user ID."
        }), 401

    today = datetime.now().strftime("%Y-%m-%d")

    result = db.motivation.update_one(
        {
            "user_id": user_id,
            "date": today
        },
        {
            "$set": {
                "challenge_completed": True,
                "updated_at": datetime.utcnow()
            }
        }
    )

    if result.matched_count == 0:
        return jsonify({
            "success": False,
            "message": "Today's motivation was not found."
        }), 404

    return jsonify({
        "success": True,
        "message": "Challenge completed successfully."
    })


# =====================================================
# GET MOTIVATION HISTORY
# =====================================================

@motivation_bp.route("/history", methods=["GET"])
@token_required
def get_motivation_history():

    if db is None:
        return jsonify({
            "success": False,
            "message": "Database is not connected."
        }), 500

    try:
        user_id = ObjectId(request.user_id)
    except Exception:
        return jsonify({
            "success": False,
            "message": "Invalid user ID."
        }), 401

    motivations = db.motivation.find(
        {
            "user_id": user_id
        }
    ).sort(
        "date",
        -1
    )

    result = []

    for motivation in motivations:
        result.append(
            serialize_document(motivation)
        )

    return jsonify({
        "success": True,
        "motivations": result
    })