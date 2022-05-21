import { createContext, useReducer } from "react"

export const Store = createContext();

const user = JSON.parse(localStorage.getItem('userInfo'));
const itmes = JSON.parse(localStorage.getItem('cartItems'));
const address = JSON.parse(localStorage.getItem('shippingAddress'));
const payment = JSON.parse(localStorage.getItem('paymentMethod'));

const initialState = {
    userInfo: user ? user : null,
    cart: {
        cartItems: itmes ? itmes : [],
        shippingAddress: address ? address : {},
        paymentMethod: payment ? payment : '',
    }

}

const Reducer = (state, action) => {
    switch(action.type) {
        case "ADD_TO_CART":
            const newItem = action.payload;
            const existItem = state.cart.cartItems.find(item => item._id === newItem._id);
            const cartItems = existItem
            ? state.cart.cartItems.map(item => 
                item._id === existItem._id ? newItem : item
            )
            : [...state.cart.cartItems, newItem];
            localStorage.setItem('cartItems', JSON.stringify(cartItems));
            return {
                ...state,
                cart: {
                    ...state.cart,
                    cartItems
                }
            }

        case "REMOVE_FROM_CART":
            {
                const existItem = state.cart.cartItems.filter(item => item._id !== action.payload._id);
                localStorage.setItem('cartItems', JSON.stringify(existItem));
                return {
                    ...state,
                    cart: {
                        ...state.cart,
                        existItem
                    }
                }
            }

        case "USER_SINGIN": 
            return {
                ...state,
                userInfo: action.payload
            }

        case "USER_SIGNOUT":
            return {
                ...state,
                userInfo: null,
                cart: {
                    ...state,
                    shippingAddress: {}
                }
            }

        case "SAVE_SHIPPING_ADDRESS": 
            return {
                ...state,
                cart: {
                    ...state.cart,
                    shippingAddress: action.payload
                }
            }

        case "SAVE_PAYMENT_METHOD": 
            return {
                ...state,
                cart: {
                    ...state.cart,
                    paymentMethod: action.payload
                }
            }
    
        default:
            return state;
    }
}

export const StoreProvider = ({children}) => {
    const [state, dispatch] = useReducer(Reducer, initialState);
    const value = {state, dispatch}
    return <Store.Provider value={value}> {children} </Store.Provider>
}