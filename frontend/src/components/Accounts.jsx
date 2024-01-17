import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import client from "../api/axios"
import Sidebar from "./Sidebar"
import { maskAccountNumber, formatToIBAN } from "../utils/accounts"

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
                {account.balance.toFixed(2)} {account.currency}
            </td>
            <td className="px-6 py-4 text-right">
                <button onClick={() => setShow(!show)} className="font-medium text-blue-600 dark:text-blue-500 hover:underline">{ !show ? "Show account number" : "Hide account number"}</button>
            </td>
        </tr>
    ): ""
}

const Accounts = () => {
    const [user, setUser] = useState({
        name: "",
        surname: ""
    })
    const [accounts, setAccounts] = useState([])

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
    }, [])

    return (
         <>
            <Sidebar user={user} />
            <div className="p-4 ml-64 my-5">
                <div className="w-full mx-auto max-w-5xl justify-between flex flex-wrap space-y-3">
                    <h1 className="text-white w-screen text-3xl font-bold py-4">Accounts</h1>
                    <div className="overflow-x-auto border border-gray-700 rounded-lg w-full">
                        <div className="bg-gray-800">
                            <h2 className="px-5 pt-5 text-lg font-semibold text-left text-white">Already owned accounts</h2>                          
                            <p className="px-5 pb-5 mt-1 text-sm font-normal text-gray-400">Remember that you can have a maximum of 5 different bank accounts of any type. If you want to close a particular account, contact a bank employee.</p>
                        </div>
                        <table className="w-full text-sm text-left text-gray-400">
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
                        <div className="flex items-center justify-end p-4 bg-gray-800">
                            <Link to="/accounts/open" className="inline-flex items-center justify-center px-3 h-8 text-sm font-medium border rounded bg-gray-800 border-gray-700 text-gray-400 hover:bg-gray-700 hover:text-white">Open new account</Link>
                        </div>
                    </div>
                </div>
            </div>
         </>
    )
}

export default Accounts