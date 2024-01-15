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

export { maskAccountNumber, formatToIBAN, findRelatedAccount }
