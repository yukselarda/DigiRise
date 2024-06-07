import React from 'react';
import { Link } from 'react-router-dom'; 
import './Header.css';

function Header() {
    return (
        <header className="header">
            <div className="header__logo">
                <h1>DigiRise</h1>
            </div>
            <div className="header__icons">
                <ul>
                    <li>
                        <Link to="/home">
                            <i className="fas fa-home"></i> Anasayfa
                        </Link>
                    </li>
                    <li>
                        <Link to="/search">
                            <i className="fas fa-search"></i> Ara
                        </Link>
                    </li>
                    <li>
                        <Link to="">
                            <i className="fas fa-compass"></i> Keşfet
                        </Link>
                    </li>
                    <li>
                        <Link to="">
                            <i className="fas fa-envelope"></i> Mesajlar
                        </Link>
                    </li>
                    <li>
                        <Link to="">
                            <i className="fas fa-bell"></i> Bildirimler
                        </Link>
                    </li>
                    <li>
                        <Link to="/post">
                            <i className="fas fa-plus-square"></i> Oluştur
                        </Link>
                    </li>
                    <li>
                        <Link to="">
                            <i className="fas fa-user"></i> Profil
                        </Link>
                    </li>
                    <li>
                        <Link to="">
                            <i className="fas fa-ellipsis-h"></i> Ayarlar
                        </Link>
                    </li>

                </ul>
            </div>
        </header>
    );
}

export default Header;
