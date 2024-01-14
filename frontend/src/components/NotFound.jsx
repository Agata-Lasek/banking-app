import { Link } from "react-router-dom"

const NotFound = () => {
    return (
        <div className="flex flex-col items-center justify-center space-y-2 h-screen">
            <h1 className="text-white text-3xl">We couldn't find that page</h1>
            <p className="text-md font-light text-gray-400">Sorry, looks like this page doesn't exist.</p>
            <Link to="/dashboard" className="font-medium hover:underline text-primary-500 px-2">Take me back</Link>
        </div>
    )
}

export default NotFound
