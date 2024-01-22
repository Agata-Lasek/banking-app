import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import client from "../../api/axios"
import Sidebar from "../Sidebar"
import CardTableElement from "./CartTableElement"

const Cards = () => {
    const [user, setUser] = useState({
        name: "",
        surname: ""
    })
    const [cards, setCards] = useState([])
    const [accounts, setAccounts] = useState([])
    const [params, setParams] = useState({
        expired: false,
        blocked: false,
        offset: 0,
        limit: 15
    })

    const getCards = async() => {
        try {
            const response = await client.get("/me/cards", { params: params })
            if (response.data.items.length === 0 && params.offset > 0) {
                setParams({...params, offset: 0})
                return
            }
            setCards(response.data.items)
        } catch(error) {
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

    useEffect(() => {
        const fetchData = async() => {
            await Promise.all([
                getUser(),
                getAccounts()
            ])
        }
        fetchData()
    }, [])

    useEffect(() => {
        getCards()
    }, [params])

    return (
         <>
            <Sidebar user={user} />
            <div className="p-4 ml-64 my-5">
                <div className="w-full mx-auto max-w-5xl items-center justify-center flex flex-wrap space-y-3">
                    <h1 className="text-white w-screen text-3xl font-bold py-4">Cards</h1>
                    <div className="overflow-x-auto border border-gray-700 rounded-lg w-full">
                        <div className="pt-5 px-5 flex flex-col bg-gray-800">
                            <h2 className="text-lg font-semibold text-left text-white">Already owned cards</h2>
                            <p className="mt-1 text-sm font-normal text-gray-400">Remember that you can only have three active cards connected to one account.</p>
                            <div className="my-2 inline-flex items-center space-x-4">
                                <p className="text-gray-300">Show also:</p>
                                <div>
                                    <input id="expired" type="checkbox" onChange={(e) => setParams({...params, expired: e.target.checked})} className="w-4 h-4 text-blue-600 rounded focus:ring-blue-600 ring-offset-gray-800 focus:ring-2 bg-gray-700 border-gray-600" />
                                    <label htmlFor="expired" className="ms-2 text-sm font-medium text-gray-300">Expired</label>
                                </div>
                                <div>
                                <input id="blocked" type="checkbox" onChange={(e) => setParams({...params, blocked: e.target.checked})} className="w-4 h-4 text-blue-600 rounded focus:ring-blue-600 ring-offset-gray-800 focus:ring-2 bg-gray-700 border-gray-600" />
                                    <label htmlFor="blocked" className="ms-2 text-sm font-medium text-gray-300">Blocked</label>
                                </div>
                            </div>
                        </div>
                        <table className="w-full text-sm text-left text-gray-400">
                            <thead className="text-xs uppercase bg-gray-700 text-gray-400">
                                <tr>
                                   <th scope="col" className="px-6 py-3">
                                       Card number
                                   </th>
                                   <th scope="col" className="px-6 py-3">
                                       Status
                                   </th>
                                   <th scope="col" className="px-6 py-3">
                                       Related account number
                                   </th>
                                   <th scope="col" className="px-6 py-3">
                                       Available funds
                                   </th>
                                   <th scope="col" className="px-6 py-3">
                                        <span className="sr-only">Details</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {cards.map((card) => <CardTableElement key={card.id} card={card} accounts={accounts} />)}
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
                                <Link to="/cards/add" className="inline-flex items-center justify-center mx-3 px-3 h-8 text-sm font-medium border rounded bg-gray-800 border-gray-700 text-gray-400 hover:bg-gray-700 hover:text-white">Add new card</Link>
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

export default Cards