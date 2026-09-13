from datetime import datetime


def create_motivation_document(
    user_id,
    date,
    quote,
    quote_author,
    challenge_title,
    challenge_description,
    challenge_completed=False
):
    return {
        "user_id": user_id,
        "date": date,
        "quote": quote,
        "quote_author": quote_author,
        "challenge_title": challenge_title,
        "challenge_description": challenge_description,
        "challenge_completed": challenge_completed,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }