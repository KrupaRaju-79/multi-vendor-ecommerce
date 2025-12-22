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