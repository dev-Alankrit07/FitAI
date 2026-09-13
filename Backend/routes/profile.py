from flask import Blueprint, request, jsonify
from bson import ObjectId

from db.mongodb import db
from utils.auth import token_required


profile_bp = Blueprint(
    "profile",
    __name__,
    url_prefix="/api/profile"
)


@profile_bp.route("", methods=["GET"])
@token_required
def get_profile():

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

    user = db.users.find_one({
        "_id": user_id
    })

    if not user:
        return jsonify({
            "success": False,
            "message": "User not found."
        }), 404

    return jsonify({
        "success": True,
        "user": {
            "id": str(user["_id"]),
            "name": user.get("name", ""),
            "email": user.get("email", ""),
            "age": user.get("age"),
            "gender": user.get("gender"),
            "height": user.get("height"),
            "weight": user.get("weight"),
            "bmi": user.get("bmi")
        }
    })


@profile_bp.route("", methods=["PUT"])
@token_required
def update_profile():

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

    allowed_fields = [
        "name",
        "age",
        "gender",
        "height",
        "weight",
        "bmi"
    ]

    update_data = {}

    for field in allowed_fields:
        if field in data:
            update_data[field] = data[field]

    if not update_data:
        return jsonify({
            "success": False,
            "message": "No profile data provided."
        }), 400

    from datetime import datetime

    update_data["updated_at"] = datetime.utcnow()

    result = db.users.update_one(
        {
            "_id": user_id
        },
        {
            "$set": update_data
        }
    )

    if result.matched_count == 0:
        return jsonify({
            "success": False,
            "message": "User not found."
        }), 404

    return jsonify({
        "success": True,
        "message": "Profile updated successfully."
    })