import client from "../api/axios"
import { createContext, useContext, useMemo, useReducer } from "react"

const AuthContext = createContext()

const ACTIONS = {
    setToken: "setToken",
    clearToken: "clearToken"
}

const authReducer = (state, action) => {
    switch(action.type) {
        case ACTIONS.setToken:
            client.defaults.headers.common["Authorization"] = `Bearer ${action.payload}`
            localStorage.setItem("token", action.payload)
            return { ...state, token: action.payload }
        case ACTIONS.clearToken:
            delete client.defaults.headers.common["Authorization"]
            localStorage.removeItem("token")
            return { ...state, token: null }
        default:
            console.error(`Invalid action type ${action.type}`)
    }
}

const initData = {
    token: localStorage.getItem("token")
}

const AuthProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, initData)

    const setToken = (token) => {
        dispatch({ type: ACTIONS.setToken, payload: token })
    }

    const clearToken = () => {
        dispatch({ type: ACTIONS.clearToken })
    }

    const contextValue = useMemo(
        () => ({
            ...state,
            setToken,
            clearToken
        }),
        [state]
    )

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    return useContext(AuthContext)
}

export default AuthProvider
