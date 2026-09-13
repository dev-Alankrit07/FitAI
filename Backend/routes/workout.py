from flask import Blueprint, request, jsonify
from bson import ObjectId

from db.mongodb import db
from models.workout import create_workout_document
from utils.auth import token_required
from utils.helpers import serialize_document


workout_bp = Blueprint(
    "workout",
    __name__,
    url_prefix="/api/workouts"
)


@workout_bp.route("", methods=["POST"])
@token_required
def add_workout():

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

    category = data.get("category", "").strip()
    workout = data.get("workout", "").strip()

    if not category or not workout:
        return jsonify({
            "success": False,
            "message": "Category and workout are required."
        }), 400

    document = create_workout_document(
        user_id,
        category,
        workout,
        data.get("sets"),
        data.get("reps"),
        data.get("weight"),
        data.get("duration"),
        data.get("notes", "")
    )

    result = db.workouts.insert_one(document)

    return jsonify({
        "success": True,
        "message": "Workout saved successfully.",
        "workout_id": str(result.inserted_id)
    }), 201


@workout_bp.route("", methods=["GET"])
@token_required
def get_workouts():

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

    workouts = db.workouts.find({
        "user_id": user_id
    }).sort(
        "created_at",
        -1
    )

    result = []

    for workout in workouts:
        result.append(
            serialize_document(workout)
        )

    return jsonify({
        "success": True,
        "workouts": result
    })


@workout_bp.route("/<workout_id>", methods=["DELETE"])
@token_required
def delete_workout(workout_id):

    if db is None:
        return jsonify({
            "success": False,
            "message": "Database is not connected."
        }), 500

    try:
        user_id = ObjectId(request.user_id)
        workout_object_id = ObjectId(workout_id)

    except Exception:
        return jsonify({
            "success": False,
            "message": "Invalid workout ID."
        }), 400

    result = db.workouts.delete_one({
        "_id": workout_object_id,
        "user_id": user_id
    })

    if result.deleted_count == 0:
        return jsonify({
            "success": False,
            "message": "Workout not found."
        }), 404

    return jsonify({
        "success": True,
        "message": "Workout deleted successfully."
    })