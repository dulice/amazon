import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Dashboard from "./admin/Dashboard";
import EditProduct from "./admin/EditProduct";
import OrdersList from "./admin/OrdersList";
import ProductsList from "./admin/ProductsList";
import UserList from "./admin/UserList";
import AdminRoute from "./components/AdminRoute";
import Cart from "./components/Cart";
import Header from "./components/Header";
import PlaceOrder from "./components/PlaceOrder";
import ProtectedRoute from "./components/ProtectedRoute";
import CategoryProduct from "./Pages/CategoryProduct";
import FinishOrder from "./Pages/FinishOrder";
import Home from "./Pages/Home";
import OrderHistory from "./Pages/OrderHistory";
import PaymentMethod from "./Pages/PaymentMethod";
import Profile from "./Pages/Profile";
import Search from "./Pages/Search";
import ShippingAddress from "./Pages/ShippingAddress";
import Signin from "./Pages/Signin";
import SingleProduct from "./Pages/SingleProduct";
import Signup from "./Pages/Singup";
import Thankyou from "./Pages/Thankyou";

function App() {
  return (
    <div>
      <ToastContainer position="bottom-center" limit={1} />
      <Header />
      <Routes>
        <Route path="/" element={ <Home />} />
        <Route path="/cart" element={ <Cart />} />
        <Route path="/search/:name" element={ <Search />} />
        <Route path="/search" element={ <CategoryProduct />} />
        <Route path="/signin" element={ <Signin />} />
        <Route path="/signup" element={ <Signup />} />
        <Route path="/products/:id" element={ <SingleProduct />} />
        <Route path="/shipping" element={ <ProtectedRoute> <ShippingAddress /> </ProtectedRoute> } />
        <Route path="/paymentMethod" element={ <ProtectedRoute> <PaymentMethod /> </ProtectedRoute> } />
        <Route path="/placeorder" element={ <ProtectedRoute> <PlaceOrder /> </ProtectedRoute> } />
        <Route path="/orders/:id" element={ <ProtectedRoute> <FinishOrder /> </ProtectedRoute>} />
        <Route path="/thankyou" element={ <Thankyou /> } />
        <Route path="/orders/history" element={ <ProtectedRoute> <OrderHistory /> </ProtectedRoute>} />
        <Route path="/profile" element={ <ProtectedRoute> <Profile /> </ProtectedRoute>} />

        <Route path="/admin/productsList" element={ <AdminRoute> <ProductsList /> </AdminRoute>  } />
        <Route path="/admin/productsList/:id" element={ <AdminRoute><EditProduct /></AdminRoute>  } />
        <Route path="/admin/usersList" element={ <AdminRoute><UserList /></AdminRoute> } />
        <Route path="/admin/dashboard" element={ <AdminRoute> <Dashboard /> </AdminRoute>} />
        <Route path="/admin/ordersList" element={ <AdminRoute> <OrdersList /> </AdminRoute>  } />
      </Routes>
    </div>
  );
}

export default App;
