import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Post from '../../components/post/Post';
import Header from '../../components/headers/Header';
import './home.css';
import { Puff } from 'react-loader-spinner';

function HomePage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/posts/get-all');
        console.log('API Response:', response.data);
        setPosts(response.data);
      } catch (err) {
        console.error('Error fetching posts:', err.response); 
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
        <div className="loader-container">
          <Puff
            color="#00BFFF"
            height={100}
            width={100}
            timeout={3000}
          />
        </div>

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
