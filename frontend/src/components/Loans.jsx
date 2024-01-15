import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import client from "../api/axios"
import Sidebar from "./Sidebar"

const Loans = () => {
    const [user, setUser] = useState({
        name: "",
        surname: ""
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
            <div className="p-4 ml-64 my-5">
                <div className="w-full mx-auto max-w-5xl justify-between flex flex-wrap space-y-3">
                    <h1 className="text-white w-screen text-3xl font-bold py-4">Loans</h1>
                </div>
            </div>
         </>
    )
}

export default Loans