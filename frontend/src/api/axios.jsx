import axios from 'axios';

const client = axios.create({
    baseURL: "http://localhost:3004/api/v1",
    withCredentials: false,
    headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem('token')}`
    }
})

export default client