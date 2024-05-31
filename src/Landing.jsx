import React, {useState} from 'react';
import LoginPopUp from "./LoginPopUp.jsx";
import './Landing.css';
import SignupPopUp from "./SignupPopUp.jsx";

const Landing = ({user, updateUser}) => {
    // const navigate = useNavigate();
    const [loginPopUpOpen, setLoginPopUpOpen] = useState(false);
    const [signupPopUpOpen, setSignupPopUpOpen] = useState(false);

    const closeLoginPopUp = () => {
        const url = `/`;
        window.history.pushState('', '', url);
        setLoginPopUpOpen(false);
    }

    const closeSignupPopUp = () => {
        const url = `/`;
        window.history.pushState('', '', url);
        setSignupPopUpOpen(false);
    }

    return (
        <div className="landing-page">
            <header className="top-bar">
                <div className="product-name">Easy AV</div>
                <nav>
                    <ul>
                        <li>For Actuaries</li>
                        <li>For Brokers</li>
                        <li>For HR</li>
                        <li>For Finance</li>
                        <li>For M&A</li>
                    </ul>
                </nav>
                <div className="auth-buttons">
                    <button
                        onClick={() => {
                            const url = `/authentication/login`;
                            window.history.pushState('', '', url);
                            setLoginPopUpOpen(true)}
                        }
                    >Log In</button>
                    <button
                        className={"signup-button"}
                        onClick={() => {
                            const url = `/authentication/signup`;
                            window.history.pushState('', '', url);
                            setSignupPopUpOpen(true)}
                        }
                    >Sign Up
                    </button>
                </div>
            </header>

            <section className="hero-section">
                <div className="hero-content">
                    <div className="left-pane">
                        <h1>Calculate the actuarial value of health plans instantly - no actuary required!</h1>
                        <p>With Easy AV&#39;s AI Plan Upload, load plans directly from benefit guides into the model.
                            View how the plans compare to market.</p>
                    </div>
                    <div className="right-pane">
                        <img src="path-to-image" alt="Hero"/>
                    </div>
                </div>
            </section>

            <section className="info-section">
                <div className="info-content">
                    <div className="right-pane">
                        <img src="path-to-image" alt="Info"/>
                    </div>
                    <div className="left-pane">
                        <h2>Easy AV is like having your actuary at your fingertips</h2>
                        <ul>
                            <li>Upload plan design docs, SBCs, benefit guides, and more to instantly load plans into the
                                model and calculate their actuarial values
                            </li>
                            <li>Determine metallic level of plans to see if they are bronze, silver, gold, or platinum
                            </li>
                            <li>Estimate the cost impact of adding a new plan, changing deductibles, and more!</li>
                        </ul>
                    </div>
                </div>
            </section>

            <section className="load-plans-section">
                <h2>Load plans from anywhere</h2>
                <p>Easy AV&#39;s AI Plan Upload can instantly read plan designs from a variety of sources straight into
                    the
                    model.</p>
                <div className="load-columns">
                    <div className="column">
                        <img src="path-to-image" alt="Benefit Guides"/>
                        <h3>Benefit Guides</h3>
                        <p>Take a screenshot of the plans in the benefit guide or load the whole document.</p>
                    </div>
                    <div className="column">
                        <img src="path-to-image" alt="SBCs and SPDs"/>
                        <h3>SBCs and SPDs</h3>
                        <p>Upload the plan documents straight from the insurance carrier.</p>
                    </div>
                    <div className="column">
                        <img src="path-to-image" alt="Import from Other Models"/>
                        <h3>Import from Other Models</h3>
                        <p>Quickly search and load plans from past modeling sessions.</p>
                    </div>
                    <div className="column">
                        <img src="path-to-image" alt="Manual Input"/>
                        <h3>Manual Input</h3>
                        <p>Start from scratch and input plan designs by hand.</p>
                    </div>
                </div>
                <div className="centered-image">
                    <img src="path-to-image" alt="Centered"/>
                </div>
            </section>

            <section className="cards-section">
                <div className="cards-grid">
                    <div className="card">
                        <img src="path-to-icon" alt="For Actuaries"/>
                        <h3>For Actuaries</h3>
                        <p>Instantly calculate AVs and import them into your Excel models.</p>
                    </div>
                    <div className="card">
                        <img src="path-to-icon" alt="For Brokers"/>
                        <h3>For Brokers</h3>
                        <p>Bring new plan design ideas to your clients and export beautiful exhibits for your next
                            presentation.</p>
                    </div>
                    <div className="card">
                        <img src="path-to-icon" alt="For HR"/>
                        <h3>For HR</h3>
                        <p>Determine the competitiveness of your benefit offering and find new ways to add to your
                            benefit package.</p>
                    </div>
                    <div className="card">
                        <img src="path-to-icon" alt="For Finance"/>
                        <h3>For Finance</h3>
                        <p>Determine financial impact of plan design changes and integrate into budget.</p>
                    </div>
                    <div className="card">
                        <img src="path-to-icon" alt="For Private Equity"/>
                        <h3>For Private Equity</h3>
                        <p>Model the impact of harmonizing plan offerings between two or more groups.</p>
                    </div>
                    <div className="card">
                        <img src="path-to-icon" alt="For Insurers"/>
                        <h3>For Insurers</h3>
                        <p>Leverage the Easy AV API to model hundreds or even thousands of potential plan designs.</p>
                    </div>
                </div>
            </section>

            <section className="used-by-section">
                <h2>Used by professionals at top firms</h2>
                <div className="company-logos">
                    {/* Add company logos here */}
                </div>
            </section>

            <section className="get-started-section">
                <h2>Get Started</h2>
                <p>Upload your plans and calculate the Actuarial Value today.</p>
                <button>Sign up for free</button>
            </section>

            {loginPopUpOpen && <div className="overlay" onClick={() => closeLoginPopUp()}></div>}
            {loginPopUpOpen && <LoginPopUp  user={user} updateUser={updateUser} />}
            {signupPopUpOpen && <div className="overlay" onClick={() => closeSignupPopUp()}></div>}
            {signupPopUpOpen && <SignupPopUp  user={user} updateUser={updateUser} />}
        </div>

    );
};

export default Landing;
