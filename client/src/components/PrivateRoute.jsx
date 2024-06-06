import React from 'react';
import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';

function PrivateRoute({ children }) {
    const token = Cookies.get('userToken');
    if (!token) {
        return <Navigate to="/" />;
    }
    return children;
}

export default PrivateRoute;
