import React from 'react'
import { Helmet } from 'react-helmet-async'
import { FiCheckCircle } from 'react-icons/fi'
import { Link } from 'react-router-dom'

const Thankyou = () => {
  return (
    <div className='text-center my-10 leading-loose'>
      <Helmet>
        <title>Thankyou</title>
      </Helmet>
        <FiCheckCircle className='text-green-400 text-7xl' />
        <p className='font-bold text-5xl my-7'>Thank You For Your Order</p>
        <p>Your order has been Recieved.</p>
        <Link to='/' className='text-indigo-500 hover:underline'>GO TO HOME PAGE</Link>
    </div>
  )
}

export default Thankyou