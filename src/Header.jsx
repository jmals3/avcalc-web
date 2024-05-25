import React from 'react';
import { IoMdNotificationsOutline } from 'react-icons/io';
import { CgProfile } from 'react-icons/cg';
import './Header.css';

const Header = ({sidebarOpen}) => {
    return (
        <header className={"header" + (sidebarOpen ? '' : ' expanded')}>
            <div className="header-title">AV Calc</div>
            <div className="header-actions">
                <IoMdNotificationsOutline className="header-icon" />
                <CgProfile className="header-icon" />
            </div>
        </header>
    );
};

export default Header;
