import jwt
from datetime import datetime, timedelta, timezone
from functools import wraps
from flask import request, jsonify

from config import Config


def generate_token(user_id):
    """
    Generate a JWT token with an expiration time.
    """

    now = datetime.now(timezone.utc)

    payload = {
        "user_id": str(user_id),
        "iat": now,
        "exp": now + timedelta(
            hours=Config.JWT_EXPIRATION_HOURS
        )
    }

    token = jwt.encode(
        payload,
        Config.JWT_SECRET,
        algorithm="HS256"
    )

    return token


def token_required(function):
    """
    Protect API routes using JWT authentication.
    """

    @wraps(function)
    def decorated(*args, **kwargs):

        auth_header = request.headers.get("Authorization")

        if not auth_header:
            return jsonify({
                "success": False,
                "message": "Authorization token is required."
            }), 401

        try:
            parts = auth_header.split(" ")

            if len(parts) != 2 or parts[0] != "Bearer":
                return jsonify({
                    "success": False,
                    "message": "Invalid authorization format."
                }), 401

            token = parts[1]

            payload = jwt.decode(
                token,
                Config.JWT_SECRET,
                algorithms=["HS256"]
            )

            user_id = payload.get("user_id")

            if not user_id:
                return jsonify({
                    "success": False,
                    "message": "Invalid token."
                }), 401

            request.user_id = user_id

        except jwt.ExpiredSignatureError:
            return jsonify({
                "success": False,
                "message": "Token has expired. Please login again."
            }), 401

        except jwt.InvalidTokenError:
            return jsonify({
                "success": False,
                "message": "Invalid or expired token."
            }), 401

        return function(*args, **kwargs)

    return decorated