from datetime import datetime


def create_progress_document(
    user_id,
    weight=None,
    bmi=None,
    notes=None
):

    return {
        "user_id": user_id,
        "weight": weight,
        "bmi": bmi,
        "notes": notes,
        "created_at": datetime.utcnow()
    }