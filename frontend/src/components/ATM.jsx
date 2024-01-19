import { useState, useEffect } from "react"
import client from "../api/axios"
import Sidebar from "./Sidebar"
import { maskAccountNumber, AccountType } from "../utils/account"
import { maskCardNumber } from "../utils/card"
import { handleError } from "../utils/api"


const ATM = () => {
    const [formError, setFormError] = useState("")
    const [cardsError, setCardsError] = useState("")
    const [success, setSuccess] = useState(false)
    const [user, setUser] = useState({
        name: "",
        surname: ""
    })
    const [withdrawal, setWithdrawal] = useState(true)
    const [accounts, setAccounts] = useState([])
    const [selectedAccountId, setSelectedAccountId] = useState("")
    const [cards, setCards] = useState([])
    const [selectedCardId, setSelectedCardId] = useState("")
    const [formData, setFormData] = useState({
        pin: "",
        amount: ""
    })

    const getAccounts = async() => {
        try {
            const response = await client.get("/me/accounts")
            setAccounts(response.data.items)
        } catch(error) {
            console.log(error?.response.status)
        }
    }

    const getCards = async() => {
        try {
            setCardsError("")
            const response = await client.get(`/accounts/${selectedAccountId}/cards`)
            if (response.status >= 200 && response.status < 300) {
                const activeCards = response.data.items.filter(card => card.active && !card.blockedAt);
                if (activeCards.length === 0) {
                    setCardsError("You don't have any active cards for this account")
                }
                setCards(activeCards)
            }
        } catch(error) {
            if (error?.response.status === 404) {
                setCardsError("You don't have any cards for this account")
                return
            }
            setCardsError(handleError(error))
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

    const handleChange = (e) => {
        const value = e.target.value;
        setFormData({
            ...formData,
            [e.target.name]: value
        })
    }

    const withdrawMoney = async() => {
        try {
            const response = await client.post(`/cards/${selectedCardId}/withdraw`, formData)
            setSuccess(response.status >= 200 && response.status < 300)
        } catch(error) {
            setFormError(handleError(error))
        }
    }

    const depositMoney = async() => {
        try {
            const response = await client.post(`/cards/${selectedCardId}/deposit`, formData)
            setSuccess(response.status >= 200 && response.status < 300)
        } catch(error) {
            setFormError(handleError(error))
        }
    }

    const handleSubmit = async(e) => {
        e.preventDefault()
        setFormError("")
        setSuccess(false)
        
        if (!selectedAccountId) { setFormError("You need to select an account"); return }
        if (!selectedCardId) { setFormError("You need to select a card"); return }

        if (!formData.amount) { setFormError("You need to provide an amount"); return }
        if (isNaN(Number(formData.amount))) { setFormError("Amount must be a number"); return }
        if (formData.amount <= 0) { setFormError("Amount must be greater than 0"); return }

        if (!formData.pin) { setFormError("You need to provide your pin"); return }
        if (isNaN(Number(formData.pin))) { setFormError("Pin must be a number"); return }

        withdrawal ? withdrawMoney() : depositMoney()
    }

    useEffect(() => {
        getUser()
    }, [])

    useEffect(() => {
        getAccounts()
    }, [success])

    useEffect(() => {
        if (selectedAccountId) getCards()
    }, [selectedAccountId])

    return (
         <>
            <Sidebar user={user} />
            <div className="p-4 ml-64 my-5">
                <div className="w-full mx-auto max-w-5xl items-center flex flex-col space-y-3">
                    <h1 className="text-white text-3xl font-bold py-4">Automated Teller Machine</h1>
                    <form onSubmit={handleSubmit} className="mx-auto flex flex-col space-y-4 w-1/2">
                        <div>
                            <p className="block mb-2 text-sm font-medium text-white">Operation type</p>
                            <ul className="flex items-center space-x-3">
                                <li className="basis-1/2 pb-3">
                                    <input type="radio" id="withdrawal" name="operation" onChange={() => setWithdrawal(true)} className="hidden peer" defaultChecked/>
                                    <label htmlFor="withdrawal" className="flex items-center p-5 hover:bg-gray-700 bg-gray-800 peer-checked:border-blue-600 border-gray-700 cursor-pointer rounded-lg border">
                                        <div className="flex-1 min-w-0">
                                            <p className="text-lg font-semibold text-white">Withdrawal</p>
                                            <p className="text-sm text-gray-400">The daily amount of this operation is limited</p>
                                        </div>
                                    </label>
                                </li>
                                <li className="basis-1/2 pb-3">
                                    <input type="radio" id="deposit" name="operation" onChange={() => setWithdrawal(false)} className="hidden peer"/>
                                    <label htmlFor="deposit" className="flex items-center p-5 hover:bg-gray-700 bg-gray-800 peer-checked:border-blue-600 border-gray-700 cursor-pointer rounded-lg border">
                                        <div className="flex-1 min-w-0">
                                            <p className="text-lg font-semibold text-white">Deposit</p>
                                            <p className="text-sm text-gray-400">The daily amount of this operation is limited</p>
                                        </div>
                                    </label>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <p className="block mb-2 text-sm font-medium text-white">{withdrawal ? "Withdraw from" : "Deposit from"}</p>
                            <ul>
                                {accounts.map((account, index) => account && account.type != AccountType.SAVING && (
                                    <li key={index} className="pb-3">
                                        <input type="radio" id={`account-${index}`} name="account-id" onChange={() => setSelectedAccountId(account.id)} className="hidden peer"/>
                                        <label htmlFor={`account-${index}`} className="flex items-center p-5 hover:bg-gray-700 bg-gray-800 peer-checked:border-blue-600 border-gray-700 cursor-pointer rounded-lg border">
                                            <div className="flex-1 min-w-0">
                                                <p className="text-lg font-semibold text-white">{maskAccountNumber(account.number)}</p>
                                                <p className="text-sm text-gray-400">{account.type}</p>
                                            </div>
                                            <div className="inline-flex items-center text-base font-semibold text-white">
                                                {account.balance} {account.currency}
                                            </div>
                                        </label>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        {cards.length > 0 ? (
                            <>
                                <div className="space-y-4">
                                    <div>
                                        <p className="block mb-2 text-sm font-medium text-white">Select card</p>
                                        <ul className="grid w-full gap-6 grid-cols-2">
                                            {cards.map((card, index) => 
                                                <li key={index}>
                                                    <input type="radio" id={`card-${index}`} name="card-id" onChange={() => setSelectedCardId(card.id)} className="hidden peer"/>
                                                    <label htmlFor={`card-${index}`} className="inline-flex items-center flex-wrap space-y-2 w-full p-5 bg-gradient-to-r from-gray-600 via-gray-700 to-gray-800 rounded-xl text-white shadow-2xl cursor-pointer peer-checked:from-primary-600 peer-checked:via-primary-700 peer-checked:to-primary-800">
                                                        <div className="">
                                                            <p className="font-light text-sm">Name</p>
                                                            <p className="font-medium tracking-widest text-sm">{user.name} {user.surname}</p>
                                                        </div>
                                                        <div className="">
                                                        <p className="font-light text-sm">Card number</p>
                                                            <p className="font-medium tracking-widest text-sm">{maskCardNumber(card.number)}</p>
                                                        </div>
                                                    </label>
                                                </li>
                                            )}
                                        </ul>
                                    </div>
                                    <div className="space-y-4">
                                        <label htmlFor="amount" className="mb-2 text-sm font-medium sr-only text-white">Amount</label>
                                        <div className="relative w-full">
                                            <div className="absolute inset-y-0 start-0 top-0 flex items-center ps-3.5 pointer-events-none">
                                                <svg className="w-4 h-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 2a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1M2 5h12a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Zm8 5a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z"/>
                                                </svg>
                                            </div>
                                            <input type="number" id="amount" name="amount" value={formData.amount} onChange={handleChange} className="block px-4 py-3 w-full font-medium z-20 ps-10 text-sm rounded-lg border focus:ring-blue-500 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:border-blue-500" placeholder="Enter amount"/>
                                        </div>
                                        <div className="relative w-full">
                                            <div className="absolute inset-y-0 start-0 top-0 flex items-center ps-3.5 pointer-events-none">
                                                <svg className="w-4 h-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                                                </svg>
                                            </div>
                                            <input type="password" id="pin" name="pin" value={formData.pin} onChange={handleChange} className="block px-4 py-3 w-full font-medium z-20 ps-10 text-sm rounded-lg border focus:ring-blue-500 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:border-blue-500" placeholder="Enter pin"/>
                                        </div>
                                    </div>
                                    {success &&
                                        <div className="flex items-center p-4 mb-4 text-sm text-green-400 border border-green-800 rounded-lg">
                                            <svg className="flex-shrink-0 inline w-4 h-4 me-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
                                            </svg>
                                            <span className="font-medium">{withdrawal ? "Successfully withdrew money!" : "Successfully deposited money!"}</span>
                                        </div>
                                    }
                                    {formError &&
                                        <div className="flex items-center p-4 mb-4 text-sm text-red-400 border border-red-800 rounded-lg">
                                            <svg className="flex-shrink-0 inline w-4 h-4 me-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
                                            </svg>
                                            <span className="font-medium">{formError}</span>
                                        </div>
                                    }
                                    <button type="submit" className="text-white font-medium rounded-lg text-sm px-5 py-2.5 text-center w-full bg-primary-600 hover:bg-primary-700 focus:ring-primary-800 focus:outline-none">{withdrawal ? "Withdraw" : "Deposit"}</button>
                                </div>
                            </>
                        ) : ""}
                        {cardsError &&
                            <div className="flex items-center p-4 mb-4 text-sm text-red-400 border border-red-800 rounded-lg">
                                <svg className="flex-shrink-0 inline w-4 h-4 me-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
                                </svg>
                                <span className="font-medium">{cardsError}</span>
                            </div>
                        }
                    </form>
                </div>
            </div>
         </>
    )
}

export default ATM