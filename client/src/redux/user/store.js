import {configureStore, combineReducers} from '@reduxjs/toolkit'
import userReducer from './userSlice.js'
import postReducer from './postSlice.js'
import {persistReducer,persistStore} from 'redux-persist'
import storage from 'redux-persist/lib/storage'


const rootReducer = combineReducers({
    user:userReducer,
    userPost:postReducer

});

const persistConfig ={
    key:'root',
    storage,
    version:1,
    whitelist: ['user'],
};


const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
    reducer:persistedReducer, 
     middleware: (getDefaultMiddleware) => 
     getDefaultMiddleware({serializableCheck:false}),
    
})

export const persistor = persistStore(store)