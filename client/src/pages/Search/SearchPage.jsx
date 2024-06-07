import React, { useState } from 'react';
import axios from 'axios';
import Header from '../../components/headers/Header';
import AllUsers from '../../components/User/AllUsers';
import './search.css';

const SearchPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleSearch = () => {
        setLoading(true);
        axios.get(`http://localhost:5000/api/users/get-by-username?username=${searchTerm}`)
            .then(response => {
                setSearchResults(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching search results:', error);
                setLoading(false);
            });
    };

    return (
        <div className="search-page">
            <Header />

            <div className="search-container">
                <input
                    type="text"
                    className="search-input"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={handleChange}
                />
                <button className="search-button" onClick={handleSearch}>Search</button>
            </div>

            {loading && <p>Loading...</p>}

            <div className="search-results">
                {searchResults.map(user => (
                    <div key={user.id} className="user-card">
                        <img src={`http://localhost:5000/${user.img}`} alt={user.username} />
                        <p>{user.username}</p>
                    </div>
                ))}
            </div>
            <AllUsers />
        </div>
    );
};

export default SearchPage;
