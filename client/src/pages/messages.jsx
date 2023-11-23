/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import CreateChatModal from "../components/CreateChatModal";
import ChatBox from "../components/ChatBox";


function Messages({triggerRefreshAmongPages }) {
    // these two use state variable are paired with the floating button
    const [showCreateChatModal, setShowCreateChatModal] = useState(false);
    const [userData, setUserData] = useState(null);


    useEffect(() => {
        async function getUserData() {
            const rawData = await fetch('/api/user');
            const data = await rawData.json();
            setUserData(data);
        }

        getUserData();
    }, [])


    return (
        <main>

            {showCreateChatModal &&
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
            />
        </main>


    )
}

export default Messages;