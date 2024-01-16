import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import client from "../api/axios"
import Sidebar from "./Sidebar"

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
                <button className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Payoff</button>
            </td>
        </tr>
    )
}

const Loans = () => {
    const [user, setUser] = useState({
        name: "",
        surname: ""
    })
    const [loans, setLoans] = useState([])

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

    const getLoans = async() => {
        try {
            const response = await client.get("/me/loans")
            setLoans(response.data.items)
        } catch(error) {
            console.log(error?.response.status)
        }
    }

        useEffect(() => {
            const fetchData = async () => {
                await Promise.all([getUser(), getLoans()]);
            };
            fetchData();
        }, [])

    return (
        <>
           <Sidebar user={user} />
           <div className="p-4 ml-64 my-5">
               <div className="w-full mx-auto max-w-5xl justify-between flex flex-wrap space-y-3">
                   <h1 className="text-white w-screen text-3xl font-bold py-4">Loans</h1>
                   <div className="overflow-x-auto border border-gray-700 rounded-lg w-full">
                       <div className="bg-gray-800">
                           <h2 className="px-5 pt-5 text-lg font-semibold text-left text-white">Already taken out loans</h2>                          
                           <p className="px-5 pb-5 mt-1 text-sm font-normal text-gray-400">Remember that you can take out an unlimited number of loans, however, the day will come when you will have to pay them all back.</p>
                       </div>
                       <table className="w-full text-sm text-left text-gray-400">
                           <thead className="text-xs uppercase bg-gray-700 text-gray-400">
                               <tr>
                                   <th scope="col" className="px-6 py-3">
                                       Take out date
                                   </th>
                                   <th scope="col" className="px-6 py-3 w-2/6">
                                       Amount
                                   </th>
                                   <th scope="col" className="px-6 py-3">
                                       Paid at date
                                   </th>
                                   <th scope="col" className="px-6 py-3">
                                        <span className="sr-only">Payoff</span>
                                    </th>
                               </tr>
                           </thead>
                           <tbody>
                               {loans.map((account, index) => <LoanTableElement loan={account} key={index} />)}
                           </tbody>
                       </table>
                       <div className="flex items-center justify-end p-4 bg-gray-800">
                           <Link to="/loans/take" className="inline-flex items-center justify-center px-3 h-8 text-sm font-medium border rounded bg-gray-800 border-gray-700 text-gray-400 hover:bg-gray-700 hover:text-white">Take out loan</Link>
                       </div>
                   </div>
               </div>
           </div>
        </>
   )
}

export default Loans