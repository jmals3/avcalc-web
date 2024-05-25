import React, {useState, useEffect} from 'react';
import {useParams} from "react-router-dom";
import Sidebar from "./Sidebar.jsx";
import Header from "./Header.jsx";
import AVModel from "./AVModel.jsx";
import SettingsPopUp from "./SettingsPopUp.jsx";
import HelpPopUp from "./HelpPopUp.jsx";
import defaultplan from "./defaultplan.js";
import './App.css';

function App() {
    const {sid} = useParams();
    const [sessionData, setSessionData] = useState([]);
    const [planData, setPlanData] = useState(null);
    const [selectedSession, setSelectedSession] = useState(null);
    const [settingsPopUpOpen, setSettingsPopUpOpen] = useState(false);
    const [helpPopUpOpen, setHelpPopUpOpen] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(true);

    useEffect(() => {
        fetch(import.meta.env.VITE_API_ENDPOINT + '/sessions')
            .then(response => response.json())
            .then(data => {
                setSessionData(data);
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
            fetch(import.meta.env.VITE_API_ENDPOINT + '/session/' + selectedSession.guid + '/plans')
                .then(response => response.json())
                .then(data => {
                    setPlanData(data);
                })
                .catch(error => console.error('Error:', error));
        }
    }, [selectedSession]);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    }

    const openSettings = () => {
        setSettingsPopUpOpen(true);
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

    const updatePlanData = (newPlanData) => {
        setPlanData(newPlanData);
    }

    const addDefaultPlan = () => {
        // TODO: update this so it's done server side
        const newPlan = defaultplan;
        const updatedPlanData = {
            plans: [...planData.plans, newPlan]
        };
        setPlanData(updatedPlanData);
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
                <Header sidebarOpen={sidebarOpen}/>
                <div className="content">
                    <div className="model-header">
                        <h2>{selectedSession?.name}</h2>
                    </div>
                    <div className="model-wrapper">
                        {!planData || planData.plans.length === 0
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
            {settingsPopUpOpen && <SettingsPopUp closeSettings={closeSettings}/>}

            {helpPopUpOpen && <div className="overlay" onClick={() => setHelpPopUpOpen(false)}></div>}
            {helpPopUpOpen && <HelpPopUp closeHelp={closeHelp}/>}
        </div>
    );
}

export default App;