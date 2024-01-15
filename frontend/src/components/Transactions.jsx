import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import client from "../api/axios"
import Sidebar from "./Sidebar"
import TransactionTableRow from "./TransactionTableRow"

const TransactionType = {
    DEPOSIT: "deposit",
    WITHDRAWAL: "withdrawal",
    TRANSFER_IN: "transferin",
    TRANSFER_OUT: "transferout",
    LOAN_TAKE: "loantake",
    LOAN_PAYOFF: "loanpayoff"
}

const TransactionTypeLabel = {
    [TransactionType.DEPOSIT]: "Deposit",
    [TransactionType.WITHDRAWAL]: "Withdrawal",
    [TransactionType.TRANSFER_IN]: "Transfer in",
    [TransactionType.TRANSFER_OUT]: "Transfer out",
    [TransactionType.LOAN_TAKE]: "Loan take",
    [TransactionType.LOAN_PAYOFF]: "Loan payoff"
}

const Transactions = () => {
    const [user, setUser] = useState({
        name: "",
        surname: ""
    })
    const [accounts, setAccounts] = useState([])
    const [transactions, setTransactions] = useState([])
    const [params, setParams] = useState({
        startDate: "",
        endDate: "",
        type: "",
        offset: 0,
        limit: 15
    })

    const handleChange = (e) => {
        const value = e.target.value
        setParams({
            ...params,
            [e.target.name]: value
        })
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
            const filteredParams = Object.fromEntries(
                Object.entries(params).filter(([key, value]) => value !== "")
            )
            const response = await client.get("/me/transactions", { params: filteredParams })
            if (response.data.items.length === 0 && params.offset > 0) {
                setParams({...params, offset: 0})
                return
            }
            setTransactions(response.data.items)
        } catch(error) {
            console.log(error?.response.status)
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

    useEffect(() => {
        getTransactions()
    }, [params])

    return (
         <>
            <Sidebar user={user} />
            <div className="p-4 ml-64 my-5">
                <div className="w-full mx-auto max-w-5xl justify-between flex flex-wrap space-y-3">
                    <h1 className="text-white w-screen text-3xl font-bold py-4">Transactions</h1>
                    <div className="overflow-x-auto border border-gray-700 rounded-lg w-full">
                    <div className="bg-gray-800">
                        <h2 className="p-5 text-lg font-semibold text-left text-white">Transactions history</h2>
                        <form onChange={handleChange} className="px-5 pb-2 flex">
                            <p className="text-white me-4">Show only:</p>
                            <div className="flex items-center me-4">
                                <input id="all" type="radio" value="" name="type" defaultChecked className="w-4 h-4 text-blue-600 focus:ring-blue-600 ring-offset-gray-800 focus:ring-2 bg-gray-700 border-gray-600"/>
                                <label htmlFor="all" className="ms-2 text-sm font-medium text-gray-300">All</label>
                            </div>
                            {Object.keys(TransactionTypeLabel).map((transactionType) => (
                                <div className="flex items-center me-4" key={transactionType}>
                                    <input id={transactionType} type="radio" value={transactionType} name="type" className="w-4 h-4 text-blue-600 focus:ring-blue-600 ring-offset-gray-800 focus:ring-2 bg-gray-700 border-gray-600" />
                                    <label htmlFor={transactionType} className="ms-2 text-sm font-medium text-gray-300">{TransactionTypeLabel[transactionType]}</label>
                                </div>
                            ))}
                        </form>
                    </div>
                    <table className="w-full text-sm text-left text-gray-400">
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
                    <div className="flex items-center p-4 bg-gray-800">
                        <div className="inline-flex basis-1/2">
                            <p className="text-sm font-normal text-gray-400">
                                Showing
                                <span className="ms-1 font-semibold text-white">
                                    {params.offset === 0 ? "1" : params.offset}-{params.offset + params.limit}
                                </span>
                            </p>
                        </div>
                        <div className="inline-flex basis-1/2 justify-end">
                            <button onClick={() => params.offset > 0 ? setParams({...params, offset: params.offset - params.limit}) : null } className="flex items-center justify-center px-3 h-8 text-sm font-medium border border-r-0 rounded-s bg-gray-800 border-gray-700 text-gray-400 hover:bg-gray-700 hover:text-white">Previous</button>
                            <button onClick={() => setParams({...params, offset: params.offset + params.limit})} className="flex items-center justify-center px-3 h-8 text-sm font-medium border rounded-e bg-gray-800 border-gray-700 text-gray-400 hover:bg-gray-700 hover:text-white">Next</button>
                        </div>
                    </div>
                </div>
                </div>
            </div>
         </>
    )
}

export default Transactions