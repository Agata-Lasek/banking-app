import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import client from "../api/axios"
import Sidebar from "./Sidebar"
import { maskAccountNumber, formatToIBAN } from "../utils/accounts"

const AccountTypes = {
    CHECKING: "Checking",
    SAVING: "Saving",
    FOREIGN_CURRENCY: "Foreign currency"
}

const CurrencyTypes = {
    PLN: "PLN",
    USD: "USD",
    EUR: "EUR",
    GBP: "GBP",
};

const shouldDisplayCurrency = (accountType, currency) => {
    const isForeignAccount = accountType === AccountTypes.FOREIGN_CURRENCY
    return isForeignAccount ? currency !== CurrencyTypes.PLN : currency === CurrencyTypes.PLN
}

const AccountTableElement = ({ account }) => {
    const [show, setShow] = useState(false)

    return account ? (
        <tr className="border-b bg-gray-800 border-gray-700">
            <th scope="row" className="px-6 py-4 font-medium whitespace-nowrap text-white">
                {account.type}
            </th>
            <td className="px-6 py-4">
                {show ? formatToIBAN(account.number) : maskAccountNumber(account.number)}
            </td>
            <td className="px-6 py-4">
                {account.balance} {account.currency}
            </td>
            <td className="px-6 py-4 text-right">
                <button onClick={() => setShow(!show)} className="font-medium text-blue-600 dark:text-blue-500 hover:underline">{ !show ? "Show account numbe" : "Hide account number"}</button>
            </td>
        </tr>
    ): ""
}

const Accounts = () => {
    const [user, setUser] = useState({
        id: 0,
        name: "",
        surname: ""
    })
    const [accounts, setAccounts] = useState([])
    const [formData, setFormData] = useState({
        type: AccountTypes.CHECKING,
        currency: CurrencyTypes.PLN
    })
    const [newAccount, setNewAccount] = useState(0)

    const handleChange = (e) => {
        const value = e.target.value
        setFormData({
            ...formData,
            [e.target.name]: value
        })
    }

    const handleAccountCreation = async(e) => {
        e.preventDefault();
        try {
            const response = await client.post(`/customers/${user.id}/accounts`, formData)
            setNewAccount(prevCount => prevCount + 1)
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

    const getAccounts = async() => {
        try {
            const response = await client.get("/me/accounts")
            setAccounts(response.data.items)
        } catch(error) {
            console.log(error?.response.status)
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            await Promise.all([getUser(), getAccounts()]);
        };
        fetchData();
    }, [newAccount])

    return (
         <>
            <Sidebar user={user} />
            <div className="p-4 ml-64 my-5">
                <div className="w-full mx-auto max-w-5xl justify-between flex flex-wrap space-y-3">
                    <h1 className="text-white w-screen text-3xl font-bold py-4">Accounts</h1>
                    <div className="overflow-x-auto border border-gray-700 rounded-lg w-full">
                        <table className="w-full text-sm text-left text-gray-400">
                            <caption className="p-5 text-lg font-semibold text-left text-white bg-gray-800">
                                Already owning accounts
                                <p className="mt-1 text-sm font-normal text-gray-400">Remember that you can have a maximum of 5 different bank accounts of any type. If you want to close a particular account, contact a bank employee.</p>
                            </caption>
                            <thead className="text-xs uppercase bg-gray-700 text-gray-400">
                                <tr>
                                    <th scope="col" className="px-6 py-3">
                                        Type
                                    </th>
                                    <th scope="col" className="px-6 py-3 w-2/6">
                                        Account number
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Balance
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        <span className="sr-only">Toggle account number</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {accounts.map((account, index) => <AccountTableElement account={account} key={index} />)}
                            </tbody>
                        </table>
                    </div>
                    <h1 className="text-white w-screen text-3xl font-bold py-4">Open new bank account</h1>
                    <form className="w-full space-y-4" onSubmit={handleAccountCreation}>
                        <div>
                            <label className="mb-2 text-base font-medium text-white">What type of bank account would you like to open?</label>
                            <select onChange={handleChange} id="type" name="type" className="w-full px-4 py-3 text-base border rounded-lg bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500">
                                {Object.values(AccountTypes).map((accountType) => (
                                    <option value={accountType} key={accountType} >{accountType}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                        <label className="mb-2 text-base font-medium text-white">Select bank account currency</label>
                            <select onChange={handleChange} id="currency" name="currency" className="w-full px-4 py-3 text-base border rounded-lg bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500">
                                {Object.values(CurrencyTypes).map((currencyType) => (
                                    (shouldDisplayCurrency(formData.type, currencyType)) && 
                                    <option value={currencyType} key={currencyType} >{currencyType}</option>
                                ))}
                            </select>
                        </div>
                        <button type="submit" className="text-white font-medium rounded-lg text-sm px-5 py-2.5 text-center w-full bg-primary-600 hover:bg-primary-700 focus:ring-primary-800 focus:outline-none">Open account</button>
                    </form>
                </div>
            </div>
         </>
    )
}

export default Accounts