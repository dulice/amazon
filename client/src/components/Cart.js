import React, { useContext } from 'react'
import { Store } from '../Context/Store'
import { AiOutlinePlusCircle, AiOutlineMinusCircle} from 'react-icons/ai';
import { FaTrashAlt } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';

const Cart = () => {
  const navigate = useNavigate();
    const {state, dispatch: ctxDispatch} = useContext(Store);
    const { cart } = state;

    const handleUpdate = (product, quantity) => {
      ctxDispatch({
        type: "ADD_TO_CART",
        payload: {
          ...product,
          quantity
        }
      })
    }

    const handleRemove = (item) => {
      ctxDispatch({
        type: "REMOVE_FROM_CART",
        payload: item
      })
      window.location.reload();
    }

    const handleCheckOut = () => {
      navigate('/signin?redirect=/shipping')
    }
  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <div className="grid grid-cols-12 gap-6 mt-5">
          
          <div className="col-span-12 sm:col-span-8">
            {cart.cartItems.length < 1 
            ? <p>No items added yet. Go to <Link to="/" className='text-indigo-600 hover:underline'>Shopping</Link></p>
            :
            <div>
              {cart.cartItems.map(item => (
                  <div key={item._id} className="grid grid-cols-12 gap-6 border shadow-md mb-3 items-center">
                    <div className="col-span-4 flex items-center">
                      <img src={item.image} alt={item.name} className="h-16"/>
                      <p className="ml-3">{item.name}</p>
                    </div>
                    <div className="col-span-4 flex">
                      <button onClick={() => handleUpdate(item, item.quantity -1)}><AiOutlineMinusCircle/></button>
                      <p className='px-3'>{item.quantity} x ${item.price}</p>
                      <button className="" onClick={() => handleUpdate(item, item.quantity + 1)}><AiOutlinePlusCircle/></button>
                    </div>
                    <div className="col-span-3">$ {item.quantity * item.price}</div>
                    <div className="col-span-1">
                      <button onClick={() => handleRemove(item)}>
                        <FaTrashAlt/>
                      </button>
                    </div>
                  </div>
              ))}
            </div>
          }
          </div>
          <div className="col-span-8 sm:col-span-4 border-md shadow-lg p-5">
            <div className="flex justify-between items-center">
              <strong>Total Items: </strong>
              <strong className='text-indigo-600 text-3xl'>{cart.cartItems.reduce((sum, num) => sum + num.quantity, 0)}</strong>
            </div>
            <div className="flex justify-between items-center">
              <strong>Total Price: </strong>
              <strong className='text-indigo-600 text-3xl'>$ {cart.cartItems.reduce((sum, num) => sum + (num.price * num.quantity), 0)}</strong>
            </div>
            <button onClick={handleCheckOut} className="border bg-violet-700 text-white rounded-md mt-3 px-3 py-2 w-full hover:bg-violet-800">Proceed To CheckOut</button>
          </div>
        </div>
    </div>
  )
}

export default Cart