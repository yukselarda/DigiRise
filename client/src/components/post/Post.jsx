import React, { useState, useEffect } from 'react';
import {
  Card, CardMedia, CardContent, CardActions, Avatar, Typography, IconButton, Skeleton, CardHeader
} from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ModeCommentOutlinedIcon from '@mui/icons-material/ModeCommentOutlined';
import ShareIcon from '@mui/icons-material/Share';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { styled } from '@mui/material/styles';
import CommentModal from './CommentModal';
import { Link } from 'react-router-dom';

const PostCard = styled(Card)(({ theme }) => ({
  background: 'linear-gradient(45deg, #2C3E50, #1E1F29)',
  backgroundSize: '400% 400%',
  animation: 'gradientAnimation 7s ease infinite',
  borderRadius: '12px',
  boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
  overflow: 'hidden',
  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  marginBottom: '20px',
  maxWidth: '600px',
  width: '100%',
  marginLeft: 'auto',
  marginRight: 'auto',
  '&:hover': {
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)',
  },
}));

const PostUsername = styled(Link)(({ theme }) => ({
  color: '#1abc9c',
  textDecoration: 'none',
  '&:hover': {
    textDecoration: 'underline',
  },
}));

const CardActionsStyled = styled(CardActions)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
}));

const IconButtonStyled = styled(IconButton)(({ theme }) => ({
  color: '#bdc3c7',
  '&:hover': {
    color: '#1abc9c',
  },
}));

const BodyText = styled(Typography)(({ theme }) => ({
  color: '#ecf0f1',
}));

const SubheaderText = styled(Typography)(({ theme }) => ({
  color: '#bdc3c7',
}));

const gradientAnimation = {
  '0%': {
    backgroundPosition: '0% 50%',
  },
  '50%': {
    backgroundPosition: '100% 50%',
  },
  '100%': {
    backgroundPosition: '0% 50%',
  },
};

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
    <PostCard>
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
        action={
          <IconButtonStyled aria-label="settings">
            <MoreVertIcon />
          </IconButtonStyled>
        }
        title={
          isLoading || !post.userId ? (
            <Skeleton variant="text" width={150} />
          ) : (
            <PostUsername to={`/user/${post.userId.username}`}>
              {post.username}
            </PostUsername>
          )
        }
        subheader={
          isLoading ? (
            <Skeleton variant="text" width={200} />
          ) : (
            <SubheaderText variant="body2">
              {new Date(post.createdAt).toLocaleDateString()}
            </SubheaderText>
          )
        }
      />

      {isLoading ? (
        <Skeleton variant="rectangular" height={400} />
      ) : (
        <CardMedia
          component="img"
          height="400"
          image={`http://localhost:5000/${post.img}`}
          alt="post-img"
        />
      )}

      <CardActionsStyled disableSpacing>
        <IconButtonStyled aria-label="add to favorites">
          <FavoriteBorderIcon />
        </IconButtonStyled>
        <IconButtonStyled aria-label="comment" onClick={handleCommentClick}>
          <ModeCommentOutlinedIcon />
        </IconButtonStyled>
        <IconButtonStyled aria-label="share">
          <ShareIcon />
        </IconButtonStyled>
      </CardActionsStyled>

      <CardContent>
        {isLoading ? (
          <Skeleton variant="text" />
        ) : (
          <BodyText variant="body1">
            {post.comment}
          </BodyText>
        )}
      </CardContent>

      <CommentModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleCommentSubmit}
      />
    </PostCard>
  );
}

export default Post;
