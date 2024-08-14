import React, {useState, useEffect} from 'react';
import {useParams, useNavigate} from "react-router-dom";
import Sidebar from "./Sidebar.jsx";
import Header from "./Header.jsx";
import AVModel from "./AVModel.jsx";
import SettingsPopUp from "./SettingsPopUp.jsx";
import HelpPopUp from "./HelpPopUp.jsx";
import './App.css';
import {extractUserFromToken} from "./functions.js";
import {
    addSessionPlanDefaultApi,
    createSessionApi,
    getSessionPlansApi,
    getSessionsApi,
    updateSessionApi
} from "./api/session.js";
import AVModelMini from "./AVModelMini.jsx";
import AVModelMini3 from "./AVModelMini3.jsx";
import ChatSidePane from "./ChatSidePane.jsx";


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
        const getSessions = async () => {
            const result = await getSessionsApi();
            if (result.success) {
                const sessions = result.sessions;
                setSessionData(sessions);
                if (!sessions || sessions.length === 0) {
                    setSessionData([]);
                    return;
                }
                if (sid) {
                    const session = sessions.find(s => s.guid === sid);
                    if (session) {
                        setSelectedSession(session);
                    } else {
                        const session = sessions[0];
                        setSelectedSession(session);
                        const url = `/s/${session.guid}`;
                        window.history.pushState(session, '', url);
                    }
                } else {
                    const session = sessions[0];
                    setSelectedSession(session);
                    const url = `/s/${session.guid}`;
                    window.history.pushState(session, '', url);
                }
            }
        }

        getSessions();
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

    const getSessionPlans = async () => {
        if (selectedSession) {
            const result = await getSessionPlansApi(selectedSession.guid);
            if (result.success) {
                setPlanData(result.planData);
            }
            setSelectedSessionName(selectedSession?.name ?? '')
        }
    }

    useEffect(() => {
        getSessionPlans();
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

        const result = await updateSessionApi(selectedSession.guid, {name: selectedSessionName});
        if (result.success) {
            setSessionData(updatedSessionData);
            setSelectedSession({...selectedSession, name: selectedSessionName});
        }
    }

    const updatePlanData = (newPlanData) => {
        setPlanData(newPlanData);
    }

    const addDefaultPlan = async () => {
        if (!selectedSession) {
            const result = await createSessionApi();
            if (result.success) {
                updateSessionData([result.session, ...sessionData]);
                const url = `/s/${result.session.guid}`;
                window.history.pushState(result.session, '', url);
                selectNewSession(result.session);
            }
        }

        const result = await addSessionPlanDefaultApi(selectedSession.guid)
        if (result.success) {
            await getSessionPlans();
        }

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
                            : <AVModelMini3 planData={planData} updatePlanData={updatePlanData} />
                        }
                    </div>
                </div>
            </div>
            <ChatSidePane />

            {settingsPopUpOpen && <div className="overlay" onClick={() => setSettingsPopUpOpen(false)}></div>}
            {settingsPopUpOpen && <SettingsPopUp closeSettings={closeSettings} selectedTab={settingsTab} setSelectedTab={updateSettingsTab}/>}

            {helpPopUpOpen && <div className="overlay" onClick={() => setHelpPopUpOpen(false)}></div>}
            {helpPopUpOpen && <HelpPopUp closeHelp={closeHelp}/>}
        </div>
    );
}

export default App;