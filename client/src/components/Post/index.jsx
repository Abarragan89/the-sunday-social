/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import ViewPostModal from '../ViewPostModal';
import { BiLike } from 'react-icons/bi'
import { formatDate } from '../../utils/formatDate'
import { ToastContainer, toast } from "react-toastify";
import './index.css';
import { Image } from 'cloudinary-react';

// triggerRefresh is for refreshing the profile page on change
// refresh is to refresh the post data when in view single post modal
function Post({ postId, isInUserProfile, setTriggerRefresh, triggerRefresh, isUserLoggedIn }) {
    const [showModal, setShowModal] = useState(false)
    const [postData, setPostData] = useState(null)
    const [refresh, setRefresh] = useState(false);


    useEffect(() => {
        async function getPost() {
            try {
                const data = await fetch(`/api/post/getSinglePost/${postId}`);
                const response = await data.json();
                setPostData(response)
            } catch (err) {
                console.log('could not get post ', err)
            }
        }
        getPost();
    }, [postId, refresh, showModal])

    async function addLike(e) {
        e.stopPropagation();
        try {
            const data = await fetch('/api/user/addLike', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    postId: postData.id
                })
            })
            const response = await data.json();
            if (response.error) {
                showToastMessage(response.error)
            }
            if (response) {
                setTriggerRefresh(!triggerRefresh)
                setRefresh(!refresh)
            }
        } catch (err) {
            console.log(err)
        }
    }

    const showToastMessage = (errorMsg) => {
        toast.error(errorMsg, {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 2000,
            className: 'toast-message',
            toastId: 'cannotLike'
        });
    };

    async function removeNotificationFromPost() {
        try {
            const data = await fetch('/api/user/removeNotificationFromPost', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    postId,
                })
            })
            const response = await data.json();
            if (!response) {
                console.log('could not add notification to post')
            }
        } catch (err) {
            console.log('comment not added', err);
        }
    }

    return (
        <>
            {showModal &&
                <ViewPostModal
                    triggerModal={setShowModal}
                    postId={postData?.id}
                    // these two props are for fresh of post
                    postRefresh={setRefresh}
                    postStatus={refresh}
                    isInEditMode={isInUserProfile}
                    setTriggerRefresh={setTriggerRefresh}
                    triggerRefresh={triggerRefresh}
                    isUserLoggedIn={isUserLoggedIn}
                />
            }

            <ToastContainer />
            <section onClick={() => setTimeout(() => {setShowModal(true); removeNotificationFromPost()}, 200)} className="post-section">       
                <div className="post-header">
                    <div className='flex-box-sa'>

                        <figure>
                            <Image alt='user profile picture' className='profile-pic' cloudName='dp6owwg93' publicId={postData?.User?.profilePic} />
                        </figure>
                        <div>
                            <p>{postData?.author}</p>
                            <p>{formatDate(postData?.createdAt)}</p>
                        </div>
                    </div>

                    {isInUserProfile && <p className='click-to-edit-modal-text'>(click to edit)</p>}
                    {/* Notification Bubble */}
                    {postData?.notifications && isInUserProfile > 0 ? <p className='notification-on-post-profile'>{postData.notifications}</p> : <p></p>}

                </div>
                <div className="post-body">
                    <p>{postData?.postText}</p>
                </div>
                <div className="post-footer">
                    <p>{postData?.Comments?.length}
                        {postData?.Comments?.length > 1 ? ' comments' : ' comment'}
                    </p>
                    <div>
                        <p>{postData?.Likes?.length}</p>
                        <p className='like-icon' onClick={(e) => addLike(e)}><BiLike /></p>
                    </div>
                </div>
            </section>
        </>
    )
}

export default Post;