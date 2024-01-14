/* eslint-disable react/prop-types */
import { useState, useEffect, useContext } from "react";
import CreateChatModal from "../components/CreateChatModal";
import ChatBox from "../components/ChatBox";
import LoadingIcon from "../components/LoadingIcon";
import { authStatusContext } from "../store/auth";



function Messages({ triggerRefreshAmongPages, setTriggerRefreshAmongPages }) {
    // these two use state variable are paired with the floating button
    const [showCreateChatModal, setShowCreateChatModal] = useState(false);
    const [userData, setUserData] = useState(null);

    const { isLoggedIn } = useContext(authStatusContext);

    useEffect(() => {
        async function getUserData() {
            const rawData = await fetch('/api/user');
            const data = await rawData.json();
            setUserData(data);
        }
        getUserData();
    }, [])


    return (
        <>
            {isLoggedIn === null &&
                <p className="sign-in-to-view-page-text">You need to <span>sign in </span> to view this page</p>
            }
            {userData?.id ?
                <main>
                    {userData &&
                        showCreateChatModal &&
                        <CreateChatModal
                            triggerModal={setShowCreateChatModal}
                        />
                    }
                    <button className="submit-btn" id="create-chatroom-btn" onClick={() => setShowCreateChatModal(true)}>New Chat+</button>
                    <ChatBox
                        username={userData?.username}
                        userId={userData?.id}
                        triggerModalStatus={showCreateChatModal}
                        triggerRefreshAmongPages={triggerRefreshAmongPages}
                        setTriggerRefreshAmongPages={setTriggerRefreshAmongPages}
                    />
                </main>
                :
                isLoggedIn && <LoadingIcon />
            }
        </>


    )
}

export default Messages;