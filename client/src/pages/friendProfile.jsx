/* eslint-disable react/prop-types */
import AddPostModal from "../components/AddPostModal";
import FloatingButton from "../components/FloatingBtn";
import Post from "../components/Post";
import { useParams } from "react-router-dom";
import EditProfileModal from "../components/EditProfileModal";
import { useEffect, useState } from "react";
import { Image } from 'cloudinary-react';

function FriendProfilePage() {

    const { friendId } = useParams();

    // these two use state variable are paired with the floating button
    const [showAddPostModal, setShowAddPostModal] = useState(false)
    const [makeButtonDisappear, setMakeButtonDisappear] = useState(false);
    const [triggerRefresh, setTriggerRefresh] = useState(false)
    const [userData, setUserData] = useState(null)
    const [showEditModal, setShowEditModal] = useState(false)

    useEffect(() => {
        async function getUserInfo() {
            try {
                const data = await fetch(`/api/user/getFriendInfo/${friendId}`);
                const response = await data.json();
                setUserData(response)
            }
            catch (err) {
                console.log(err)
            }
        }
        getUserInfo()
    }, [showAddPostModal, triggerRefresh])


    const [photoUrl, setPhotoUrl] = useState(userData?.profilePic)

    useEffect(() => {
        setPhotoUrl(userData?.profilePic)
    }, [userData?.profilePic])


    return (
        <>
            {userData?.id ?
                <main>
                    {/* FLOATING BUTTON */}
                    {showAddPostModal &&
                        <AddPostModal
                            setShowPostModal={setShowAddPostModal}
                            setMakeButtonDisappear={setMakeButtonDisappear}

                        />
                    }

                    {showEditModal &&
                        <EditProfileModal
                            setShowModal={setShowEditModal}
                            userData={userData}
                            triggerRefresh={triggerRefresh}
                            setTriggerRefresh={setTriggerRefresh}
                        />
                    }
                    <FloatingButton
                        setShowAddPostModal={setShowAddPostModal}
                        setMakeButtonDisappear={setMakeButtonDisappear}
                        makeButtonDisappear={makeButtonDisappear}
                        showAddPostModal={showAddPostModal}
                    />
                    {/* User Info */}
                    <h2 className="section-heading"><span>Friend Info</span></h2>


                    <section className="profile-stats-main-section">
                        <div className="user-profile-image-bio">

                            <Image className='user-profile-image' cloudName='dp6owwg93' publicId={photoUrl} />

                            <h3>Headline</h3>

                            <p className="user-bio">&ldquo;{userData?.headline}&rdquo;</p>

                            <h3>Website</h3>
                            <a className="view-work-link" target="_blank" rel="noopener noreferrer" href={userData?.website}>View my work</a>
                        </div>

                        <div className="user-stats">
                            <h3>Searchable Qualities</h3>
                            <p>Username: <span>{userData && userData?.username}</span></p>
                            <p>Email: <span>{userData && userData?.email}</span></p>
                            <p>Relationship Status: <span>{userData && userData?.relationshipStatus}</span></p>
                            <p>School: <span>{userData && userData?.school}</span></p>
                            <p>Work: <span>{userData && userData?.work}</span></p>
                            <p>Currently Learning: <span>{userData && userData?.currentlyLearning}</span></p>
                            <p>Hobbies: <span>{userData && userData?.hobbies}</span></p>
                            <p>Pet Peeve: <span>{userData && userData?.petPeeve}</span></p>
                        </div>
                    </section>


                    {/* User Posts */}
                    <h2 className="section-heading"><span>{userData?.username}&apos;s Posts</span></h2>
                    {userData &&
                        userData?.Posts.map((post, index) => {
                            return (
                                <Post
                                    key={index}
                                    postId={post.id}
                                    setTriggerRefresh={setTriggerRefresh}
                                    triggerRefresh={triggerRefresh}
                                />
                            )
                        })
                    }
                </main>
                :
                <p className="sign-in-to-view-page-text">You need to <span>sign in </span> to view this page</p>
            }
        </>
    )

}

export default FriendProfilePage;
