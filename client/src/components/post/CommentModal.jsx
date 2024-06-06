import React from 'react';
import "./post.css";

function CommentModal({ isOpen, onClose, onSubmit }) {
  const [comment, setComment] = React.useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(comment);
    setComment('');
    onClose();
  };

  if (!isOpen) {
    return null;
  }

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
