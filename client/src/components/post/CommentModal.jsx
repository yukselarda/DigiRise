import React from 'react';
import './post.css';
import axios from 'axios';

function CommentModal({ isOpen, onClose, postId, onSubmit }) {
  const [comment, setComment] = React.useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.post(`http://localhost:5000/api/comments/${postId}`, { comment });
      if (!response.data) {
        throw new Error('Yorum gönderilemedi.');
      }
      setComment('');
      onClose();
      onSubmit();
    } catch (error) {
      console.error('Yorum gönderme hatası:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Yorum Yap</h2>
          <span className="close" onClick={onClose}>&times;</span>
        </div>
        <div className="modal-body">
          <form onSubmit={handleSubmit}>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Yorumunuzu yazın..."
              required
              style={{ width: '100%', height: '100px' }}
            />
            <div className="modal-footer">
              <button type="submit" style={{ marginRight: '10px' }}>Gönder</button>
              <button type="button" onClick={onClose}>İptal</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CommentModal;
