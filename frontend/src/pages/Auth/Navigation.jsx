import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  AiOutlineHome,
  AiOutlineShopping,
  AiOutlineLogin,
  AiOutlineUserAdd,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { FaHeart } from "react-icons/fa";
import { useLoginMutation, useLogoutMutation, useRegisterMutation } from "../../Redux/api/userApiSlice";
import { logout } from "../../Redux/features/auth/authSlice";
import "./Navigation.css";
import FavoriteCount from "../Products/FavoriteCount";

const Navigation = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const {cartItems} = useSelector((state) => state.cart);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [logoutApiCall] = useLogoutMutation();

  // Logout handler with improved error handling
  const LogoutHandler = async () => {
    try {
      await logoutApiCall().unwrap(); // Ensure correct API usage
      dispatch(logout());
      navigate("/login"); // Navigate to login page after logout
    } catch (error) {
      console.error("Logout failed:", error); // Log detailed error
    }
  };

  const toggleDropdown = () => setDropdownOpen((prev) => !prev); // Toggle dropdown state
  const toggleSidebar = () => setSidebarOpen((prev) => !prev); // Toggle sidebar visibility
  const closeSidebar = () => setSidebarOpen(false); // Close sidebar explicitly

  return (
    <div
      style={{ zIndex: 9999 }}
      className={`${
        sidebarOpen ? "hidden" : "flex"
      } xl:flex lg:flex md:flex sm:hidden flex-col justify-between p-4 text-white bg-[#000] w-[4%] hover:w-[15%] h-[100vh] fixed`}
      id="navigation-container"
    >
      {/* Sidebar links */}
      <div className="flex flex-col justify-center space-y-4">
        <Link to="/" className="flex items-center transition-transform hover:translate-x-2">
          <AiOutlineHome className="mr-2 mt-[3rem]" size={26} />
          <span className="hidden nav-item-name mt-[3rem]">HOME</span>
        </Link>

        <Link to="/shop" className="flex items-center transition-transform hover:translate-x-2">
          <AiOutlineShopping className="mr-2 mt-[3rem]" size={26} />
          <span className="hidden nav-item-name mt-[3rem]">SHOP</span>
        </Link>

        <Link to="/cart" className="flex relative">
          <div className="flex items-center transition-transform transform hover:translate-x-2">
            <AiOutlineShoppingCart className="mt-[3rem] mr-2" size={26} />
            <span className="hidden nav-item-name mt-[3rem]">Cart</span>{" "}
          </div>

          <div className="absolute top-9">
            {cartItems.length > 0 && (
              <span>
                <span className="px-1 py-0 text-sm text-black bg-pink-500 rounded-full">
                  {cartItems.reduce((a, c) => a + c.qty, 0)}
                </span>
              </span>
            )}
          </div>
        </Link>

        <Link to="/favorite" className="flex relative">
          <div className="flex justify-center items-center transition-transform transform hover:translate-x-2">
            <FaHeart className="mt-[3rem] mr-2" size={20} />
            <span className="hidden nav-item-name mt-[3rem]">
              Favorites
            </span>{" "}
            <FavoriteCount />
          </div>
        </Link>
      </div>

      {/* User dropdown */}
      <div className="relative">
      <button
          onClick={toggleDropdown}
          className="flex items-center text-gray-800 focus:outline-none"
        >
          {userInfo ? (
            <span className="text-white">{userInfo.username}</span>
          ) : (
            <></>
          )}
          {userInfo && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-4 w-4 ml-1 ${
                dropdownOpen ? "transform rotate-180" : ""
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="white"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d={dropdownOpen ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"}
              />
            </svg>
          )}
        </button>

        {dropdownOpen && userInfo && (
          <ul
            className={`absolute right-0 mt-2 mr-14 space-y-2 bg-white text-gray-600 ${
              !userInfo.isAdmin ? "-top-20" : "-top-80"
            } `}
          >
            {userInfo.isAdmin && (
              <>
                <li>
                  <Link
                    to="/admin/dashboard"
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/productlist"
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    Products
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/categorylist"
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    Category
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/orderlist"
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    Orders
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/userlist"
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    Users
                  </Link>
                </li>
              </>
            )}

            <li>
              <Link to="/profile" className="block px-4 py-2 hover:bg-gray-100">
                Profile
              </Link>
            </li>
            <li>
              <button
                onClick={LogoutHandler}
                className="block w-full px-4 py-2 text-left hover:bg-gray-100"
              >
                Logout
              </button>
            </li>
          </ul>
        )}
      </div>

      {/* Login/Register links for guests */}
      {!userInfo && (
        <ul>
          <li>
            <Link to="/login" className="flex items-center mt-5 transition-transform hover:translate-x-2">
              <AiOutlineLogin className="mr-2 mt-[4px]" size={26} />
              <span className="hidden nav-item-name">LOGIN</span>
            </Link>
          </li>
          <li>
            <Link to="/register" className="flex items-center mt-5 transition-transform hover:translate-x-2">
              <AiOutlineUserAdd size={26} />
              <span className="hidden nav-item-name">REGISTER</span>
            </Link>
          </li>
        </ul>
      )}
    </div>
  );
};

export default Navigation;
 