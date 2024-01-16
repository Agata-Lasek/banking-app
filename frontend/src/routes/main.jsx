import { RouterProvider, createBrowserRouter } from "react-router-dom"
import ProtectedRoute from "./ProtectedRoute"
import RedirectAuthenticatedRoute from "./RedirectAuthenticatedRoute"
import Login from "../components/auth/Login"
import Signup from "../components/auth/Signup"
import Logout from "../components/auth/Logout"
import Dashboard from "../components/Dashboard"
import Accounts from "../components/Accounts"
import AccountOpen from "../components/AccountOpen"
import Cards from "../components/Cards"
import Transactions from "../components/Transactions"
import Transfer from "../components/Transfer"
import Loans from "../components/Loans"
import LoanTake from "../components/LoanTake"
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
                    path: "/accounts/open",
                    element: <AccountOpen />
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
                    path: "/transfer",
                    element: <Transfer />
                },
                {
                    path: "/loans",
                    element: <Loans />,
                },
                {
                    path: "/loans/take",
                    element: <LoanTake />,
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
