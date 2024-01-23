from decimal import Decimal
import requests
from requests.exceptions import RequestException

from src.models.account import Currency

# Default exchange rates based on Frankfurter API from 2024-01-24
DEFAULT_EXCHANGE_RATES = {
    (Currency.PLN, Currency.EUR): 0.22815,
    (Currency.PLN, Currency.USD): 0.24805,
    (Currency.PLN, Currency.GBP): 0.19506,
    (Currency.EUR, Currency.PLN): 4.383,
    (Currency.EUR, Currency.USD): 1.0872,
    (Currency.EUR, Currency.GBP): 0.85493,
    (Currency.USD, Currency.PLN): 4.0315,
    (Currency.USD, Currency.EUR): 0.91979,
    (Currency.USD, Currency.GBP): 0.78636,
    (Currency.GBP, Currency.PLN): 5.1267,
    (Currency.GBP, Currency.EUR): 1.1697,
    (Currency.GBP, Currency.USD): 1.2717
}

FRANKFURTER_API_URL = "https://api.frankfurter.app/latest"


def get_exchange_rate(from_currency: Currency, to_currency: Currency) -> Decimal:
    """
    Get exchange rate for given currencies, if there is a problem with connection to
    the external API, use default hardcoded rates.
    """
    try:
        params = {
            "amount": 1.0,
            "from": from_currency.value,
            "to": to_currency.value
        }
        response = requests.get(FRANKFURTER_API_URL, params=params)
        response.raise_for_status()
        rate = Decimal(response.json()["rates"][to_currency.value])
    except RequestException:
        rate = Decimal(DEFAULT_EXCHANGE_RATES[(from_currency, to_currency)])
    return rate
