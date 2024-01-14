import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "../provider/authProvider"

const RedirectAuthenticatedRoute = () => {
    const { token } = useAuth()
    return (
        token ? <Navigate to="/dashboard" replace={true} /> : <Outlet />
    )
}

export default RedirectAuthenticatedRoute
