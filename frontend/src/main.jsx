import React from "react";
import { createRoot } from "react-dom/client"; // Correct ReactDOM import for React 18+
import "./index.css";
import App from "./App";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom"; // Correct imports
import { Provider } from "react-redux";
import store from "./Redux/store";
//Private Route
import PrivateRoute from "./Components/PrivateRoute.jsx";
//auth
import Login from "./pages/Auth/Login.jsx";
import Register from "./pages/Auth/Register.jsx";
import UserList from "./pages/Admin/UserList.jsx";
import Profile from "./pages/User/Profile.jsx";
import AdminRoute from "./pages/Admin/AdminRoute.jsx";
import CategoryList from "./pages/Admin/CategoryList.jsx";
import ProductList from "./pages/Admin/ProductList.jsx";
import AllProducts from "./pages/Admin/AllProducts.jsx";
import AdminProductUpdate from "./pages/Admin/productUpdate.jsx";
import Home from "./Home.jsx";
import Favorites from "./pages/Products/Favorites.jsx";
import ProductDetails from "./pages/Products/ProductDetails.jsx";
import Cart from "./pages/Cart.jsx";
import Shop from "./pages/Shop.jsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    
    <Route path="/" element={<App />}>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route index={true} path="/" element={<Home />} />
      <Route path="/favorite" element={<Favorites />} />
      <Route path="/product/:id" element={<ProductDetails />} />
      <Route path="/cart" element={<Cart />}/>
      <Route path="/shop" element={<Shop />}/>

      <Route path="" element={<PrivateRoute />}>
        <Route path="/profile" element={<Profile />} />
      </Route>
      {/* //Admin Routes */}

      <Route path='/admin' element={<AdminRoute />}>
        <Route path="userlist" element={<UserList/>}/>
        <Route path="categorylist" element={<CategoryList/>}/>
        <Route path="productlist" element={<ProductList/>}/>
        <Route path="allproductslist" element={<AllProducts/>}/>
        <Route path="product/update/:_id" element={<AdminProductUpdate/>}/>
      
      </Route>
        
    </Route>


  )
);

// Get the root DOM element
const rootElement = document.getElementById("root");

// Render the app using ReactDOM.createRoot
createRoot(rootElement).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);
