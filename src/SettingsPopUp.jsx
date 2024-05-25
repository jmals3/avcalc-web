import React, {useState} from 'react';
import {FaCreditCard, FaTimes, FaUser} from "react-icons/fa";
import './PopUp.css';

const SettingsPopUp = ({closeSettings}) => {
    const [selectedTab, setSelectedTab] = useState('Account');

    const accountSettings = (
        // TODO: implement account settings
        <div className="pop-up-content">
            <p>Account settings</p>
            <p>Plan (free) (upgrade)</p>
            <p>Name (Jeff) (update)</p>
            <p>Email (jeff@email.com) (update)</p>
            <p>Password (********) (update)</p>
            <p>Company (super corp) (update)</p>
            <button>Suspend Account</button>
            <button>Delete Account</button>
        </div>
    );

    const billingSettings = (
        // TODO: implement billing settings
        <div className="pop-up-content">
            <p>Billing settings</p>
            <p>Plan (free) (upgrade)</p>
            <p>Card Type (amex)</p>
            <p>Card number</p>
            <p>Expiration date</p>
            <p>CVV</p>
            <button>Update Card</button>
        </div>
    );

    const tabContent = () => {
        if (selectedTab === 'Account') {
            return accountSettings;
        } else if (selectedTab === 'Billing') {
            return billingSettings;
        }
    }

    return (
        <div className="pop-up">
            <div className="pop-up-header">
                <h2>Settings</h2>
                <button className="pop-up-close-btn" onClick={closeSettings}><FaTimes/></button>
            </div>
            <div className="pop-up-body">
                <div className="pop-up-sidebar">
                    <nav className="nav">
                        <ul className="nav-list">
                            <li className={"nav-item " + (selectedTab === 'Account' ? 'selected' : '')}
                                onClick={() => setSelectedTab('Account')}>
                                <FaUser className="icon"/>
                                Account
                            </li>
                            <li className={"nav-item " + (selectedTab === 'Billing' ? 'selected' : '')}
                                onClick={() => setSelectedTab('Billing')}>
                                <FaCreditCard className="icon"/>
                                Billing
                            </li>
                        </ul>
                    </nav>
                </div>
                {tabContent()}
            </div>
        </div>
    );
};

export default SettingsPopUp;