import React, { useContext, useState } from 'react'
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import Step from '../components/Step';
import { Store } from '../Context/Store';

const PaymentMethod = () => {
    const navigate = useNavigate();
    const { state, dispatch: ctxDispatch } = useContext(Store);
    const { cart: {paymentMethod}} = state;
    const [payment, setPayment] = useState(paymentMethod || 'paypal');
    
    const handleSubmit = (e) => {
        e.preventDefault();
        ctxDispatch({type: "SAVE_PAYMENT_METHOD", payload: payment});
        localStorage.setItem('paymentMethod', JSON.stringify(payment));
        navigate('/placeorder')
    }
  return (
      <>
        <Step step1 step2 step3 />
        <div className="max-w-5xl mx-auto p-2 sm:p-8 lg:p-6 ">
            <Helmet>Payment</Helmet>
            <p className="font-bold text-3xl mb-5">Payment Method</p>
            <form onSubmit={handleSubmit}>
                <div className='block mb-3'>
                    <input 
                        checked={payment === 'paypal'}
                        onChange={(e) => setPayment(e.target.value)}
                        value="paypal"
                        name="paymentMethod" className='mr-3' type="radio" id='paypal' />
                    <label htmlFor="paypal">Pay Pal</label>
                </div>

                <div className='block mb-3'>
                    <input 
                        checked={payment === 'visa'}
                        onChange={(e) => setPayment(e.target.value)}
                        value="visa"
                        name="paymentMethod" className='mr-3' type="radio" id='visa' />
                    <label htmlFor="visa">Visa</label>
                </div>

                <div className='block mb-3'>
                    <input 
                        checked={payment === 'kpay'}
                        onChange={(e) => setPayment(e.target.value)}
                        value="kpay"
                        name="paymentMethod" className='mr-3' type="radio" id='kpay' />
                    <label htmlFor="kpay">KPay</label>
                </div>
                <button type="submit" className='border shadow-sm rounded-md bg-indigo-600 text-white hover:bg-indigo-700 py-2 px-4'>Continue</button>
            </form>
        </div>
    </>
  )
}

export default PaymentMethod