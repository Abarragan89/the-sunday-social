/* eslint-disable react/prop-types */
import './index.css';
import { useEffect } from 'react';

function FloatingButton({ setShowAddPostModal, makeButtonDisappear, setMakeButtonDisappear }) {


    useEffect(() => {
        if (makeButtonDisappear) {
            setTimeout(() => setShowAddPostModal(true), 200)
        }
    }, [makeButtonDisappear, setShowAddPostModal])



    return (
        <p
            onClick={() => setMakeButtonDisappear(true)}
            className={`add-post-floating-btn ${makeButtonDisappear ? 'remove-position remove-floating-button' : 'initial-position add-post-floating-btn-slide-in'}`}
        >+</p>
    )
}

export default FloatingButton;