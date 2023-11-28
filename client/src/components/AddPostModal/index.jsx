/* eslint-disable react/prop-types */
import { IoMdSend } from 'react-icons/io'
import { useState } from 'react';
import { ToastContainer, toast } from "react-toastify";
import './index.css';


function AddPostModal({ setMakeButtonDisappear, setShowPostModal }) {

    const showToastMessage = (errorMsg) => {
        toast.error(errorMsg, {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 2000,
            className: 'toast-message',
            toastId: 'postMustHaveText'
        });
    };

    const [postText, setPostText] = useState('');

    async function postHandler(e) {
        e.preventDefault();
        if (postText.trim() === '') {
            showToastMessage('Add text to post');
            return
        }
        try {
            const data = await fetch('/api/user/addPost', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    postText
                })
            })
            const response = await data.json();
            if (!response) {
                showToastMessage('Oops, an error occurred')
            } else {
                setShowPostModal(false)
                setMakeButtonDisappear(false)
            }

        } catch (err) {
            console.log(err)
        }

    }

    return (
        <div onClick={() => { setMakeButtonDisappear(false); setShowPostModal(false) }} className='modal-container'>
            <div onClick={(e) => e.stopPropagation()} className='modal'>
                <ToastContainer />
                <h3 className='modal-title'>Add Post</h3>
                <div className='post-form-textarea-div'>
                    <textarea
                        className='post-form-textarea'
                        type='text'
                        onChange={((e) => setPostText(e.target.value) )}
                        placeholder='what&apos;s going on...'
                    />
                    <p className='send-icon'><IoMdSend onClick={postHandler} /></p>
                </div>
            </div>
        </div>
    )
}

export default AddPostModal;