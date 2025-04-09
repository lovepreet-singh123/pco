import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type userType = {
    isLoggedIn: boolean,
    details: {
        username?: string,
        name?: string,
        email?: string,
    },
    role?: null | number,
    permissions?: string[],
}

const initialState: userType = {
    isLoggedIn: false,
    details: {
        username: "",
        name: "",
        email: "",
    },
    role: null,
    permissions: [],
}

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<userType["details"]>) => {
            state.details = { ...state.details, ...action.payload };
        },
        setPermissions: (state, action: PayloadAction<string[]>) => {
            state.permissions = action.payload;
        },
        setRole: (state, action: PayloadAction<number | null>) => {
            state.role = action.payload;
        },
        setLoggedIn: (state, action: PayloadAction<boolean>) => {
            state.isLoggedIn = action.payload;
        },
    }
})
export const { setUser, setPermissions, setLoggedIn, setRole } = userSlice.actions;