import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import './Allusers.css';

const AllUsers = () => {

    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState([]);
    const location = useLocation();

    useEffect(() => {
        if (location.pathname === '/search') {
            fetchUsers();
        }
    }, [location.pathname]);

    const fetchUsers = () => {
        setLoading(true);
        axios.get('http://localhost:5000/api/users/get-all')
            .then(response => {
                const shuffledUsers = shuffleArray(response.data);
                setUsers(shuffledUsers);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching all users:', error);
                setLoading(false);
            });
    };


    const shuffleArray = (array) => {
        let currentIndex = array.length, randomIndex;

        while (currentIndex !== 0) {

            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
            [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
        }

        return array;
    };

    return (
        <div className="all-users-container">
            <div className="random-users">
                {users.map(user => (
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
