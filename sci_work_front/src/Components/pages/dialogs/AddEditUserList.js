import React, { useState, useMemo }  from 'react'
import '../../../css/pages/dialogs/AddEditUserList.css'
import '../../../css/pages/dialogs/dialog.css'

const AddEditUserList = ({ userData, setUserData, data, setData, state, setState, rights, users, itemStructure, defaultStructure, isCompany }) => {

    const currentItem = useMemo(() => {
        return state.currentProject
    }, [state.currentProject])

    const userList = useMemo(() => {
        return currentItem.userList || []
    }, [currentItem])

    const usersWithAccess = useMemo(() => {
        return users.filter(user => userList.some(listItem => listItem.id === user._id))
    }, [users, userList])

    const usersWithoutAccess = useMemo(() => {
        return users.filter(user => !userList.some(listItem => listItem.id === user._id))
    }, [users, userList])

    const handleInputChange = (e) => {
        
    }

    // Close the dialog

    const handleOutsideClick = (e) => {
        if (e.target === e.currentTarget) {
            setState((prevState) => ({
                ...prevState,
                currentDialog: {
                    name: undefined,
                    params: []
                }
            }))
        }
    }

    const formatLabel = (key) => key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())

    const handleRemoveUser = (userId) => {
        // Logic to remove user from the current list
    }

    const handleAddUser = (userId) => {
        // Add user to userList in currentItem with default access
        const defaultAccess = rights.length > 0 ? rights[0].value : null;
        const updatedUserList = [...userList, { id: userId, access: defaultAccess }];
        setState(prevState => ({
            ...prevState,
            currentProject: {
                ...currentItem,
                userList: updatedUserList,
            },
        }));
    };

    const handleRightChange = (userId, newRight) => {
        // Logic to change access rights
    }

    return (
        <div className="AddEditUserListDialog dialogContainer" onClick={handleOutsideClick}>
            <div className="dialogContent">
                <div className="usersWithAccess">
                    <h3>Users with Access</h3>
                    <div className="scrollableList">
                        {usersWithAccess.map(user => (
                            <div key={user.id} className="userItem">
                                <span>{`${user.name} ${user.secondName} ${user.surname} ${user.patronymic}`}</span>
                                <select
                                    value={user.right}
                                    onChange={(e) => handleRightChange(user.id, e.target.value)}
                                >
                                    {rights.map((right) => (
                                        <option key={right.value} value={right.value}>
                                            {right.name}
                                        </option>
                                    ))}
                                </select>
                                <button onClick={() => handleRemoveUser(user.id)}>Remove</button>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="usersWithoutAccess">
                    <h3>Users without Access</h3>
                    <div className="scrollableList">
                        {usersWithoutAccess.map(user => (
                            <div key={user.id} className="userItem">
                                <span>{`${user.name} ${user.secondName} ${user.surname} ${user.patronymic}`}</span>
                                <button onClick={() => handleAddUser(user.id)}>Add</button>
                            </div>
                        ))}
                    </div>
                </div>
                <button
                    className='backButton'
                    onClick={handleOutsideClick}
                >
                    Back
                </button>
            </div>
        </div>
    )
}

export default AddEditUserList