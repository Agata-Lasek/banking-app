import { useState, useEffect } from "react"
import client from "../../api/axios"
import Sidebar from "../Sidebar"
import { maskAccountNumber, AccountType } from "../../utils/account"
import { handleError } from "../../utils/api"


const loanOptions = [
    {
        title: "RapidRise Express Loan",
        description: "Elevate your financial journey with RapidRise Express.",
        amount: 2500,
    },
    {
        title: "SwiftStream Advance",
        description: "Flow smoothly through financial challenges with SwiftStream.",
        amount: 5000,
    },
    {
        title: "ZenithEase Loan Solution",
        description: "Attain financial zenith with our ZenithEase Loan Solution.",
        amount: 10000,
    },
    {
        title: "LuminaLend QuickPath",
        description: "Light up your financial path with LuminaLend QuickPath.",
        amount: 15000,
    },
    {
        title: "VivaVelocity Funding",
        description: "Embrace the vibrant speed of financial growth with VivaVelocity.",
        amount: 25000,
    },
    {
        title: "ReadyRocket LaunchLoan",
        description: "Blast off into financial freedom with ReadyRocket LaunchLoan.",
        amount: 50000,
    },
]


const LoanTake = () => {
    const [error, setError] = useState("")
    const [success, setSuccess] = useState(false)
    const [user, setUser] = useState({
        name: "",
        surname: ""
    })
    const [accounts, setAccounts] = useState([])
    const [formData, setFormData] = useState({
        account: "",
        amount: ""
    })

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
        
        if (!formData.amount) { setError("You need to select a loan option"); return }
        if (!formData.account) { setError("You need to select an account"); return }

        try {
            const response = await client.post("/loans", formData)
            setSuccess(response.status >= 200 && response.status < 300)
        } catch (error) {
            setError(handleError(error))
        }
    }

    useEffect(() => {
        getUser()
    }, [])

    useEffect(() => {
        getAccounts()
    }, [success])

    return (
         <>
            <Sidebar user={user} />
            <div className="p-4 ml-64 my-5">
                <div className="w-full mx-auto max-w-5xl items-center flex flex-col space-y-3">
                    <h1 className="text-white text-3xl font-bold py-4">Take out loan</h1>
                    <form onSubmit={handleSubmit} className="mx-auto flex flex-col space-y-4 w-1/2">
                        <div>
                            <p className="block mb-2 text-sm font-medium text-white">Select the desired loan option</p>
                            <ul>
                                {loanOptions.map((loan, index) => (
                                    <li key={index} className="pb-3">
                                        <input type="radio" id={`loan-${index}`} name="loan-id" onChange={() => setFormData({...formData, amount: loan.amount})} className="hidden peer"/>
                                        <label htmlFor={`loan-${index}`} className="flex items-center p-5 hover:bg-gray-700 bg-gray-800 peer-checked:border-blue-600 border-gray-700 cursor-pointer rounded-lg border">
                                            <div className="flex-1 min-w-0">
                                                <p className="text-lg font-semibold text-white">{loan.title}</p>
                                                <p className="text-sm text-gray-400">{loan.description}</p>
                                            </div>
                                            <div className="inline-flex items-center text-base font-semibold text-white">
                                                {loan.amount} PLN
                                            </div>
                                        </label>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <p className="block mb-2 text-sm font-medium text-white">Transfer funds to</p>
                            <ul>
                                {accounts.map((account, index) => account && account.type === AccountType.CHECKING && (
                                    <li key={index} className="pb-3">
                                        <input type="radio" id={`account-${index}`} name="account-id" onChange={() => setFormData({...formData, account: account.number})} className="hidden peer"/>
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
                                <span className="font-medium">Successfully took out loan!</span>
                            </div>
                        }
                        <button type="submit" className="text-white font-medium rounded-lg text-sm px-5 py-2.5 text-center w-full bg-primary-600 hover:bg-primary-700 focus:ring-primary-800 focus:outline-none">Take out</button>
                    </form>
                </div>
            </div>
         </>
    )
}

export default LoanTake