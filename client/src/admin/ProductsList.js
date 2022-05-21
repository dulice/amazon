import React, {  useContext, useEffect, useReducer } from 'react'
import { toast } from 'react-toastify'
import axios from 'axios';
import getError from '../components/getError'
import { useNavigate } from 'react-router-dom';
import { Store } from '../Context/Store';

const Reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true }
    
    case "FETCH_SUCCESS":
      return { ...state, loading: false, products: action.payload}

    case "FETCH_FAIL":
      return { ...state, error: action.payload }

    case "CREATE_REQUEST":
      return { ...state, loading: true }
    
    case "CREATE_SUCCESS":
      return { ...state, loading: false, product: action.payload}

    case "CREATE_FAIL":
      return { ...state, error: action.payload }

    case "DELETE_REQUEST":
      return { ...state, deleteLoading: true, successDelete: false }
    
    case "DELETE_SUCCESS":
      return { ...state, deleteLoading: false, successDelete: true }

    case "DELETE_FAIL":
      return { ...state, error: action.payload, deleteLoading: false, successDelete: false }

    default:
      return state
  }
}

const ProductsList = () => {
  const { state } = useContext(Store);
  const { userInfo } = state;
  const navigate = useNavigate();
  const [{loading, error, products}, dispatch ] = useReducer(Reducer, {
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
  },[dispatch]);;

  const handleDelete = async (id) => {
    dispatch({type: "DELETE_REQUEST"});
    try {
      await axios.delete(`http://localhost:5000/api/products/${id}`, {
        headers: {
          authorization: `Bearer ${userInfo.token}`
        }
      })
      dispatch({type: "DELETE_SUCCESS"});
      toast.success("Delete Successfully");
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (err) {
      dispatch({type: "DELETE_FAIL", payload: getError(err)});
      toast.error(error);
    }
  }

  const handleCreate = async () => {
    if(window.confirm("Are you sure you want to crate new product?")) {
      dispatch({type: "CREATE_REQUEST"});
      try {
        const { data } = await axios.post('http://localhost:5000/api/products');
        dispatch({type: "CREATE_SUCCESS", payload: data});
        navigate(`/admin/productsList/${data._id}`);
      } catch (err) {
        dispatch({type: "CREATE_FAIL", payload: getError(err)});
        toast.error(error);
      }
    }
  }

  return (
    <div className='max-w-7xl mx-auto px-2 sm:px-6 lg:px-8'>
      <button 
        onClick={handleCreate}                 
        className="border bg-indigo-600 rounded-lg float-right border-violet-600 m-5 px-3 py-1 text-white hover:bg-indigo-700 active:bg-indigo-500"
      >
        Create
      </button>
      <p className='font-bold text-3xl my-5'>Products</p>
      {loading? <div>loading...</div>
      :
      <table className="table-auto w-full border-collapse border text-left overflow-x-auto">
            <thead className='border p-5 bg-gray-300'>               
                <tr>
                    <th className='p-3 '>ID</th>
                    <th className=''>NAME</th>
                    <th className=''>PRICE</th>
                    <th className=''>CATEGORY</th>
                    <th className=''>BRAND</th>
                    <th>ACTIONS</th>
                </tr>
            </thead>
            <tbody className='border'>
                {products.map(product => {
                  return (                
                    <tr className='hover:bg-gray-200' key={product._id}>
                      <td className='p-3'>{product._id}</td>
                      <td>{product.name}</td>
                      <td>$ {product.price}</td>
                      <td>{product.category}</td>
                      <td>{product.brand}</td>
                      <td>
                          <button className="border bg-green-500 rounded-lg mr-5 px-3 py-1 text-white hover:bg-green-600 active:bg-green-400" onClick={()=>navigate(`/admin/productsList/${product._id}`)}>Edit</button>
                          <button className="border bg-red-500 rounded-lg px-3 py-1 text-white hover:bg-red-600 active:bg-red-400" onClick={()=>handleDelete(product._id)}>Delete</button>
                      </td>
                    </tr>
                )})}
            </tbody>
        </table>
        }
    </div>
  )
}

export default ProductsList