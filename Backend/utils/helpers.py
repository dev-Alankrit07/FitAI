from bson import ObjectId


def serialize_document(document):

    if not document:
        return None

    document["_id"] = str(document["_id"])

    if "user_id" in document:
        document["user_id"] = str(document["user_id"])

    return document


def convert_object_id(value):

    try:
        return ObjectId(value)

    except Exception:
        return None