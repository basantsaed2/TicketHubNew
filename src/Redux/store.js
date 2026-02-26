import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import {userReducer} from "./CartSlice";
import { combineReducers } from 'redux';
import { thunk } from "redux-thunk";

const reducers = combineReducers({
       user: userReducer,
});

const persistConfig = {
       key: 'root',
       storage,
       whitelist: JSON.parse(localStorage.getItem('whitelist') || '["user"]'),
};

const persistedReducer = persistReducer(persistConfig, reducers);

export const StoreApp = configureStore({
       reducer: persistedReducer,
       middleware: (getDefaultMiddleware) =>
              getDefaultMiddleware({
                     serializableCheck: false,
                     immutableCheck: false,
              }).concat(thunk), // Add thunk middleware
});

export const persistor = persistStore(StoreApp);
