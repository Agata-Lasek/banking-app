import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../../provider/authProvider"
import client from "../../api/axios"
import { handleError } from "../../utils/api"

const Login = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    })
    const [error, setError] = useState("")
    const navigate = useNavigate()
    const { setToken } = useAuth()

    const handleChange = (e) => {
        const value = e.target.value
        setFormData({
            ...formData,
            [e.target.name]: value
        })
    }

    const handleLogin = async() => {
        try {
            const headers = {"Content-Type": "application/x-www-form-urlencoded"}
            const loginData = {username: formData.email, password: formData.password}
            const response = await client.post("/auth/token", loginData, {headers: headers})
            setToken(response.data.access_token)
            navigate("/dashboard", { replace: true })
        } catch (error) {
            setError(handleError(error))
        }

    }

    const handleSubmit = (e) => {
        e.preventDefault();
        setError("")
        if (!formData.email) { setError("You need to provide your email"); return }
        if (!formData.password) { setError("You need to provide your password"); return }
        handleLogin()
    }

    return (
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto max-w-prose h-screen">
            <div className="w-full bg-gray-800 border-gray-700 rounded-lg shadow border">
                <div className="p-6 space-y-4">
                    <h1 className="text-xl font-bold leading-tight tracking-tight text-white">Welcome back</h1>                        
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div>
                            <label className="block mb-2 text-sm font-medium text-white">Your email</label>
                            <input type="email" name="email" value={formData.email} onChange={handleChange} className="bg-gray-700 border border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 placeholder-gray-400 text-white" placeholder="your@email.com"/>
                        </div>
                        <div>
                            <label className="block mb-2 text-sm font-medium text-white">Your password</label>
                            <input type="password" name="password" value={formData.password} onChange={handleChange} className="bg-gray-700 border border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 placeholder-gray-400 text-white" placeholder="••••••••"/>
                        </div>
                        {error &&
                            <div className="flex items-center p-4 mb-4 text-sm text-red-400 border border-red-800 rounded-lg">
                                <svg className="flex-shrink-0 inline w-4 h-4 me-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
                                </svg>
                                <span className="font-medium">{error}</span>
                            </div>
                        }
                        <button type="submit" className="text-white font-medium rounded-lg text-sm px-5 py-2.5 text-center w-full bg-primary-600 hover:bg-primary-700 focus:ring-primary-800 focus:outline-none">Sign in to your account</button>
                        <p className="text-sm font-light text-gray-400">
                        Don't have an account yet? <Link to="/signup" className="font-medium hover:underline text-primary-500">Sign up</Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Login