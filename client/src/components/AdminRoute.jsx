import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom';
import { Store } from '../Context/Store'

const AdminRoute = ({children}) => {
    const navigate = useNavigate();
    const { state } = useContext(Store);
    const { userInfo } = state;
  return userInfo && userInfo.isAdmin ? children : navigate('/signin');
}

export default AdminRoute