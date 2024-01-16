import { useState, useEffect } from "react"
import client from "../api/axios"
import Sidebar from "./Sidebar"
import { maskAccountNumber } from "../utils/accounts"
import { handleError } from "../utils/api"

const Transfer = () => {
    const [error, setError] = useState("")
    const [success, setSuccess] = useState(false)
    const [user, setUser] = useState({
        name: "",
        surname: ""
    })
    const [accounts, setAccounts] = useState([])
    const [formData, setFormData] = useState({
        id: "",
        amount: "",
        receiver: "",
        description: ""
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

    const handleChange = (e) => {
        const value = e.target.value;
        setFormData({
            ...formData,
            [e.target.name]: value
        })
    }

    const handleSubmit = async(e) => {
        e.preventDefault()
        setError("")
        setSuccess(false)
        
        if (!formData.receiver) { setError("You need to provide receiver's account number"); return }
        if (formData.receiver.replace(/\s/g, "").length !== 26) { setError("Invalid receiver's account number"); return }
        if (!formData.amount) { setError("You need to provide amount"); return }
        if (formData.amount <= 0) { setError("Invalid amount"); return }
        if (!formData.description) { setError("You need to provide description"); return }
        if (!formData.id) { setError("You need to select an account"); return }

        try {
            let { id, ...body } = formData
            body.receiver = body.receiver.replace(/\s/g, "")
            const response = await client.post(`/accounts/${formData.id}/transfer`, body)
            setSuccess(response.status >= 200 && response.status < 300)
        } catch (error) {
            setError(handleError(error))
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            await Promise.all([
                getUser(),
                getAccounts()
            ]);
        };
        fetchData();
    }, [])

    return (
         <>
            <Sidebar user={user} />
            <div className="p-4 ml-64 my-5">
                <div className="w-full mx-auto max-w-5xl items-center flex flex-col space-y-3">
                    <h1 className="text-white text-3xl font-bold py-4">Transfer money</h1>
                    <form onSubmit={handleSubmit} className="mx-auto flex flex-col space-y-4 w-1/2">
                        <div>
                            <label htmlFor="receiver" className="block mb-2 text-sm font-medium text-white">Recipient's account number</label>
                            <input type="text" id="receiver" name="receiver" value={formData.receiver} onChange={handleChange} className="bg-gray-700 border border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 placeholder-gray-400 text-white" placeholder="98 1019 1404 5284 6939 4502 3049"/>
                        </div>
                        <div>
                            <label htmlFor="amount" className="mb-2 text-sm font-medium sr-only text-white">Amount</label>
                            <div className="relative w-full">
                                <div className="absolute inset-y-0 start-0 top-0 flex items-center ps-3.5 pointer-events-none">
                                    <svg className="w-4 h-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 2a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1M2 5h12a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Zm8 5a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z"/>
                                    </svg>
                                </div>
                                <input type="number" id="amount" name="amount" value={formData.amount} onChange={handleChange} className="block px-4 py-3 w-full font-medium z-20 ps-10 text-sm rounded-lg border focus:ring-blue-500 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:border-blue-500" placeholder="Enter amount"/>
                            </div>
                        </div>
                        <div>
                            <label htmlFor="description" className="block mb-2 text-sm font-medium text-white">Description</label>
                            <input type="text" id="description" name="description" value={formData.description} onChange={handleChange} className="bg-gray-700 border border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 placeholder-gray-400 text-white" placeholder="Funds transfer"/>
                        </div>
                        <div>
                            <p className="block mb-2 text-sm font-medium text-white">Transfer from</p>
                            <ul>
                                {accounts.map((account, index) => account && (
                                    <li key={index} className="pb-3">
                                        <input type="radio" id={`account-${index}`} name="account-id" onChange={() => setFormData({...formData, id: account.id})} className="hidden peer"/>
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
                                <span className="font-medium">Successfully transfered money!</span>
                            </div>
                        }
                        <button type="submit" className="text-white font-medium rounded-lg text-sm px-5 py-2.5 text-center w-full bg-primary-600 hover:bg-primary-700 focus:ring-primary-800 focus:outline-none">Transfer</button>
                    </form>
                </div>
            </div>
         </>
    )
}

export default Transfer