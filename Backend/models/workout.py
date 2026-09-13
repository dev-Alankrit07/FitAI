from datetime import datetime


def create_workout_document(
    user_id,
    category,
    workout,
    sets,
    reps,
    weight,
    duration,
    notes
):

    return {
        "user_id": user_id,
        "category": category,
        "workout": workout,
        "sets": sets,
        "reps": reps,
        "weight": weight,
        "duration": duration,
        "notes": notes,
        "created_at": datetime.utcnow()
    }