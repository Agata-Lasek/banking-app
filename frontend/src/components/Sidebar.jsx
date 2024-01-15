import { Link } from "react-router-dom"

const Sidebar = ({ user }) => {
    return (
        <aside className="fixed top-0 left-0 z-40 w-64 h-screen">
            <div className="h-5/6 px-3 py-4 overflow-y-auto bg-gray-800">
                <Link to="#" className="flex items-center ps-2.5 mb-5">
                    <svg className="w-6 me-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 8.25h15m-16.5 7.5h15m-1.8-13.5-3.9 19.5m-2.1-19.5-3.9 19.5" />
                    </svg>
                    <p className="self-center text-xl font-semibold whitespace-nowrap text-white">banking-app</p>
                </Link>
                <ul className="space-y-2 font-medium">
                    <li>
                        <Link to="/dashboard" className="flex items-center p-2 text-white rounded-lg hover:bg-gray-700 group">
                            <svg className="w-6 h-6 text-gray-400 group-hover:text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 1 0 7.5 7.5h-7.5V6Z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0 0 13.5 3v7.5Z" />
                            </svg>
                            <p className="ms-3">Dashboard</p>
                        </Link>
                    </li>
                    <li>
                        <Link to="/accounts" className="flex items-center p-2 text-white rounded-lg hover:bg-gray-700 group">
                        <svg className="w-6 h-6 text-gray-400 group-hover:text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 0 0-2.25-2.25H15a3 3 0 1 1-6 0H5.25A2.25 2.25 0 0 0 3 12m18 0v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 9m18 0V6a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 6v3" />
                        </svg>
                            <p className="ms-3">Accounts</p>
                        </Link>
                    </li>
                    <li>
                        <Link to="/cards" className="flex items-center p-2 text-white rounded-lg hover:bg-gray-700 group">
                        <svg className="w-6 h-6 text-gray-400 group-hover:text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" />
                        </svg>
                            <p className="ms-3">Cards</p>
                        </Link>
                    </li>
                    <li>
                        <Link to="/transactions" className="flex items-center p-2 text-white rounded-lg hover:bg-gray-700 group">
                        <svg className="w-6 h-6 text-gray-400 group-hover:text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
                        </svg>
                            <p className="ms-3">Transactions</p>
                        </Link>
                    </li>
                    <li>
                        <Link to="/transfer" className="flex items-center p-2 text-white rounded-lg hover:bg-gray-700 group">
                            <svg className="w-6 h-6 text-gray-400 group-hover:text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                            </svg>
                            <p className="ms-3">Transfer money</p>
                        </Link>
                    </li>
                    <li>
                        <Link to="/loans" className="flex items-center p-2 text-white rounded-lg hover:bg-gray-700 group">
                        <svg className="w-6 h-6 text-gray-400 group-hover:text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z" />
                        </svg>
                            <p className="ms-3">Loans</p>
                        </Link>
                    </li>
                </ul>
            </div>
            <div className="h-1/6 flex items-end px-3 py-4 overflow-y-auto bg-gray-800">
                <ul className="space-y-2 font-medium w-full">
                    <li>
                        <Link to="/me" className="flex items-center p-2 text-white rounded-lg hover:bg-gray-700 group">
                            <svg className="w-6 h-6 text-gray-400 group-hover:text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                            </svg>
                            <p className="ms-3">{ user ? `${user.name} ${user.surname.charAt(0)}.` : ""}</p>
                        </Link>
                    </li>
                    <li>
                        <Link to="/logout" className="flex items-center p-2 text-white rounded-lg hover:bg-gray-700 group">
                            <svg className="w-6 h-6 text-gray-400 group-hover:text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
                            </svg>
                            <p className="ms-3">Logout</p>
                        </Link>
                    </li>
                </ul>
            </div>
        </aside>
    )
}

export default Sidebar