import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchQuery } from '../store/slices/productsSlice';
import { setUser, logout } from '../store/slices/authSlice';
import { toggleModal } from '../store/slices/cartSlice';
import { GOOGLE_CLIENT_ID, isValidGoogleSetup } from '../config/auth';

const Navbar = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const searchQuery = useSelector((state) => state.products.searchQuery);
  const cartItems = useSelector((state) => state.cart.items);
  const [authError, setAuthError] = useState('');

  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  useEffect(() => {
    if (!isValidGoogleSetup()) {
      setAuthError('Google Client ID not configured');
      return;
    }

    const loadGoogleApi = () => {
      window.gapi.load('auth2', () => {
        window.gapi.auth2.init({
          client_id: GOOGLE_CLIENT_ID,
        }).then(() => {
          const auth2 = window.gapi.auth2.getAuthInstance();
          if (auth2.isSignedIn.get()) {
            const googleUser = auth2.currentUser.get();
            handleUserProfile(googleUser);
          }
        }).catch(error => {
          console.error('Error initializing Google Sign-In:', error);
          setAuthError('Failed to initialize Google Sign-In');
        });
      });
    };

    if (window.gapi) {
      loadGoogleApi();
    }
  }, [dispatch]);

  const handleUserProfile = (googleUser) => {
    const profile = googleUser.getBasicProfile();
    dispatch(setUser({
      id: profile.getId(),
      name: profile.getName(),
      email: profile.getEmail(),
      imageUrl: profile.getImageUrl(),
    }));
    setAuthError('');
  };

  const handleLogin = () => {
    if (!isValidGoogleSetup()) {
      setAuthError('Google Client ID not configured');
      return;
    }

    const auth2 = window.gapi.auth2.getAuthInstance();
    auth2.signIn().then(handleUserProfile).catch(error => {
      console.error('Error signing in:', error);
      setAuthError('Failed to sign in');
    });
  };

  const handleLogout = () => {
    const auth2 = window.gapi.auth2.getAuthInstance();
    auth2.signOut().then(() => {
      dispatch(logout());
      setAuthError('');
    }).catch(error => {
      console.error('Error signing out:', error);
      setAuthError('Failed to sign out');
    });
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
          <button className="cart-button" onClick={() => dispatch(toggleModal())}>
            Cart ({cartItemCount})
          </button>
          {authError && (
            <span className="auth-error">{authError}</span>
          )}
          {isAuthenticated ? (
            <div className="user-info">
              <img src={user.imageUrl} alt={user.name} style={{ width: 32, height: 32, borderRadius: '50%', marginRight: 8 }} />
              <button className="auth-button" onClick={handleLogout}>Logout</button>
            </div>
          ) : (
            <button 
              className="auth-button" 
              onClick={handleLogin}
              disabled={!isValidGoogleSetup()}
            >
              Login with Google
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;