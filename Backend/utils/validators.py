import re


def validate_email(email):

    if not email:
        return False

    pattern = r"^[^@\s]+@[^@\s]+\.[^@\s]+$"

    return re.match(pattern, email) is not None


def validate_password(password):

    if not password:
        return False

    return len(password) >= 6


def validate_required_fields(data, fields):

    missing = []

    for field in fields:

        if not data.get(field):
            missing.append(field)

    return missing