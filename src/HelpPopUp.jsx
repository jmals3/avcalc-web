import React, {useState} from 'react';
import {FaCreditCard, FaTimes, FaUser} from "react-icons/fa";
import './PopUp.css';

const HelpPopUp = ({closeHelp}) => {

    return (
        <div className="pop-up">
            <div className="pop-up-header">
                <h2>Help</h2>
                <button className="pop-up-close-btn" onClick={closeHelp}><FaTimes/></button>
            </div>
            <div className="pop-up-body">
                <div className="pop-up-sidebar">
                    <p>Send a message to the support team.</p>
                </div>
                <div className="pop-up-content">
                    <div style={{height: '100%', width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}>
                        <input style={{height: '20px'}} type="text" placeholder="Subject"/>
                        <textarea style={{height: '30vh'}} placeholder="Message"/>
                        <button style={{height: '40px'}}>Send</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HelpPopUp;