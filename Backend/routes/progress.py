from flask import Blueprint, request, jsonify

from bson import ObjectId

from db.mongodb import db

from models.progress import create_progress_document

from utils.auth import token_required

from utils.helpers import serialize_document


progress_bp = Blueprint(
    "progress",
    __name__,
    url_prefix="/api/progress"
)


@progress_bp.route("", methods=["POST"])
@token_required
def add_progress():

    data = request.get_json() or {}

    weight = data.get("weight")
    bmi = data.get("bmi")
    notes = data.get("notes")

    progress = create_progress_document(
        ObjectId(request.user_id),
        weight,
        bmi,
        notes
    )

    result = db.progress.insert_one(progress)

    return jsonify({
        "success": True,
        "message": "Progress saved successfully.",
        "progress_id": str(result.inserted_id)
    }), 201


@progress_bp.route("", methods=["GET"])
@token_required
def get_progress():

    records = db.progress.find({
        "user_id": ObjectId(request.user_id)
    }).sort(
        "created_at",
        -1
    )

    result = []

    for record in records:

        result.append(
            serialize_document(record)
        )

    return jsonify({
        "success": True,
        "progress": result
    })