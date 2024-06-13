import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Card, CardMedia, CardContent, CardActions, Avatar, Typography, IconButton, Skeleton, CardHeader
} from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ModeCommentOutlinedIcon from '@mui/icons-material/ModeCommentOutlined';
import ShareIcon from '@mui/icons-material/Share';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { styled } from '@mui/material/styles';
import CommentModal from './CommentModal';
import { Link } from 'react-router-dom';
import { useSnackbar } from 'notistack';


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
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const handleCommentClick = () => {
    setIsModalOpen(true);
    console.log("açıldım")
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    console.log("kapandım");
  };

  const handleCommentSubmit = (comment) => {
    console.log('Yorum gönderildi:', comment);
  };

  useEffect(() => {
    const fetchLikeData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/posts/${post._id}/likes`);
        setLiked(response.data.liked);
        setLikeCount(response.data.likeCount);
      } catch (error) {
        console.error("Beğeni işlemi hatası:", error);
        enqueueSnackbar('Beğeni işlemi başarısız oldu.', { variant: 'error' });
      } finally {
        setLoading(false);
      }
    };
    fetchLikeData();
  }, [post._id, enqueueSnackbar]);

  const handleLikeClick = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const response = await axios.post(`http://localhost:5000/api/posts/${post._id}/like`, null, { withCredentials: true });
      setLiked(response.data.liked);
      setLikeCount(response.data.likeCount);
    } catch (error) {
      console.error("Beğeni işlemi hatası:", error);

      if (error.response) {
        switch (error.response.status) {
          case 401:
            enqueueSnackbar('Oturumunuzun süresi doldu veya geçersiz.', { variant: 'error' });
            break;
          case 404:
            enqueueSnackbar('Gönderi bulunamadı.', { variant: 'error' });
            break;
          default:
            enqueueSnackbar('Beğeni işlemi başarısız oldu.', { variant: 'error' });
        }
      } else {
        enqueueSnackbar('Bir hata oluştu. Lütfen daha sonra tekrar deneyin.', { variant: 'error' });
      }
    } finally {
      setLoading(false);
    }
  };


  return (
    <PostCard>
      <CardHeader
        avatar={
          loading || !post.userId || !post.userId.img ? (
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
          loading || !post.userId ? (
            <Skeleton variant="text" width={150} />
          ) : (
            <PostUsername to={`/user/${post.userId.username}`}>
              {post.username}
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
          image={`http://localhost:5000/${post.img}`}
          alt="post-img"
        />
      )}

      <CardActionsStyled disableSpacing>
        <IconButtonStyled
          aria-label="add to favorites"
          onClick={handleLikeClick}
          disabled={loading}
        >
          {liked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
        </IconButtonStyled>

        {likeCount > 0 && (
          <Typography variant="body2" color="#bdc3c7" marginLeft={1}>
            {likeCount}
          </Typography>
        )}

        <IconButtonStyled aria-label="comment" onClick={handleCommentClick}>
          <ModeCommentOutlinedIcon />
        </IconButtonStyled>

        <IconButtonStyled aria-label="share">
          <ShareIcon />
        </IconButtonStyled>
      </CardActionsStyled>

      <CardContent>
        {loading ? (
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
