import React from 'react'
import { Route, Routes } from 'react-router-dom'
import UserRoutes from './routes/UserRoutes'
import AdminRoutes from './routes/AdminRoutes'

export const serverUrl = import.meta.env.VITE_SERVER_URL

function App() {
    return (
        <Routes>
            <Route path="/*" element={<UserRoutes/>} />
            <Route path="/admin/*" element={<AdminRoutes/>} />
        </Routes>
    )
}

export default App
