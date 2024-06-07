import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './post.css';
import Cookies from 'js-cookie';
import { Avatar } from '@mui/material';
import { Puff } from 'react-loader-spinner';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import Header from '../../components/headers/Header';

function CreatePostPage() {
  const [comment, setComment] = useState('');
  const [image, setImage] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [cropData, setCropData] = useState(null);
  const [cropper, setCropper] = useState(null);
  const [isCropping, setIsCropping] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const userData = Cookies.get('user');
      if (userData) {
        setUser(JSON.parse(userData));
      }
      setIsLoading(false);
    };

    fetchUserData();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!user) {
      toast.error('Gönderi paylaşmak için lütfen oturum açın.');
      return;
    }

    const formData = new FormData();
    formData.append('comment', comment);

    if (cropData) {
      console.log(dataURLtoBlob(cropData))
      formData.append('img', dataURLtoBlob(cropData)); // Crop edilmiş resmi Blob'a dönüştür
    } else if (image) {
      formData.append('img', image);
    } else {
      toast.error('Lütfen bir resim seçin.');
      return;
    }

    formData.append('userId', user._id);
    formData.append('username', user.username);

    try {
      setIsLoading(true);

      const response = await axios.post('http://localhost:5000/api/posts/add', formData, {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });

      if (response.status === 201) {
        // ... (başarılı gönderim işlemleri)
        toast.success('Gönderi başarıyla paylaşıldı!');
        setComment('');
        setImage(null);
        setCropData(null);
      } else {
        toast.error('Gönderi paylaşılırken bir hata oluştu: ' + response.statusText);
      }
    } catch (error) {
      console.error('Gönderim hatası:', error.response ? error.response.data : error);
      toast.error('Gönderi paylaşılırken bir hata oluştu.');
    } finally {
      setIsLoading(false);
    }
  };


  function dataURLtoBlob(dataURL) {
    const arr = dataURL.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  }

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
    setIsCropping(true);
  };

  const getCropData = () => {
    if (cropper !== null) {
      setCropData(cropper.getCroppedCanvas().toDataURL());
      setIsCropping(false);
    }
  };



  return (
    <div className="post-page">

      <Header />

      {isLoading ? (
        <div className="loader-container">
          <Puff color="#00BFFF" height={100} width={100} />
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="post-form">
          <textarea
            placeholder="Yorum yaz..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="description-input"
            required
          />
          <div className="image-section">
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="image-input"
              required
            />
            {isCropping && image && (
              <div>
                <Cropper
                  src={URL.createObjectURL(image)}
                  onInitialized={(instance) => setCropper(instance)}
                  rotatable={true}
                  scalable={true}
                  style={{ height: 400, width: '100%' }}
                />
                <button onClick={getCropData}>Crop Image</button>
              </div>
            )}
          </div>

          <button type="submit" className="submit-button" disabled={!user || isLoading}>
            {isLoading ? (
              <Puff color="#00BFFF" height={24} width={24} />
            ) : (
              'Paylaş'
            )}
          </button>
        </form>
      )}

      {user && (
        <div className="user-info">
          <Avatar src={`http://localhost:5000/${user.img}`} alt={user.username} />
          <span> Paylaşan: {user.username}</span>
        </div>
      )}
      <ToastContainer />
    </div>
  );
}

export default CreatePostPage;
