import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import './update.css';

function UpdateProfilePage() {
    const [formData, setFormData] = useState({
        newUsername: '',
        email: '',
        customername: '',
        password: '',
        verificationCode: '',
        img: null,
    });

    const [user, setUser] = useState(null);
    const [showVerification, setShowVerification] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            const userData = Cookies.get('user');
            if (userData) {
                setUser(JSON.parse(userData));
                setFormData({
                    newUsername: JSON.parse(userData).username,
                    email: JSON.parse(userData).email,
                    customername: JSON.parse(userData).customername,
                    img: JSON.parse(userData).img,
                });
                setSelectedImage(JSON.parse(userData).img);
            }
            setIsLoading(false);
        };

        fetchUserData();
    }, []);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: files ? files[0] : value,
        }));

        if (name === 'img') {
            setSelectedImage(URL.createObjectURL(files[0]));
        }
    };

    const handleVerificationRequest = async () => {
        try {
            await axios.post('http://localhost:5000/api/auth/send-verification-code', {
                username: formData.newUsername || user?.username,
            });
            setShowVerification(true);
        } catch (err) {
            if (err.response && err.response.status === 404) {
                setError('Doğrulama kodu gönderme uç noktası bulunamadı.');
            } else {
                setError('Doğrulama kodu gönderilirken bir hata oluştu: ' + err.message);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const updatedFormData = new FormData();
        for (const key in formData) {
            if (formData[key] !== user[key]) {
                updatedFormData.append(key, formData[key]);
            }
        }

        try {
            setIsLoading(true);

            const response = await axios.put(`http://localhost:5000/api/auth/update/${user.username}`,
                updatedFormData,
                {
                    headers: {
                        'Authorization': `Bearer ${user.token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            if (response.status === 200) {
                toast.success('Profil başarıyla güncellendi!');
                setSuccess(true);
                setError(null);

                const updatedUser = { ...user, ...formData };
                Cookies.set('user', JSON.stringify(updatedUser));
                setUser(updatedUser);
            } else {
                toast.error('Güncelleme sırasında bir hata oluştu.');
                setError(response.data.error || 'Bilinmeyen bir hata oluştu.');
            }
        } catch (error) {
            toast.error('Güncelleme sırasında bir hata oluştu.');
            setError(error.response?.data?.error || 'Bilinmeyen bir hata oluştu.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form className='update-profile-form' onSubmit={handleSubmit}>
            <div className='form-group'>
                <label htmlFor="newUsername">Kullanıcı adı:</label>
                <input
                    type="text"
                    id="newUsername"
                    name="newUsername"
                    value={formData.newUsername}
                    onChange={handleChange}
                />
            </div>

            <div className='form-group'>
                <label htmlFor="email">E-posta:</label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                />
            </div>

            <div className='form-group'>
                <label htmlFor="customername">Ad ve soyad:</label>
                <input
                    type="text"
                    id="customername"
                    name="customername"
                    value={formData.customername}
                    onChange={handleChange}
                />
            </div>

            <div className='form-group'>
                <label htmlFor="password">Yeni Şifre:</label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                />
            </div>

            <div className='form-group'>
                <label htmlFor="img">Profil Resmi:</label>
                <input
                    type="file"
                    id="img"
                    name="img"
                    accept="image/*"
                    onChange={handleChange}
                />
                {selectedImage && <img src={selectedImage} alt="Profile" className="profile-picture" />}
            </div>

            {!showVerification ? (
                <button type="button" onClick={handleVerificationRequest}>
                    Doğrulama Kodu Gönder
                </button>
            ) : (
                <div className='form-group'>
                    <input
                        type="text"
                        name="verificationCode"
                        value={formData.verificationCode}
                        onChange={handleChange}
                        placeholder="Doğrulama Kodu"
                    />
                    <button type="submit">Güncelle</button>
                </div>
            )}

            {error && <p style={{ color: 'red' }}>{error}</p>}
            {success && <p style={{ color: 'green' }}>Profil başarıyla güncellendi!</p>}

        </form>
    );
}

export default UpdateProfilePage;
