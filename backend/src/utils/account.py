from string import digits
from random import choice

BANK_CODE = "101"
NATIONAL_CHECK_DIGIT = "4"

# 25 -> P; 21 -> L; 00 -> checksum placeholder
NATIONAL_BASE_APPENDIX = "252100"


def generate_account_number() -> str:
    """
    Generates a random account number
    following the Polish IBAN format.

    Returns:
        Concatenated checksum and BBAN.
    """
    account_number = "".join([choice(digits) for _ in range(16)])
    branch_code = "".join([choice(digits) for _ in range(4)])
    base = f"{BANK_CODE}{branch_code}{NATIONAL_CHECK_DIGIT}{account_number}"
    return f"{98 - (int(f'{base}{NATIONAL_BASE_APPENDIX}') % 97):02d}{base}"
