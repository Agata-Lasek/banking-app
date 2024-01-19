import { RouterProvider, createBrowserRouter } from "react-router-dom"
import ProtectedRoute from "./ProtectedRoute"
import RedirectAuthenticatedRoute from "./RedirectAuthenticatedRoute"
import Login from "../components/auth/Login"
import Signup from "../components/auth/Signup"
import Logout from "../components/auth/Logout"
import Customer from "../components/Customer"
import Dashboard from "../components/Dashboard"
import Accounts from "../components/account/Accounts"
import AccountOpen from "../components/account/AccountOpen"
import Cards from "../components/card/Cards"
import CardDetails from "../components/card/CardDetails"
import CardActivate from "../components/card/CardActivate"
import CardAdd from "../components/card/CardAdd"
import ATM from "../components/ATM"
import Transactions from "../components/transaction/Transactions"
import Transfer from "../components/Transfer"
import Loans from "../components/loan/Loans"
import LoanTake from "../components/loan/LoanTake"
import LoanPayoff from "../components/loan/LoanPayoff"
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
                    path: "/me",
                    element: <Customer />
                },
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
                    path: "/cards/:cardId",
                    element: <CardDetails />
                },
                {
                    path: "/cards/:cardId/activate",
                    element: <CardActivate />
                },
                {
                    path: "/cards/add",
                    element: <CardAdd />
                },
                {
                    path: "/atm",
                    element: <ATM />
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
                    path: "/loans/:loanId/payoff",
                    element: <LoanPayoff />,
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
