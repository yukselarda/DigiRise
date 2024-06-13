// SharePopup.jsx

import React from 'react';
import './SharePopup.css';

const SharePopup = ({ onClose, onShare }) => {
  const handleShare = (platform) => {
    onShare(platform);
    onClose();
  };

  return (
    <div className="share-popup">
      <div className="share-popup-content">
        <span className="close" onClick={onClose}>&times;</span>
        <p>Paylaşmak istediğiniz platformu seçin:</p>
        <div className="social-icons">
          <button className="social-icon" onClick={() => handleShare('instagram')}>
            <i className="fa fa-instagram"></i>
          </button>
          <button className="social-icon" onClick={() => handleShare('twitter')}>
            <i className="fa fa-twitter"></i>
          </button>
          <button className="social-icon" onClick={() => handleShare('facebook')}>
            <i className="fa fa-facebook"></i>
          </button>
          <button className="social-icon" onClick={() => handleShare('whatsapp')}>
            <i className="fa fa-whatsapp"></i>
          </button>
        </div>
      </div>
    </div>
  );
}

export default SharePopup;
