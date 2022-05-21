import axios from 'axios'
import React, { useEffect, useReducer } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import getError from '../components/getError'
import Product from '../components/Product'

const Reducer = (state, action) => {
    switch(action.type) {
        case "FETCH_REQUEST":
            return { ...state, loading: true}

        case "FETCH_SUCCESS":
            return {
                ...state,
                loading: false,
                countProducts: action.payload,
                products: action.payload,
                page: action.payload,
                pages: action.payload
            };
        
        case "FETCH_FAIL":
            return {
                ...state,
                loading: false,
                error: action.payload
            }

        default:
            return state;
    }
}

const prices = [
    {
        name: '$1 to $50',
        value: '1-50',
    },
    {
        name: '$51 to $200',
        value: '51-200',
    },
    {
        name: '$201 to $1000',
        value: '201-1000',
    }
];

const ratings = [
    {
        name: '4 starts and up',
        value: 4
    },
    {
        name: '3 starts and up',
        value: 3
    },
    {
        name: '2 starts and up',
        value: 2
    },
    {
        name: '1 starts and up',
        value: 1
    },
]

const CategoryProduct = () => {
    const navigate = useNavigate();
    const [{loading, error, products, countProducts, pages}, dispatch] = useReducer(Reducer, {
        loading: true,
        error: ''
    })
    const { search } = useLocation();
    const searchParamsUrl = new URLSearchParams(search);
    const category = searchParamsUrl.get('category') || 'all';
    const price = searchParamsUrl.get('price') || 'all';
    const rating = searchParamsUrl.get('rating') || 'all';
    const page = searchParamsUrl.get('page') || 1;
    const order = searchParamsUrl.get('order') || 'newest';
    const query = searchParamsUrl.get('query') || 'all';

    useEffect(() => {
        const fetchData = async () => {
            dispatch({type: "FETCH_REQUEST"});
            try {
                const { data } = await axios.get(`http://localhost:5000/api/products/search?category=${category}&price=${price}&rating=${rating}&page=${page}&order=${order}&query=${query}`);
                console.log(data.countProducts);
                dispatch({type: "FETCH_SUCCESS", payload: data});
            } catch (err) {
                dispatch({type: "FETCH_FAIL", payload: getError(err)});
            }
        }
        fetchData();
    },[dispatch, category, price, rating, page, order, query]);

    const filterProduct = (filter) => {
        const filterCategory = filter.category || category;
        const filterPrice = filter.price || price;
        const filterRating = filter.rating || rating;
        const filterOrder = filter.order || order;
        const filterPage = filter.page || page;
        const filterQuery = filter.query || query;
        return `/search?category/${filterCategory}&price=${filterPrice}&rating=${filterRating}&order=${filterOrder}&page=${filterPage}&query=${filterQuery}`
    }
  return (
    <div className="max-w-7xl mx-auto p-2 sm:p-6 lg:p-8">
        <Helmet>
            <title>Category</title>
        </Helmet>
        <select 
            value={order}
            onChange={(e)=> navigate(filterProduct({order: e.target.value}))}
            name="" id="" className='position-relative float-right border border-indigo-600 outline-indigo-600 p-2 rounded-md'>
            <option value="highest">Price: High to Low</option>
            <option value="lowest">Price: Low to High</option>
            <option value="newest">Lastest</option>
            <option value="toprated">Avg. Reviews</option>
        </select>
        <div className="grid grid-cols-12 gap-4">
            <div className="col-span-5 sm:col-span-2">
                <div className='mb-5'>
                    <p className='font-bold text-indigo-600'>Price</p>
                    <ul>
                        {prices.map(p => (
                            <li key={p.value} className="ml-3 hover:text-indigo-600">
                                <Link to={filterProduct({price: p.value})}>{p.name}</Link>
                            </li>
                        ))}
                    </ul>
                </div>
                <div>
                    <p className='font-bold text-indigo-600'>Rating</p>
                    <ul>
                        {ratings.map(r => (
                            <li key={r.value} className="ml-3 hover:text-indigo-600">
                                <Link to={filterProduct({rating: r.value})}>{r.name}</Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            <div className="col-span-7 sm:col-span-10">
            {loading ? <div>Loading...</div>
            : products.countProducts === 0 
            ? <p className='text-red-600'>No Result Found</p>
            :
                <div className="grid grid-cols-12 gap-6">
                    {products.products.map(product => (
                        <div  className=" col-span-12 sm:col-span-6 lg:col-span-4 border rounded-md shadow-lg p-5 mb-5" key={product._id}>
                            <Product product={product}/>
                        </div>
                    ))
                    }
                </div>
            }
            </div>
        </div>
    </div>
  )
}

export default CategoryProduct