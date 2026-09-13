import os

from flask import Flask, jsonify, send_from_directory
from flask_cors import CORS

from config import Config
from db.mongodb import db

# -----------------------------------
# ROUTES
# -----------------------------------

from routes.auth import auth_bp
from routes.profile import profile_bp
from routes.workout import workout_bp
from routes.diet import diet_bp
from routes.water import water_bp
from routes.progress import progress_bp
from routes.chatbot import chatbot_bp
from routes.motivation import motivation_bp


# -----------------------------------
# FRONTEND PATH
# -----------------------------------

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FRONTEND_DIR = os.path.join(BASE_DIR, "Frontend")


# -----------------------------------
# CREATE FLASK APP
# -----------------------------------

app = Flask(
    __name__,
    static_folder=FRONTEND_DIR,
    static_url_path=""
)

app.config.from_object(Config)


# -----------------------------------
# CORS
# -----------------------------------

CORS(
    app,
    resources={
        r"/api/*": {
            "origins": [
                "http://127.0.0.1:5500",
                "http://localhost:5500"
            ]
        }
    }
)


# -----------------------------------
# REGISTER BLUEPRINTS
# -----------------------------------

app.register_blueprint(auth_bp)
app.register_blueprint(profile_bp)
app.register_blueprint(workout_bp)
app.register_blueprint(diet_bp)
app.register_blueprint(water_bp)
app.register_blueprint(progress_bp)
app.register_blueprint(chatbot_bp)
app.register_blueprint(motivation_bp)


# -----------------------------------
# FRONTEND HOME
# -----------------------------------

@app.route("/")
def home():
    return send_from_directory(
        FRONTEND_DIR,
        "index.html"
    )


# -----------------------------------
# API TEST
# -----------------------------------

@app.route("/api/test")
def test_api():

    return jsonify({
        "success": True,
        "message": "FitAI API is working."
    })


# -----------------------------------
# DATABASE TEST
# -----------------------------------

@app.route("/api/db-test")
def database_test():

    if db is None:

        return jsonify({
            "success": False,
            "message": "MongoDB is not connected."
        }), 500

    try:

        db.command("ping")

        return jsonify({
            "success": True,
            "message": "MongoDB connection is working.",
            "database": "fitai"
        })

    except Exception as error:

        return jsonify({
            "success": False,
            "message": str(error)
        }), 500


# -----------------------------------
# START SERVER
# -----------------------------------

if __name__ == "__main__":

    app.run(
        host="0.0.0.0",
        port=int(os.environ.get("PORT", 5000)),
        debug=False
    )
