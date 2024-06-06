import React, { useState } from 'react';
import axios from 'axios';
import { useSpring, animated } from '@react-spring/web';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom";
import "./singup.css"

function SingupPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/auth/singup', {
        username,
        password,
      });
      console.log(response.data);
      toast.success('Başarıyla kayıt olundu');
      navigate("/login");
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
          Hesabın yok mu? <a href="/">Kayıt Ol</a>
        </div>
      </animated.div>
      <ToastContainer />
    </div>
  );
}

export default SingupPage;
