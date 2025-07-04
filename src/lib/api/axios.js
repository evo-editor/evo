import axios from "axios"


const local = "http://localhost:8080"
const server = "https://evo-server.onrender.com"

const BASE_URL = local


const axiosRequest = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
    headers: { 
        'Content-Type': 'application/json', 
    }
})

export default axiosRequest