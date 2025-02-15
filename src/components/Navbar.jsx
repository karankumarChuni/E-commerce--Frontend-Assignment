import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSearchQuery } from "../store/slices/productsSlice";
import { setUser, logout } from "../store/slices/authSlice";
import { toggleModal } from "../store/slices/cartSlice";
import { GoogleLogin, googleLogout } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode"; // Corrected function name

const Navbar = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const searchQuery = useSelector((state) => state.products.searchQuery);
  const cartItems = useSelector((state) => state.cart.items);
  const [authError, setAuthError] = useState("");

  const cartItemCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  // Load user from localStorage on component mount
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      dispatch(setUser(storedUser));
    }
  }, [dispatch]);

  const handleLoginSuccess = (response) => {
    const decoded = jwtDecode(response.credential); // Fixed function name
    const userData = {
      id: decoded.sub,
      name: decoded.name,
      email: decoded.email,
      imageUrl: decoded.picture,
    };

    // Save user to Redux & localStorage
    dispatch(setUser(userData));
    localStorage.setItem("user", JSON.stringify(userData));
    setAuthError("");
  };

  const handleLoginFailure = () => {
    setAuthError("Failed to sign in");
  };

  const handleLogout = () => {
    googleLogout();
    dispatch(logout());

    // Remove user from localStorage
    localStorage.removeItem("user");
    setAuthError("");
  };

  return (
    <nav className="navbar">
      <div className="container navbar-content">
        <h1>E-Shop</h1>

        <div className="search-bar">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => dispatch(setSearchQuery(e.target.value))}
          />
        </div>

        <div className="auth-section">
          <button
            className="cart-button"
            onClick={() => dispatch(toggleModal())}
          >
            Cart ({cartItemCount})
          </button>
          {authError && <span className="auth-error">{authError}</span>}

          {isAuthenticated ? (
            <div className="user-info">
              <img
                src={user.imageUrl}
                alt={user.name}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  marginRight: 8,
                }}
              />
              <button className="auth-button" onClick={handleLogout}>
                Logout
              </button>
            </div>
          ) : (
            <GoogleLogin
              onSuccess={handleLoginSuccess}
              onError={handleLoginFailure}
            />
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
