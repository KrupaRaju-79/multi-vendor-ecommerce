import { configureStore } from '@reduxjs/toolkit';
import authReducer from './sllice/authSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
    },
    middleware: (getDefaultMiddleware) => 
        getDefaultMiddleware({
            serializableCheck: {
                ignoredAction: [],
                ignoreActionPaths:['meta.arg', 'payload.timestamp'],
                ignorePaths: ['items.dates'],
            },
        }),
    devTools: Process.env.NODE_ENV !== 'production',
});