import { Fragment, useContext, useState } from 'react'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { MenuIcon, XIcon } from '@heroicons/react/outline'
import { CgShoppingCart } from 'react-icons/cg'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { BsCart } from 'react-icons/bs'
import { Store } from '../Context/Store'
import { BsCaretDownFill, BsSearch } from 'react-icons/bs'
import styled from 'styled-components'
import Category from '../Pages/Category'

const navigation = [
  { name: 'Home', href: '/', current: true },
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Header() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const navigate = useNavigate();
  const { cart: {cartItems}, userInfo } = state;
  const [search, setSearch] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate(`/search?query=${search}`)
    setSearch("");
  }

  const handleSignout = () => {
    ctxDispatch({type: "USER_SIGNOUT"});
    localStorage.removeItem('userInfo');
    localStorage.removeItem('shippingAddress');
    localStorage.removeItem('cartItems');
    localStorage.removeItem('paymentMethod');
  }

  return (
    <Disclosure as="nav" className="bg-gray-800">
      {({ open }) => (
        <>
          <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
            <div className="relative flex items-center justify-between h-16">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                {/* Mobile menu button*/}
                <Disclosure.Button className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <MenuIcon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
              <div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
                <div className="flex-shrink-0 flex items-center">
                    <span className="hidden lg:block h-8 w-auto text-white flex align-center">
                        <CgShoppingCart size={26}/> 
                        <span>SHOPPING</span>
                    </span>
                </div>
                <div className="hidden sm:block sm:ml-6">
                  <div className="flex space-x-4">
                    {navigation.map((item) => (
                      <>
                      <Link
                        key={item.name}
                        to={item.href}
                        className={classNames(
                          item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                          'px-3 py-2 rounded-md text-sm font-medium'
                        )}
                        aria-current={item.current ? 'page' : undefined}
                      >
                        {item.name}
                      </Link>
                      <form onSubmit={handleSubmit}>
                          <div className="relative">
                              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                  <button type='submit' className='bg-transparent search-btn'><BsSearch /></button>
                              </div>
                              <input 
                                  type="text"
                                  placeholder='Search Products...'
                                  value={search}
                                  onChange={(e)=> setSearch(e.target.value)}
                                  className="p-2 rounded-md sm:text-sm border border-violet-500 outline-violet-600 block pl-10 p-2.5" />
                          </div>
                      </form>
                      </>
                    ))}
                  </div>
                </div>
              </div>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                <LinkR to='/cart' className='hover:bg-gray-700 text p-2 rounded-md text-sm font-medium text-white'>
                  <BsCart className="h-6 w-6" aria-hidden="true" />
                  {
                    cartItems?
                    <span className="bg-red-500 rounded-sm p-1 text-white">{cartItems?.reduce((sum, num) => sum + num.quantity, 0)}</span>
                    : <span className="bg-red-500 rounded-sm p-1 text-white">0</span>
                  }
                  </LinkR>
                  
                {!userInfo && 
                  <Menu as="div" className="ml-3 relative">
                    <div>
                      <Menu.Button className="bg-gray-800 flex text-sm rounded-full hover:bg-gray-900 px-3 py-2">
                        <span className="sr-only">Open user menu</span>                                       
                        <Link to='/signin' className='text-white font-bold'>Sign in</Link>                                          
                      </Menu.Button>
                    </div>
                  </Menu>
                }
                {/* Profile dropdown */}
                {userInfo &&
                <Menu as="div" className="ml-3 relative">
                  <div>
                    <Menu.Button className="bg-gray-800 flex text-sm rounded-full hover:bg-gray-900 px-3 py-2">
                      <span className="sr-only">Open user menu</span>                                       
                      <p className="font-bold text-white ">{userInfo.name} <BsCaretDownFill /></p>                     
                      
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
                    <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            to='/profile'
                            className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}
                          >
                            Your Profile
                          </Link>
                        )}
                      </Menu.Item>                                          
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            to='/orders/history'
                            className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}
                          >
                            Order History
                          </Link>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            to='/signin'
                            onClick={handleSignout}
                            className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}
                          >
                            Sign out
                          </Link>
                        )}
                      </Menu.Item>
                    </Menu.Items>
                  </Transition>
                </Menu>
                } 

                {userInfo && userInfo.isAdmin && 
                <Menu as="div" className="ml-3 relative">
                  <div>
                    <Menu.Button className="bg-gray-800 flex text-sm rounded-full hover:bg-gray-900 px-3 py-2">
                      <span className="sr-only">Open user menu</span>
                      <p className="font-bold text-white ">Admin <BsCaretDownFill /></p>
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
                    <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            to='/admin/dashboard'
                            className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}
                          >
                            Dashboard
                          </Link>
                        )}
                      </Menu.Item>                                          
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            to='/admin/productsList'
                            className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}
                          >
                            Products List
                          </Link>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            to='/admin/ordersList'
                            className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}
                          >
                            Orders List
                          </Link>
                        )}
                      </Menu.Item>                    
                    </Menu.Items>
                  </Transition>
                </Menu>
                }
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as="a"
                  href={item.href}
                  className={classNames(
                    item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                    'block px-3 py-2 rounded-md text-base font-medium'
                  )}
                  aria-current={item.current ? 'page' : undefined}
                >
                  {item.name}
                </Disclosure.Button>
              ))}
            </div>
          </Disclosure.Panel>
          <Category />
        </>
      )}
    </Disclosure>
  )
}

const LinkR = styled(NavLink)`
  background-color: #1F2937;
  &.active{
    background-color: #111827;
  }
`