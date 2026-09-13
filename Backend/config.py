import os
from dotenv import load_dotenv

load_dotenv()


class Config:
    # MongoDB
    MONGO_URI = os.getenv("MONGO_URI")

    # JWT
    JWT_SECRET = os.getenv("JWT_SECRET")
    JWT_EXPIRATION_HOURS = int(
        os.getenv("JWT_EXPIRATION_HOURS", "24")
    )

    # Gemini AI
    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
    GEMINI_MODEL = os.getenv(
        "GEMINI_MODEL",
        "gemini-3.6-flash"
    )