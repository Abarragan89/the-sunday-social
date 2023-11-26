/* eslint-disable react/prop-types */
import { useEffect, useState, useRef } from "react";
import { useParams, Link, useNavigate } from 'react-router-dom'
import { formatDateShortYear } from "../../utils/formatDate";
import ShowChatUserListModal from "../showChatUserListModal";
import { getTime } from "../../utils/formatDate";
import { IoMdSend, IoIosMore } from 'react-icons/io'
import io from 'socket.io-client';
const socket = io.connect('http://localhost:3001');
import './index.css'

function ChatBox({
    username,
    userId,
    triggerModalStatus,
    triggerRefreshAmongPages,
}) {

    const navigate = useNavigate();
    const { chatId } = useParams();
    const [allMessages, setAllMessage] = useState(null);
    const [allChatrooms, setAllChatrooms] = useState(null);
    const [messageText, setMessageText] = useState('');
    const [showChatUserList, setShowChatUserList] = useState(false);
    const [currentChatUserList, setCurrentChatUserList] = useState(null);
    const [isSendingMessage, setIsSendingMessage] = useState(false);

    const messageTextArea = useRef(null);

    async function getMessages(chatId) {
        try {
            const data = await fetch(`/api/user/getChatMessages/${chatId}`)
            const response = await data.json();
            setAllMessage(response);
        } catch (err) {
            console.log('error getting messages ', err)
        }
    }
    async function getChatrooms() {
        try {
            const data = await fetch(`/api/user/getAllChatrooms/${userId}`)
            const response = await data.json();
            setAllChatrooms(response);
        } catch (err) {
            console.log('error getting messages ', err)
        }
    }

    // open latest chat as soon as page loads
    if (!chatId && allChatrooms) {
        navigate(`/messages/${allChatrooms.ChatRoom[0]?.id}`)
    }

    async function removeAllNotifications(chatId) {
        try {
            const data = await fetch('/api/user/removeAllNotificationsFromUserChat', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                }, 
                body: JSON.stringify({
                    userId,
                    chatId
                })
            })
            const response = await data.json();
            if (!response) {
                console.log('could not remove notifications')
            }
            await getChatrooms();
        } catch(err) {
            console.log(err)
        }
    }

    useEffect(() => {
        removeAllNotifications(chatId);
        getMessages(chatId);
        socket.emit('join_room', chatId)
        // leave room so messages don't render if you switch chat channel!!!!
        return () => {
            socket.emit('leave_room', chatId);
        };
    }, [userId, chatId, triggerModalStatus, triggerRefreshAmongPages])

    async function addNotification (chatId) {
        try {
            const data = await fetch(`/api/user/addNotification`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                }, 
                body: JSON.stringify({
                    userId,
                    chatId
                })
            })
            const response = await data.json();
            if (response) {
                getChatrooms();
            }
        } catch(err) {
            console.log(err)
        }
    }


    async function addMessage() {
        try {
            if (messageText.trim() === '') return;
            const data = await fetch('/api/user/createNewMessage', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    messageText,
                    chatroomId: chatId,
                    sender: username
                })
            });
            const response = await data.json();
            if (!response) {
                console.log(' error sending message ')
            }
            setIsSendingMessage(true)
            setMessageText('');
            await getMessages(chatId);
            await removeAllNotifications(chatId);
            // only add notification if user is not in the same chat
            await addNotification(chatId);
            // Socket io emit to render automatically
            socket.emit('send_message', { data, chatId })
            setIsSendingMessage(false)
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        // eslint-disable-next-line no-unused-vars
        // This use effect will trigger when we emit send_message
        // and in turn trigger the recieved_message and trigger reload of messages
        socket.on('recieve_message', async (data) => {
            await getMessages(data.chatId);
            setIsSendingMessage(true);
        })
    }, [socket])

    useEffect(() => {
        if (!isSendingMessage) {
            scrollToBottom('auto')
        } else {
            scrollToBottom('smooth')
        }
    }, [allMessages])

    // Function to scroll to the bottom
    function scrollToBottom(scrollType) {
        if (messageTextArea.current) {
            messageTextArea.current.scrollIntoView({ behavior: scrollType })
        }
    }

    function showAllUsersInChat(e, users) {
        e.stopPropagation();
        setCurrentChatUserList(users)
        setShowChatUserList(true)
    }

    console.log(allChatrooms)

    return (
        <section className="chatbox-main-section">
            <aside className="chatbox-aside">
                {showChatUserList && 
                    <ShowChatUserListModal 
                        triggerModal={setShowChatUserList}
                        data={currentChatUserList}
                        username={username}
                    />
                }
                <ul className="aside-ul-list">
                    {/* sort the chat boxes by last updated so most relevant is on top */}
                    <a href="#" className="messages-title"><li>Messages</li></a>
                    {allChatrooms && allChatrooms?.ChatRoom.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)).map((chatroom, index) => {
                        return (
                            <div key={index} className="link-container">
                                <Link
                                    onClick={() => {
                                        setMessageText(''); 
                                        removeAllNotifications(chatId);
                                        setIsSendingMessage(false)
                                    }}
                                    className={`chat-aside-link ${chatId == chatroom.id ? 'active-chat' : ''}`}
                                    to={`/messages/${chatroom.id}`}
                                >
                                    {/* Only show the names that aren't the logged in user */}
                                    <li>{chatroom.chatRoomName.split(', ').filter(item => item !== username).join(', ')}</li>

                                    {/* these two will be the  button to show all users*/}
                                </Link>
                                {/* {chatroom?.UserChatJunc?.notifications > 0 && chatroom.id != chatId && <p className="notification-bubble-in-message-aside">{chatroom.UserChatJunc.notifications}</p>} */}
                                {chatroom?.UserChatJunc?.notifications > 0 && <p className="notification-bubble-in-message-aside">{chatroom.UserChatJunc.notifications}</p>}
                                {chatroom.isGroupChat && <IoIosMore onClick={(e) => showAllUsersInChat(e, chatroom.chatRoomName)} className="showAllUsersInChat" />}
                            </div>
                        )
                    })}
                </ul>
            </aside>
            <div className="message-text-screen">
                <div className="text-messages-area">
                    {allMessages && allMessages.map((message, index) => {
                        return (
                            <div key={index} className={`${message.sender === username ? 'message-justify-right' : 'message-justify-left'}`}>
                                <div className={`message-bubble ${message.sender === username ? 'outgoing-message-bubble' : 'incoming-message-bubble'}`}>
                                    <p>{message.messageText}</p>
                                    <div className="sender-info-div">
                                        <p>{message.sender}</p>
                                    </div>
                                    <div className="message-timestamp">
                                        <p>{getTime(message.createdAt)}</p>
                                        <p>{formatDateShortYear(message.createdAt)}</p>
                                    </div>
                                </div>

                            </div>
                        )
                    })}
                    {/* I'll use this div to scroll to bottom */}
                    <div ref={messageTextArea}></div>
                </div>
                {/* text input */}
                <div className="type-message-div">
                    <form>
                        <textarea
                            value={messageText}
                            onKeyDown={(e) => { if (e.key === 'Enter') addMessage() }}
                            onChange={(e) => setMessageText(e.target.value)}
                        />
                        <p className='send-icon'><IoMdSend onClick={addMessage} /></p>
                    </form>
                </div>
            </div>
        </section>
    )

}

export default ChatBox;