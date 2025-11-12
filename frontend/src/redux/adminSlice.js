import { createSlice } from "@reduxjs/toolkit";

const adminSlice = createSlice({
    name: "admin",
    initialState: {
        adminData: null
    },
    reducers: {
        setAdminData:(state, action)=>{
            state.adminData = action.payload
        }
    }
})

export const {setAdminData} = adminSlice.actions
export default adminSlice.reducer