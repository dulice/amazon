import React from 'react'
import { BsCart, BsFacebook, BsInstagram, BsYoutube } from 'react-icons/bs'

const Footer = () => {
  return (
    <div>
        <div className='bg-gray-800 text-white my-5 py-5'>
            <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
                <div className="grid grid-cols-12 gap-6">
                    <div className="col-span-6 sm:col-span-3">
                        <p className="text-2xl">Customer Care</p>
                        <ul className='list-none cursor-pointer'>
                            <li>Help Center</li>
                            <li>How to Buy</li>
                            <li>Coroporate and Bulk Purchasing</li>
                            <li>Returns and Refunds</li>
                            <li>Contact Us</li>
                        </ul>
                        <p className="text-2xl mt-5">Earn with Shop</p>
                        <ul className='list-none cursor-pointer'>
                            <li>Shop University</li>
                            <li>Sell on Shop</li>
                            <li>Code on Conduct</li>
                        </ul>
                    </div>
                    <div className="col-span-6 sm:col-span-3">
                        <p className="text-2xl mt-5">Shop</p>
                        <ul className='list-none cursor-pointer'>
                            <li>About Shop</li>
                            <li>Careers</li>
                            <li>Shop Cares</li>
                            <li>Terms & Conditions</li>
                            <li>Privacy Policy</li>
                        </ul>                    
                    </div>
                    <div className="col-span-6 mt-5">
                        < BsCart className='block text-3xl mb-1'/>
                        <p className='mb-5'>Happy Shopping</p> 
                        <div className="">

                        <button className=''>
                            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Google_Play_Store_badge_EN.svg/800px-Google_Play_Store_badge_EN.svg.png" alt="" className='w-1/3' />
                        </button>  
                        <button className=''>
                            <img src="https://www.seekpng.com/png/full/223-2231228_app-store-apple-transprent-download-on-apple-store.png" alt="" className='w-1/3' />
                        </button>            
                        </div>
                    </div>
                </div>
            </div>
            
        </div>
        <div className="max-w-7xl mx-auto px-2 sm:px-6 lg-px-8 my-5">
            <div className="grid grid-cols-12 gap-6">
                <div className="col-span-6">
                    <p className="text-2xl">Payment Methods</p>
                    <button>
                        <img src="https://st2.depositphotos.com/2485091/45350/v/950/depositphotos_453506614-stock-illustration-popular-credit-card-companies-logos.jpg?forcejpeg=true" alt="" className='w-1/2'/>
                    </button>
                </div>
                <div className="col-span-6">
                    <p className="text-2xl mb-5">Follow us</p>
                    < BsFacebook className='mr-5 text-blue-500 text-2xl cursor-pointer' />
                    < BsInstagram className='mr-5 text-pink-500 text-2xl cursor-pointer'/>
                    < BsYoutube className='mr-5 text-red-500 text-2xl cursor-pointer'/>
                </div>
            </div>
        </div>
        <div className="bg-gray-300 text-center py-5">
            Copyright &copy; and all rights resevered.
        </div>
    </div>
  )
}

export default Footer