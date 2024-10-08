import React, {useState} from 'react';
import { IoMdNotificationsOutline } from 'react-icons/io';
import { CgProfile } from 'react-icons/cg';
import './Header.css';
import {api} from "./constants.js";
import {logoutApi} from "./api/auth.js";

const Header = ({user, updateUser, sidebarOpen, openSettings}) => {
    const [showUserMenu, setShowUserMenu] = useState(false);

    const handleLogout = async () => {
        const success = await logoutApi();
        if (success) {
            updateUser(null);
        }
    }

    return (
        <header className={"header" + (sidebarOpen ? '' : ' expanded')}>
            <div className="header-title">AV Calc</div>
            <div className="header-actions">
                <button className="header-icon-button">
                    <IoMdNotificationsOutline className="header-icon"/>
                </button>
                <button className="header-icon-button" onClick={() => setShowUserMenu(true)}>
                    <CgProfile className="header-icon"/>
                </button>
                {showUserMenu && (
                    <div
                        className="menu-overlay"
                        onClick={() => setShowUserMenu(false)}
                    >
                        <div
                            className="menu"
                            style={{top: '50px', right: '10px'}}
                            onBlur={() => setShowUserMenu(false)}
                            tabIndex="0"
                        >
                            <ul>
                                <li onClick={() => openSettings('Account')}>{user?.username ?? ''}</li>
                                <li onClick={() => openSettings('Billing')} style={{borderBottom: '1px solid white'}}>Billing</li>
                                <li onClick={() => handleLogout}>Log Out</li>
                            </ul>
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;
