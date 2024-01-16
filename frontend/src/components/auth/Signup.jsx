import { useState } from "react"
import { Link } from "react-router-dom"
import client from "../../api/axios"
import { handleError } from "../../utils/api"

const Signup = () => {
    const [formData, setFormData] = useState({
        name: "",
        surname: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: ""
    })
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState("")

    const handleChange = (e) => {
        const value = e.target.value
        setFormData({
            ...formData,
            [e.target.name]: value
        })
    }

    const handleSignup = async() => {
        try {
            const response = await client.post("/customers", formData)
            setSuccess(response.status >= 200 && response.status < 300)
        } catch(error) {
            setError(handleError(error))
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        setError("")
        setSuccess(false)

        if (!formData.name) { setError("You need to provide your name"); return }
        if (!formData.surname) { setError("You need to provide your surname"); return }
        if (!formData.email) { setError("You need to provide your email"); return }
        if (!formData.phone) { setError("You need to provide your phone number"); return }

        const phoneRegex = /^\+[1-9]\d{1,14}$/
        if (!phoneRegex.test(formData.phone)) { setError("Invalid phone number"); return }

        if (!formData.password) { setError("You need to provide your password"); return }
        if (formData.password !== formData.confirmPassword) { setError("Passwords don't match"); return }
        handleSignup()
    }

    return (
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto max-w-prose h-screen">
            <div className="w-full bg-gray-800 border-gray-700 rounded-lg shadow border">
                <div className="p-6 space-y-4">
                    <h1 className="text-xl font-bold leading-tight tracking-tight text-white">Get started</h1>                        
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div>
                            <label className="block mb-2 text-sm font-medium text-white">Your name</label>
                            <input type="text" name="name" value={formData.name} onChange={handleChange} className="bg-gray-700 border border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 placeholder-gray-400 text-white" placeholder="name"/>
                        </div>
                        <div>
                            <label className="block mb-2 text-sm font-medium text-white">Your surname</label>
                            <input type="text" name="surname" value={formData.surname} onChange={handleChange} className="bg-gray-700 border border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 placeholder-gray-400 text-white" placeholder="surname"/>
                        </div>
                        <div>
                            <label className="block mb-2 text-sm font-medium text-white">Your email</label>
                            <input type="email" name="email" value={formData.email} onChange={handleChange} className="bg-gray-700 border border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 placeholder-gray-400 text-white" placeholder="your@email.com"/>
                        </div>
                        <div>
                            <label className="block mb-2 text-sm font-medium text-white">Your phone</label>
                            <input type="phone" name="phone" value={formData.phone} onChange={handleChange} className="bg-gray-700 border border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 placeholder-gray-400 text-white" placeholder="+48601875132"/>
                        </div>
                        <div>
                            <label className="block mb-2 text-sm font-medium text-white">Your password</label>
                            <input type="password" name="password" value={formData.password} onChange={handleChange} className="bg-gray-700 border border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 placeholder-gray-400 text-white" placeholder="••••••••"/>
                        </div>
                        <div>
                            <label className="block mb-2 text-sm font-medium text-white">Repeat your password</label>
                            <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} className="bg-gray-700 border border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 placeholder-gray-400 text-white" placeholder="••••••••"/>
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
                                <span className="font-medium">Successfully created an account!</span>
                            </div>
                        }
                        <button type="submit" className="text-white font-medium rounded-lg text-sm px-5 py-2.5 text-center w-full bg-primary-600 hover:bg-primary-700 focus:ring-primary-800 focus:outline-none">Sign up</button>
                        <p className="text-sm font-light text-gray-400">
                        Already have an account yet? <Link to="/login" className="font-medium hover:underline text-primary-500">Sign in</Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Signup
