import axios from 'axios'
import React, { useEffect } from 'react'
import { serverUrl } from '../App'
import { useDispatch } from 'react-redux'
import { setUserData } from '../redux/userSlice.js'

function useGetCurrentUser() {
    const dispatch = useDispatch()
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const result = await axios.get(`${serverUrl}/api/user/current-user`, {withCredentials:true})
            } catch (error) {
                dispatch(setUserData(null))
                console.error("Fetch current user failed:", error)
            }
        }
        fetchUser()
    },[])
}

export default useGetCurrentUser
