import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useSpring, animated } from '@react-spring/web';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './index.css';
import { useNavigate } from "react-router-dom";
import { AuthContext } from '../../Context/Context';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', {
        username,
        email,
        password,
        customername: fullName,
      });
      console.log(response.data);
      toast.success('Kullanıcı başarıyla kaydedildi');
      login(response.data.user, rememberMe); // Kullanıcı ve beni hatırla bilgisini AuthContext'e aktar
      navigate("/home");
    } catch (error) {
      console.error(error);
      if (error.response && error.response.data && error.response.data.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error('Kullanıcı kaydedilirken hata oluştu');
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
          <div className="remember-me"> {/* Beni Hatırla checkbox'ı eklendi */}
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
          Zaten bir hesabın var mı? <a href="/sing-up">Giriş yap</a> 
        </div>
      </animated.div>
      <ToastContainer />
    </div>
  );
}

export default LoginPage;
