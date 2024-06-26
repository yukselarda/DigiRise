import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useSpring, animated } from '@react-spring/web';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from '../../Context/Context';
import './index.css'; 

function LoginPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [image, setImage] = useState(null);

  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData();
    formData.append('username', username);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('customername', fullName);
    formData.append('img', image);

    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      toast.success('Kayıt başarılı!');
      login(response.data.user, rememberMe);
      setTimeout(() => {
        setIsLoading(false);
        navigate("/");
      }, 1500); 

    } catch (error) {
      console.error(error);
      if (error.response && error.response.data && error.response.data.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error('Kullanıcı kaydedilirken hata oluştu');
      }
      setIsLoading(false); 
    }
  };

  const fadeIn = useSpring({
    from: { opacity: 0, transform: 'translateY(-20px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
    config: { tension: 200, friction: 20 }
  });

  return (
    <div className="App">
      {isLoading && (
        <div className="overlay">
          <div className="spinner"></div>
        </div>
      )}

      <animated.div style={fadeIn} className="signup-container">
        <h2>DigiRise</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Ad ve Soyad"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Kullanıcı adı"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="E-Mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Şifre"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="image-input"
          />
          <div className="remember-me">
            <input
              type="checkbox"
              id="rememberMe"
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
            />
            <label htmlFor="rememberMe">Beni Hatırla</label>
          </div>
          <button type="submit">Kayıt Ol</button>
        </form>
        <div className="alternative">
          Zaten bir hesabın var mı? <Link to="/">Giriş yap</Link>
        </div>
      </animated.div>

      <ToastContainer position="top-right" /> 
    </div>
  );
}

export default LoginPage;