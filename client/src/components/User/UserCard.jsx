import React from 'react';
import './UserCard.css';

const UserCard = ({ user }) => {
    return (
        <div className="user-card">
            <div className="user-card-image-container">
                <img src={`http://localhost:5000/${user.img}`} alt={user.username} className="user-card-image"/>
            </div>
            <div className="user-card-body">
                <h5 className="user-card-title">{user.username}</h5>
            </div>
        </div>
    );
};

export default UserCard;
