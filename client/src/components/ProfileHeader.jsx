import React from 'react';

function ProfileHeader({ profile }) {
  return (
    <div className="profile-header">
      <img src={profile.profilePicture} alt="Profil Resmi" className="profile-picture" />
      <div className="profile-info">
        <h2>{profile.username}</h2>
        <p>{profile.fullName}</p>
        <p>{profile.bio}</p>
      </div>
    </div>
  );
}

export default ProfileHeader;
