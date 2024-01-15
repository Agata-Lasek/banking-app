import { RouterProvider, createBrowserRouter } from "react-router-dom"
import { useAuth } from "../provider/authProvider"
import ProtectedRoute from "./ProtectedRoute"
import RedirectAuthenticatedRoute from "./RedirectAuthenticatedRoute"
import Login from "../components/auth/Login"
import Signup from "../components/auth/Signup"
import Logout from "../components/auth/Logout"
import Dashboard from "../components/Dashboard"
import Accounts from "../components/Accounts"
import Cards from "../components/Cards"
import Transactions from "../components/Transactions"
import Loans from "../components/Loans"
import NotFound from "../components/NotFound"


const Routes = () => {
    const publicRoutes = [
        {
            path: "*",
            element: <NotFound />
        },
        {
            path: "/",
            element: <RedirectAuthenticatedRoute />,
            children: [
                {
                    path: "/login",
                    element: <Login />,
                },
                {
                    path: "/signup",
                    element: <Signup />,
                }
            ]
        }
    ]

    const authenticatedRoutes = [
        {
            path: "/",
            element: <ProtectedRoute />,
            children: [
                {
                    path: "/logout",
                    element: <Logout />
                },
                {
                    path: "/dashboard",
                    element: <Dashboard />
                },
                {
                    path: "/accounts",
                    element: <Accounts />
                },
                {
                    path: "/cards",
                    element: <Cards />
                },
                {
                    path: "/transactions",
                    element: <Transactions />
                },
                {
                    path: "/loans",
                    element: <Loans />
                }
            ]
        }
    ]

    const router = createBrowserRouter([
        ...publicRoutes,
        ...authenticatedRoutes,
    ])

    return <RouterProvider router={router} />
}

export default Routes
