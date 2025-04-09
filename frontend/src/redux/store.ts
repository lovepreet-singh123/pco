import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { persistReducer } from "redux-persist";
import persistStore from "redux-persist/es/persistStore";
import storage from 'redux-persist/lib/storage';
import { loginApi } from "../api/login/login.api";
import { userSlice } from "../slices/user/user.slice";
import errorHandlerMiddleware from "../utils/errorhandler.middleware";
import { productsApi } from "../api/products/products.api";

const persistConfig = {
    key: "root",
    storage,
}
const rootReducer = combineReducers({
    user: userSlice.reducer,
    [loginApi.reducerPath]: loginApi.reducer,
    [productsApi.reducerPath]: productsApi.reducer,
})
const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
    reducer: persistedReducer,
    middleware: getdefaultMiddleware =>
        getdefaultMiddleware({
            serializableCheck: false,
        }).concat(errorHandlerMiddleware, loginApi.middleware, productsApi.middleware),
})
setupListeners(store.dispatch);
export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;


export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useAppDispatch = () => useDispatch<AppDispatch>();