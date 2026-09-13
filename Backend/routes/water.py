from flask import Blueprint, request, jsonify
from bson import ObjectId
from datetime import datetime

from db.mongodb import db
from models.water import create_water_document
from utils.auth import token_required
from utils.helpers import serialize_document

water_bp = Blueprint(
    "water",
    __name__,
    url_prefix="/api/water"
)


# =====================================================
# ADD WATER
# =====================================================

@water_bp.route("", methods=["POST"])
@token_required
def add_water():

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

    amount = data.get("amount")

    if amount is None:
        return jsonify({
            "success": False,
            "message": "Water amount is required."
        }), 400

    try:
        amount = float(amount)
    except (TypeError, ValueError):
        return jsonify({
            "success": False,
            "message": "Water amount must be a valid number."
        }), 400

    if amount <= 0:
        return jsonify({
            "success": False,
            "message": "Water amount must be greater than 0."
        }), 400

    if amount > 10000:
        return jsonify({
            "success": False,
            "message": "Water amount cannot exceed 10,000 ml."
        }), 400

    document = create_water_document(
        user_id,
        amount
    )

    result = db.water.insert_one(document)

    return jsonify({
        "success": True,
        "message": "Water intake saved successfully.",
        "water_id": str(result.inserted_id)
    }), 201


# =====================================================
# GET WATER
# =====================================================

@water_bp.route("", methods=["GET"])
@token_required
def get_water():

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

    water_records = db.water.find(
        {
            "user_id": user_id
        }
    ).sort(
        "created_at",
        -1
    )

    result = []

    for record in water_records:
        result.append(
            serialize_document(record)
        )

    return jsonify({
        "success": True,
        "water": result
    })


# =====================================================
# RESET TODAY'S WATER
# =====================================================

@water_bp.route("/today", methods=["DELETE"])
@token_required
def reset_today_water():

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

    now = datetime.now()

    start_of_day = datetime(
        now.year,
        now.month,
        now.day
    )

    start_of_next_day = datetime(
        now.year,
        now.month,
        now.day + 1
    )

    result = db.water.delete_many({
        "user_id": user_id,
        "created_at": {
            "$gte": start_of_day,
            "$lt": start_of_next_day
        }
    })

    return jsonify({
        "success": True,
        "message": "Today's water has been reset.",
        "deleted_count": result.deleted_count
    })


# =====================================================
# DELETE SINGLE WATER RECORD
# =====================================================

@water_bp.route("/<water_id>", methods=["DELETE"])
@token_required
def delete_water(water_id):

    if db is None:
        return jsonify({
            "success": False,
            "message": "Database is not connected."
        }), 500

    try:
        user_id = ObjectId(request.user_id)
        water_object_id = ObjectId(water_id)
    except Exception:
        return jsonify({
            "success": False,
            "message": "Invalid water record ID."
        }), 400

    result = db.water.delete_one({
        "_id": water_object_id,
        "user_id": user_id
    })

    if result.deleted_count == 0:
        return jsonify({
            "success": False,
            "message": "Water record not found."
        }), 404

    return jsonify({
        "success": True,
        "message": "Water record deleted successfully."
    })