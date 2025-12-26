import axios from 'axios';
import { store } from '../store/store';
import { loginUser } from '../store/slice/authSlice';

//create axios instance
const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});