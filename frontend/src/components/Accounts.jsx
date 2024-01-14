import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import client from "../api/axios"
import Sidebar from "./Sidebar"

const Accounts = () => {
    const [user, setUser] = useState({
        name: "Name",
        surname: "Surname"
    })

    useEffect(() => {
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
        getUser()
    }, [])

    return (
        <>
            <Sidebar user={user} />
            <div className="p-4">
                <h1 className="text-3xl font-bold leading-tight tracking-tight text-white">Dashboard</h1>
            </div>
        </>
    )
}

export default Accounts