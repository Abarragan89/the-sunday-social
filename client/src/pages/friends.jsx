/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import AddPostModal from "../components/AddPostModal";
import FloatingButton from "../components/FloatingBtn";
import FriendFinder from "../components/FriendFinder";
import FriendRequests from "../components/FriendRequests";

function FriendPage({ triggerRefreshAmongPages, setTriggerRefreshAmongPages }) {

    // these two use state variable are paired with the floating button
    const [showAddPostModal, setShowAddPostModal] = useState(false)
    const [makeButtonDisappear, setMakeButtonDisappear] = useState(false);
    const [triggerRefreshInFriends, setTriggerRefreshInFriends] = useState(false)
    const [userData, setUserData] = useState(null)

    useEffect(() => {
        async function getUserData() {
            const rawData = await fetch('/api/user');
            const data = await rawData.json();
            setUserData(data);
        }

        getUserData();
    }, [showAddPostModal])

    return (
        <main>
            {showAddPostModal &&
                <AddPostModal
                    setShowPostModal={setShowAddPostModal}
                    setMakeButtonDisappear={setMakeButtonDisappear}
                />
            }

            <FloatingButton
                setShowAddPostModal={setShowAddPostModal}
                setMakeButtonDisappear={setMakeButtonDisappear}
                makeButtonDisappear={makeButtonDisappear}
                showAddPostModal={showAddPostModal} />

            <main className="friend-page-main">
                <FriendFinder
                    setTriggerRefreshInFriends={setTriggerRefreshInFriends}
                    triggerRefreshInFriends={triggerRefreshInFriends}
                    userId={userData?.id}
                    triggerRefreshAmongPages={triggerRefreshAmongPages}
                    setTriggerRefreshAmongPages={setTriggerRefreshAmongPages}
                />

                <FriendRequests
                    setTriggerRefreshInFriends={setTriggerRefreshInFriends}
                    triggerRefreshInFriends={triggerRefreshInFriends}
                />
            </main>
            <p>Socket Io for automatic refresh and notfications</p>
            <p>making a new message from friends needs to refresh friends list</p>
            <p>making new chat from modal will make new chat with single user even if it already exists</p>
        </main>

    )
}

export default FriendPage;