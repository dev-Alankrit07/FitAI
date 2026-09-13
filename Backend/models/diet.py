from datetime import datetime


def create_meal_document(
    user_id,
    meal_type,
    food,
    quantity,
    notes
):

    return {
        "user_id": user_id,
        "meal_type": meal_type,
        "food": food,
        "quantity": quantity,
        "notes": notes,
        "created_at": datetime.utcnow()
    }