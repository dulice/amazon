import React, { useEffect } from 'react'
import axios from 'axios'
import { Fragment, useState } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { BsCaretDownFill } from 'react-icons/bs'
import { Link } from 'react-router-dom'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

const Category = () => {

    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchData = async () => {
            const { data } = await axios.get('/api/products/category');
            setCategories(data);
            setLoading(false);
        }
        fetchData();
    },[setCategories, categories]);
    
  return (
    <div className='max-w-7xl mx-auto px-2 sm:px-6 lg:px-8'>
        <Menu as="div" className=" relative">
            <div>
            <Menu.Button className="bg-gray-800 flex text-sm rounded-full hover:bg-gray-900 px-3 py-2">
                <span className="sr-only">Open user menu</span>
                <p className="font-bold text-white ">Category <BsCaretDownFill /></p>

            </Menu.Button>
            </div>
            <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
            >
            <Menu.Items className="origin-top-left absolute left-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                {loading ? <div>Loading...</div>
                :
                categories?.map(category => (
                    <Menu.Item key={category}>
                    {({ active }) => (
                        <Link
                        to={`/search?category=${category}`}
                        className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}
                        >
                        {category}
                        </Link>
                    )}
                    </Menu.Item>
                ))
                }
            </Menu.Items>
            </Transition>
        </Menu>
    </div>
  )
}

export default Category