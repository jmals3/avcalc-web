import React, {useState} from 'react';
import {FaBars, FaStar, FaRegStar, FaEllipsisH, FaCog, FaQuestionCircle, FaPlus} from "react-icons/fa";
import './Sidebar.css';
import _sessiondata from "./sessiondata.js";

const Sidebar = ({selectedSession, onNavigation}) => {
    const [sessionData, setSessionData] = useState(_sessiondata);
    const [showMenuId, setShowMenuId] = useState(false);
    const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
    const [renameSessionId, setRenameSessionId] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Add this line

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    }

    const handleEllipsisClick = (event, id) => {
        event.stopPropagation();
        const rect = event.target.getBoundingClientRect();
        setMenuPosition({ top: rect.top + window.scrollY, left: rect.left + rect.width + 15 + window.scrollX });
        setShowMenuId(showMenuId !== id ? id : null);
    }

    const handleMenuClose = () => {
        setShowMenuId(null);
    }

    const toggleSessionStar = (session) => {
        const updatedSessionData = sessionData.map(s => {
            if (s.id === session.id) {
                s.starred = !s.starred;
            }
            return s;
        });
        setSessionData(updatedSessionData);
    }

    const renameSession = (session) => {
        setRenameSessionId(session.id);
    }

    const handleSessionNameChange = (session, e) => {
        if (e.key === 'Escape' || e.key === 'Enter') {
            setRenameSessionId(null);
            return;
        }
        const updatedSessionData = sessionData.map(s => {
            if (s.id === session.id) {
                s.name = e.target.value;
            }
            return s;
        });
        setSessionData(updatedSessionData);
    }

    const handleRenameClose = () => {
        setRenameSessionId(null);
    }

    const cloneSession = (session) => {
        const newSession = {...session, id: sessionData.length + 1};
        setSessionData([newSession, ...sessionData]);
    }

    const deleteSession = (session) => {
        const confirmDelete = window.confirm("Are you sure you want to delete?");
        if (confirmDelete) {
            const updatedSessionData = sessionData.filter(s => s.id !== session.id);
            setSessionData(updatedSessionData);
        }
    }

    if (isSidebarOpen) {
        return (
            <div className="sidebar">
                <button onClick={toggleSidebar} className="sidebar-toggle">
                    <FaBars className="logo"/>
                </button>
                <button className="new-model-button">
                    <div className="new-model-button-text">
                        <span>+</span>
                        <span>New Model</span>
                    </div>
                </button>
                <table className="sessions">
                    <tbody>
                    {sessionData.map((session, index) => {
                        return (
                            <tr key={index}
                                className={`session ${selectedSession.id === session.id ? 'selected-session' : ''}`}
                                onClick={() => onNavigation(session)}>
                                <td className="session-star">
                                    {session.starred ? <FaStar/> : <FaRegStar/>}
                                </td>
                                <td className="session-name">
                                    {renameSessionId === session.id ?
                                        <>
                                            <div
                                                className="rename-overlay"
                                                onClick={handleRenameClose}
                                            />
                                            <input
                                                className="session-rename"
                                                value={session.name}
                                                onChange={(e) => handleSessionNameChange(session, e)}
                                                onKeyDown={(e) => handleSessionNameChange(session, e)}
                                                autoFocus
                                            />
                                        </> : session.name}
                                </td>
                                <td className={`session-ellipsis ${showMenuId !== session.id && 'hidden'}`}
                                    onClick={(e) => handleEllipsisClick(e, session.id)}>
                                    <FaEllipsisH/>
                                    {showMenuId === session.id && (
                                        <div
                                            className="menu-overlay"
                                            onClick={handleMenuClose}
                                        >
                                            <div
                                                className="menu"
                                                style={{top: menuPosition.top, left: menuPosition.left}}
                                                onBlur={handleMenuClose}
                                                tabIndex="0"
                                            >
                                                <ul>
                                                    <li onClick={() => toggleSessionStar(session)}>{session.starred ? 'Unstar' : 'Star'}</li>
                                                    <li onClick={() => renameSession(session)}>Rename</li>
                                                    <li onClick={() => cloneSession(session)}>Clone</li>
                                                    <li onClick={() => deleteSession(session)}>Delete</li>
                                                </ul>
                                            </div>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
                <nav className="nav">
                    <div className="nav-bottom">
                        <hr/>
                        <ul className="nav-list">
                            <li className="nav-item" onClick={() => onNavigation({title: 'Settings'})}>
                                <FaCog className="icon"/>
                                Settings
                            </li>
                            <li className="nav-item" onClick={() => onNavigation({title: 'Help'})}>
                                <FaQuestionCircle className="icon"/>
                                Help
                            </li>
                        </ul>
                    </div>
                </nav>
            </div>
        );
    } else {
        return (
            <div className={`sidebar collapsed`}>
                <button onClick={toggleSidebar} className="sidebar-toggle">
                    <FaBars className="logo"/>
                </button>
                <nav className="nav">
                    <div className="nav-bottom">
                        <hr/>
                        <ul className="nav-list">
                            <li className="nav-item"
                                onClick={() => onNavigation({title: 'Settings'})}>
                                <FaCog style={{marginLeft: '12px'}}/>
                            </li>
                            <li className="nav-item"
                                onClick={() => onNavigation({title: 'Help'})}>
                                <FaQuestionCircle style={{marginLeft: '12px'}}/>
                            </li>
                        </ul>
                    </div>
                </nav>
            </div>
        );
    }
};

export default Sidebar;