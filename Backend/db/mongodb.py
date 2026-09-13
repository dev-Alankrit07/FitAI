from pymongo import MongoClient
from config import Config

client = None
db = None

try:
    client = MongoClient(
        Config.MONGO_URI,
        serverSelectionTimeoutMS=5000
    )

    # Test MongoDB connection
    client.admin.command("ping")

    # Connect to FitAI database
    db = client["fitAI"]

    print("✅ MongoDB connected successfully.")
    print("✅ Database: fitAI")

except Exception as error:
    print("❌ MongoDB connection failed.")
    print("Error:", error)