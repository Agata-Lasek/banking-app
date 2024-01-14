import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "../provider/authProvider"

const ProtectedRoute = () => {
    const { token } = useAuth()
    return (
        token ? <Outlet /> : <Navigate to="/login" replace={true} />
    )
}

export default ProtectedRoute
