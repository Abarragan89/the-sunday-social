/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom'
import { IoHome, } from 'react-icons/io5'
import { BiSolidMessage } from 'react-icons/bi'
import { FaUserFriends } from 'react-icons/fa'
import LoginModal from '../LoginModal';
import { Image } from 'cloudinary-react';
import { useHref } from 'react-router-dom'
import './index.css'

function NavLinks({ closeHamburger, isMobile, triggerRefreshAmongPages }) {

    const href = useHref();

    const activeLinkStyle = {
        color: '#FFCD00'
    }

    function closeHamburgerMenu() {
        if (isMobile) {
            closeHamburger();
        }
    }

    const [showModal, setShowModal] = useState(false);
    const [userData, setUserData] = useState(null);
    let [messageNotifications, setMessageNotifications] = useState(0);
    let [postNotifications, setPostNotifications] = useState(0);

    async function getUserData() {
        try {
            const rawData = await fetch('/api/user');
            const data = await rawData.json();
            setUserData(data);
        } catch (err) {
            console.log('error getting user info in nav')
        }
    }
    async function getUserMessageNotifications() {
        try {
            const rawData = await fetch('/api/user/getTotalMessageNotifications');
            const data = await rawData.json();
            setMessageNotifications(data.total)
        } catch (err) {
            console.log('error getting user info in nav')
        }
    }

    async function getUserPostNotifications() {
        try {
            const rawData = await fetch('/api/post/getTotalPostNotifications');
            const data = await rawData.json();
            setPostNotifications(data.total)
        } catch (err) {
            console.log('error getting user info in nav')
        }
    }

    useEffect(() => {
        getUserData();
    }, [triggerRefreshAmongPages])

    useEffect(() => {
        if (userData && userData.message !== 'Unauthorized') {
            getUserPostNotifications();
            getUserMessageNotifications();
        }
    }, [href])

    return (
        <>
            {!href.includes('/passwordReset') &&
                <>
                    {showModal && <LoginModal setShowModal={setShowModal} />}
                    {userData?.profilePic ?
                        <nav className='navLinks'>
                            <ul>
                                <li>
                                    <NavLink
                                        to='/'
                                        onClick={closeHamburgerMenu}
                                        style={({ isActive }) => isActive ? activeLinkStyle : {}}
                                    >
                                        <IoHome />
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink
                                        to={`/messages/0`}
                                        onClick={closeHamburgerMenu}
                                        style={({ isActive }) => isActive ? activeLinkStyle : {}}
                                    >
                                        <BiSolidMessage />
                                        {messageNotifications > 0 && <p className='notification-bubble-in-nav'>!</p>}
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink
                                        to='/friends'
                                        onClick={closeHamburgerMenu}
                                        style={({ isActive }) => isActive ? activeLinkStyle : {}}
                                    >
                                        <FaUserFriends />
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink
                                        to='/profile'
                                        onClick={closeHamburgerMenu}
                                        style={({ isActive }) => isActive ? activeLinkStyle : {}}
                                    >
                                        <Image className='profile-pic-in-nav' cloudName='dp6owwg93' publicId={userData?.profilePic} />
                                        {postNotifications > 0 && <p className='notification-bubble-in-nav'>!</p>}
                                    </NavLink>
                                </li>
                            </ul>
                        </nav>
                        :
                        <nav className='navLinks'>
                            <ul>
                                <li>
                                    <p onClick={() => setShowModal(true)}>Sign in</p>
                                </li>
                            </ul>
                        </nav>
                    }
                </>
            }
        </>
    )
}

export default NavLinks;