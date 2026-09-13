from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from bson import ObjectId

from db.mongodb import db
from models.user import create_user_document
from utils.validators import validate_email, validate_password
from utils.auth import generate_token, token_required


auth_bp = Blueprint(
    "auth",
    __name__,
    url_prefix="/api/auth"
)


# =========================
# REGISTER
# =========================

@auth_bp.route("/register", methods=["POST"])
def register():

    if db is None:
        return jsonify({
            "success": False,
            "message": "Database is not connected."
        }), 500

    data = request.get_json() or {}

    name = data.get("name", "").strip()
    email = data.get("email", "").strip().lower()
    password = data.get("password", "")


    if not name:
        return jsonify({
            "success": False,
            "message": "Name is required."
        }), 400


    if not validate_email(email):
        return jsonify({
            "success": False,
            "message": "Please enter a valid email."
        }), 400


    if not validate_password(password):
        return jsonify({
            "success": False,
            "message": "Password must contain at least 6 characters."
        }), 400


    existing_user = db.users.find_one({
        "email": email
    })


    if existing_user:

        return jsonify({
            "success": False,
            "message": "An account with this email already exists."
        }), 409


    password_hash = generate_password_hash(password)


    user = create_user_document(
        name,
        email,
        password_hash
    )


    result = db.users.insert_one(user)


    token = generate_token(
        result.inserted_id
    )


    return jsonify({

        "success": True,

        "message": "Registration successful.",

        "token": token,

        "user": {
            "id": str(result.inserted_id),
            "name": name,
            "email": email
        }

    }), 201


# =========================
# LOGIN
# =========================

@auth_bp.route("/login", methods=["POST"])
def login():

    if db is None:
        return jsonify({
            "success": False,
            "message": "Database is not connected."
        }), 500


    data = request.get_json() or {}

    email = data.get(
        "email",
        ""
    ).strip().lower()

    password = data.get(
        "password",
        ""
    )


    if not email or not password:

        return jsonify({
            "success": False,
            "message": "Email and password are required."
        }), 400


    user = db.users.find_one({
        "email": email
    })


    if not user:

        return jsonify({
            "success": False,
            "message": "Invalid email or password."
        }), 401


    if not check_password_hash(
        user["password_hash"],
        password
    ):

        return jsonify({
            "success": False,
            "message": "Invalid email or password."
        }), 401


    token = generate_token(
        user["_id"]
    )


    return jsonify({

        "success": True,

        "message": "Login successful.",

        "token": token,

        "user": {
            "id": str(user["_id"]),
            "name": user["name"],
            "email": user["email"]
        }

    })


# =========================
# CURRENT USER
# =========================

@auth_bp.route("/me", methods=["GET"])
@token_required
def me():

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


# =========================
# LOGOUT
# =========================

@auth_bp.route("/logout", methods=["POST"])
@token_required
def logout():

    return jsonify({

        "success": True,

        "message": "Logout successful."

    })