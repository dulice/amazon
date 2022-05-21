import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom';
import { Store } from '../Context/Store'

const ProtectedRoute = ({children}) => {
    const  { state } = useContext(Store);
    const { userInfo } = state;
    const navigate = useNavigate();
  return userInfo ? children : navigate('/signin');
}

export default ProtectedRoute