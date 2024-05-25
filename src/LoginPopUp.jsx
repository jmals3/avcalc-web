import React, {useState} from 'react';
import './LoginPopUp.css';
import './PopUp.css';
import {FaTimes} from "react-icons/fa";

const LoginPopUp = ({closeLoginPopUp}) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleEmailChange = (e) => setUsername(e.target.value);
    const handlePasswordChange = (e) => setPassword(e.target.value);
    const toggleShowPassword = () => setShowPassword(!showPassword);

    const handleLogIn = (e) => {
        e.preventDefault();
        // Handle log-in logic here
        console.log('Email:', username);
        console.log('Password:', password);
    };

    return (
        // <div className="pop-up">
        //     <div className="pop-up-header">
        //         <h2>Log In</h2>
        //         <button className="pop-up-close-btn" onClick={closeLoginPopUp}><FaTimes/></button>
        //     </div>
            <div className="login-container">
                <div className="login-box">
                    <h2>Log In</h2>
                    <p>Actuarial modeling made easy</p>
                    <form onSubmit={handleLogIn}>
                        <input
                            type="text"
                            placeholder="Email"
                            value={username}
                            onChange={handleEmailChange}
                        />
                        <div className="password-container">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Password"
                                value={password}
                                onChange={handlePasswordChange}
                            />
                            <button
                                type="button"
                                className="show-password-btn"
                                onClick={toggleShowPassword}
                            >
                                {showPassword ? "hide" : "show"}
                            </button>
                        </div>
                        <a href="/forgot-password" className="forgot-password-link">Forgot password?</a>
                        <button type="submit" className="login-btn login-std-btn">Log in</button>
                    </form>
                    {/*<div className="divider">*/}
                    {/*    <p>or</p>*/}
                    {/*</div>*/}
                    {/*<button className="login-btn login-apple-btn">Log in with Apple</button>*/}
                    {/*<button className="login-btn login-google-btn">*/}
                    {/*    <div className="oauth-login-content">*/}
                    {/*        <svg*/}
                    {/*            version="1.1"*/}
                    {/*            xmlns="http://www.w3.org/2000/svg"*/}
                    {/*            viewBox="0 0 48 48"*/}
                    {/*            style={{display: 'block', width: '24px'}}*/}
                    {/*        >*/}
                    {/*            <path fill="#EA4335"*/}
                    {/*                  d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>*/}
                    {/*            <path fill="#4285F4"*/}
                    {/*                  d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>*/}
                    {/*            <path fill="#FBBC05"*/}
                    {/*                  d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>*/}
                    {/*            <path fill="#34A853"*/}
                    {/*                  d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>*/}
                    {/*            <path fill="none" d="M0 0h48v48H0z"></path>*/}
                    {/*        </svg>*/}
                    {/*        Log in with Google*/}
                    {/*    </div>*/}
                    {/*</button>*/}
                    {/*<button className="login-btn login-microsoft-btn">*/}
                    {/*    <div className="oauth-login-content">*/}
                    {/*        <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 21 21">*/}
                    {/*            <title>MS-SymbolLockup</title>*/}
                    {/*            <rect x="1" y="1" width="9" height="9" fill="#f25022"/>*/}
                    {/*            <rect x="1" y="11" width="9" height="9" fill="#00a4ef"/>*/}
                    {/*            <rect x="11" y="1" width="9" height="9" fill="#7fba00"/>*/}
                    {/*            <rect x="11" y="11" width="9" height="9" fill="#ffb900"/>*/}
                    {/*        </svg>*/}
                    {/*        Log in with Microsoft*/}
                    {/*    </div>*/}
                    {/*</button>*/}
                    <p className="signup-link">
                        New to Easy AV? <a href="/signup">Join now</a>
                    </p>
                </div>
            </div>
        // </div>
    );
};

export default LoginPopUp;
