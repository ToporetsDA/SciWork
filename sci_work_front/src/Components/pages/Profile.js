import React, { useState } from 'react';
import '../../css/pages/Profile.css';

const Profile = ({ userData, setUserData, profileData }) => {

    const [editMode, setEditMode] = useState(false);
    const [tmpUserData, setTempData] = useState({ ...userData });
    const [errors, setErrors] = useState({});
  
    const handleInputChange = (field, value) => {
        setTempData({ ...tmpUserData, [field]: value });
        setErrors({ ...errors, [field]: false }); // Clear error on change
    };
  
    const validateRequiredFields = () => {
        const newErrors = {};
        Object.entries(profileData.basic).forEach(([key, [isRequired]]) => {
            if (isRequired && (!tmpUserData[key] || tmpUserData[key].trim() === '')) {
            newErrors[key] = true; // Mark field as invalid
            }
        });
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0; // Return true if no errors
    };

    const saveChanges = () => {
        if (!validateRequiredFields()) {
            alert("Please fill out all required fields.");
            return;
        }
        setUserData(tmpUserData);
        setEditMode(false);
    };
    
    return (
        <div className="accountPage">
            <h2>Account Details</h2>
            {/* <div className='accountImage'>
                {userData.photo !== undefined &&
                    <></>
                }
            </div> */}
            <div className="accountInfo">
                {Object.entries(profileData.basic).map(([key, [isRequired, type]]) => (
                    <div className="accountField" key={key}>
                        <label>
                            
                            {isRequired && editMode && !profileData.fixed.includes(key) &&
                                <p className='required'>'*'</p>
                            }
                            {key}
                        </label>
                        {(editMode && !profileData.fixed.includes(key)) ? (
                            <input
                                type={type === 'mail' ? 'email' : 'text'}
                                value={tmpUserData[key] || ''}
                                onChange={(e) => {
                                    if (!profileData.fixed.includes(key)) {
                                        handleInputChange(key, e.target.value)
                                    }
                                }}
                                disabled={profileData.fixed.includes(key)}
                            />
                        ) : (
                            <p className='fixed'>{tmpUserData[key] || '.'}</p>
                        )}
                    </div>
                ))}
            </div>
            <div className="accountActions">
                {editMode ? (
                    <>
                        <button onClick={saveChanges}>Save</button>
                        <button onClick={() => setEditMode(false)}>Cancel</button>
                    </>
                ) : (
                    <button onClick={() => setEditMode(true)}>Edit Profile</button>
                )}
            </div>
        </div>
    );
};

export default Profile;

/*!!! for beta-version !!!

permission list

profile image

locale related settings
last login dateTime

account status          (active, disabled, suspended)

list of devices         (optional, may be required)
list of allowed devices (optional)

more organisation data  (like class, department) (optional)
*/