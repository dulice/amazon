import axios from 'axios'
import React, { useContext, useEffect, useReducer } from 'react'
import { toast } from 'react-toastify'
import getError from '../components/getError'
import { Store } from '../Context/Store'
import {Helmet} from 'react-helmet-async'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Doughnut, Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true }
    
    case "FETCH_SUCCESS":
      return { 
          ...state, 
          loading: false, 
          summary: action.payload, 
        }

    case "FETCH_FAIL":
      return { ...state, error: action.payload }   

    default:
      return state
  }
};

const Dashboard = () => {
    const { state } = useContext(Store);
    const { userInfo } = state;
    const [{loading, error, summary}, dispatch] = useReducer(Reducer, {
        loading: true,
        error: '',
    });
  
    useEffect(() => {
        const fetchData = async () => {
            dispatch({type: "FETCH_REQUEST"});
            try {
                const { data } = await axios.get('/api/orders/summary', {
                    headers: {
                        authorization: `Bearer ${userInfo.token}`
                    }
                })
                dispatch({type: "FETCH_SUCCESS", payload: data});
            } catch (err) {
                dispatch({type: "FETCH_FAIL", payload: getError(err)});
                toast.error(error);
            }
        }
        fetchData();
    },[dispatch, userInfo, error]);

    const salesData = {
      labels: summary?.dailyOrders.map(x => x._id),
      datasets: [{
        label: "Sales",
        data: summary?.dailyOrders.map(sale => sale.sales),
        backgroundColor: 'rgb(255, 99, 132)',
        borderColor: 'rgb(255, 99, 132)',
        redraw: true,
        borderWidth: 1
      }]
    }

    const saleOption = {
      scales: {
        x: {
          display: true,
          title: {
            display: true,
            text: 'Date'
          }
        },
        y: {
          display: true,
          title: {
            display: true,
            text: 'Sale'
          }
        }
      }
    }

    const categoryData = {
      labels: summary?.categories.map(x => x._id),
      datasets: [{
      label: "Category",
      data: summary?.categories.map(x => x.count),
      backgroundColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)'
      ],
      borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)'
      ],
      }]
    }
  return (
    <div className='max-w-7xl mx-auto px-2 sm:px-6 lg:px-8'>
      <Helmet>
        <title>Dashboard</title>
      </Helmet>
      <p className="font-bold text-3xl py-5">Dashobard</p>
      {loading ? <div>Loading...</div>
      :
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 sm:col-span-4 p-5 text-center border shadow-sm hover:shadow-lg hover:-translate-y-2 duration-500">
            <p className="font-bold text-indigo-600 text-3xl">{summary.users[0].numUsers}</p>
            <p className="">Users</p>
          </div>
          <div className="col-span-12 sm:col-span-4 p-5 text-center border shadow-sm hover:shadow-lg hover:-translate-y-2 duration-500">
            <p className="font-bold text-indigo-600 text-3xl">{summary.orders[0].numOrders}</p>
            <p className="">Orders</p>
          </div>
          <div className="col-span-12 sm:col-span-4 p-5 text-center border shadow-sm hover:shadow-lg hover:-translate-y-2 duration-500">
            <p className="font-bold text-indigo-600 text-3xl">{summary.orders[0].totalSales.toFixed(2)}</p>
            <p className="">Sales</p>
          </div>
          <div className="col-span-12 sm:col-span-8">
            <p className='font-bold'>Sales</p>
            {summary.dailyOrders.length === 0 ? <p className='text-red-400'>NO Sale Today</p>
            :
            <Line data={salesData} options={saleOption} />
            }
          </div>
          <div className="col-span-8 sm:col-span-4">
            <p className="font-bold">Category</p>
            {summary.dailyOrders.length === 0 ? <p className='text-red-400'>NO Category</p>
            :
            <Doughnut data={categoryData} />
            }
          </div>
        </div>
      }
    </div>
  )
}

export default Dashboard