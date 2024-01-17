import { useState, useEffect } from "react"
import client from "../api/axios"
import Sidebar from "./Sidebar"
import { handleError } from "../utils/api"


const Customer = () => {
    const [error, setError] = useState("")
    const [success, setSuccess] = useState(false)
    const [user, setUser] = useState({
        name: "",
        surname: ""
    })
    const [formData, setFormData] = useState({
        surname: "",
        email: "",
        phone: ""
    })

    const handleChange = (e) => {
        const value = e.target.value
        setFormData({
            ...formData,
            [e.target.name]: value
        })
    }

    const updateCustomer = async() => {
        try {
            const response = await client.put("/me", formData)
            setSuccess(response.status >= 200 && response.status < 300)
        } catch(error) {
            setError(handleError(error))
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        setError("")
        setSuccess(false)

        if (!formData.surname) { setError("You need to provide your surname"); return }
        if (!formData.email) { setError("You need to provide your email"); return }

        const phoneRegex = /^\+[1-9]\d{1,14}$/
        if (!formData.phone) { setError("You need to provide your phone number"); return }
        if (!phoneRegex.test(formData.phone)) { setError("Invalid phone number"); return }

        updateCustomer()
    }

    const getUser = async() => {
        try {
            const response = await client.get("/me")
            setUser(response.data)
            setFormData({
                surname: response.data.surname,
                email: response.data.email,
                phone: response.data.phone
            })
        } catch (error) {
            console.log(error?.response.status)
        }
    }

    useEffect(() => {
        getUser();
    }, [success])

    return (
         <>
            <Sidebar user={user} />
            <div className="p-4 ml-64 my-5">
                <div className="w-full mx-auto max-w-5xl items-center flex flex-col space-y-3">
                    <h1 className="text-white text-3xl font-bold py-4">Customer details</h1>
                    <div className="w-1/2 flex flex-col items-center">
                        <svg className="w-32 h-32 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                        </svg>
                        <h2 className="mb-1 text-xl font-medium text-white">{user.name} {user.surname}</h2>
                        <p className="text-sm text-gray-400">{user.email}</p>
                        <p className="text-sm text-gray-400">{user.phone}</p>
                    </div>
                    <h2 className="p-5 pt-10 pb-0 w-1/2 text-white text-2xl">Update your details</h2>
                    <form onSubmit={handleSubmit} className="p-5 pt-0 space-y-4 w-1/2">
                        <div>
                            <label className="block mb-2 text-sm font-medium text-white">Your surname</label>
                            <input type="text" name="surname" value={formData.surname} onChange={handleChange} className="bg-gray-700 border border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 placeholder-gray-400 text-white"/>
                        </div>
                        <div>
                            <label className="block mb-2 text-sm font-medium text-white">Your email</label>
                            <input type="email" name="email" value={formData.email} onChange={handleChange} className="bg-gray-700 border border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 placeholder-gray-400 text-white"/>
                        </div>
                        <div>
                            <label className="block mb-2 text-sm font-medium text-white">Your phone</label>
                            <input type="phone" name="phone" value={formData.phone} onChange={handleChange} className="bg-gray-700 border border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 placeholder-gray-400 text-white"/>
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
                                <span className="font-medium">Successfully updated your details!</span>
                            </div>
                        }
                        <button type="submit" className="text-white font-medium rounded-lg text-sm px-5 py-2.5 text-center w-full bg-primary-600 hover:bg-primary-700 focus:ring-primary-800 focus:outline-none">Update</button>
                    </form>
                </div>
            </div>
         </>
    )
}

export default Customer