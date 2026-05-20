import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./userSlice.js"
import adminSlice from "./adminSlice.js"

export const store = configureStore({
    reducer: {
        user: userSlice,
        admin: adminSlice
    }
})
