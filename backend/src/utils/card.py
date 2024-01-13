from random import choice
from string import digits

MASTERCARD_PREFIXES = ["51", "55"]


def generate_card_number() -> str:
    """
    Generates a random card number
    following the Mastercard format.
    """
    prefix = choice(MASTERCARD_PREFIXES)
    number = f"{prefix}{''.join([choice(digits) for _ in range(13)])}"

    total = 0
    for idx, digit in enumerate(number):
        _digit = int(digit)
        if idx % 2 == 0:
            _digit *= 2
            _digit = _digit if _digit < 10 else _digit - 9
        total += _digit
    return f"{number}{(10 - (total % 10)) % 10}"


def generate_cvv() -> str:
    """
    Generates a random CVV number.
    """
    return "".join([choice(digits) for _ in range(3)])
