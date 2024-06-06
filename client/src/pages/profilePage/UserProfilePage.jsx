import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import ProfileHeader from '../../components/ProfileHeader';
import ProfilePosts from '../../components/ProfilePosts';
import './Profile.css'

function UserProfilePage() {
  const { username } = useParams(); 
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await axios.get(`/api/profile/${username}`);
        setProfileData(response.data);
      } catch (error) {
        console.error('Profil verisi çekme hatası:', error);
      }
    };

    fetchProfileData();
  }, [username]);

  return (
    <div className="app-container">
      {profileData && (
        <>
          <ProfileHeader profile={profileData} />
          <ProfilePosts posts={profileData.posts} />
        </>
      )}
    </div>
  );
}

export default UserProfilePage;