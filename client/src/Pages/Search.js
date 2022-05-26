import axios from 'axios'
import React, { useEffect, useReducer } from 'react'
import { Helmet } from 'react-helmet-async'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import getError from '../components/getError'
import Product from '../components/Product'

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

const Search = () => {
    const params = useParams();

    const [{loading, error, products}, dispatch] = useReducer(Reducer, {
        loading: true,
        error: '',
        products: []
    })

        useEffect(() => {
        const fetchProducts = async () => {
            dispatch({type: "FETCH_REQUEST"});
            try {
                const { data } = await axios.get(`/api/products/search?query=${params.name}`);
                dispatch({type: "FETCH_SUCCESS", payload: data});
            } catch (err) {
                dispatch({type: "FETCH_FAIL", payload: getError(err)});
                toast.error(error);
            }
        }
        fetchProducts();
    },[dispatch, params.name, error])    
 
  return (
    <div className='max-w-7xl mx-auto px-2 sm:px-6 lg:px-8'>
      <Helmet>
        <title>Search Products</title>
      </Helmet>
        {loading ? <div>loading...</div>
        :
            <div className='grid grid-cols-12 gap-4 mt-5'>
                {products.products.map(product => (
                    <div  className=" col-span-12 md:col-span-3 sm:col-span-6 border rounded-md shadow-lg p-5 mb-5" key={product._id}>
                        <Product product={product}/>
                    </div>
                ))}
            </div>
        }
    </div>
  )
}

export default Search