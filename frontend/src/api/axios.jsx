import axios from 'axios';

const client = axios.create({
    baseURL: "http://localhost:3004/api/v1",
    withCredentials: false,
    headers: {
        "Content-Type": "application/json"
    }
})

client.interceptors.request.use((config) => {
    const token = localStorage.getItem('token')
    if (token) {
        config.headers["Authorization"] = `Bearer ${token}`
    }
    return config;
}, (error) => {
    return Promise.reject(error)
})

export default client