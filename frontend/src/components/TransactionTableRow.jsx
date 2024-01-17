import { maskAccountNumber, findRelatedAccount } from "../utils/accounts"


const TransactionTableRow = ({ transaction, accounts }) => {
    if (!transaction) return ""
    const account  = findRelatedAccount(transaction, accounts)
    const amount = (transaction.balanceAfter - transaction.balanceBefore).toFixed(2)
    const date = new Date(transaction.createdAt)
    const shortDescription = transaction.description.length > 50 ? `${transaction.description.substring(0, 50).trim()}...` : transaction.description
    
    return (
        <tr className="border-b bg-gray-800 border-gray-700">
            <th scope="row" className="px-6 py-4 font-medium whitespace-nowrap text-white">
                {date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
            </th>
            <td className="px-6 py-4">
                {shortDescription}
            </td>
            <td className="px-6 py-4">
                {amount > 0 ? `+${amount}` : amount} {account ? account.currency : ""}
            </td>
            <td className="px-6 py-4">
                {account ? maskAccountNumber(account.number) : ""}
            </td>
            <td className="px-6 py-4">
                {transaction.type}
            </td>
        </tr>
    )
}

export default TransactionTableRow