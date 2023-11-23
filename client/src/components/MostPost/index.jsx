/* eslint-disable react/prop-types */
import './index.css';
import ViewPostModal from '../ViewPostModal';
import { Image } from 'cloudinary-react';
import { useState } from 'react';

function MostPost({ title, posts, refreshMostPosts, setRefreshMostPosts }) {
    const [showModal, setShowModal] = useState(false)
    const [postId, setPostId] = useState(null)

    return (
        <>

            {showModal &&
                <ViewPostModal
                    triggerModal={setShowModal}
                    postId={postId}
                    refreshMostPosts={refreshMostPosts}
                    setRefreshMostPosts={setRefreshMostPosts}
                />
            }
            <section className='most-post-main-section'>
                <h3>{title}</h3>

                {/* map the most post */}
                {posts && posts.map((post, index) => {
                    return (
                        <div onClick={() => { setShowModal(true); setPostId(post.id) }} className='single-most-post-div' key={index}>
                            <div className='most-post-content'>
                                <figure>
                                    <Image alt='user profile picture' className='profile-pic-in-most-post' cloudName='dp6owwg93' publicId={post.User.profilePic} />
                                </figure>
                                <div className='most-post-text'>
                                    <p>{post.postText}</p>
                                </div>
                            </div>
                            <div className='post-info-most-post'>
                                <p>{post.likeCount} likes</p>
                                <p>{post.commentCount} comments</p>
                            </div>
                        </div>
                    )
                })}
            </section>
        </>
    )
}

export default MostPost