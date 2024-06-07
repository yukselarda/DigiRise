import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Allusers.css';

const AllUsers = () => {
    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = () => {
        setLoading(true);
        axios.get('http://localhost:5000/api/users/get-all')
            .then(response => {
                setUsers(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching all users:', error);
                setLoading(false);
            });
    };

    const getRandomUsers = () => {
        const shuffledUsers = users.sort(() => 0.5 - Math.random());
        return shuffledUsers.slice(0, 7);
    };

    const randomUsers = getRandomUsers();

    return (
        <div className="all-users-container">
            <div className="random-users">
                {randomUsers.map(user => (
                    <div key={user.id} className="user-card">
                        <img src={`http://localhost:5000/${user.img}`} alt={user.username} />
                        <p>{user.username}</p>
                    </div>
                ))}
            </div>
            {loading && <p>Loading...</p>}
        </div>
    );
};

export default AllUsers;
