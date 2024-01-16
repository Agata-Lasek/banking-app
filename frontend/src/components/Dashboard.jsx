import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import client from "../api/axios"
import Sidebar from "./Sidebar"
import { maskAccountNumber } from "../utils/accounts"
import TransactionTableRow from "./TransactionTableRow"

const AccountListElement = ({ account }) => {
    return account ? (
        <li className="py-3">
            <div className="flex items-center">
                <div className="flex-1 min-w-0 ms-4">
                    <p className="text-sm font-medium truncate text-white">
                        {maskAccountNumber(account.number)}
                    </p>
                    <p className="text-sm truncate text-gray-400">
                        {account.type}
                    </p>
                </div>
                <div className="inline-flex items-center text-base font-semibold text-white">
                    {account.balance} {account.currency}
                </div>
            </div>
        </li>
    ) : ""
}

const Dashboard = () => {
    const [user, setUser] = useState({
        name: "",
        surname: ""
    })
    const [accounts, setAccounts] = useState([])
    const [transactions, setTransactions] = useState([])

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

    const getAccounts = async() => {
        try {
            const response = await client.get("/me/accounts")
            setAccounts(response.data.items)
        } catch(error) {
            console.log(error?.response.status)
        }
    }

    const getTransactions = async() => {
        try {
            const response = await client.get("/me/transactions", { params: { limit: 10 } })
            setTransactions(response.data.items)
        } catch(error) {
            console.log(error?.response.status)
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            await Promise.all([
                getUser(),
                getAccounts(),
                getTransactions()
            ]);
        };
        fetchData();
    }, [])

    return (
        <> 
            <Sidebar user={user} />
            <div className="p-4 ml-64 my-5">
                <div className="w-full mx-auto max-w-5xl justify-between flex flex-wrap space-y-3">
                    <h1 className="text-white w-screen text-3xl font-bold py-4">Dashboard</h1>
                    <div className="w-2/5 p-6 border bg-gray-800 border-gray-700 rounded-lg">
                        <h2 className="mb-2 text-3xl text-white font-bold py-4">Welcome back, <br />{user.name}! 👋</h2>
                        <p className="mb-3 font-normal text-gray-400">Everything seems to be fine with your account since your last visit. However, wouldn't you perhaps like to take out a loan to realize your dreams?</p>
                        <Link to="/loans/take" className="inline-flex items-center px-3 py-2 rounded-lg text-sm bg-blue-600 font-medium text-center text-white rounder-lg hover:bg-blue-700 focus:ring-blue-800 focus:outline-none">
                            It all starts with you
                            <svg className="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
                            </svg>
                        </Link>
                    </div>
                    <div className="w-7/12 p-4 border rounded-lg shadow bg-gray-800 border-gray-700">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold leading-none text-white">Accounts</h2>
                        </div>
                    <div className="flow-root">
                            <ul role="list" className="divide-y divide-gray-700">
                                {accounts.map((account) => (
                                    <AccountListElement key={account.id} account={account} />
                                ))}
                            </ul>
                        </div>
                    </div>
                    <div className="overflow-x-auto border border-gray-700 rounded-lg w-full">
                        <table className="w-full text-sm text-left text-gray-400">
                            <caption className="p-5 text-lg font-semibold text-left text-white bg-gray-800">
                                Recent transactions
                            </caption>
                            <thead className="text-xs uppercase bg-gray-700 text-gray-400">
                                <tr>
                                    <th scope="col" className="px-6 py-3">
                                        Date
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Short description
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Amount
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Account number
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Type
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.map((transaction) => (
                                    <TransactionTableRow
                                        key={transaction.id}
                                        transaction={transaction}
                                        accounts={accounts}
                                    />
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Dashboard