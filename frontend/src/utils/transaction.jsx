const TransactionType = {
    DEPOSIT: "deposit",
    WITHDRAWAL: "withdrawal",
    TRANSFER_IN: "transferin",
    TRANSFER_OUT: "transferout",
    LOAN_TAKE: "loantake",
    LOAN_PAYOFF: "loanpayoff"
}

const TransactionTypeLabel = {
    [TransactionType.DEPOSIT]: "Deposit",
    [TransactionType.WITHDRAWAL]: "Withdrawal",
    [TransactionType.TRANSFER_IN]: "Transfer in",
    [TransactionType.TRANSFER_OUT]: "Transfer out",
    [TransactionType.LOAN_TAKE]: "Loan take",
    [TransactionType.LOAN_PAYOFF]: "Loan payoff"
}

export { TransactionType, TransactionTypeLabel }