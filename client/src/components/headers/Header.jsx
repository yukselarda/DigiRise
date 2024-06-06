import React from 'react';
import './Header.css';

function Header() {
    return (
        <header className="header">
            <div className="header__logo">
                <h1>DigiRise</h1>
            </div>
            <div className="header__search">
                <input type="text" placeholder="Search" />
            </div>

            <div className="header__icons">
                <ul>
                    <li>
                        <a href="">Anasayfa</a>
                    </li>
                    <li>
                        <a href="">Ara</a>
                    </li>
                    <li>
                        <a href="">Profil</a>
                    </li>
                    <li>
                        <a href="">Daha Fazla</a>
                    </li>
                </ul>
            </div>
        </header>
    );
}

export default Header;
