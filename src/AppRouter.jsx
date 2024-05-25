import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from "./Landing.jsx";
import App from './App';
import LoginPopUp from "./LoginPopUp.jsx";

const AppRouter = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<LoginPopUp />} />
                <Route path="/s/" element={<App />} />
                <Route path="/s/:sid" element={<App />} />
            </Routes>
        </Router>
    );
};

export default AppRouter;