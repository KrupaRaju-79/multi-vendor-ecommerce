import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../utils/axios';

//Async thunks 
export const  loginUser = createAsyncThunk(
    'auth/login',
    async ({ email,password }, { rejectWithValue }) => {
        try {
            const { data } = await axios.post('/auth/login', { email, password });
            if (data.token) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
            }
            return data;
        } catch (error) {
            return rejectWithValue(error.reponse?.data?.message || 'Login failed');
        }
    }
);
export const registerUser = createAsyncThunk(
    'auth/register',
    async (userData, { rejectWithValue }) => {
        try {
            const { data } = await axios.post('/auth/register', userData);
            if (data.token) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
            }
            return data;
        }
        catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Registration failed')
        }
    }
);

export const logoutUser = createAsyncThunk(
    'auth/logout',
    async (_, { rejectWithValue }) => {
        try {
            await axios.post('/auth/login');
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            return null;
        }catch (error) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            return isRejectedWithValue(error.response?.data?.message || 'Logout failed');
        }
    }
);
const initialState = {
    user: JSON.parser(localStorage.getItems('user')) || null,
    token: localStorage.getItem('token') || null,
    isLoading: false,
    error: null,
    isAuthenticated: !!localStorage.getItem('token'),
};