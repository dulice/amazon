import React from 'react'

const Step = (props) => {
  return (
    <div className="max-w-7xl mx-auto p-2 sm:p-8 lg:p-6 ">
        <div className="grid grid-cols-12">
            <div className={[props.step1 ? 'border-indigo-600 a': 'border-gray-600 a', 'a text-center col-span-3 border-b-2']}>Sign In</div>
            <div className={[props.step2 ? 'border-indigo-600 a': 'border-gray-600 a', 'a text-center col-span-3 border-b-2']}>Shipping Address</div>
            <div className={[props.step3 ? 'border-indigo-600 a': 'border-gray-600 a', 'a text-center col-span-3 border-b-2']}>Payment Method</div>
            <div className={[props.step4 ? 'border-indigo-600 a': 'border-gray-600 a', 'a text-center col-span-3 border-b-2']}>Place Order</div>
        </div>
    </div>
  )
}

export default Step