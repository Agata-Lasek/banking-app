import { useState, useEffect } from "react"
import client from "../../api/axios"
import Sidebar from "../Sidebar"
import { AccountType, CurrencyType } from "../../utils/account"
import { handleError } from "../../utils/api"

const shouldDisplayCurrency = (accountType, currency) => {
    const isForeignAccount = accountType === AccountType.FOREIGN_CURRENCY
    return isForeignAccount ? currency !== CurrencyType.PLN : currency === CurrencyType.PLN
}

const AccountOpen = () => {
    const [error, setError] = useState("")
    const [success, setSuccess] = useState(false)
    const [user, setUser] = useState({
        id: "",
        name: "",
        surname: ""
    })
    const [formData, setFormData] = useState({
        type: AccountType.CHECKING,
        currency: CurrencyType.PLN
    })

    const handleChange = (e) => {
        const value = e.target.value
        setFormData({
            ...formData,
            [e.target.name]: value
        })
    }

    const getAccounts = async() => {
        try {
            const response = await client.get("/me/accounts")
        } catch(error) {
            console.log(error?.response.status)
        }
    }

    const getUser = async() => {
        try {
            const response = await client.get("/me")
            setUser({
                id: response.data.id,
                name: response.data.name,
                surname: response.data.surname
            })
        } catch (error) {
            console.log(error?.response.status)
        }
    }

    const handleSubmit = async(e) => {
        e.preventDefault();
        setError("")
        setSuccess(false)

        try {
            const response = await client.post(`/customers/${user.id}/accounts`, formData)
            setSuccess(response.status >= 200 && response.status < 300)
        } catch(error) {
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
                    <h1 className="text-white text-3xl font-bold py-4">Open new bank account</h1>
                    <form onSubmit={handleSubmit} className="mx-auto flex flex-col space-y-4 w-1/2">
                        <div>
                            <label className="mb-2 text-base font-medium text-white">What type of bank account would you like to open?</label>
                            <select onChange={handleChange} id="type" name="type" className="w-full px-4 py-3 text-base border rounded-lg bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500">
                                {Object.values(AccountType).map((accountType) => (
                                    <option value={accountType} key={accountType} >{accountType}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                        <label className="mb-2 text-base font-medium text-white">Select bank account currency</label>
                            <select onChange={handleChange} id="currency" name="currency" className="w-full px-4 py-3 text-base border rounded-lg bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500">
                                {Object.values(CurrencyType).map((currencyType) => (
                                    (shouldDisplayCurrency(formData.type, currencyType)) && 
                                    <option value={currencyType} key={currencyType} >{currencyType}</option>
                                ))}
                            </select>
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
                                <span className="font-medium">Successfully opened new account!</span>
                            </div>
                        }
                        <button type="submit" className="text-white font-medium rounded-lg text-sm px-5 py-2.5 text-center w-full bg-primary-600 hover:bg-primary-700 focus:ring-primary-800 focus:outline-none">Open account</button>
                    </form>
                </div>
            </div>
         </>
    )
}

export default AccountOpen