from datetime import datetime


def create_water_document(
    user_id,
    amount
):

    return {
        "user_id": user_id,
        "amount": amount,
        "created_at": datetime.utcnow()
    }