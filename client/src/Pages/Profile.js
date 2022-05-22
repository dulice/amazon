import axios from 'axios';
import React, { useContext, useReducer, useState } from 'react'
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-toastify';
import getError from '../components/getError';
import { Store } from '../Context/Store';

const Reducer = (state, action) => {
    switch(action.type) {
        case "FETCH_REQUEST":
            return {...state, loading: true}

        case "FETCH_SUCCESS":
            return {...state, loading: false};

        case "FETCH_FAIL":
            return { ...state, error: action.payload};

        default:
            return state;
    }
}

const Profile = () => {
    const { state, dispatch: ctxDispatch } = useContext(Store);
    const { userInfo } = state;
    const [name, setName] = useState(userInfo.name || "");
    const [email, setEmail] = useState(userInfo.email || "");
    const [password, setPassword] = useState("");
    const [confirmPasswrod, setConfirmPassword] = useState("");

    const [{loading, error}, dispatch] = useReducer(Reducer, {
        loading: true,
        error: ''
    })

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(password !== confirmPasswrod) return toast.error("Password do not match!");
            dispatch({type: "FETCH_REQUEST"});
            try {
                const { data } = await axios.put("http://localhost:5000/api/users/profile", {
                    name,
                    email,
                    password
                },{
                    headers: {
                        authorization: `Bearer ${userInfo.token}`
                    }
                })
                dispatch({type: "FETCH_SUCCESS"});
                ctxDispatch({type: "USER_SIGNIN", payload: data});
                console.log(data);
                localStorage.setItem('userInfo', JSON.stringify(data));
                toast.success("Update Successfully!");
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            } catch (err) {
                dispatch({type: "FETCH_FAIL", payload: getError(err)});
                toast.error(error);
            }       
    }

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
      <div className="m-3">
        <Helmet>
          <title>Profile Setting</title>
        </Helmet>
        <h1 className="font-bold text-3xl text-violet-800">Profile Setting</h1>
        { loading ? <div>Loading...</div>
        :
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-6 gap-4">

            <div className="col-span-6">
              <label htmlFor="name" className='block text-grap-700 mt-3'>Name:</label>
              <input 
                value={name}
                onChange={(e) => setName(e.target.value)}
                type="text" 
                className="p-2 rounded-md sm:text-sm w-full border border-violet-500 outline-violet-600" 
                id="name"
              />
            </div>

            <div className="col-span-6">
              <label htmlFor="email" className='block text-grap-700 mt-3'>Email:</label>
              <input 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="text" 
                className="p-2 rounded-md sm:text-sm w-full border border-violet-500 outline-violet-600" id="name" />
            </div>

            <div className="col-span-6">
              <label htmlFor="password" className='block text-grap-700 mt-3'>Password:</label>
              <input 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="text" 
                className="p-2 rounded-md sm:text-sm w-full border border-violet-500 outline-violet-600" id="category" />
            </div>

            <div className="col-span-6">
              <label htmlFor="confirm-password" className='block text-grap-700 mt-3'>Confirm Password:</label>
              <input 
                value={confirmPasswrod}
                onChange={(e) => setConfirmPassword(e.target.value)}
                type="text" 
                className="p-2 rounded-md sm:text-sm w-full border border-violet-500 outline-violet-600" id="brand" />
            </div>

            <button type="submit" className='border shadow-sm rounded-md bg-indigo-600 text-white hover:bg-indigo-700 py-2 px-4 w-24 sm:w-full'>Update</button>

          </div>

        </form>
        }
      </div>
    </div>
  )
}

export default Profile