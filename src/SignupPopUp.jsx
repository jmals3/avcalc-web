import React, {useState} from 'react';
import {useNavigate} from "react-router-dom";
import {api} from './constants.js';
import './SignupPopUp.css';
import './PopUp.css';

const SignupPopUp = ({user, updateUser}) => {
    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [password2, setPassword2] = useState('');
    const [showPassword2, setShowPassword2] = useState(false);

    const [signuperror, setSignupError] = useState('');

    const handleEmailChange = (e) => setUsername(e.target.value);
    const handlePasswordChange = (e) => setPassword(e.target.value);
    const toggleShowPassword = () => setShowPassword(!showPassword);
    // const handlePassword2Change = (e) => setPassword2(e.target.value);
    // const toggleShowPassword2 = () => setShowPassword2(!showPassword2);

    const handleSignUp = async (e) => {
        e.preventDefault();
        // console.log('Email:', username);
        // console.log('Password:', password);

        const response = await fetch(api + '/authentication/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({username, password}),
        });

        // console.log(api + '/authentication/signup');

        if (response.ok) {
            console.log('Signup successful');
            const user = await response.json();
            updateUser(user);
            navigate('/s/');
        } else {
            console.error('Signup failed');
            const errorBody = await response.json();
            const error = errorBody.error;
            setSignupError(error || 'Signup failed');
        }
    };

    return (
        <div className="signup-container">
            <div className="signup-box">
                <h2>Sign Up</h2>
                <p>Get ahead with Easy AV</p>
                <form onSubmit={handleSignUp}>
                    <input
                        name={"username"}
                        type="text"
                        placeholder="Email"
                        value={username}
                        onChange={handleEmailChange}
                    />
                    <div className="password-container">
                        <input
                            name={"password"}
                            type={showPassword ? "text" : "password"}
                            placeholder="Password (6+ characters)"
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
                    <p className="signup-error">{signuperror}</p>
                    {/*<div className="password-container">*/}
                    {/*    <input*/}
                    {/*        type={showPassword2 ? "text" : "password"}*/}
                    {/*        placeholder="Confirm Password"*/}
                    {/*        value={password2}*/}
                    {/*        onChange={handlePassword2Change}*/}
                    {/*    />*/}
                    {/*    <button*/}
                    {/*        type="button"*/}
                    {/*        className="show-password-btn"*/}
                    {/*        onClick={toggleShowPassword2}*/}
                    {/*    >*/}
                    {/*        {showPassword2 ? "hide" : "show"}*/}
                    {/*    </button>*/}
                    {/*</div>*/}

                    <button type="submit" className="signup-btn signup-std-btn">Sign up</button>
                </form>
                {/*<div className="divider">*/}
                {/*    <p>or</p>*/}
                {/*</div>*/}
                {/*<button className="signup-btn signup-apple-btn">Log in with Apple</button>*/}
                {/*<button className="signup-btn signup-google-btn">*/}
                {/*    <div className="oauth-signup-content">*/}
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
                {/*<button className="signup-btn signup-microsoft-btn">*/}
                {/*    <div className="oauth-signup-content">*/}
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
                <p className="login-link">
                    Been here before? <a href="/authentication/login">Log In</a>
                </p>
            </div>
        </div>
    );
};

export default SignupPopUp;
