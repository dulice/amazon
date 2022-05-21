import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import Rating from './Rating'
import { CgShoppingCart } from 'react-icons/cg'
import { Store } from '../Context/Store'

const Product = ({product}) => {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart: {cartItems}} = state;

   const existItem = cartItems.find((x) => x._id === product._id);
  const quantity = existItem ? existItem.quantity + 1 : 1;
  const handleAddToCart = (item) => {
    ctxDispatch({
      type: 'ADD_TO_CART',
      payload: { ...item, quantity },
    });
  };
  
  return (
    <div key={product._id}>
        <img src={product.image} alt={product.name} className="product-img"/>
        <Link className='' to={`/products/${product._id}`}>
            <p className="font-bold text-lg mt-3 link">{product.name}</p>
        </Link>
        <div className="flex justify-between mt-3 text-violet-500">
            <Rating rating={product.rating}/>
            <p>{product.numReviews} Reviews</p>
        </div>
        <p className="mt-3 font-bold">$ {product.price}</p>
        {product.countInStock > 1 
        ? <button className="border bg-violet-700 text-white rounded-md mt-3 px-3 py-2 w-full hover:bg-violet-800" onClick={()=> handleAddToCart(product)}>Add To Cart <CgShoppingCart /></button>
        : <button className="border bg-violet-400 text-white rounded-md mt-3 px-3 py-2 w-full" disabled>Out Of Stock</button>
        }
    </div>
  )
}

export default Product