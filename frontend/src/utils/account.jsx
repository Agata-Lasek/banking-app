const maskAccountNumber = (accountNumber) => {
    const firstTwoDigits = accountNumber.slice(0, 2)
    const lastEightDigits = accountNumber.slice(-8).replace(/(\d{4})(\d{4})/, "$1 $2")
    return `${firstTwoDigits} (...) ${lastEightDigits}`
}

const formatToIBAN = (accountNumber) => {
    const firstTwoDigits = accountNumber.slice(0, 2)
    return `${firstTwoDigits} ${accountNumber.slice(2).replace(/(.{4})/g, '$1 ').trim()}`
}

const findRelatedAccount = (transaction, accounts) => {
    return accounts.find((account) => account.id === transaction.accountId)
}

const AccountType = {
    CHECKING: "Checking",
    SAVING: "Saving",
    FOREIGN_CURRENCY: "Foreign currency"
}

const CurrencyType = {
    PLN: "PLN",
    USD: "USD",
    EUR: "EUR",
    GBP: "GBP",
};

export { maskAccountNumber, formatToIBAN, findRelatedAccount, AccountType, CurrencyType }
