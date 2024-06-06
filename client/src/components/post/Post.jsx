import React, { useState, useEffect } from 'react';
import {
  Card, CardMedia, CardContent, CardActions, Avatar, Typography, IconButton, Skeleton, CardHeader
} from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ModeCommentOutlinedIcon from '@mui/icons-material/ModeCommentOutlined';
import CommentModal from './CommentModal';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './post.css'

function Post({ post }) {
  const [isLoading, setIsLoading] = useState(true);
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

  useEffect(() => {
    setIsLoading(true);

    if (post && post.userId) {
      setIsLoading(false);
    } else {
      console.error("Post or userId data is missing:", post);
    }
  }, [post]);



  return (
    <Card className="post-card">
      {/* Image */}
      {isLoading ? (
        <Skeleton variant="rectangular" height={280} />
      ) : (
        <CardMedia
          component="img"
          height="280"
          image={`http://localhost:5000/${post.img}`}
          alt="post-img"
        />
      )}

      <CardHeader
        avatar={
          isLoading || !post.userId || !post.userId.img ? (
            <Skeleton variant="circular" width={40} height={40} />
          ) : (
            <Avatar
              src={`http://localhost:5000/${post.userId.img}`}
              alt={post.username}
            />
          )
        }
        title={
          isLoading || !post.userId ? (
            <Skeleton variant="text" width={150} />
          ) : (
            <Link to={`/user/${post.userId.username}`}>
              {post.username}
            </Link>
          )
        }

        subheader={
          isLoading ? (
            <Skeleton variant="text" width={200} />
          ) : (
            <>
              <Typography variant="body2" color="text.secondary">
                {new Date(post.createdAt).toLocaleDateString()}
              </Typography>
            </>
          )
        }
      />

      {/* Comment */}
      <CardContent>
        {isLoading ? (
          <Skeleton variant="text" />
        ) : (
          <Typography variant="body2" color="text.secondary">
            {post.comment}
          </Typography>
        )}
      </CardContent>

      {/* Action Buttons */}
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
