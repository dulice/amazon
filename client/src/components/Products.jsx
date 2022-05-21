import axios from 'axios'
import React, { useEffect, useReducer } from 'react'
import { toast } from 'react-toastify'
import getError from './getError'
import Product from './Product'

const Reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true }
    
    case "FETCH_SUCCESS":
      return { ...state, loading: false, products: action.payload}

    case "FETCH_FAIL":
      return { ...state, error: action.payload }

    default:
      return state
  }
}

const Products = () => {
    const [{loading, error, products}, dispatch] = useReducer(Reducer, {
        loading: true,
        error: '',
        products: []
    })

    useEffect(() => {
        const fetchProducts = async () => {
            dispatch({type: "FETCH_REQUEST"});
            try {
                const { data } = await axios.get('http://localhost:5000/api/products');
                dispatch({type: "FETCH_SUCCESS", payload: data});
            } catch (err) {
                dispatch({type: "FETCH_FAIL", payload: getError(err)});
                toast.error(error);
            }
        }
        fetchProducts();
    },[dispatch])

  return (
    <div id="product" className='max-w-7xl mx-auto px-2 sm:px-6 lg:px-8'>
      <h1 className='text-3xl font-bold'>Products</h1>
        {loading ? <div>loading...</div>
        :
            <div className='grid grid-cols-12 gap-4 mt-5'>
                {products.map(product => (
                    <div  className=" col-span-12 sm:col-span-6 lg:col-span-3 border rounded-md shadow-lg p-5 mb-5" key={product._id}>
                        <Product product={product}/>
                    </div>
                ))}
            </div>
        }
    </div>
  )
}

export default Products