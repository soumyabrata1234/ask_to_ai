import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { UserContext } from '../context/Usercontext'

const UserAuth = ({ children }) => {

//   const { email } = useContext(UserContext)
    const [ loading, setLoading ] = useState(false)
   
    const token = localStorage.getItem('token')
    const navigate = useNavigate()




    useEffect(() => {
        // if (email) {
        //     setLoading(false)
        //     console.log(1)
        // }

        if (!token) {
            navigate('/login')
            setLoading(false)
            console.log(2)
        }

        // if (!email) {
        //     navigate('/login')
        //     console.log(3)
        // }

    }, [])

    if (loading) {
        return <div>Loading...</div>
    }


    return (
        <>
            {children}</>
    )
}

export default UserAuth