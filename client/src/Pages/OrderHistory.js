import axios from 'axios'
import React, { useContext, useEffect, useReducer } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import getError from '../components/getError'
import { Store } from '../Context/Store'

const Reducer = (state, action) => {
    switch(action.type) {
        case "FETCH_REQUEST":
            return {...state, loading: true}

        case "FETCH_SUCCESS":
            return {...state, orders: action.payload, loading: false};

        case "FETCH_FAIL":
            return { ...state, error: action.payload};

        default:
            return state;
    }
}

const OrderHistory = () => {
    const { state } = useContext(Store);
    const { userInfo } = state;

    const [{loading, error, orders}, dispatch] = useReducer(Reducer, {
        loading: true,
        orders: [],
        error: ''
    })

    useEffect(() => {
        const fetchData = async () => {
            try {
                dispatch({type: "FETCH_REQUEST"});
                const { data } = await axios.get('/api/orders/history',{
                    headers: {
                        authorization: `Bearer ${userInfo.token}`
                    }
                })
                dispatch({type: "FETCH_SUCCESS", payload: data});
                // console.log(data);
            } catch (err) {
                dispatch({type: "FETCH_FAIL", payload: getError(err)});
            }
        }
        fetchData();
    },[dispatch, userInfo]);

  return (
    <div className="max-w-7xl mx-auto p-2 sm:p-6 lg:p-8">
        <Helmet>
            <title>Order History</title>
        </Helmet>
        <p className="font-bold text-3xl my-5">Order History</p>
        {loading ? <div>loading...</div>
        : error ? <div className='text-red-600'>{error} </div>
        :
        <table className="table-auto w-full border-collapse border text-left">
            <thead className='border p-5'>               
                <tr>
                    <th className='p-3 w-2/6'>ID</th>
                    <th className='w-1/6'>DATE</th>
                    <th className='w-1/6'>PRICE</th>
                    <th className='w-1/6'>DELIVERED</th>
                    <th className=''>PAID</th>
                    <th>ACTIONS</th>
                </tr>
            </thead>
            <tbody className='border'>
                {orders.map(order => (                
                <tr className='' key={order._id}>
                    <td className='p-3'>{order._id}</td>
                    <td>{order.createdAt.substring(0,10)}</td>
                    <td>$ {order.totalPrice}</td>
                    <td>{order.isDelivered? order.deliveredAt.substring(0,10) : 'NO'}</td>
                    <td>{order.isPaid? order.paidAt.substring(0, 10) : 'NO'}</td>
                    <td>
                        <Link className='hover:text-indigo-600' to={`/orders/${order._id}`}>DETAILS</Link>
                    </td>
                </tr>
                ))}
            </tbody>
        </table>
        }
    </div>
  )
}

export default OrderHistory