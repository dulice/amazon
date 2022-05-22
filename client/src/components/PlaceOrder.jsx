import axios from 'axios';
import React, { useContext, useReducer } from 'react'
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Store } from '../Context/Store'
import getError from './getError';
import Step from './Step'

const Reducer = (state, action) => {
    switch(action.type) {
        case "FETCH_REQUEST":
            return {...state, loading: true}
        
        case "FETCH_SUCCESS":
            return { ...state, loading: false};

        case "FETCH_FAIL":
            return { ...state, loading: false, error: action.payload };

        default:
            return state;
    }
}

const PlaceOrder = () => {
    const navigate = useNavigate();
    const [{loading, error}, dispatch] = useReducer(Reducer, {
        loading: true,
        error: ''
    })
    const { state } = useContext(Store);
    const { cart , userInfo } = state;
    // console.log(cart.cartItems);

    const handlePlaceOrder = async () => {
        try {
            dispatch({type: "FETCH_REQUEST"});
            const {data} = await axios.post('http://localhost:5000/api/orders', 
            {
                orderItems: cart.cartItems,
                shippingAddress: cart.shippingAddress,
                paymentMethod: cart.paymentMethod,
                productPrice: cart.productPrice,
                shippingPrice: cart.shippingPrice,
                taxPrice: cart.taxPrice,
                totalPrice: cart.totalPrice
            },
            {
                headers: {
                    authorization: `Bearer ${userInfo.token}`
                }
            });
            dispatch({type: "FETCH_SUCCESS"});
            // localStorage.removeItem('cartItems');
            navigate(`/orders/${data._id}`);
        } catch (err) {
            dispatch({type: "FETCH_FAIL", payload: getError(err)});
            toast.error(error);
        }
    }

    const quantity = cart.cartItems.reduce((sum, num) => sum + num.quantity, 0);
    cart.productPrice = Number((cart.cartItems.reduce((sum, num) => sum + (num.price * num.quantity), 0)).toFixed(2));
    cart.shippingPrice = 10
    cart.taxPrice = Number((cart.productPrice * 0.08).toFixed(2));
    cart.totalPrice = cart.productPrice + cart.shippingPrice + cart.taxPrice;

  return (
      <div className="max-w-7xl mx-auth p-2 sm:p-6 lg:p-8">
          <Step step1 step2 step3 step4 />
          <Helmet>
              <title>PreviewOrder</title>
          </Helmet>
          <p className="font-bold text-3xl ml-5">Preview Order</p>
          {loading? <div>Loading...</div>
          :
          <div className="grid grid-cols-12 gap-6">
              <div className="col-span-12 sm:col-span-8">
                  <div className="">
                    <div className="border-lg shadow-lg p-5 my-3">
                        <p className="font-bold">Shipping</p>
                        <p className="">
                            <strong>Name: </strong>
                            <span>{cart.shippingAddress.fullname}</span>
                        </p>
                        <p className="mb-3">
                            <strong>Address: </strong>
                            <span>{cart.shippingAddress.address}, {cart.shippingAddress.city}, {cart.shippingAddress.country}, {cart.shippingAddress.postalCode}.</span>
                        </p>
                        <Link Link to='/shipping' className='text-indigo-600 hover:underline'>Edit</Link>
                    </div>

                    <div className="border-lg shadow-lg p-5 my-3">
                        <p className="font-bold">Payment</p>
                        <p className="mb-3">
                            <strong>Method: </strong>
                            <span>{cart.paymentMethod}</span>
                        </p>
                        <Link to='/paymentMethod' className='text-indigo-600 hover:underline'>Edit</Link>
                    </div>
                    <div className="border-lg shadow-lg p-5 my-3">
                        {cart.cartItems.map(item => (
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
                        <Link to='/cart' className='text-indigo-600 hover:underline'>Edit</Link>
                    </div>
                  </div>
                </div>
                <div className="col-span-8 sm:col-span-4 border-md shadow-lg p-5">
                    <div className="flex justify-between items-center mb-3">
                    <strong>Total Items: </strong>
                    <strong className='text-indigo-600'>{quantity}</strong>
                    </div>
                    <div className="flex justify-between items-center mb-3">
                        <strong>Product Price: </strong>
                        <strong className='text-indigo-600'>$ {cart.productPrice}</strong>
                    </div>
                    <div className="flex justify-between items-center mb-3">
                        <strong>Shipping Price: </strong>
                        <strong className='text-indigo-600'>$ {cart.shippingPrice}</strong>
                    </div>
                    <div className="flex justify-between items-center mb-3">
                        <strong>Tax Price: </strong>
                        <strong className='text-indigo-600'>$ {cart.taxPrice}</strong>
                    </div>
                    <div className="flex justify-between items-center mb-3">
                        <strong>Total Price: </strong>
                        <strong className='text-indigo-600 text-3xl'>$ {cart.totalPrice}</strong>
                    </div>
                    <button onClick={handlePlaceOrder} className="border bg-violet-700 text-white rounded-md mt-3 px-3 py-2 w-full hover:bg-violet-800">Place Order</button>
                </div>
            </div>
            }
        </div>
  )
}

export default PlaceOrder