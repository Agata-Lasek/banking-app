import { Link } from "react-router-dom"

const LoanTableElement = ({ loan }) => {
    if (!loan) return ""
    const takeOutDate = new Date(loan.createdAt)
    const paidAtDate = loan.paidAt ? new Date(loan.paidAt) : ""

    return (
        <tr className="border-b bg-gray-800 border-gray-700">
            <th scope="row" className="px-6 py-4 font-medium whitespace-nowrap text-white">
                {takeOutDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
            </th>
            <td className="px-6 py-4">
                {loan.amount} PLN
            </td>
            <td className="px-6 py-4">
                {paidAtDate ? paidAtDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : "Not paid yet"}
            </td>
            <td className="px-6 py-4">
                {!paidAtDate ? <Link to={`/loans/${loan.id}/payoff`} className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Payoff</Link> : ""}
            </td>
        </tr>
    )
}

export default LoanTableElement
