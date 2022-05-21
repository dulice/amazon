import axios from 'axios'
import React, { useContext, useEffect, useReducer, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import getError from '../components/getError'
import { Store } from '../Context/Store'

const Reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true }
    
    case "FETCH_SUCCESS":
      return { ...state, loading: false}

    case "FETCH_FAIL":
      return { ...state, error: action.payload }

    case "UPLOAD_REQUEST":
      return { ...state, uploadloading: true }
    
    case "UPLOAD_SUCCESS":
      return { ...state, uploadloading: false}

    case "UPLOAD_FAIL":
      return { ...state, uploaderror: action.payload }

    default:
      return state
  }
}

const EditProduct = () => {
  const { state } = useContext(Store);
  const { userInfo } = state;
  const navigate = useNavigate();
  const {id: productId} = useParams();

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState('');
  const [brand, setBrand] = useState('');
  const [price, setPrice] = useState('');
  const [countInStock, setCountInStock] = useState('');
  const [description, setDescription] = useState('');
  
  const [image, setImage] = useState('');
  const [previewSource, setPreviewSource] = useState('');

  const [{loading, error, uploadloading}, dispatch ] = useReducer(Reducer, {
    loading: true,
    error: '',
  })

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`http://localhost:5000/api/products/${productId}`);
        setName(data.name);
        setSlug(data.slug);
        setCategory(data.category);
        setBrand(data.brand);
        setCountInStock(data.countInStock);
        setPrice(data.price);
        setDescription(data.description);
        setImage(data.image);
      } catch (err) {
        toast.error(getError(err));
      }
    }
    fetchProduct();
  },[setName, setSlug, setCategory, setBrand, setCountInStock, setPrice, setImage, setDescription]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch({type: "FETCH_REQUEST"});
    try {
      await axios.put(`http://localhost:5000/api/products/${productId}`, {
        name ,
        slug ,
        category,
        brand,
        countInStock,
        price,
        image,
        description
      }, {
        headers: {
          authorization: `Bearer ${userInfo.token}`
        }
      })
      dispatch({type: "FETCH_SUCCESS"});
      toast.success("Update Product Successfully");
      navigate('/admin/productsList')
    } catch (err) {
      dispatch({type: "FETCH_FAIL", payload: getError(err)});
      toast.error(error);
    }
  }

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    const bodyFormData = new FormData();
    bodyFormData.append('file', file);
    try {
      dispatch({ type: 'UPLOAD_REQUEST' });
      const { data } = await axios.post('http://localhost:5000/api/upload', bodyFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          authorization: `Bearer ${userInfo.token}`,
        },
      });
      console.log(data);
      dispatch({ type: 'UPLOAD_SUCCESS' });

      toast.success('Image uploaded successfully');
      setImage(data.secure_url);
    } catch (err) {
      toast.error(getError(err));
      dispatch({ type: 'UPLOAD_FAIL', payload: getError(err) });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
      <div className="m-3">
        <h1 className="font-bold text-3xl text-violet-800">Item</h1>
        <div>
          {previewSource && <img src={previewSource} alt="chosen" className="w-full rounded-md my-5"/>}
        </div>
        <form onSubmit={handleSubmit}>

          <div className="grid grid-cols-6 gap-4">

            {/* <div className="col-span-6 sm:col-span-6">
              <label htmlFor="image" className='block text-grap-700 mt-3'>Image:</label>
              <input 
                onChange={uploadFileHandler}
                type="file" className="p-2 rounded-md sm:text-sm w-full border border-violet-500 outline-violet-600" id="image" />
                {uploadloading && <div>Loading...</div>}
            </div> */}

            <div className="col-span-6 sm:col-span-6">
              <label htmlFor="image" className='block text-grap-700 mt-3'>Image:</label>
              <input 
                value={image}
                onChange={(e) => setImage(e.target.value)}
                type="text" className="p-2 rounded-md sm:text-sm w-full border border-violet-500 outline-violet-600" id="image" placeholder='Put you image url' />
            </div>

            <div className="col-span-6 sm:col-span-3">
              <label htmlFor="name" className='block text-grap-700 mt-3'>Name:</label>
              <input 
                value={name}
                onChange={(e) => setName(e.target.value)}
                type="text" 
                className="p-2 rounded-md sm:text-sm w-full border border-violet-500 outline-violet-600" 
                id="name"
              />
            </div>

            <div className="col-span-6 sm:col-span-3">
              <label htmlFor="slug" className='block text-grap-700 mt-3'>Slug:</label>
              <input 
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                type="text" 
                className="p-2 rounded-md sm:text-sm w-full border border-violet-500 outline-violet-600" id="name" />
            </div>

            <div className="col-span-6 sm:col-span-3">
              <label htmlFor="category" className='block text-grap-700 mt-3'>Cateogory:</label>
              <input 
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                type="text" 
                className="p-2 rounded-md sm:text-sm w-full border border-violet-500 outline-violet-600" id="category" />
            </div>

            <div className="col-span-6 sm:col-span-3">
              <label htmlFor="brand" className='block text-grap-700 mt-3'>Brand:</label>
              <input 
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                type="text" 
                className="p-2 rounded-md sm:text-sm w-full border border-violet-500 outline-violet-600" id="brand" />
            </div>

            <div className="col-span-6 sm:col-span-3">
              <label htmlFor="price" className='block text-grap-700 mt-3'>Price:</label>
              <input 
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                type="text" 
                className="p-2 rounded-md sm:text-sm w-full border border-violet-500 outline-violet-600" id="price" />
            </div>

            <div className="col-span-6 sm:col-span-3">
              <label htmlFor="countInStock" className='block text-grap-700 mt-3'>Count In Stock:</label>
              <input 
                value={countInStock}
                onChange={(e) => setCountInStock(e.target.value)}
                type="text" 
                className="p-2 rounded-md sm:text-sm w-full border border-violet-500 outline-violet-600" id="countInStock" />
            </div>

            <div className="col-span-6 sm:col-span-6">
              <label htmlFor="des" className='block text-grap-700 mt-3'>Description:</label>
              <textarea 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                name="des" 
                id="des" cols="30" rows="10" 
                className='p-2 rounded-md sm:text-sm w-full border border-violet-500 outline-violet-600'></textarea>
            </div>

            <button 
              type='submit'
              className='col-end-7 border shadow-sm rounded-md bg-indigo-600 text-white hover:bg-indigo-700 py-2 px-4'>Update</button>

          </div>

        </form>
      </div>
    </div>
  )
}

export default EditProduct
