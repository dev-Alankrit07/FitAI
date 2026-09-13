from flask import Blueprint, request, jsonify
from bson import ObjectId

from db.mongodb import db
from models.diet import create_meal_document
from utils.auth import token_required
from utils.helpers import serialize_document


diet_bp = Blueprint(
    "diet",
    __name__,
    url_prefix="/api/diet"
)


@diet_bp.route("", methods=["POST"])
@token_required
def add_meal():

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


    meal_type = data.get(
        "meal_type",
        ""
    ).strip()

    food = data.get(
        "food",
        ""
    ).strip()

    quantity = data.get(
        "quantity",
        ""
    ).strip()

    notes = data.get(
        "notes",
        ""
    ).strip()


    if not meal_type or not food or not quantity:

        return jsonify({
            "success": False,
            "message": "Meal type, food and quantity are required."
        }), 400


    document = create_meal_document(
        user_id,
        meal_type,
        food,
        quantity,
        notes
    )


    result = db.diet.insert_one(
        document
    )


    return jsonify({
        "success": True,
        "message": "Meal added successfully.",
        "meal_id": str(
            result.inserted_id
        )
    }), 201


@diet_bp.route("", methods=["GET"])
@token_required
def get_meals():

    if db is None:
        return jsonify({
            "success": False,
            "message": "Database is not connected."
        }), 500


    try:
        user_id = ObjectId(
            request.user_id
        )

    except Exception:
        return jsonify({
            "success": False,
            "message": "Invalid user ID."
        }), 401


    meals = db.diet.find(
        {
            "user_id": user_id
        }
    ).sort(
        "created_at",
        -1
    )


    result = []


    for meal in meals:

        result.append(
            serialize_document(
                meal
            )
        )


    return jsonify({
        "success": True,
        "meals": result
    })


@diet_bp.route(
    "/<meal_id>",
    methods=["DELETE"]
)
@token_required
def delete_meal(meal_id):

    if db is None:
        return jsonify({
            "success": False,
            "message": "Database is not connected."
        }), 500


    try:

        user_id = ObjectId(
            request.user_id
        )

        meal_object_id = ObjectId(
            meal_id
        )

    except Exception:

        return jsonify({
            "success": False,
            "message": "Invalid meal ID."
        }), 400


    result = db.diet.delete_one(
        {
            "_id": meal_object_id,
            "user_id": user_id
        }
    )


    if result.deleted_count == 0:

        return jsonify({
            "success": False,
            "message": "Meal not found."
        }), 404


    return jsonify({
        "success": True,
        "message": "Meal deleted successfully."
    })