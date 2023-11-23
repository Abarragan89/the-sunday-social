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
function Post({ postId, isInUserProfile, setTriggerRefresh, triggerRefresh, refreshMostPosts, setRefreshMostPosts }) {
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
    }, [postId, refresh])

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
                setRefreshMostPosts(!refreshMostPosts)
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
                />
            }

            <ToastContainer />

            <section onClick={() => setTimeout(() => setShowModal(true), 200)} className="post-section">
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