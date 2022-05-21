import React, { useContext, useState } from 'react'
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import Step from '../components/Step';
import { Store } from '../Context/Store';

const ShippingAddress = () => {
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch} = useContext(Store);
  const { cart: {shippingAddress} } = state;
  const [fullname, setFullName] = useState(shippingAddress.fullname || "");
  const [address, setAddress] = useState(shippingAddress.address || "");
  const [city, setCity] = useState(shippingAddress.city || "");
  const [country, setCountry] = useState(shippingAddress.country || "");
  const [postalCode, setPostalCode] = useState(shippingAddress.postalCode || "");

  const handleSubmit = (e) => {
    e.preventDefault();
      const data = {
        fullname,
        address,
        city,
        country,
        postalCode
      }
      ctxDispatch({type: "SAVE_SHIPPING_ADDRESS", payload: data });
      localStorage.setItem('shippingAddress', JSON.stringify(data));
      navigate('/paymentMethod')
  }

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
      <Step step1 step2 />
      <div className="m-3">
        <Helmet>
          <title>ShippingAddress</title>
        </Helmet>
        <h1 className="font-bold text-3xl text-violet-800">Shipping Address</h1>
        <form onSubmit={handleSubmit}>

          <div className="grid grid-cols-6 gap-4">

            <div className="col-span-6">
              <label htmlFor="name" className='block text-grap-700 mt-3'>Full Name:</label>
              <input required 
                value={fullname}
                onChange={(e) => setFullName(e.target.value)}
                type="text" 
                className="p-2 rounded-md sm:text-sm w-full border border-violet-500 outline-violet-600" 
                id="name"
              />
            </div>

            <div className="col-span-6">
              <label htmlFor="address" className='block text-grap-700 mt-3'>Address:</label>
              <input required 
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                type="text" 
                className="p-2 rounded-md sm:text-sm w-full border border-violet-500 outline-violet-600" id="name" />
            </div>

            <div className="col-span-6">
              <label htmlFor="city" className='block text-grap-700 mt-3'>City:</label>
              <input required 
                value={city}
                onChange={(e) => setCity(e.target.value)}
                type="text" 
                className="p-2 rounded-md sm:text-sm w-full border border-violet-500 outline-violet-600" id="category" />
            </div>

            <div className="col-span-6">
              <label htmlFor="country" className='block text-grap-700 mt-3'>Country:</label>
              <input required 
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                type="text" 
                className="p-2 rounded-md sm:text-sm w-full border border-violet-500 outline-violet-600" id="brand" />
            </div>

            <div className="col-span-6">
              <label htmlFor="postalCode" className='block text-grap-700 mt-3'>Postal Code:</label>
              <input required 
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                type="text" 
                className="p-2 rounded-md sm:text-sm w-full border border-violet-500 outline-violet-600" id="price" />
            </div>

            <button type="submit" className='border shadow-sm rounded-md bg-indigo-600 text-white hover:bg-indigo-700 py-2 px-4 w-24 sm:w-full'>Continue</button>

          </div>

        </form>
      </div>
    </div>
  )
}

export default ShippingAddress