import React, {useState} from 'react';
import {FaBars, FaStar, FaRegStar, FaEllipsisH, FaCog, FaQuestionCircle, FaPlus} from "react-icons/fa";
import './Sidebar.css';
import {api} from "./constants.js";

const Sidebar = ({
                     sessionData,
                     updateSessionData,
                     selectedSession,
                     selectNewSession,
                     openSettings,
                     openHelp,
                     sidebarOpen,
                     toggleSidebar
                 }) => {
    const [showMenuId, setShowMenuId] = useState(false);
    const [menuPosition, setMenuPosition] = useState({top: 0, left: 0});
    const [renameSessionId, setRenameSessionId] = useState(null);

    const selectSession = (session) => {
        const url = `/s/${session.guid}`;
        window.history.pushState(session, '', url);
        selectNewSession(session);
    }

    const handleEllipsisClick = (event, id) => {
        event.stopPropagation();
        const rect = event.target.getBoundingClientRect();
        setMenuPosition({top: rect.top + window.scrollY, left: rect.left + rect.width + 15 + window.scrollX});
        setShowMenuId(showMenuId !== id ? id : null);
    }

    const handleMenuClose = () => {
        setShowMenuId(null);
    }

    const createNewSession = () => {
        const currentDateTime = new Date().toLocaleString();

        fetch(api + '/session', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ dateTime: currentDateTime })
        })
            .then(response => {
                if (!response.ok) {
                    console.error('Session creation failed');
                    throw new Error('Session creation failed');
                }
                return response.json();
            })
            .then(data => {
                updateSessionData([data, ...sessionData]);
                const url = `/s/${data.guid}`;
                window.history.pushState(data, '', url);
                selectNewSession(data);
            })
            .catch(error => console.error('Error:', error));
    }

    const renameSession = (session) => {
        setRenameSessionId(session.guid);
    }

    const updateSession = (guid, updates) => {
        fetch(api + '/session/' + guid, {
            method: 'PATCH',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updates)
        })
            .then(response => response.json())
            .then(data => {
                const updatedSessionData = sessionData.map(s => {
                    if (s.guid === guid) {
                        return data;
                    }
                    return s;
                });
                updateSessionData(updatedSessionData);
            })
            .catch(error => console.error('Error:', error));
    }

    const handleSessionNameChange = (session, e) => {
        if (e.key === 'Escape') {
            setRenameSessionId(null);
        } else if (e.key === 'Enter') {
            updateSession(session.guid, {name: e.target.value});
            setRenameSessionId(null);
        } else {
            const updatedSessionData = sessionData.map(s => {
                if (s.guid === session.guid) {
                    s.name = e.target.value;
                }
                return s;
            });
            updateSessionData(updatedSessionData);
            if (session.guid === selectedSession.guid) {
                selectNewSession({...selectedSession, name: e.target.value});
            }
        }
    }

    const handleRenameClose = () => {
        setRenameSessionId(null);
    }

    const cloneSession = (session) => {
        fetch(api + '/session/' + session.guid + '/clone', {
            method: 'POST',
            credentials: 'include',
        })
            .then(response => response.json())
            .then(data => {
                updateSessionData([data, ...sessionData]);
            })
            .catch(error => console.error('Error:', error));
    }

    const deleteSession = (session) => {
        const confirmDelete = window.confirm("Are you sure you want to delete?");
        if (confirmDelete) {
            fetch(api + '/session/' + session.guid, {
                method: 'DELETE',
                credentials: 'include',
            })
                .then(response => {
                    if (response.ok) {
                        console.log('Session deleted');
                        const updatedSessionData = sessionData.filter(s => s.guid !== session.guid);
                        updateSessionData(updatedSessionData);
                    } else {
                        console.error('Session delete failed');
                    }
                })
                .catch(error => console.error('Error:', error));
        }
    }

    if (sidebarOpen) {
        return (
            <div className="sidebar">
                <div className="sidebar-top">
                    <button onClick={toggleSidebar} className="sidebar-toggle">
                        <FaBars className="logo"/>
                    </button>
                    <button className="new-model-button" onClick={() => createNewSession()}>
                        <div className="new-model-button-text">
                            <span>+</span>
                            <span>New Model</span>
                        </div>
                    </button>
                    <div className="sessions">
                        <table>
                            <tbody>
                            {sessionData.map((session, index) => {
                                return (
                                    <tr key={index}
                                        className={`session ${selectedSession.guid === session.guid ? 'selected-session' : ''}`}
                                        onClick={() => selectSession(session)}>
                                        <td className="session-star">
                                            {session.starred ? <FaStar/> : <FaRegStar/>}
                                        </td>
                                        <td className="session-name">
                                            {renameSessionId === session.guid ?
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
                                        <td className={`session-ellipsis ${showMenuId !== session.guid && 'hidden'}`}
                                            onClick={(e) => handleEllipsisClick(e, session.guid)}>
                                            <FaEllipsisH/>
                                            {showMenuId === session.guid && (
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
                                                            <li onClick={() => updateSession({starred: !session.starred})}>{session.starred ? 'Unstar' : 'Star'}</li>
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
                    </div>
                </div>
                <nav className="nav">
                    <div className="nav-bottom">
                        <hr/>
                        <ul className="nav-list">
                            <li className="nav-item" onClick={() => openSettings('Account')}>
                                <FaCog className="icon"/>
                                Settings
                            </li>
                            <li className="nav-item" onClick={() => openHelp()}>
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
                                onClick={() => openSettings('Account')}>
                                <FaCog style={{marginLeft: '12px'}}/>
                            </li>
                            <li className="nav-item"
                                onClick={() => openHelp()}>
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