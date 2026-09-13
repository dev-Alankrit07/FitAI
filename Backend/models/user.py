from datetime import datetime


def create_user_document(
    name,
    email,
    password_hash
):

    return {
        "name": name,
        "email": email.lower().strip(),
        "password_hash": password_hash,
        "age": None,
        "gender": None,
        "height": None,
        "weight": None,
        "bmi": None,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }