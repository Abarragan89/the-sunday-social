/* eslint-disable react/prop-types */
import './index.css';
function ConfirmModal({ triggerModal, confirmFunction, data }) {
    return (
        <section onClick={() => { triggerModal(false) }} className='modal-container'>
            <div onClick={(e) => e.stopPropagation()} className='modal'>
            <h3 className="modal-title">Delete Friend</h3>
            <p className="confirm-modal-text">Are you sure you want to delete <span>{data}</span> from your friend list? </p>
            <button onClick={confirmFunction} className="submit-btn">Delete Friend</button>
            </div>
        </section>
    )
}

export default ConfirmModal;