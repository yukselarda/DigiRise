import React, { useState } from 'react';
import {
  Card, CardMedia, CardContent, CardActions, Avatar, Typography, Button, IconButton, Modal,CardHeader} from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ModeCommentOutlinedIcon from '@mui/icons-material/ModeCommentOutlined';
import CommentModal from './CommentModal';
import { Link } from 'react-router-dom';
import './post.css'; // Your existing Post.css (updated below)


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
    <Card className="post-card">
      <CardHeader
        avatar={<Avatar src="path-to-profile-picture.jpg" />}
        title={<Link to={`/user/${post.userId}`}>{post.username}</Link>}
      />
      <CardMedia 
      className='post-image'
        component="img"
        height="auto"
        image={`http://localhost:5000/${post.img}`}
        alt="post-img"
      />
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          {post.comment}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <IconButton aria-label="add to favorites">
          <FavoriteBorderIcon />
        </IconButton>
        <IconButton aria-label="comment" onClick={handleCommentClick}>
          <ModeCommentOutlinedIcon />
        </IconButton>
      </CardActions>

      <CommentModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleCommentSubmit}
      />
    </Card>
  );
}

export default Post;
