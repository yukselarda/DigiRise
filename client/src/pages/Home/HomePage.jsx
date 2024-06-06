import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Post from '../../components/post/Post';
import Header from '../../components/headers/Header';
import './home.css';

function HomePage() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/posts/get-all');
        setPosts(response.data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="homepage">
       <Header />
      {/* <div className="profile-section">
        <div className="profile-info">
          <img className="profile-pic" src="https://via.placeholder.com/150" alt="Profile" />
          <div className="profile-details">
            <h2>Username</h2>
            <p>Bio: A short description about the user.</p>
          </div>
        </div>
      </div> */}
      <div className="feed-section">
        {posts.map((post) => (
          <Post key={post._id} post={post} />
        ))}
      </div>
    </div>
  );
}

export default HomePage;
