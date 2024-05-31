import React, {useState} from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from "./Landing.jsx";
import App from './App';
import LoginPopUp from "./LoginPopUp.jsx";
import SignupPopUp from "./SignupPopUp.jsx";

const AppRouter = () => {
    const [user, setUser] = useState(null);

    const updateUser = (user) => {
        setUser(user);
    }

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Landing  user={user} updateUser={updateUser} />} />
                <Route path="/authentication/login" element={<LoginPopUp user={user} updateUser={updateUser} />} />
                <Route path="/authentication/signup" element={<SignupPopUp user={user} updateUser={updateUser} />} />
                <Route path="/s/" element={<App user={user} updateUser={updateUser} />} />
                <Route path="/s/:sid" element={<App user={user} updateUser={updateUser} />} />
            </Routes>
        </Router>
    );
};

export default AppRouter;