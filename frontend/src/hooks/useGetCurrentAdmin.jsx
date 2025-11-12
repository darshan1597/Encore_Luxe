import axios from 'axios'
import React, { useEffect } from 'react'
import { serverUrl } from '../App'
import { useDispatch } from 'react-redux'
import { setAdminData } from '../redux/adminSlice'

function useGetCurrentAdmin() {
    const dispatch = useDispatch()
    useEffect(() => {
        const fetchAdmin = async () => {
            try {
                const result = await axios.get(`${serverUrl}/api/admin/current-admin`, {withCredentials:true})
                dispatch(setAdminData(result.data))
            } catch (error) {
                console.log(error)
            }
        }
        fetchAdmin()
    },[])
}

export default useGetCurrentAdmin
