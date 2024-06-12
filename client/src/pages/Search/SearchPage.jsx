import React, { useState } from 'react';
import axios from 'axios';
import Header from '../../components/headers/Header';
import AllUsers from '../../components/User/AllUsers';
import { Puff } from 'react-loader-spinner';
import UserCard from '../../components/User/UserCard';
import './search.css';

const SearchPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleChange = (event) => {
console.log("test")

        setSearchTerm(event.target.value);
    };

    const handleSearch = () => {
        setLoading(true);
        console.log(`Searching for: ${searchTerm}`);
        axios.get(`http://localhost:5000/api/users/get-by-username?username=${searchTerm}`)
            .then(response => {
                
                console.log('API response:', response);
                const data = response.data;
                const results = Array.isArray(data) ? data : [data];
                setSearchResults(results);
                console.log('Search results:', results);
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

            {loading && (
                <div className="loader-container">
                    <Puff
                        radius={1}
                        color="#00BFFF"
                        height={100}
                        width={100}
                        timeout={3000} ariaLabel="puff-loading"
                        visible={true}
                    />
                </div>
            )}

            <div className="search-results">
                {searchResults.length === 0 && !loading && searchTerm !== '' && (
                    <p className='user_none'>Kullanıcı Bulunamadı</p>
                )}
                {searchResults.map(user => (
                    <UserCard key={user.id} user={user} />
                ))}
            </div>

            <AllUsers />

        </div>
    );
};

export default SearchPage;
