import { Link } from "react-router-dom"
import { maskAccountNumber } from "../../utils/account"
import { maskCardNumber, getCardStatus, findRelatedAccount } from "../../utils/card"

const CardTableElement = ({ card, accounts }) => {
    if (!card) return ""
    const account = findRelatedAccount(card, accounts)

    return (
        <tr className="border-b bg-gray-800 border-gray-700">
            <th scope="row" className="px-6 py-4 font-medium whitespace-nowrap text-white">
                {maskCardNumber(card.number)}
            </th>
            <td className="px-6 py-4">
                {getCardStatus(card)}
            </td>
            <td className="px-6 py-4">
                {account ? maskAccountNumber(account.number) : ""}
            </td>
            <td className="px-6 py-4">
                {account ? `${account.balance} ${account.currency}` : ""}
            </td>
            <td className="px-6 py-4">
                <Link to={`/cards/${card.id}`} className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Details</Link>
            </td>
        </tr>
    )
}

export default CardTableElement