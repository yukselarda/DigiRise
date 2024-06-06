import React from 'react';

function PostItem({ post }) {
  return (
    <div className="post-item">
      <img src={post.image} alt="Gönderi Resmi" />
      {/* Beğeni, yorum sayısı vb. */}
    </div>
  );
}

export default PostItem;
