/* eslint-disable react/prop-types */

function ConfirmModal({ triggerModal, confirmFunction, data }) {
    return (
        <section onClick={() => { triggerModal(false) }} className='modal-container'>
            <div onClick={(e) => e.stopPropagation()} className='modal'>
            <h3 className="modal-title">Select Friends</h3>
            <p>Are you sure you want to delete {data} from your friend list? </p>
            <button onClick={confirmFunction} className="submit-btn">Delete Friend</button>
            </div>
        </section>
    )
}

export default ConfirmModal;