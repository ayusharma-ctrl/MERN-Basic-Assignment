import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'

const PrivateRoute = ({auth}) => {
    return (
        <div>
            {
                auth ? (<Outlet />) : (<Navigate to='/login' />)
            }
        </div>
    )
}

export default PrivateRoute