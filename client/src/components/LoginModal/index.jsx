/* eslint-disable react/prop-types */
import { useState, useRef, useEffect } from "react";
import { FallingLines } from 'react-loader-spinner';
import { ToastContainer, toast } from "react-toastify";
import './index.css'

function LoginModal({ setShowModal }) {

    const showToastMessage = (errorMsg, toastId) => {
        toast.error(errorMsg, {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 2000,
            closeOnClick: true,
            className: 'toast-message',
            toastId: toastId
        });
    };

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [username, setUsername] = useState('');
    const [showSignup, setShowSignup] = useState(false);
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [showLogin, setShowLogin] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    const emailInputEl = useRef(null);
    const forgotEmailText = useRef(null);

    useEffect(() => {
        emailInputEl.current.focus()
    }, [showSignup, showForgotPassword, showLogin, emailInputEl])

    function resetFormFields() {
        setEmail('');
        setPassword('');
        setUsername('');
    }

    function showSignupHandler() {
        setShowLogin(false);
        setShowForgotPassword(false);
        setShowSignup(true);
        resetFormFields()
    }

    function showLoginHandler() {
        setShowLogin(true);
        setShowForgotPassword(false);
        setShowSignup(false);
        resetFormFields()
    }
    function showForgotPasswordHandler() {
        setShowLogin(false);
        setShowForgotPassword(true);
        setShowSignup(false);
        resetFormFields()
    }


    async function signupHandler(e) {
        e.preventDefault();
        if (isLoading) return;

        if (password !== confirmPassword) {
            showToastMessage('Passwords must match');
            return;
        }

        setIsLoading(true)
        try {
            const data = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email,
                    password,
                    username
                })
            })

            const response = await data.json();
            if (response.error) {
                setIsLoading(false)
                showToastMessage(response.error, 'nosignup')
            } else {
                window.location.reload();
            }
        } catch (err) {
            console.log('error sign up user ', err)
        }
    }

    async function loginHandler(e) {
        e.preventDefault();
        if (isLoading) return;
        setIsLoading(true)

        try {
            const rawData = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email,
                    password
                })
            })

            const response = await rawData.json();
            if (response.error) {
                showToastMessage(response.error, 'loginError')
                setIsLoading(false)
            } else {
                window.location.reload();
            }
        } catch (err) {
            console.log('error sign up user ', err)
        }
    }

    async function resetPasswordHandler(e) {
        e.preventDefault();
        if (email === '') return;
        try {
            const data = await fetch('/api/user/resetPasswordEmail', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email
                })
            });

            const response = await data.json()
            if (!response) {
                console.log('error sending ')
            } else {
                forgotEmailText.current.innerHTML = 'Check your email <span>(including Spam/Junk Folder)</span> to reset your password'
            }
        } catch(err) {
            console.log(err)
        }
    }

    return (
        <div onClick={() => setShowModal(false)} className="modal-container">
            <ToastContainer />
            <div onClick={(e) => e.stopPropagation()} className="modal">
                {/* Login Section */}
                {showLogin &&
                    <>
                        <h3 className="modal-title">Sign in</h3>
                        <form className="login-form" onSubmit={(e) => loginHandler(e)}>
                            <input
                                type="email"
                                ref={emailInputEl}
                                placeholder="email"
                                onChange={(e) => setEmail(e.target.value)}
                                minLength={3}
                            />
                            <input
                                type="password"
                                placeholder="password"
                                onChange={(e) => setPassword(e.target.value)}
                                minLength={8}
                            />

                            {isLoading ?
                                <p className="loading-icon">
                                    <FallingLines
                                        color="#FFCD00"
                                        width="50"
                                        visible={true}
                                        ariaLabel='falling-lines-loading'
                                    />
                                </p>
                                :
                                <button className="submit-btn" type="submit">Sign in</button>
                            }
                        </form>
                        <p className="login-option-text">Not a member?
                            <span onClick={showSignupHandler}> Create account</span>
                        </p>
                        <p className="login-option-text">Forgot
                            <span onClick={showForgotPasswordHandler}> Password?</span>
                        </p>
                    </>
                }

                {/* Signup Section */}
                {showSignup &&
                    <>
                        <h3 className="modal-title">Sign up</h3>
                        <form className="login-form" onSubmit={(e) => signupHandler(e)}>
                            <input
                                type="email"
                                ref={emailInputEl}
                                placeholder="email"
                                onChange={(e) => setEmail(e.target.value)}

                            />
                            <input
                                type="text"
                                placeholder="username"
                                onChange={(e) => setUsername(e.target.value)}
                                minLength={3}
                            />
                            <input
                                type="password"
                                placeholder="password"
                                minLength={8}
                                onChange={(e) => setPassword(e.target.value)}
                            />

                            <input
                                type="password"
                                placeholder="confirm password"
                                minLength={8}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />

                            {isLoading ?
                                <p className="loading-icon">
                                    <FallingLines
                                        color="#FFCD00"
                                        width="50"
                                        visible={true}
                                        ariaLabel='falling-lines-loading'
                                    />
                                </p>
                                :
                                <button className={`submit-btn ${confirmPassword === password && password.length > 7 ? '' : 'disabled-btn'}`} type="submit">Create account</button>
                            }
                        </form>
                        <p className="login-option-text">Already a member?
                            <span onClick={showLoginHandler}> Sign in</span>
                        </p>
                        <p className="login-option-text">Forgot 
                            <span onClick={showForgotPasswordHandler}>Password?</span>
                        </p>
                    </>
                }
                {showForgotPassword &&
                    <>
                        <h3 className="modal-title">Forgot Password?</h3>
                        <form className="login-form" onSubmit={(e) => resetPasswordHandler(e)}>
                            <input
                                type="email"
                                ref={emailInputEl}
                                placeholder="email"
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <p ref={forgotEmailText} className="forgot-email-text"></p>
                            {isLoading ?
                                <p className="loading-icon">
                                    <FallingLines
                                        color="#FFCD00"
                                        width="50"
                                        visible={true}
                                        ariaLabel='falling-lines-loading'
                                    />
                                </p>
                                :
                                <button className="submit-btn" type="submit">Reset</button>
                            }
                        </form>
                        <p className="login-option-text">Or <br />
                            <span onClick={showLoginHandler}>Sign in</span>
                        </p>

                    </>
                }
            </div>
        </div>
    )
}

export default LoginModal;