const maskCardNumber = (cardNumber) => {
    const visibleSection = cardNumber.slice(-4);
    const maskedSection = cardNumber.slice(0, -4).replace(/.{4}/g, '**** ');
    return `${maskedSection}${visibleSection}`.trim();
}

const CardStatus = {
    ACTIVE: "Active",
    INACTIVE: "Inactive",
    BLOCKED: "Blocked",
    EXPIRED: "Expired"
}

const getCardStatus = (card) => {
    if (card.blockedAt) {
        return CardStatus.BLOCKED
    }
    const today = new Date()
    const expirationDate = new Date(card.expiryAt)
    if (expirationDate < today) {
        return CardStatus.EXPIRED
    }
    return card.active ? CardStatus.ACTIVE : CardStatus.INACTIVE
}

const findRelatedAccount = (card, accounts) => {
    return accounts.find((account) => account.id === card.accountId)
}

export { maskCardNumber, getCardStatus, findRelatedAccount }
