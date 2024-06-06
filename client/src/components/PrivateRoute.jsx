import React from 'react';
import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';

function PrivateRoute({ children }) {
  const userCookie = Cookies.get('user'); 

  let token;
  if (userCookie) {
    try {
      const user = JSON.parse(decodeURIComponent(userCookie));
      token = user && user._id;
    } catch (e) {
      console.error('Error parsing user cookie:', e);
    }
  }

  if (!token) {
    return <Navigate to="/" />;
  }

  return children;
}

export default PrivateRoute;
