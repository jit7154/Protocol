import axios from "axios"

export const axiosInstance = axios.create({
    baseURL:import.meta.env.MODE==="development"?"http://localhost:5001/api":"/api",
    withCredentials:true,
})
//Axios is a popular JavaScript library used for making HTTP requests to external resources, typically APIs. It simplifies the process of fetching and sending data between your React application and a backend server.