import React, { useState } from 'react';
import axios from 'axios';
import { useSpring, animated } from '@react-spring/web';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate, Link } from "react-router-dom";
import Cookies from 'js-cookie';
import "./singup.css"

function SingupPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/auth/', {
        username,
        password,
      });
      console.log(response.data);
      
      Cookies.set('user', JSON.stringify(response.data));

      toast.success('Başarıyla Giriş Yapıld');
      navigate("/home");
    } catch (error) {
      console.error(error);
      if (error.response && error.response.data && error.response.data.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error('Kayıt olurken hata oluştu');
      }
    }
  };

  const fadeIn = useSpring({
    from: { opacity: 0, transform: 'translateY(-20px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
    config: { tension: 200, friction: 20 }
  });

  return (
    <div className="App">
      <animated.div style={fadeIn} className="login-container">
        <h2>DigiRise</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Kullanıcı adı"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Şifre"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Giriş Yap</button>
        </form>
        <div className="alternative">
          Hesabın yok mu? <Link to="/register">Kayıt Ol</Link>
        </div>
      </animated.div>
      <ToastContainer />
    </div>
  );
}

export default SingupPage;
