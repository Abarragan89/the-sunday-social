/* eslint-disable react/prop-types */
import './index.css';
function ShowChatUserListModal({ triggerModal, data, username }) {
    return (
        <section onClick={() => { triggerModal(false) }} className='modal-container'>
            <div onClick={(e) => e.stopPropagation()} className='modal'>
                <h3 className="modal-title">Chat List</h3>
                <ul className="chat-user-list">
                    {data.split(', ').map((user, index) => {
                        if (user === username) return 
                        return (
                            <li key={index}>{user}</li>
                        )
                    })}

                </ul>
                <button className="submit-btn" onClick={() => triggerModal(false)}>Ok</button>
            </div>
        </section>
    )
}

export default ShowChatUserListModal;