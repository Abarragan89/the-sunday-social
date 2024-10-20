/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import FloatingButton from "../components/FloatingBtn";
import Post from "../components/Post";
import AddPostModal from "../components/AddPostModal";
import MostPost from "../components/MostPost";
import LoadingIcon from "../components/LoadingIcon";
import 'react-toastify/dist/ReactToastify.css';


function HomePage() {

    const [userData, setUserData] = useState(null);
    // these two use state variable are paired with the floating button
    const [showAddPostModal, setShowAddPostModal] = useState(false)
    const [makeButtonDisappear, setMakeButtonDisappear] = useState(false);
    const [allPosts, setAllPosts] = useState(null);
    const [mostLikedPosts, setMostLikedPosts] = useState(null);
    const [mostCommentedPosts, setMostCommentedPosts] = useState(null);
    const [refreshMostPosts, setRefreshMostPosts] = useState(false)


    async function getUserData() {
        const rawData = await fetch('/api/user');
        const data = await rawData.json();
        console.log('userdata ', data)
        setUserData(data);
    }
    async function getAllPosts() {
        const rawData = await fetch('/api/post/getAllPosts');
        const allPostData = await rawData.json();
        setAllPosts(allPostData);
    }
    async function getMostLikedPosts() {
        const rawData = await fetch('/api/post/mostLikedPosts');
        const mostLiked = await rawData.json();
        setMostLikedPosts(mostLiked)
    }
    async function getMostCommentedPosts() {
        const rawData = await fetch('/api/post/mostCommentedPosts');
        const mostCommented = await rawData.json();
        setMostCommentedPosts(mostCommented)
    }

    useEffect(() => {
        getUserData();
        getAllPosts();
    }, [showAddPostModal])

    useEffect(() => {
        getMostCommentedPosts();
        getMostLikedPosts();
    }, [refreshMostPosts])


    return (
        <main>
            {userData?.profilePic &&
                <>
                    <p className="homepage-greeting">Hello, {userData.username}. Let&apos;s get social...</p>
                    <FloatingButton
                        setShowAddPostModal={setShowAddPostModal}
                        setMakeButtonDisappear={setMakeButtonDisappear}
                        makeButtonDisappear={makeButtonDisappear}
                        showAddPostModal={showAddPostModal} />
                </>
            }
            {showAddPostModal &&
                <AddPostModal
                    setShowPostModal={setShowAddPostModal}
                    setMakeButtonDisappear={setMakeButtonDisappear}
                />
            }

            <h1 className="page-heading">The Sunday Feed</h1>
            <section className="main-section-homepage">

                {!allPosts || !mostCommentedPosts || !mostLikedPosts || !userData ?
                    <LoadingIcon />
                    :
                    <>
                        <div className="homepage-post-div">
                            {allPosts &&
                                allPosts.map((post, index) => {
                                    return (
                                        <Post
                                            postId={post?.id}
                                            key={index}
                                            isUserLoggedIn={userData.id}
                                            isInUserProfile={false}
                                            setTriggerRefresh={setRefreshMostPosts}
                                            triggerRefresh={refreshMostPosts}
                                        />
                                    )
                                })
                            }
                        </div>
                        <aside className="most-post-aside">
                            {/*  Most Liked */}
                            <MostPost
                                title={'Favorited'}
                                posts={mostLikedPosts}
                                isUserLoggedIn={userData.id}
                                refreshMostPosts={refreshMostPosts}
                                setRefreshMostPosts={setRefreshMostPosts}
                            />

                            {/* Most Talked about */}
                            <MostPost
                                title={'Trending'}
                                posts={mostCommentedPosts}
                                isUserLoggedIn={userData.id}
                                refreshMostPosts={refreshMostPosts}
                                setRefreshMostPosts={setRefreshMostPosts}
                            />
                        </aside>
                    </>
                }
            </section>
        </main>
    )
}

export default HomePage;