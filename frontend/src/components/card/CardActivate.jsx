import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import client from "../../api/axios"
import Sidebar from "../Sidebar"
import { handleError } from "../../utils/api"
import NotFound from "../NotFound"


const CardActivate = () => {
    const [error, setError] = useState("")
    const [success, setSuccess] = useState(false)
    const [user, setUser] = useState({
        name: "",
        surname: ""
    })
    const { cardId } = useParams()
    const [card, setCard] = useState({})
    const [formData, setFormData] = useState({
        pin: "",
        confirmPin: ""
    })

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

    const handleChange = (e) => {
        const value = e.target.value
        setFormData({
            ...formData,
            [e.target.name]: value
        })
    }

    const activateCard = async() => {
        try {
            const response = await client.put(`/cards/${cardId}/activate`, { pin: formData.pin})
            setSuccess(response.status >= 200 && response.status < 300)
        } catch(error) {
            setError(handleError(error))
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        setError("")
        setSuccess(false)

        if (!formData.pin) { setError("You need to provide your pin"); return }
        if (isNaN(Number(formData.pin))) { setError("Pin must be a number"); return }
        if (formData.pin.length !== 4) { setError("Pin must be 4 digits long"); return }

        if (!formData.confirmPin) { setError("You need to confirm your pin"); return }
        if (isNaN(Number(formData.confirmPin))) { setError("Pin must be a number"); return }
        if (formData.confirmPin != formData.pin) { setError("Pins don't match"); return }

        activateCard()
    }

    const getUser = async() => {
        try {
            const response = await client.get("/me")
            setUser(response.data)
        } catch (error) {
            console.log(error?.response.status)
        }
    }

    useEffect(() => {
        getCard()
    }, [])

    useEffect(() => {
        if (Object.keys(card).length > 0) {
            getUser()
        }
    }, [card])

    return Object.keys(card).length > 0 ? (
         <>
            <Sidebar user={user} />
            <div className="p-4 ml-64 my-5">
                <div className="w-full mx-auto max-w-5xl items-center flex flex-col space-y-3">
                    <h1 className="text-white text-3xl font-bold py-4">Activate your card</h1>
                    <form onSubmit={handleSubmit} className="p-5 pt-0 space-y-4 w-1/2">
                        <div>
                            <label className="block mb-2 text-sm font-medium text-white">Your pin</label>
                            <input type="password" name="pin" value={formData.pin} onChange={handleChange} className="bg-gray-700 border border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 placeholder-gray-400 text-white"/>
                        </div>
                        <div>
                            <label className="block mb-2 text-sm font-medium text-white">Confirm your pin</label>
                            <input type="password" name="confirmPin" value={formData.confirmPin} onChange={handleChange} className="bg-gray-700 border border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 placeholder-gray-400 text-white"/>
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
                                <span className="font-medium">Successfully activated your card!</span>
                            </div>
                        }
                        <button type="submit" className="text-white font-medium rounded-lg text-sm px-5 py-2.5 text-center w-full bg-primary-600 hover:bg-primary-700 focus:ring-primary-800 focus:outline-none">Activate</button>
                    </form>
                </div>
            </div>
         </>
    ) : <NotFound />
}

export default CardActivate