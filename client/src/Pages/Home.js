import React from 'react'
import Footer from '../components/footer'
import Products from '../components/Products'
import heroImg from '../images/hero.jpg'

const Home = () => {

  return (
    <div>
      <div className='grid grid-cols-6 m-1 sm:m-20 lg:m-20'>
        <div className='col-span-6 sm:col-span-6 lg:col-span-3'>
          <img src={heroImg} alt="" className="rounded-lg"/>
        </div>
        <div className='col-span-6 sm:col-span-6 lg:col-span-3 mt-20 ml-10'>
          <p className="text-3xl sm:text-5xl leading-relaxed">Shopping Today And Explore Your Happiness</p>
          <a href='#product'>
            <button className='my-5 block text-white bg-indigo-600 hover:bg-indigo-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center'>Explore Now</button>
          </a>
        </div>
        
      </div>
        <Products/>
        <Footer />
    </div>
  )
}

export default Home