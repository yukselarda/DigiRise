import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './post.css';
import Cookies from 'js-cookie';

function CreatePostPage() {
  const [comment, setComment] = useState('');
  const [image, setImage] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Cookie'den kullanıcı bilgilerini al
    const userData = Cookies.get('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!user) {
      toast.error('Gönderi paylaşmak için lütfen oturum açın.');
      return;
    }

    const formData = new FormData();
    formData.append('comment', comment);
    formData.append('img', image);
    formData.append('userId', user._id);

    try {
      const response = await axios.post('http://localhost:5000/api/posts/add', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${user.token}` 
        }
      });

      if (response.status === 201) {
        toast.success('Gönderi başarıyla paylaşıldı!');
        setComment('');
        setImage(null);
      } else {
        toast.error('Gönderi paylaşılırken bir hata oluştu.');
      }
    } catch (error) {
      console.error('Gönderim hatası:', error);
      toast.error('Gönderi paylaşılırken bir hata oluştu.');
    }
  };

  return (
    <div className="post-page">
      <form onSubmit={handleSubmit} className="post-form">
        <textarea
          placeholder="Yorum yaz..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="description-input"
          required
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="image-input"
          required
        />

        <button type="submit" className="submit-button" disabled={!user}>
          Paylaş
        </button>
      </form>

      {user && <p className="user-info">Paylaşan: {user.username}</p>}

      <ToastContainer />
    </div>
  );
}

export default CreatePostPage;
