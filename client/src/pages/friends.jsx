/* eslint-disable react/prop-types */
import { useState, useEffect, useContext } from "react";
import AddPostModal from "../components/AddPostModal";
import FloatingButton from "../components/FloatingBtn";
import FriendFinder from "../components/FriendFinder";
import FriendRequests from "../components/FriendRequests";
import { authStatusContext } from "../store/auth";
import LoadingIcon from "../components/LoadingIcon";

function FriendPage({ triggerRefreshAmongPages, setTriggerRefreshAmongPages }) {

    const { isLoggedIn } = useContext(authStatusContext)

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
        <>
        {isLoggedIn === null &&
            <p className="sign-in-to-view-page-text">You need to <span>sign in </span> to view this page</p>
        }
            {userData?.id ?
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
                </main>
                :
                isLoggedIn && <LoadingIcon />
            }
        </>

    )
}

export default FriendPage;