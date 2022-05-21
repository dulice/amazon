import axios from 'axios'
import React, { useContext, useEffect, useReducer } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import getError from '../components/getError'
import { Store } from '../Context/Store'

const Reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true }
    
    case "FETCH_SUCCESS":
      return { ...state, loading: false, orders: action.payload}

    case "FETCH_FAIL":
      return { ...state, error: action.payload }   

    default:
      return state
  }
}

const OrdersList = () => {
    const { state } = useContext(Store);
    const { userInfo } = state;
    const [{loading, error, orders}, dispatch] = useReducer(Reducer, {
        loading: true,
        error: '',
        orders: []
    });

    useEffect(() => {
        const fetchUsers = async () => {
            dispatch({type: "FETCH_REQUEST"});
            try {
                const { data } = await axios.get('http://localhost:5000/api/orders/admin', {
                    headers: {
                        authorization: `Bearer ${userInfo.token}`
                    }
                });
                // console.log(data);
                dispatch({type: "FETCH_SUCCESS", payload: data});
            } catch (err) {
                dispatch({type: "FETCH_FAIL", payload: getError(err)});
                toast.error("Orders Not Found!");
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
                    <th className=''>USER</th>
                    <th className=''>TOTAL</th>
                    <th className=''>PAID</th>
                    <th className=''>DELIVERED</th>
                    <th className=''>ACTIONS</th>
                </tr>
            </thead>
            <tbody className='border'>
                {orders.map(order => {
                  return (                
                    <tr className='hover:bg-gray-200' key={order._id}>
                      <td className='p-3'>{order._id}</td>
                      <td>{order.shippingAddress.fullname}</td>
                      <td>$ {order.totalPrice}</td>
                      <td>{order.isPaid ? order.paidAt.substring(0, 10) : 'NO'}</td>
                      <td>{order.isDelivered ? order.deliveredAt.substring(0, 10) : 'NO'}</td>
                      <td>
                          <button className="px-3 py-1 bg-green-500 rounded-md text-white hover:bg-green-600">
                              <Link to={`/orders/${order._id}`}>View</Link>
                          </button>
                      </td>
                    </tr>
                )})}
            </tbody>
        </table>
        }
    </div>
  )
}

export default OrdersList