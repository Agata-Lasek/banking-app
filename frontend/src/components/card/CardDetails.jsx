import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import client from "../../api/axios"
import Sidebar from "../Sidebar"
import { getCardStatus } from "../../utils/card"
import { handleError } from "../../utils/api"
import NotFound from "../NotFound"
import Card from "./Card"


const CardDetails = () => {
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    const [user, setUser] = useState({
        name: "",
        surname: ""
    })
    const [card, setCard] = useState({})
    const { cardId } = useParams()
    const [account, setAccount] = useState({})

    const getCard = async() => {
        try {
            if (isNaN(Number(cardId))) return
            const response = await client.get(`/cards/${cardId}`)
            if (response.status >= 200 && response.status < 300) {
                setCard(response.data)
            }
        } catch(error) {
            console.log(error?.response.status)
        }
    }

    const blockCard = async() => {
        try {
            const response = await client.put(`/cards/${cardId}/block`)
            if (response.status >= 200 && response.status < 300) {
                setCard(response.data)
                setError("")
                setSuccess("Card blocked successfully!")
            }
        } catch (error) {
            setSuccess("")
            setError(handleError(error))
        }
    }

    const unblockCard = async() => {
        try {
            const response = await client.put(`/cards/${cardId}/unblock`)
            if (response.status >= 200 && response.status < 300) {
                setCard(response.data)
                setError("")
                setSuccess("Card unblocked successfully!")
            }
        } catch(error) {
            setSuccess("")
            setError(handleError(error))
        }
    }

    const getAccount = async(accountId) => {
        try {
            const response = await client.get(`/accounts/${accountId}`)
            setAccount(response.data)
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
        getCard()
    }, [])

    useEffect(() => {
        const fetchData = async() => {
            if (Object.keys(card).length > 0) {
                await Promise.all([getUser(), getAccount(card.accountId)])
            }
        }
        fetchData()
    }, [card])

    return Object.keys(card).length > 0 ? (
         <>
            <Sidebar user={user} />
            <div className="p-4 ml-64 my-5">
                <div className="w-full mx-auto max-w-5xl items-center flex flex-col space-y-3">
                    <h1 className="text-white text-3xl font-bold py-4">Card details</h1>
                    <Card user={user} card={card}/>
                    <div className="w-96 flex items-center p-2">
                        <div className="p-2 basis-1/2">
                            <p className="text-white text-xl font-bold">Available funds</p>
                            <p className="text-gray-400 text-md">{account.balance} {account.currency}</p>
                        </div>
                        <div className="basis-1/2 p-2">
                            <p className="text-white text-xl font-bold">Status</p>
                            <p className="text-gray-400 text-md">{getCardStatus(card)}</p>
                        </div>
                    </div>
                    <div className="w-96 flex items-center">
                        {error &&
                            <div className="w-full flex items-center p-4 text-sm text-red-400 border border-red-800 rounded-lg">
                                <svg className="flex-shrink-0 inline w-4 h-4 me-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
                                </svg>
                                <span className="font-medium">{error}</span>
                            </div>
                        }
                        {success &&
                            <div className="w-full flex items-center p-4 text-sm text-green-400 border border-green-800 rounded-lg">
                                <svg className="flex-shrink-0 inline w-4 h-4 me-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
                                </svg>
                                <span className="font-medium">{success}</span>
                            </div>
                        }
                    </div>
                    <div className="w-96 flex items-center space-x-2">
                        { card.blockedAt ? (
                            <button onClick={unblockCard} className="w-full inline-flex items-center justify-center px-3 h-8 text-sm font-medium border rounded bg-gray-800 border-gray-700 text-gray-400 hover:bg-gray-700 hover:text-white">Unblock</button>
                        ) : (
                            <button onClick={blockCard} className="w-full inline-flex items-center justify-center px-3 h-8 text-sm font-medium border rounded bg-gray-800 border-gray-700 text-gray-400 hover:bg-gray-700 hover:text-white">Block</button>
                        )}
                        <Link 
                            to={`/cards/${cardId}/activate`}
                            onClick={(e) => card.active ? e.preventDefault() : null}
                            className={`w-full inline-flex items-center justify-center text-white font-medium rounded text-sm px-3 h-8 text-center w-full ${!card.active ? 'bg-primary-600 hover:bg-primary-700 focus:ring-primary-800 focus:outline-none' : 'bg-gray-600 cursor-not-allowed'}`}>
                                Activate
                        </Link>
                    </div>
                </div>
            </div>
         </>
    ) : <NotFound />
}

export default CardDetails