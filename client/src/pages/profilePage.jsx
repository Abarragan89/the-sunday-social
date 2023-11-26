/* eslint-disable react/prop-types */
import AddPostModal from "../components/AddPostModal";
import FloatingButton from "../components/FloatingBtn";
import Post from "../components/Post";
import { useNavigate } from "react-router-dom";
import EditProfileModal from "../components/EditProfileModal";
import { useEffect, useState } from "react";
import { IoCloudUpload } from 'react-icons/io5'
import { FaCheckCircle } from "react-icons/fa";
import Axios from 'axios';
import { Image } from 'cloudinary-react';

function ProfilePage({ triggerRefreshAmongPages, setTriggerRefreshAmongPages}) {
    const navigate = useNavigate();

    // these two use state variable are paired with the floating button
    const [showAddPostModal, setShowAddPostModal] = useState(false)
    const [makeButtonDisappear, setMakeButtonDisappear] = useState(false);
    const [triggerRefresh, setTriggerRefresh] = useState(false)
    const [userData, setUserData] = useState(null)
    const [showEditModal, setShowEditModal] = useState(false)

    useEffect(() => {
        async function getUserInfo() {
            try {
                const data = await fetch('/api/user/getUserInfo');
                const response = await data.json();
                setUserData(response)
            }
            catch (err) {
                console.log(err)
            }
        }
        getUserInfo()
    }, [showAddPostModal, triggerRefresh])

    // Profile Picture logic and Variables
    const [imageSelected, setImageSelected] = useState('');
    const [photoUrl, setPhotoUrl] = useState(userData?.profilePic)

    useEffect(() => {
        setPhotoUrl(userData?.profilePic)
    }, [userData?.profilePic])

    // Math.fact.missions@gmail.com is my account email with cloudinary
    async function uploadImage() {
        try {
            // set up form data
            const formData = new FormData();
            formData.append('file', imageSelected)
            formData.append('upload_preset', 'ct5upohe')
            // make Axios request to cloudinary for Post
            Axios.post(
                'https://api.cloudinary.com/v1_1/dp6owwg93/image/upload',
                formData
            ).then( async (response) => {
                setImageSelected('');
                setPhotoUrl(response.data.url)
                // save photo to user's database
                await fetch('/api/user/updateProfilePic', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        profilePicURL: response.data.url
                    })
                })
            })
        } catch (err) {
            console.log('image not uploaded')
        }
    }
    async function handleLogout() {
        try {
            await fetch('/api/auth/logout', {
                method: 'POST'
            });
            localStorage.removeItem('token');
            navigate('/');
            setTriggerRefreshAmongPages(!triggerRefreshAmongPages)
        } catch (err) {
            console.log('problem signing out', err)
        }
    }
    return (
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

            <p className="submit-btn logout-btn" onClick={handleLogout}>Logout</p>
            <h2 className="section-heading"><span>Your Info</span></h2>

            {userData && 
            <section className="profile-stats-main-section">
                <div className="user-profile-image-bio">

                    <Image className='user-profile-image' cloudName='dp6owwg93' publicId={photoUrl} />
                    
                    <input type="file" name="upload-pic" id="upload-pic-input"
                        onChange={(event) => { setImageSelected(event.target.files[0]) }}
                    />

                    <h3>Headline
                    {imageSelected ?
                        <p className="open-file-profile-pic-btn" onClick={uploadImage}>
                        <FaCheckCircle />
                        </p>
                        :
                        <label className="open-file-profile-pic-btn" htmlFor="upload-pic-input">
                            <IoCloudUpload />
                        </label>
                    }
                    </h3>
                    <p className="user-bio">&ldquo;{userData?.headline}&rdquo;</p>

                    <h3>Website</h3>
                    <a className="view-work-link" target="_blank" rel="noopener noreferrer" href={userData?.website}>View my work</a>
                </div>
                <button className="edit-profile-btn" onClick={() => setShowEditModal(true)}>edit</button>

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
            }


            {/* User Posts */}
            <h2 className="section-heading"><span>My Posts</span></h2>
            {userData &&
                userData?.Posts.map((post, index) => {
                    return (
                        <Post
                            key={index}
                            postId={post.id}
                            isInUserProfile={true}
                            setTriggerRefresh={setTriggerRefresh}
                            triggerRefresh={triggerRefresh}
                        />
                    )
                })
            }
        </main>
    )

}

export default ProfilePage;
