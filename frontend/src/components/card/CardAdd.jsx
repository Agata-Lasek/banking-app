import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import client from "../../api/axios"
import Sidebar from "../Sidebar"
import NotFound from "../NotFound"
import { maskAccountNumber, AccountType } from "../../utils/account"
import { handleError } from "../../utils/api"

const CardAdd = () => {
    const [error, setError] = useState("")
    const [success, setSuccess] = useState(false)
    const [user, setUser] = useState({
        name: "",
        surname: ""
    })
    const [accountId, setAccountId] = useState("")
    const [accounts, setAccounts] = useState([])

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

        if (!accountId) { setError("You need to select an account"); return }
        try {
            const response = await client.post(`/accounts/${accountId}/cards`)
            setSuccess(response.status >= 200 && response.status < 300)
        } catch (error) {
            setError(handleError(error))
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            await Promise.all([getUser(), getAccounts()])
        }
        fetchData()
    }, [])


    return (
         <>
            <Sidebar user={user} />
            <div className="p-4 ml-64 my-5">
                <div className="w-full mx-auto max-w-5xl items-center flex flex-col space-y-3">
                    <h1 className="text-white text-3xl font-bold py-4">Add new card</h1>
                    <form onSubmit={handleSubmit} className="mx-auto flex flex-col space-y-4 w-1/2">
                        <div>
                            <p className="block mb-2 text-sm font-medium text-white">Select account</p>
                            <ul>
                                {accounts.map((account, index) => account && account.type != AccountType.SAVING && (
                                    <li key={index} className="pb-3">
                                        <input type="radio" id={`account-${index}`} name="account" onChange={() => setAccountId(account.id)} className="hidden peer"/>
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
                                <span className="font-medium">Successfully added new card to your account!</span>
                            </div>
                        }
                        <button type="submit" className="text-white font-medium rounded-lg text-sm px-5 py-2.5 text-center w-full bg-primary-600 hover:bg-primary-700 focus:ring-primary-800 focus:outline-none">Add</button>
                    </form>
                </div>
            </div>
         </>
    )
}

export default CardAdd