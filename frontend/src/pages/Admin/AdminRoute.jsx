import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'


const AdminRoute = () => {
    const {userInfo} = useSelector((select)=>select.auth);
  return userInfo && userInfo.isAdmin?(
    <Outlet/>
  ):(
    <Navigate to="/login" replace/>
  )
}

export default AdminRoute