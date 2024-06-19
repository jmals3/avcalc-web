import React, {useState, useEffect} from 'react';
import {useParams, useNavigate} from "react-router-dom";
import Sidebar from "./Sidebar.jsx";
import Header from "./Header.jsx";
import AVModel from "./AVModel.jsx";
import SettingsPopUp from "./SettingsPopUp.jsx";
import HelpPopUp from "./HelpPopUp.jsx";
import defaultplan from "./defaultplan.js";
import {api} from "./constants.js";
import './App.css';
import {extractUserFromToken} from "./functions.js";


function App({user, updateUser}) {
    const navigate = useNavigate();

    const {sid} = useParams();
    const [sessionData, setSessionData] = useState([]);
    const [planData, setPlanData] = useState(null);
    const [selectedSession, setSelectedSession] = useState(null);
    const [settingsPopUpOpen, setSettingsPopUpOpen] = useState(false);
    const [settingsTab, setSettingsTab] = useState('Account'); // ['Account', 'Billing']
    const [helpPopUpOpen, setHelpPopUpOpen] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [isEditingSessionName, setIsEditingSessionName] = useState(false);
    const [selectedSessionName, setSelectedSessionName] = useState('');

    useEffect(() => {
        if (!user) {
            const tokenUser = extractUserFromToken();
            if (tokenUser) {
                updateUser(tokenUser);
            } else {
                navigate('/authentication/login');
            }
        }
    }, [user]);

    useEffect(() => {
        fetch(api + '/sessions', {
            method: 'GET',
            credentials: 'include'
        })
            .then(response => response.json())
            .then(data => {
                setSessionData(data);
                if (!data || data.length === 0) {
                    setSessionData([]);
                    return;
                }
                if (sid) {
                    const session = data.find(s => s.guid === sid);
                    if (session) {
                        setSelectedSession(session);
                    } else {
                        const session = data[0];
                        setSelectedSession(session);
                        const url = `/s/${session.guid}`;
                        window.history.pushState(session, '', url);
                    }
                } else {
                    const session = data[0];
                    setSelectedSession(session);
                    const url = `/s/${session.guid}`;
                    window.history.pushState(session, '', url);

                }
            })
            .catch(error => console.error('Error:', error));
    }, []);

    useEffect(() => {
        const popStateHandler = (event) => {
            if (event.state) {
                setSelectedSession(event.state);
            }
        };

        window.addEventListener('popstate', popStateHandler);

        return () => {
            window.removeEventListener('popstate', popStateHandler);
        };
    }, []);

    useEffect(() => {
        if (selectedSession) {
            fetch(api + '/session/' + selectedSession.guid + '/plans', {
                method: 'GET',
                credentials: 'include',
            })
                .then(response => response.json())
                .then(data => {
                    setPlanData(data);
                })
                .catch(error => console.error('Error:', error));
            setSelectedSessionName(selectedSession?.name ?? '')
        }
    }, [selectedSession]);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    }

    const openSettings = (tab) => {
        setSettingsTab(tab);
        setSettingsPopUpOpen(true);
    }

    const updateSettingsTab = (tab) => {
        setSettingsTab(tab);
    }

    const closeSettings = () => {
        setSettingsPopUpOpen(false);
    }

    const openHelp = () => {
        setHelpPopUpOpen(true);
    }

    const closeHelp = () => {
        setHelpPopUpOpen(false);
    }

    const updateSessionData = (newData) => {
        setSessionData(newData);
    }

    const selectNewSession = (session) => {
        setSelectedSession(session);
    }

    async function updateSelectedSessionName() {
        const updatedSessionData = sessionData.map(session => {
            if (session.guid === selectedSession.guid) {
                // Update the session name
                return {...session, name: selectedSessionName};
            } else {
                return session;
            }
        });

        setSessionData(updatedSessionData);

        setSelectedSession({...selectedSession, name: selectedSessionName});

        const response = await fetch(api + '/session/' + selectedSession.guid, {
            method: 'PATCH',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({name: selectedSessionName}),
        });

        if (!response.ok) {
            console.error('Error:', response.statusText);
        }
    }

    const updatePlanData = (newPlanData) => {
        setPlanData(newPlanData);
    }

    const addDefaultPlan = () => {
        if (!selectedSession) {
            fetch(api + '/session/' + selectedSession.guid + '/plans', {
                method: 'GET',
                credentials: 'include',
            })
                .then(response => response.json())
                .then(data => {
                    setPlanData(data);
                })
                .catch(error => console.error('Error:', error));
        }
        fetch(api + '/session/' + selectedSession.guid + '/plans', {
            method: 'GET',
            credentials: 'include',
        })
            .then(response => response.json())
            .then(data => {
                setPlanData(data);
            })
            .catch(error => console.error('Error:', error));
        setSelectedSessionName(selectedSession?.name ?? '')
    }

    const openPlanImportPopUp = () => {
        // TODO: implement
        // importPlan(plan); <- this method will handle api call
    }

    const importPlan = (plan) => {
        // TODO: implement
        // clicking the button should open pop-up to select which plan to import
    }

    const openPlanUploadPopUp = () => {
        // TODO: implement
    }

    return (
        <div className="app">
            <Sidebar sessionData={sessionData} updateSessionData={updateSessionData} selectedSession={selectedSession}
                     selectNewSession={selectNewSession} openSettings={openSettings} openHelp={openHelp}
                     sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar}/>
            <div className={"main" + (sidebarOpen ? '' : ' expanded')}>
                <Header user={user} updateUser={updateUser} sidebarOpen={sidebarOpen} openSettings={openSettings}/>
                <div className="content">
                    <div className="model-header">
                        <h2 onClick={() => setIsEditingSessionName(true)} style={{cursor: 'pointer'}}>
                            {isEditingSessionName ? (
                                <input
                                    type="text"
                                    value={selectedSessionName}
                                    onChange={(e) => setSelectedSessionName(e.target.value)}
                                    onBlur={async () => {
                                        setIsEditingSessionName(false);
                                        await updateSelectedSessionName();
                                    }}
                                    onKeyDown={async (e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            setIsEditingSessionName(false);
                                            await updateSelectedSessionName();
                                        } else if (e.key === 'Escape') {
                                            e.preventDefault();
                                            setSelectedSessionName(selectedSession.name);
                                            setIsEditingSessionName(false);
                                        }
                                    }}
                                    style={{ border: 'none', background: 'transparent', width: '50%', fontSize: 'unset', fontWeight: 'unset'}}
                                    autoFocus
                                />
                            ) : (
                                selectedSessionName
                            )}
                        </h2>
                    </div>
                    <div className="model-wrapper">
                        {!selectedSession || !planData || planData.plans.length === 0
                            ? (
                                <div className="add-plans-container">
                                    <h3>Let&#39;s add some plans...</h3>
                                    <div className="add-plans-btns">
                                        <button className="add-plans-btn" onClick={addDefaultPlan}>Create a new plan
                                        </button>
                                        <button className="add-plans-btn" onClick={openPlanImportPopUp}>Import plan(s)
                                            from another session
                                        </button>
                                        <button className="add-plans-btn" onClick={openPlanUploadPopUp}>Upload plan(s)
                                            from document
                                        </button>
                                    </div>
                                </div>
                            )
                            : <AVModel planData={planData} updatePlanData={updatePlanData}/>
                        }
                    </div>
                </div>
            </div>

            {settingsPopUpOpen && <div className="overlay" onClick={() => setSettingsPopUpOpen(false)}></div>}
            {settingsPopUpOpen && <SettingsPopUp closeSettings={closeSettings} selectedTab={settingsTab} setSelectedTab={updateSettingsTab}/>}

            {helpPopUpOpen && <div className="overlay" onClick={() => setHelpPopUpOpen(false)}></div>}
            {helpPopUpOpen && <HelpPopUp closeHelp={closeHelp}/>}
        </div>
    );
}

export default App;