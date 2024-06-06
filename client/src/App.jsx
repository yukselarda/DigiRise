import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/Login/LoginPage';
import SingupPage from './pages/singup/SingupPage';
import HomePage from './pages/Home/HomePage';
import PostPage from './pages/post/CreatePostPage'
import UserProfilePage from './pages/profilePage/UserProfilePage'
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<LoginPage />}/>
        <Route path="/" element={<SingupPage />} />
        <Route path="/home" element={<HomePage />}/>
        <Route path="/post" element={<PostPage />}/>
        <Route path="/profile" element={<UserProfilePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
