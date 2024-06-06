import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Post from '../../components/post/Post';
import Header from '../../components/headers/Header';
import './home.css';

function HomePage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/posts/get-all');
        console.log('API Response:', response.data); // API yanıtını konsola yazdır
        setPosts(response.data);
      } catch (err) {
        console.error('Error fetching posts:', err.response); // Hata ayrıntılarını konsola yazdır
        setError('Gönderiler yüklenirken bir hata oluştu.');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="homepage">
      <Header />

      {loading ? (
        <p>Gönderiler yükleniyor...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <div className="feed-section">
          {posts.map((post) => (
            <Post key={post._id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}

export default HomePage;
