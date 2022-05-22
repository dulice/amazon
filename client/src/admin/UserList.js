import axios from 'axios'
import React, { useContext, useEffect, useReducer } from 'react'
import { toast } from 'react-toastify'
import getError from '../components/getError'
import { Store } from '../Context/Store'

const Reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true }
    
    case "FETCH_SUCCESS":
      return { ...state, loading: false, users: action.payload}

    case "FETCH_FAIL":
      return { ...state, error: action.payload }   

    default:
      return state
  }
}

const UserList = () => {
    const { state } = useContext(Store);
    const { userInfo } = state;
    const [{loading, users}, dispatch] = useReducer(Reducer, {
        loading: true,
        error: '',
        users: []
    });

    useEffect(() => {
        const fetchUsers = async () => {
            dispatch({type: "FETCH_REQUEST"});
            try {
                const { data } = await axios.get('http://localhost:5000/api/users');
                console.log(data);
                dispatch({type: "FETCH_SUCCESS", payload: data});
            } catch (err) {
                dispatch({type: "FETCH_FAIL", payload: getError(err)});
                toast.error("Users Not Found!");
            }
        }
        fetchUsers();
    },[userInfo, dispatch]);

  return (
    <div className='max-w-7xl mx-auto px-2 sm:px-6 lg:px-8'>
        <p className='font-bold text-3xl py-5'>Users List</p>
        {loading? <div>Loading...</div>
        :
        <table className="table-auto w-full border-collapse border text-left overflow-x-auto">
            <thead className='border p-5 bg-gray-300'>               
                <tr>
                    <th className='p-3 '>ID</th>
                    <th className=''>USERNAME</th>
                    <th className=''>EAMIL</th>
                    <th className=''>IS ADMIN</th>
                </tr>
            </thead>
            <tbody className='border'>
                {users.map(user => {
                  return (                
                    <tr className='hover:bg-gray-200' key={user._id}>
                      <td className='p-3'>{user._id}</td>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.isAdmin ? 'YES' : 'NO'}</td>
                    </tr>
                )})}
            </tbody>
        </table>
        }
    </div>
  )
}

export default UserList