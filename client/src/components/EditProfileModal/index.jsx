/* eslint-disable react/prop-types */
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import './index.css'

function EditProfileModal({ setShowModal, userData, triggerRefresh, setTriggerRefresh }) {
    const [relationshipStatus, setRelationshipStatus] = useState(userData?.relationshipStatus);
    const [school, setSchool] = useState(userData?.school);
    const [work, setWork] = useState(userData?.work);
    const [currentlyLearning, setCurrentlyLearning] = useState(userData?.currentlyLearning);
    const [petPeeve, setPetPeeve] = useState(userData?.petPeeve);
    const [headline, setHeadline] = useState(userData?.headline);
    const [website, setWebsite] = useState(userData?.website);
    const [hobbies, setHobbies] = useState(userData?.hobbies);


    const showToastMessage = (errorMsg) => {
        toast.error(errorMsg, {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 3000,
            className: 'toast-message',
            toastId: 'httpsRequired'
        });
    };


    async function updateUserInfo(e) {
        e.preventDefault();
        // check the format of website and enforce 'https://'
        const urlRegex = /^https:\/\//;
        if (!urlRegex.test(website) && website) {
            showToastMessage('website needs to start with \'https://\'')
            return
        }
        try {
            const data = await fetch('/api/user/updateUserInfo', {
                method: 'PUT', 
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    relationshipStatus,
                    school,
                    work,
                    currentlyLearning,
                    petPeeve, 
                    headline,
                    website,
                    hobbies
                })
            })

            const response = await data.json();
            if(response.error) {
                console.log(response.error)
                return
            }
            setTriggerRefresh(!triggerRefresh);
            setShowModal(false);
        } catch (err) {
            console.log('could not update user', err)
        }
    }


    return (
        <div onClick={() => setShowModal(false)} className="modal-container">
            <div onClick={(e) => e.stopPropagation()} className="modal">
                <ToastContainer />
                <h3 className="modal-title">Update Info</h3>
                <form className="update-userinfo-form" onSubmit={(e) => updateUserInfo(e)}>
                    <label htmlFor="relationshipStatus">Relationship Status</label>
                    <select value={relationshipStatus} id="relationshipStatus" onChange={(e) => setRelationshipStatus(e.target.value)} className="form-input">
                        <option>Single</option>
                        <option>Married</option>
                        <option>Partner</option>
                        <option>Dating</option>
                        <option>Yikes</option>
                    </select>

                    <div className="flex-box-sb">
                        <label htmlFor="school">School</label>
                        <p className="form-character-count">{school.length}/30</p>
                    </div>
                    <input
                        type="text"
                        value={school}
                        className="form-input"
                        id="school"
                        maxLength={30}
                        onChange={(e) => setSchool(e.target.value)}
                    />

                    <div className="flex-box-sb">
                        <label htmlFor="work">Work</label>
                        <p className="form-character-count">{work.length}/30</p>
                    </div>
                    <input
                        type="text"
                        value={work}
                        maxLength={30}
                        className="form-input"
                        id="work"
                        onChange={(e) => setWork(e.target.value)}
                    />

                    <div className="flex-box-sb">
                        <label htmlFor="currently-learning">Currently Learning</label>
                        <p className="form-character-count">{currentlyLearning.length}/20</p>
                    </div>
                    <input
                        type="text"
                        value={currentlyLearning}
                        className="form-input"
                        maxLength={20}
                        id="currently-learning"
                        onChange={(e) => setCurrentlyLearning(e.target.value)}
                    />
                    
                    <div className="flex-box-sb">
                        <label htmlFor="hobbies">Hobbies</label>
                        <p className="form-character-count">{hobbies.length}/30</p>
                    </div>
                    <input
                        type="text"
                        value={hobbies}
                        className="form-input"
                        maxLength={30}
                        id="hobbies"
                        onChange={(e) => setHobbies(e.target.value)}
                    />

                    <div className="flex-box-sb">
                        <label htmlFor="petPeeve">Pet Peeve</label>
                        <p className="form-character-count">{petPeeve.length}/28</p>
                    </div>
                    <input
                        type="text"
                        value={petPeeve}
                        className="form-input"
                        maxLength={28}
                        id="pet-peeve"
                        onChange={(e) => setPetPeeve(e.target.value)}
                    />


                    <div className="flex-box-sb">
                        <label htmlFor="headline">Headline</label>
                        <p className="form-character-count">{headline.length}/100</p>
                    </div>
                    <textarea
                        type="text"
                        value={headline}
                        className="form-input"
                        maxLength={100}
                        id="headline"
                        onChange={(e) => setHeadline(e.target.value)}
                    />

                    <label htmlFor="website">Website</label>
                    <input
                        type="text"
                        value={website}
                        className="form-input"
                        id="website"
                        placeholder="https://..."
                        onChange={(e) => setWebsite(e.target.value)}
                    />
                    <button className="submit-btn" type="submit">Update</button>
                </form>

            </div>
        </div>
    )
}

export default EditProfileModal;