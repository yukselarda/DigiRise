import React, { useState } from 'react';
import "./post.css";
import CommentModal from './CommentModal';
import { Link } from 'react-router-dom';

function Post({ post }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCommentClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleCommentSubmit = (comment) => {
    console.log('Yorum gönderildi:', comment);
  };

  return (
    <div className="post-card">
      <div className="post-header">
        <img src="path-to-profile-picture.jpg" alt="profile" />
        <h3>
          <Link to={`/user/${post.userId}`}>
            {post.username}
          </Link>
        </h3>
      </div>
      <img className="post-image" src={`http://localhost:5000/${post.img}`} alt="post-img" />
      <div className="post-details">
        <p>{post.comment}</p>
      </div>
      <div className="post-footer">
        <button>❤️ Beğen</button>
        <button onClick={handleCommentClick}>💬 Yorum Yap</button>
      </div>
      <CommentModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleCommentSubmit}
      />
    </div>
  );
}

export default Post;
