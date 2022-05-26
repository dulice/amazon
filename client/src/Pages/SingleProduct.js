import axios from 'axios';
import React, { useContext, useEffect, useReducer } from 'react'
import { Helmet } from 'react-helmet-async';
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify';
import getError from '../components/getError';
import Rating from '../components/Rating';
import Reviews from '../components/Reviews';
import { Store } from '../Context/Store';

const Reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true }
    
    case "FETCH_SUCCESS":
      return { ...state, loading: false, product: action.payload}

    case "FETCH_FAIL":
      return { ...state, error: action.payload }

    default:
      return state
  }
}

const SingleProduct = () => {
  const navigate = useNavigate();
    const [{loading, error, product}, dispatch] = useReducer(Reducer, {
        loading: true,
        error: '',
        product: []
    })

    const {state, dispatch: ctxDispatch} = useContext(Store);
    const { cart } = state;
    const { id } = useParams();

    useEffect(() => {
        const fetchProduct = async () => {
            dispatch({type: "FETCH_REQUEST"})
            try {
                const { data } = await axios.get(`/api/products/${id}`);
                dispatch({type: "FETCH_SUCCESS", payload: data});
            } catch (err) {
                dispatch({type: "FECTH_FAIL", payload: getError(err)});
                toast.error(error);
            }
        }
        fetchProduct();
    },[dispatch, error, id]);

    const handleAddToCart = async () => {
        const newItem = cart.cartItems.find(item => item._id === product._id);
        newItem.quantity = 1;
        console.log(newItem);
        const quantity = newItem ? newItem.quantity + 1 : newItem.quantity;
        console.log(quantity);
        ctxDispatch({
          type: "ADD_TO_CART",
          payload: {
            ...product,
            quantity
          }
        })
    }

  return (
    <div className="max-w-5xl mx-auto px-2 sm:px-6 lg:px-8 mt-5">
      <Helmet>
        <title>Product</title>
      </Helmet>
        {loading ? <div>Loading...</div>
        :
            <div className="grid grid-cols-6 gap-6">
                <div className="col-span-6 sm:col-span-3">
                    <img src={product.image} alt="" className="rounded-md" />
                </div>
                <div className="col-span-1"></div>
                <div className="col-span-6 sm:col-span-2 leading-8">
                    <p className="font-bold">{product.name}</p>
                    <div className="flex text-indigo-700">
                        <Rating rating={product.rating} />
                        <span className='ml-3'>{product.numReviews} Reviews</span>
                    </div>
                    <p className='capitalize'>
                        <strong>Brand: </strong> {product.brand}
                    </p>
                    <p className="text-6xl text-indigo-700 my-5">$ {product.price}</p>
                    <p className="font-bold">Description:</p>
                    <p>{product.description}</p>
                    <div className='mt-3'>
                      {product.countInStock === 0 
                      ? <>
                        <button disabled={product.countInStock === 0} className='cursor-not-allowed border shadow-sm rounded-md bg-indigo-400 text-white py-1 px-4 mr-5'>Out Of Stock</button>
                        <button className='cursor-not-allowed border shadow-sm rounded-md bg-amber-300 text-white py-1 px-4'>Buy Now</button>
                      </>
                      :
                      <>
                        <button onClick={handleAddToCart} className='border shadow-sm rounded-md bg-indigo-600 text-white hover:bg-indigo-700 py-1 px-4 mr-5'>Add To Cart</button>
                        <button onClick={()=>navigate('/cart')} className=' border shadow-sm rounded-md bg-amber-500 text-white hover:bg-amber-600 py-1 px-4'>Buy Now</button>
                      </>
                      }
                    </div>
                </div>
            </div>
        }
        <Reviews />
    </div>
  )
}

export default SingleProduct