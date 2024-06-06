import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/Login/LoginPage';
import SignupPage from './pages/singup/SingupPage';
import HomePage from './pages/Home/HomePage';
import PostPage from './pages/post/CreatePostPage';
import UserProfilePage from './pages/profilePage/UserProfilePage';
import PrivateRoute from './components/PrivateRoute'; // Import the PrivateRoute component
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<LoginPage />} />
        <Route path="/" element={<SignupPage />} />
        
        <Route 
          path="/home" 
          element={
            <PrivateRoute>
              <HomePage />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/post" 
          element={
            <PrivateRoute>
              <PostPage />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/profile" 
          element={
            <PrivateRoute>
              <UserProfilePage />
            </PrivateRoute>
          } 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
