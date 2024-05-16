import React, {useState} from 'react';
import Sidebar from "./Sidebar.jsx";
import Header from "./Header.jsx";
import AVModel from "./AVModel.jsx";
import './App.css';
// import ServiceCostSharingPopup from "./ServiceCostSharingPopUp.jsx";


function App() {
    // const [selectedSession, setSelectedSession] = useState(null);
    const [selectedSession, setSelectedSession] = useState({
        id: 3,
        name: 'Session 3',
        starred: false,
    });

    const onNavigation = (session) => {
        setSelectedSession(session);
    }

    return (
        <div className="app">
            <Sidebar selectedSession={selectedSession} onNavigation={onNavigation}/>
            <div className="main">
                <Header />
                <div className="content">
                    <AVModel />
                </div>
            </div>
        </div>
    );
}

export default App;
