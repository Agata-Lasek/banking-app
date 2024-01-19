import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import client from "../../api/axios"
import Sidebar from "../Sidebar"
import NotFound from "../NotFound"
import { maskAccountNumber, AccountType } from "../../utils/account"
import { handleError } from "../../utils/api"

const LoanPayoff = () => {
    const [error, setError] = useState("")
    const [success, setSuccess] = useState(false)
    const [user, setUser] = useState({
        name: "",
        surname: ""
    })
    const [accounts, setAccounts] = useState([])
    const { loanId } = useParams()
    const [loan, setLoan] = useState({})
    const [accountNumber, setAccountNumber] = useState("")

    const getLoan = async() => {
        try {
            if (isNaN(Number(loanId))) return
            const response = await client.get(`/loans/${loanId}`)
            if (response.status >= 200 && response.status < 300) {
                setLoan(response.data)
            }
        } catch(error) {
            console.log(error?.response.status)
        }
    }

    const getAccounts = async() => {
        try {
            const response = await client.get("/me/accounts")
            setAccounts(response.data.items)
        } catch(error) {
            console.log(error?.response.status)
        }
    }

    const getUser = async() => {
        try {
            const response = await client.get("/me")
            setUser({
                name: response.data.name,
                surname: response.data.surname
            })
        } catch (error) {
            console.log(error?.response.status)
        }
    }

    const handleSubmit = async(e) => {
        e.preventDefault()
        setError("")
        setSuccess(false)
        
        if (!accountNumber) { setError("You need to select an account"); return }

        try {
            const response = await client.post(`/loans/${loanId}/payoff`, { account: accountNumber })
            setSuccess(response.status >= 200 && response.status < 300)
        } catch (error) {
            setError(handleError(error))
        }
    }

    useEffect(() => {
        getLoan()
    }, [])

    useEffect(() => {
        const fetchData = async () => {
            if (Object.keys(loan).length > 0) {
                await Promise.all([getUser(), getAccounts()])
            }
        }
        fetchData()
    }, [loan])

    useEffect(() => {
        if (success) {
            getAccounts()
        }
    }, [success])

    return Object.keys(loan).length > 0 ? (
         <>
            <Sidebar user={user} />
            <div className="p-4 ml-64 my-5">
                <div className="w-full mx-auto max-w-5xl items-center flex flex-col space-y-3">
                    <h1 className="text-white text-3xl font-bold py-4">Payoff loan</h1>
                    <div className="w-1/2">
                        <p className="block mb-2 w-max text-sm font-medium text-white">The amount of the loan taken out</p>
                        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 flex items-center">
                            <div className="inline-flex w-full items-center space-x-2">
                                <svg className="w-6 h-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z" />
                                </svg>
                                <p className="text-lg font-semibold text-white">{loan.amount} PLN</p>
                            </div>
                        </div>
                    </div>
                    <form onSubmit={handleSubmit} className="mx-auto flex flex-col space-y-4 w-1/2">
                        <div>
                            <p className="block mb-2 text-sm font-medium text-white">Select account</p>
                            <ul>
                                {accounts.map((account, index) => account && account.type == AccountType.CHECKING && (
                                    <li key={index} className="pb-3">
                                        <input type="radio" id={`account-${index}`} name="account" onChange={() => setAccountNumber(account.number)} className="hidden peer"/>
                                        <label htmlFor={`account-${index}`} className="flex items-center p-5 hover:bg-gray-700 bg-gray-800 peer-checked:border-blue-600 border-gray-700 cursor-pointer rounded-lg border">
                                            <div className="flex-1 min-w-0">
                                                <p className="text-lg font-semibold text-white">{maskAccountNumber(account.number)}</p>
                                                <p className="text-sm text-gray-400">{account.type}</p>
                                            </div>
                                            <div className="inline-flex items-center text-base font-semibold text-white">
                                                {account.balance} {account.currency}
                                            </div>
                                        </label>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        {error &&
                            <div className="flex items-center p-4 mb-4 text-sm text-red-400 border border-red-800 rounded-lg">
                                <svg className="flex-shrink-0 inline w-4 h-4 me-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
                                </svg>
                                <span className="font-medium">{error}</span>
                            </div>
                        }
                        {success &&
                            <div className="flex items-center p-4 mb-4 text-sm text-green-400 border border-green-800 rounded-lg">
                                <svg className="flex-shrink-0 inline w-4 h-4 me-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
                                </svg>
                                <span className="font-medium">Successfully paid off loan!</span>
                            </div>
                        }
                        <button type="submit" className="text-white font-medium rounded-lg text-sm px-5 py-2.5 text-center w-full bg-primary-600 hover:bg-primary-700 focus:ring-primary-800 focus:outline-none">Payoff</button>
                    </form>
                </div>
            </div>
         </>
    ) : <NotFound />
}

export default LoanPayoff