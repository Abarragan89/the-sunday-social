import { useEffect, useState } from "react";
import { FallingLines } from 'react-loader-spinner';
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";


function ResetPasswordPage() {

    const {tokenId} = useParams();
    const navigate = useNavigate(); 
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        getUserInfo();
    }, [tokenId])


    async function getUserInfo() {
        try {
            const data = await fetch(`/api/user/verifyUserByToken/${tokenId}`);
            const response = await data.json();
            console.log(response)
            setUserData(response)
        } catch(err) {
            console.log(err)
        }
    }
    console.log(tokenId)

    async function resetPasswordHandler(e) {
        e.preventDefault();
        if (password !== confirmPassword || password === '') return; 
        if (isLoading) return;
        setIsLoading(true)
        try {
            const data = await fetch('/api/user/resetPassword', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    password,
                    userData
                })
            });
            const response = await data.json();
            if (response) {
                navigate('/')
            }
            setIsLoading(false)
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <>
        {userData?.id ? 
        <>
            <h3 className="modal-title">Reset Password</h3>
            <form className="login-form" onSubmit={(e) => resetPasswordHandler(e)}>
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
                    <button className={`submit-btn ${confirmPassword === password && password.length > 7 ? '' : 'disabled-btn'}`} type="submit">Confirm</button>
                }
            </form>
        </>
        :
        <p className="sign-in-to-view-page-text">Password Reset has expired, please try again.</p>
        }
        </>
    )
}

export default ResetPasswordPage;