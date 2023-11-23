import { useState, useEffect } from "react";
import AddPostModal from "../components/AddPostModal";
import FloatingButton from "../components/FloatingBtn";
import FriendFinder from "../components/FriendFinder";
import FriendRequests from "../components/FriendRequests";

function FriendPage() {

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
                />

                <FriendRequests
                    setTriggerRefreshInFriends={setTriggerRefreshInFriends}
                    triggerRefreshInFriends={triggerRefreshInFriends}
                />
            </main>

            <p>Most talkedabout and most liked</p>
            <p>Socket Io for automatic refresh and notfications</p>
        </main>

    )
}

export default FriendPage;