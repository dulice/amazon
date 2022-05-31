import axios from 'axios';
import React, { useContext, useEffect, useReducer } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { Store } from '../Context/Store'
import getError from '../components/getError';
import { toast } from 'react-toastify';
import StripeCheckout from 'react-stripe-checkout'
import { Helmet } from 'react-helmet-async';

const Reducer = (state, action) => {
    switch(action.type) {
        case "FETCH_REQUEST":
            return {...state, loading: true}
        
        case "FETCH_SUCCESS":
            return { ...state, loading: false, order: action.payload };

        case "FETCH_FAIL":
            return { ...state, loading: false, error: action.payload };

        case "DELIVER_REQUEST":
            return {...state, deliverloading: true, deliversuccess: false}
        
        case "DELIVER_SUCCESS":
            return { ...state, deliverloading: false, deliversuccess: true };

        case "DELIVER_FAIL":
            return { ...state, deliverloading: false, deliversuccess: false, error: action.payload };

        default:
            return state;
    }
}

const FinishOrder = () => {
    const {id: orderId} = useParams();
    const navigate = useNavigate();
    const [{loading, error, order}, dispatch]= useReducer(Reducer, {
        loading: true,
        error: '',
        order: {}
    });

    const { state } = useContext(Store);
    const { userInfo } = state;

    const makePayment = async(token) => {
        const body = {token};
        try {
            await axios.post(`/api/orders/${orderId}/payment`, body, {
                headers: {
                    authorization: `Bearer ${userInfo.token}`
                }
            })
            toast.success("Paid Successfully");
        } catch(err){
            console.log(err.message);
        }
        localStorage.removeItem('cartItems');
        window.location.replace('/thankyou');
//         navigate('/thankyou');
    }

    useEffect(() => {
        const fetchData = async () => {
            dispatch({type: "FETCH_REQUEST"})
            try {
                const { data } = await axios.get(`/api/orders/${orderId}`, {
                    headers: {
                        authorization: `Bearer ${userInfo.token}`
                    }
                })
                dispatch({type: "FETCH_SUCCESS", payload: data});
                // console.log(data);
            } catch (err) {
                dispatch({type: "FETCH_FAIL", payload: getError(err)});
                toast.error(error);
            }
        }
        fetchData();
    },[dispatch, userInfo, error, orderId]);

    const handleDeliver = async () => {
        dispatch({type: "DELIVER_REQUEST"});
        try {
            await axios.put(`/api/orders/${orderId}/delivered`, {}, {
                headers: {
                    authorization: `Bearer ${userInfo.token}`
                }
            });
            dispatch({type: "DELIVER_SUCCESS"});
            toast.success("Deliverd order successfully!");
            localStorage.removeItem('cartItems');
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        } catch (err) {
            dispatch({type: "DELIVERED_FAIL", payload: getError(err)});
            toast.error(error);
        }
    }
  return (
      <div className="max-w-7xl mx-auth p-2 sm:p-6 lg:p-8">
          <Helmet>
              <title>Order Details</title>
          </Helmet>
          <p className="font-bold text-3xl ml-5">Order Details</p>
            {loading ? <div>loading...</div>
            :
          <div className="grid grid-cols-12 gap-6">
              <div className="col-span-12 sm:col-span-8">
                  <div className="">
                    <div className="border-lg shadow-lg p-5 my-3">
                        <p className="font-bold">Shipping</p>
                        <p className="">
                            <strong>Name: </strong>
                            <span>{order.shippingAddress.fullname}</span>
                        </p>
                        <p className="mb-3">
                            <strong>Address: </strong>
                            <span>{order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.country}, {order.shippingAddress.postalCode}.</span>
                        </p>
                        {order.isDelivered 
                        ?   <p className="w-full p-3 bg-green-600 rounded-md text-center text-white">Delivered At: {order.deliveredAt.substring(0,10)}</p>
                        : <p className="w-full p-3 bg-red-400 rounded-md text-center text-white">Not Delivered</p>
                        }
                    </div>

                    <div className="border-lg shadow-lg p-5 my-3">
                        <p className="font-bold">Payment</p>
                        <p className="mb-3">
                            <strong>Method: </strong>
                            <span>{order.paymentMethod}</span>
                        </p>
                        {order.isPaid 
                        ?   <p className="w-full p-3 bg-green-600 rounded-md text-center text-white">Paid At: {order.paidAt.substring(0,10)}</p>
                        : <p className="w-full p-3 bg-red-400 rounded-md text-center text-white">Not Paid</p>
                        }
                    </div>
                    <div className="border-lg shadow-lg p-5 my-3">
                        <p className="font-bold">Items</p>
                        {order.orderItems.map(item => (
                            <div key={item._id} className="grid grid-cols-12 gap-6 border mb-3 items-center">
                            <div className="col-span-4 flex items-center">
                                <img src={item.image} alt={item.name} className="h-16 p-1 rounded-md"/>
                                <p className="ml-3">{item.name}</p>
                            </div>
                            <div className="col-span-4 flex">
                                <p className='px-3'>{item.quantity} x ${item.price}</p>
                            </div>
                            <div className="col-span-4">$ {item.quantity * item.price}</div>
                            </div>
                        ))}
                    </div>
                  </div>
                </div>
                <div className="col-span-8 sm:col-span-4 border-md shadow-lg p-5">
                    <div className="flex justify-between items-center mb-3">
                    <strong>Total Items: </strong>
                    <strong className='text-indigo-600'>{order.orderItems.reduce((sum, num) => sum + num.quantity, 0)}</strong>
                    </div>
                    <div className="flex justify-between items-center mb-3">
                        <strong>Product Price: </strong>
                        <strong className='text-indigo-600'>$ {order.productPrice}</strong>
                    </div>
                    <div className="flex justify-between items-center mb-3">
                        <strong>Shipping Price: </strong>
                        <strong className='text-indigo-600'>$ {order.shippingPrice}</strong>
                    </div>
                    <div className="flex justify-between items-center mb-3">
                        <strong>Tax Price: </strong>
                        <strong className='text-indigo-600'>$ {order.taxPrice}</strong>
                    </div>
                    <div className="flex justify-between items-center mb-3">
                        <strong>Total Price: </strong>
                        <strong className='text-indigo-600 text-3xl'>$ {order.totalPrice}</strong>
                    </div>
                    <StripeCheckout stripeKey={process.env.REACT_APP_STRIPE_CLIENT_KEY} token={makePayment} name="Buy">

                        {order.paymentMethod === 'paypal'
                        ? <div>
                            <button className="text-gray-900 bg-[#F7BE38] hover:bg-[#F7BE38]/90 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center mr-2 mb-2">
                            <svg className="w-4 h-4 mr-2 -ml-1" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="paypal" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path fill="currentColor" d="M111.4 295.9c-3.5 19.2-17.4 108.7-21.5 134-.3 1.8-1 2.5-3 2.5H12.3c-7.6 0-13.1-6.6-12.1-13.9L58.8 46.6c1.5-9.6 10.1-16.9 20-16.9 152.3 0 165.1-3.7 204 11.4 60.1 23.3 65.6 79.5 44 140.3-21.5 62.6-72.5 89.5-140.1 90.3-43.4 .7-69.5-7-75.3 24.2zM357.1 152c-1.8-1.3-2.5-1.8-3 1.3-2 11.4-5.1 22.5-8.8 33.6-39.9 113.8-150.5 103.9-204.5 103.9-6.1 0-10.1 3.3-10.9 9.4-22.6 140.4-27.1 169.7-27.1 169.7-1 7.1 3.5 12.9 10.6 12.9h63.5c8.6 0 15.7-6.3 17.4-14.9 .7-5.4-1.1 6.1 14.4-91.3 4.6-22 14.3-19.7 29.3-19.7 71 0 126.4-28.8 142.9-112.3 6.5-34.8 4.6-71.4-23.8-92.6z"></path></svg>
                            Check out with PayPal
                            </button>
                        </div>
                        :order.paymentMethod === 'visa'
                        ? <div>
                            <button type="button" className=" text-gray-900 bg-white hover:bg-gray-100 border border-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center active:bg-gray-200">
                            <svg className="w-10 h-3 mr-2 -ml-1" viewBox="0 0 660 203" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M233.003 199.762L266.362 4.002H319.72L286.336 199.762H233.003V199.762ZM479.113 8.222C468.544 4.256 451.978 0 431.292 0C378.566 0 341.429 26.551 341.111 64.604C340.814 92.733 367.626 108.426 387.865 117.789C408.636 127.387 415.617 133.505 415.517 142.072C415.384 155.195 398.931 161.187 383.593 161.187C362.238 161.187 350.892 158.22 333.368 150.914L326.49 147.803L319.003 191.625C331.466 197.092 354.511 201.824 378.441 202.07C434.531 202.07 470.943 175.822 471.357 135.185C471.556 112.915 457.341 95.97 426.556 81.997C407.906 72.941 396.484 66.898 396.605 57.728C396.605 49.591 406.273 40.89 427.165 40.89C444.611 40.619 457.253 44.424 467.101 48.39L471.882 50.649L479.113 8.222V8.222ZM616.423 3.99899H575.193C562.421 3.99899 552.861 7.485 547.253 20.233L468.008 199.633H524.039C524.039 199.633 533.198 175.512 535.27 170.215C541.393 170.215 595.825 170.299 603.606 170.299C605.202 177.153 610.098 199.633 610.098 199.633H659.61L616.423 3.993V3.99899ZM551.006 130.409C555.42 119.13 572.266 75.685 572.266 75.685C571.952 76.206 576.647 64.351 579.34 57.001L582.946 73.879C582.946 73.879 593.163 120.608 595.299 130.406H551.006V130.409V130.409ZM187.706 3.99899L135.467 137.499L129.902 110.37C120.176 79.096 89.8774 45.213 56.0044 28.25L103.771 199.45L160.226 199.387L244.23 3.99699L187.706 3.996" fill="#0E4595"/><path d="M86.723 3.99219H0.682003L0 8.06519C66.939 24.2692 111.23 63.4282 129.62 110.485L110.911 20.5252C107.682 8.12918 98.314 4.42918 86.725 3.99718" fill="#F2AE14"/></svg>
                            Pay with Visa
                            </button>
                        </div>
                        : <button className='text-gray-900 bg-white hover:bg-gray-100 border border-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-white dark:border-gray-700 dark:text-gray-900 dark:hover:bg-gray-200 mr-2 mb-2'>Pay with Kpay</button>
                    }
                    </StripeCheckout>
                {userInfo && userInfo.isAdmin && <button className='mt-3 block text-white bg-indigo-600 hover:bg-indigo-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center' onClick={handleDeliver}>Deliver</button>}
                </div>
            </div>
            }
        </div>
  )
}

export default FinishOrder
