/* eslint-disable react/prop-types */
import { IoMdSend } from 'react-icons/io'
import { useEffect, useState } from 'react';
import { formatDate } from '../../utils/formatDate';
import { Image } from 'cloudinary-react';
import './index.css';

// all these refreshes refresh different components
function ViewPostModal({
    triggerModal,
    postId,
    postRefresh,
    postStatus,
    isInEditMode,
    setTriggerRefresh,
    triggerRefresh,
    refreshMostPosts,
    setRefreshMostPosts
}) {

    const [postData, setPostData] = useState(null);
    const [updatedPostText, setUpdatedPostText] = useState('');
    const [isUserLoggedIn, setIsUserLoggedIn] = useState(false)
    const [confirmDeletePost, setConfirmDeletePost] = useState(false);
    const [refresh, setRefresh] = useState(false);


    async function getUserData() {
        const rawData = await fetch('/api/user');
        const data = await rawData.json();
        if (data?.username) {
            setIsUserLoggedIn(true)
        }
    }
    async function getSinglePost() {
        const rawData = await fetch(`/api/post/getSingleViewPost/${postId}`);
        const response = await rawData.json();
        setPostData(response)
        setUpdatedPostText(response.postText)
    }
    useEffect(() => {
        getSinglePost();
        getUserData();
    }, [postId, refresh])


    const [commentText, setCommentText] = useState('');
    async function addComment() {
        if (commentText === '') {
            return
        }
        try {
            const data = await fetch('/api/user/addComment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    commentText,
                    postId,
                })
            })
            const response = await data.json();
            if (response) {
                await addNotificationToPost()
                setRefresh(!refresh);
                setCommentText('');
                // refreshes the post in Post component OR the Most Post
                postRefresh ? postRefresh(!postStatus) : setRefreshMostPosts(!refreshMostPosts);
            }
        } catch (err) {
            console.log('comment not added ', err);
        }
    }

    async function addNotificationToPost() {
        try {
            const data = await fetch('/api/user/addNotificationToPost', {
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
            console.log('comment not added ', err);
        }
    }



    async function editPostHandler() {
        try {
            const data = await fetch('/api/user/updatePost', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    updatedPostText,
                    postId
                })
            })

            const response = await data.json();

            if (!response) {
                console.log('error updating post')
            } else {
                triggerModal(false);
                postRefresh(!postStatus)
            }
        } catch (err) {
            console.log(err)
        }
    }

    async function deletePost() {
        try {
            const data = await fetch('/api/user/deletePost', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    postId
                })
            })

            const response = await data.json();
            if (!response) {
                console.log('could not delete post')
            } else {
                triggerModal(false);
                setTriggerRefresh(!triggerRefresh)
            }
        } catch (err) {
            console.log(err)
        }
    }


    return (
        <section onClick={() => { triggerModal(false) }} className='modal-container'>
            <div onClick={(e) => e.stopPropagation()} className='modal'>
                {/* check to see if we are in edit mode */}
                {isInEditMode && updatedPostText ?
                    <>
                        <h3 className='modal-title'>Edit Post</h3>
                        <div className='post-form-textarea-div'>
                            <textarea
                                className='post-form-textarea'
                                type='text'
                                value={updatedPostText}
                                onChange={((e) => setUpdatedPostText(e.target.value))}
                                placeholder='what&apos;s going on...'
                            />
                            <p className='send-icon'><IoMdSend onClick={editPostHandler} /></p>
                        </div>
                        {!confirmDeletePost &&
                            <button className='delete-button' onClick={() => setConfirmDeletePost(true)}>Delete Post</button>
                        }
                        {confirmDeletePost &&
                            <button className='delete-button' onClick={deletePost}>Confirm Delete</button>
                        }
                    </>
                    :
                    <>
                        <div className='post-modal-user-info'>
                            <div className='flex-box'>
                                <Image alt='user profile picture' className='profile-pic' cloudName='dp6owwg93' publicId={postData?.User?.profilePic} />
                                <div>
                                    <p>{postData?.author}</p>
                                    <p>{formatDate(postData?.createdAt)}</p>
                                </div>
                            </div>
                        </div>
                        <p className='post-modal-text'>{postData?.postText}</p>
                    </>
                }
                {/* Conditionally render comment section only if there are comments to display */}
                {postData && postData?.Comments.length === 0 ?
                    <></>
                    :
                    <div className='comment-section-div'>
                        {!isUserLoggedIn &&
                            <p className='signin-to-comment-text'>Sign in to comment...</p>
                        }

                        {/* Comment Section */}

                        {postData?.Comments.map((comment, index) => {
                            return (
                                <div key={index} className='single-comment-div'>
                                    <div className='user-comment-info'>
                                        <div className='flex-box'>
                                            <figure>
                                                <Image alt='user profile picture' className='profile-pic' cloudName='dp6owwg93' publicId={comment?.User?.profilePic} />
                                            </figure>
                                            <div>
                                                <p>{comment?.User?.username}</p>
                                                <p>{formatDate(comment?.createdAt)}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <p className='single-comment'>{comment.commentText}</p>
                                </div>
                            )
                        })
                        }

                    </div>
                }
                {/* only show comment box if user is logged in */}
                {isUserLoggedIn && !isInEditMode ?
                    <div className='comment-textarea-div'>
                        <textarea
                            className='comment-textarea'
                            type='text'
                            value={commentText}
                            placeholder='comment...'
                            onChange={(e) => setCommentText(e.target.value)}
                        />
                        <p onClick={addComment} className='send-icon'><IoMdSend /></p>
                    </div>
                    :
                    <></>
                }
            </div>
        </section>
    )
}

export default ViewPostModal;