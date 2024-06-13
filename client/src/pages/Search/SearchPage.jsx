import React, { useState, useEffect } from 'react';
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
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

    useEffect(() => {
        const timerId = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 500); // 500 ms debounce

        return () => {
            clearTimeout(timerId);
        };
    }, [searchTerm]);

    useEffect(() => {
        if (debouncedSearchTerm) {
            const cache = JSON.parse(sessionStorage.getItem('searchCache')) || {};
            if (cache[debouncedSearchTerm]) {
                setSearchResults(cache[debouncedSearchTerm]);
            } else {
                setLoading(true);
                console.log(`Searching for: ${debouncedSearchTerm}`);
                axios.get(`http://localhost:5000/api/users/get-by-username?username=${debouncedSearchTerm}`)
                    .then(response => {
                        console.log('API response:', response);
                        const data = response.data;
                        const results = Array.isArray(data) ? data : [data];
                        setSearchResults(results);
                        cache[debouncedSearchTerm] = results;
                        sessionStorage.setItem('searchCache', JSON.stringify(cache));
                        console.log('Search results:', results);
                        setLoading(false);
                    })
                    .catch(error => {
                        console.error('Error fetching search results:', error);
                        setLoading(false);
                    });
            }
        } else {
            setSearchResults([]);
        }
    }, [debouncedSearchTerm]);

    const handleChange = (event) => {
        setSearchTerm(event.target.value);
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
            </div>

            {loading ? (
                <div className="loader-container">
                    <Puff
                        radius={1}
                        color="#00BFFF"
                        height={100}
                        width={100}
                        timeout={3000}
                        ariaLabel="puff-loading"
                        visible={true}
                    />
                </div>
            ) : (
                <div className="search-results">
                    {searchResults.length === 0 && searchTerm !== '' && (
                        <p className='user_none'>Kullanıcı Bulunamadı</p>
                    )}
                    {searchResults.map(user => (
                        <UserCard key={user.id} user={user} />
                    ))}
                </div>
            )}

            <AllUsers />
        </div>
    );
};

export default SearchPage;
