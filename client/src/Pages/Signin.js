import React, { useContext, useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios'
import { Store } from '../Context/Store';
import getError from '../components/getError';
import { toast } from 'react-toastify';
import { Helmet } from 'react-helmet-async';

const Signin = () => {
    const navigate = useNavigate();
    const {search}  = useLocation();
    const redirectUrl = new URLSearchParams(search).get('redirect');
    const redirect = redirectUrl ? redirectUrl : '/';
    const { state, dispatch: ctxDispatch } = useContext(Store);
    const { userInfo } = state;
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post('/api/users/signin', {
                email,
                password
            });
            // console.log('click', data);
            ctxDispatch({
                type: "USER_SIGNIN",
                payload: data
            })
            localStorage.setItem('userInfo', JSON.stringify(data));
            navigate(redirect);
            window.location.reload();
        } catch (err) {
            toast.error(getError(err));
        }
    }
    useEffect(() => {
        if(userInfo) {
            navigate(redirect);
        }
    },[navigate, redirect]);
  return (
    <div className=" sm:max-w-4xl max-w-5xl mx-auto px-2 sm:px-8 lg:px-6 flex flex-col justify-center items-center" style={{height: "90vh"}}>
        <Helmet>
            <title>Signin</title>
        </Helmet>
        <p className="text-3xl font-bold text-indigo-500">Sign In</p>
        <form action="" onSubmit={handleSubmit}>

            <label htmlFor="email" className='block text-grap-700 mt-3'>Email:</label>
            <input   
            value={email}
            onChange={(e) => setEmail(e.target.value)}    
            type="email"
            id="email"
            className='p-2 rounded-md sm:text-sm w-full border border-violet-500 outline-violet-600'
            required/>

            <label htmlFor="password" className='block text-grap-700 mt-3'>Password:</label>
            <input 
            value={password}
            onChange={(e)=>setPassword(e.target.value)}      
            type="password"
            id="password"
            className='p-2 rounded-md sm:text-sm w-full border border-violet-500 outline-violet-600'
            required/>

            <p className="mt-3">Don't have an account yet?{' '}
                <Link to="/signup" className="text-indigo-600">Sign Up</Link>
            </p>
            <button 
                type="submit"
                className='bg-indigo-600 px-3 py-2 hover:bg-indigo-700 text-white active:bg-indigo-500 rounded-md mt-3'
            >SIGN IN</button>
        </form>
    </div>
  )
}

export default Signin