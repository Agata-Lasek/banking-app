import axios from 'axios';

const client = axios.create({
    baseURL: "http://localhost:3004/api/v1"
})

export default client