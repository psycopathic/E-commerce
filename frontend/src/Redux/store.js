import { configureStore } from "@reduxjs/toolkit";
import {setupListeners} from '@reduxjs/toolkit/query/react';
import {apiSlice} from './api/apiSlice.js';
import authReducer from './features/auth/authSlice.js';
import favoriteReducer from '../Redux/features/favorites/favoriteSlice.js';
import cartSliceReducer from '../Redux/features/cart/cartSlice.js';
import shopReducer from '../Redux/features/shop/shopSlice.js'
import { getFavoritesFromLocalStorage } from "../utils/localStorage.js";

const initialFavorites = getFavoritesFromLocalStorage() || [];

const store = configureStore({
    reducer:{
        [apiSlice.reducerPath]:apiSlice.reducer,
        auth:authReducer,
        favorite:favoriteReducer,
        cart:cartSliceReducer,
        shop:shopReducer
    },

    preloadedState:{
        favorite:initialFavorites,
    },
    
    middleware:(getDefaultMiddleware)=>
    getDefaultMiddleware().concat(apiSlice.middleware),
    devTools:true,
});

setupListeners(store.dispatch);

export default store;