/* eslint-disable react/prop-types */
import { FaSearch } from 'react-icons/fa'
import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import ConfirmModal from '../ConfirmModal';
import { Image } from 'cloudinary-react';
import './index.css'

function FriendFinder({ setTriggerRefreshInFriends, triggerRefreshInFriends, userId}) {
    const navigate = useNavigate();

    const [isFindingFriend, setIsFindingFriends] = useState(false)
    const [foundUsers, setFoundUsers] = useState(null)
    const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false)
    const [deleteFriendId, setDeleteFriendId] = useState(null)
    const [deleteFriendName, setDeleteFriendName] = useState(null)

    const inputEl = useRef(null);

    async function findMyFriends(value) {
        try {
            const data = await fetch(`/api/user/getUserFriends/${value}`);
            const response = await data.json()

            if (!response) {
                console.log('error');
                return;
            }
            setFoundUsers(response.friends)
        } catch (err) {
            console.log('error getting friends', err)
        }
    }

    async function findFriends(value) {
        if (value === '') {
            setFoundUsers(null);
            return;
        }
        try {
            const data = await fetch(`/api/user/searchNewFriends/${value}`);
            const response = await data.json();
            if (!response) {
                console.log('error')
                setFoundUsers(null)
            }
            setFoundUsers(response)
        } catch (err) {
            console.log(err)
        }
    }

    async function sendMessageToFriend(friendId) {
        try{
            // check to see if there is already a chat
            const data = await fetch(`/api/user/doesChatRoomExist/${userId}/${friendId}`);
            const response = await data.json();
            // redirect if there is a response with chatID
            if (response) { 
                navigate(`/messages/${response}`)
            } else {
                makeChatRoom(friendId)
            }
        } catch(err) {
            console.log(err)
        }
    }

    async function makeChatRoom(friendId) {
        try {
            const data = await fetch('/api/user/createChatRoom', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userIdsForChatRoom: [friendId]
                })
            })
            const response = await data.json();
            if(!response) {
                console.log('error');
                return;
            }
            navigate(`/messages/${response.id}`)
        } catch (err) {
            console.log(`error making room `, err)
        }
    }

    useEffect(() => {
        inputEl.current.value = '';
        // only run findMy friends if we are in 
        if(!isFindingFriend) findMyFriends('');
    }, [isFindingFriend, triggerRefreshInFriends, showConfirmDeleteModal])


    async function sendFriendRequestHandler(friendId) {
        try {
            const data = await fetch('/api/user/sendFriendRequest', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    friendId
                })
            })
            const response = await data.json();
            if (!response) {
                console.log('friendship not made')
            }
            setTriggerRefreshInFriends(!triggerRefreshInFriends)
            findFriends();
        } catch (err) {
            console.log(err)
        }
    }

    async function deleteFriend() {
        try {
            const data = await fetch('/api/user/deleteFriend', {
                method: 'DELETE', 
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userId,
                    friendId: deleteFriendId
                })
            })
            const response = data.json();
            if (!response) {
                console.log('friendship not made')
            }
            setShowConfirmDeleteModal(false);
        } catch(err) {
            console.log(err)
        }
    }

    return (
        <>
        {showConfirmDeleteModal &&
            <ConfirmModal 
                triggerModal={setShowConfirmDeleteModal}
                data={deleteFriendName}
                confirmFunction={deleteFriend}
            />
        }
        <aside className="friend-finder-aside">
            <div className='top-search-bar'>
                <div className="friend-search-option">
                    <h2 onClick={() => { setIsFindingFriends(false); setFoundUsers(null) }} className={isFindingFriend ? "" : "make-active"}>My Friends</h2>
                    {/* erase the finder of friends in  */}
                    <h2 onClick={() => { setIsFindingFriends(true); setFoundUsers(null) }} className={isFindingFriend ? "make-active" : ""}>Find Friends</h2>
                </div>

                {isFindingFriend ?
                    <div className='search-input-div'>
                        <input
                            type="text"
                            ref={inputEl}
                            className="search-friends-input"
                            onChange={(e) => findFriends(e.target.value)}
                        />
                        <FaSearch />
                    </div>
                    :
                    <div className='search-input-div'>
                        <input
                            ref={inputEl}
                            type="text"
                            className="search-friends-input"
                            onChange={(e) => findMyFriends(e.target.value)}
                        />
                        <FaSearch />
                    </div>
                }
            </div>


            {/* Search results for finding friends */}
            <div className="search-results">
                {foundUsers && foundUsers.map((user, index) => {
                    return (
                        <div key={index} className="single-friend">
                            <figure>
                                <Image width={28} alt='user profile picture' className='profile-pic' cloudName='dp6owwg93' publicId={user?.profilePic} />
                            </figure>
                            <div className="friend-info">
                                <p>{user.username}</p>
                                <div className='button-row'>
                                    {isFindingFriend ?
                                        <p onClick={() => sendFriendRequestHandler(user.id)}>Send Friend Request</p>
                                        :
                                        <>
                                            <a onClick={() => sendMessageToFriend(user.id)}>
                                                Message
                                            </a>
                                            <Link to={`/friendProfile/${user.id}`}>
                                                Profile
                                            </Link>
                                             <p onClick={() => {setShowConfirmDeleteModal(true); setDeleteFriendName(user.username); setDeleteFriendId(user.id)}}>
                                                Delete
                                            </p>
                                        </>
                                    }
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </aside>
        </>
    )
}

export default FriendFinder;