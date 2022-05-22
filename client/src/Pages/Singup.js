import React, { useContext, useState } from 'react'
import { Link } from 'react-router-dom';
import axios from 'axios'
import { Store } from '../Context/Store';
import getError from '../components/getError';
import { toast } from 'react-toastify';
import { Helmet } from 'react-helmet-async';

const Signup = () => {
    const { state, dispatch: ctxDispatch } = useContext(Store);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(password !== repeatPassword) return toast.error("Password do not match");
        try {
            const { data } = await axios.post('/api/users/signup', {
                name,
                email,
                password
            });
            console.log(data);
            ctxDispatch({
                type: "USER_SIGNIN",
                payload: data
            })
            localStorage.setItem('userInfo', JSON.stringify(data));
        } catch (err) {
            toast.error(getError(err));
        }
    }
  return (
    <div className=" sm:max-w-4xl max-w-5xl mx-auto px-2 sm:px-8 lg:px-6 flex flex-col justify-center items-center" style={{height: "90vh"}}>
        <Helmet>
            <title>Signup</title>
        </Helmet>
        <p className="text-3xl font-bold text-indigo-500">Sign Up</p>
        <form onSubmit={handleSubmit}>
            <label htmlFor="name" className='block text-grap-700 mt-3'>Name:</label>
            <input   
            value={name}
            onChange={(e) => setName(e.target.value)}    
            type="name"
            id="name"
            className='p-2 rounded-md sm:text-sm w-full border border-violet-500 outline-violet-600'
            required/>

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

            <label htmlFor="repeat-password" className='block text-grap-700 mt-3'>Comfirm Password:</label>
            <input 
            value={repeatPassword}
            onChange={(e)=>setRepeatPassword(e.target.value)}      
            type="password"
            id="repeat-password"
            className='p-2 rounded-md sm:text-sm w-full border border-violet-500 outline-violet-600'
            required/>

            <p className="mt-3">Already have an account yet?{' '}
                <Link to="/signin" className="text-indigo-600">Sign In</Link>
            </p>
            <button 
                type="submit"
                className='border-indigo-600 bg-indigo-600 px-3 py-2 hover:bg-indigo-700 text-white active:bg-indigo-500 rounded-md mt-3'
            >SIGN UP</button>
        </form>
    </div>
  )
}

export default Signup