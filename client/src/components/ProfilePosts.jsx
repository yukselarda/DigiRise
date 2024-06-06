import React from 'react';
import PostItem from './PostItem';

function ProfilePosts({ posts }) {
  return (
    <div className="profile-posts">
      {posts.map((post) => (
        <PostItem key={post._id} post={post} />
      ))}
    </div>
  );
}

export default ProfilePosts;
