import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Card, CardMedia, CardContent, CardActions, Avatar, Typography, IconButton, Skeleton, CardHeader
} from '@mui/material';
import ModeCommentOutlinedIcon from '@mui/icons-material/ModeCommentOutlined';
import ShareIcon from '@mui/icons-material/Share';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { styled } from '@mui/material/styles';
import CommentModal from './CommentModal';
import { Link } from 'react-router-dom';
import SharePopup from './SharePopup';

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
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [comments, setComments] = useState([]);
  const [isShareOpen, setIsShareOpen] = useState(false);

  const handleCommentClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleCommentSubmit = async (comment) => {
    try {
      const response = await axios.post(`http://localhost:5000/api/comments/${post._id}`, { comment });
      console.log('Yorum gönderildi:', response.data);
      fetchComments();
    } catch (error) {
      console.error('Yorum gönderme hatası:', error);
    }
  };

  const fetchLikes = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/posts/${post._id}/likes`);
      setLiked(response.data.liked);
      setLikeCount(response.data.likeCount);
    } catch (error) {
      console.error('Beğeni bilgisi alınamadı:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/comments/${post._id}`);
      setComments(response.data);
    } catch (error) {
      console.error('Yorumlar alınamadı:', error);
    }
  };

  const handleLikeClick = async () => {
    try {
      const response = await axios.post(`http://localhost:5000/api/posts/${post._id}/like`, { userId: post.userId });
      setLiked(response.data.liked);
      setLikeCount(response.data.likeCount);
    } catch (error) {
      console.error('Beğeni işlemi hatası:', error);
    }
  };

  const handleShareClick = () => {
    setIsShareOpen(true);
  };

  useEffect(() => {
    fetchLikes();
    fetchComments();
  }, []);

  return (
    <PostCard>
      <CardHeader
        avatar={
          loading || !post.userId || !post.userId.img ? (
            <Skeleton variant="circular" width={40} height={40} />
          ) : (
            <Avatar
              src={`http://localhost:5000/${post.userId.img}`}
              alt={post.userId.username}
            />
          )
        }
        action={
          <IconButtonStyled aria-label="settings">
            <MoreVertIcon />
          </IconButtonStyled>
        }
        title={
          loading || !post.userId ? (
            <Skeleton variant="text" width={150} />
          ) : (
            <PostUsername to={`/user/${post.userId.username}`}>
              {post.userId.username}
            </PostUsername>
          )
        }
        subheader={
          loading ? (
            <Skeleton variant="text" width={200} />
          ) : (
            <SubheaderText variant="body2">
              {new Date(post.createdAt).toLocaleDateString()}
            </SubheaderText>
          )
        }
      />

      {loading ? (
        <Skeleton variant="rectangular" height={400} />
      ) : (
        <CardMedia
          component="img"
          height="400"
          image={`http://localhost:5000/uploads/${post.img}`}
          alt="post-img"
        />
      )}

      <CardActionsStyled disableSpacing>
        <IconButtonStyled aria-label="comment" onClick={handleCommentClick}>
          <ModeCommentOutlinedIcon />
        </IconButtonStyled>

        <IconButtonStyled aria-label="share" onClick={handleShareClick}>
          <ShareIcon />
        </IconButtonStyled>

        <IconButtonStyled aria-label="like" onClick={handleLikeClick}>
          <FavoriteIcon color={liked ? 'error' : 'inherit'} />
          <Typography className='color-white' variant="body2" color="textSecondary" component="span">
            {likeCount}
          </Typography>
        </IconButtonStyled>
      </CardActionsStyled>

      <CardContent>
        {loading ? (
          <Skeleton variant="text" />
        ) : (
          <>
            <BodyText variant="body1">
              {post.comment}
            </BodyText>

            <div style={{ marginTop: '10px' }}>
              {comments.map((comment) => (
                <div key={comment._id} style={{ marginBottom: '5px' }}>
                  <Typography variant="body2" style={{ color: '#bdc3c7' }}>
                    <Link to={`/user/${comment.userId.username}`} style={{ color: '#1abc9c', textDecoration: 'none' }}>
                      {comment.userId.username}
                    </Link>
                    : {comment.text}
                  </Typography>
                </div>
              ))}
            </div>
          </>
        )}
      </CardContent>

      <CommentModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        postId={post._id}
        onSubmit={handleCommentSubmit}
      />

      {isShareOpen && (
        <SharePopup onClose={() => setIsShareOpen(false)} />
      )}
    </PostCard>
  );
}

export default Post;
