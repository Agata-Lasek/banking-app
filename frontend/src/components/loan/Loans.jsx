import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import client from "../../api/axios"
import Sidebar from "../Sidebar"
import LoanTableElement from "./LoanTableElement"

const Loans = () => {
    const [user, setUser] = useState({
        name: "",
        surname: ""
    })
    const [loans, setLoans] = useState([])
    const [params, setParams] = useState({
        paidoff: false,
        offset: 0,
        limit: 15
    })

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
            const response = await client.get("/me/loans", { params: params })
            if (response.data.items.length === 0 && params.offset > 0) {
                setParams({...params, offset: 0})
                return
            }
            setLoans(response.data.items)
        } catch(error) {
            console.log(error?.response.status)
        }
    }

    useEffect(() => {
        getUser()
    }, [])

    useEffect(() => {
        getLoans()
    }, [params])

    return (
        <>
           <Sidebar user={user} />
           <div className="p-4 ml-64 my-5">
               <div className="w-full mx-auto max-w-5xl justify-between flex flex-wrap space-y-3">
                   <h1 className="text-white w-screen text-3xl font-bold py-4">Loans</h1>
                   <div className="overflow-x-auto border border-gray-700 rounded-lg w-full">
                        <div className="pt-5 px-5 flex flex-col bg-gray-800">
                            <h2 className="text-lg font-semibold text-left text-white">Already taken out loans</h2>
                            <p className="mt-1 text-sm font-normal text-gray-400">Remember that you can take out an unlimited number of loans, however, the day will come when you will have to pay them all back.</p>
                            <div className="my-2 inline-flex items-center">
                                <p className="text-gray-300 me-4">Show also:</p>
                                <input id="paidoff" type="checkbox" onChange={(e) => setParams({...params, paidoff: e.target.checked})} className="w-4 h-4 text-blue-600 rounded focus:ring-blue-600 ring-offset-gray-800 focus:ring-2 bg-gray-700 border-gray-600" />
                                <label htmlFor="paidoff" className="ms-2 text-sm font-medium text-gray-300">Paid off</label>
                            </div>
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
                                <Link to="/loans/take" className="inline-flex items-center justify-center mx-3 px-3 h-8 text-sm font-medium border rounded bg-gray-800 border-gray-700 text-gray-400 hover:bg-gray-700 hover:text-white">Take out loan</Link>
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

export default Loans