import React, { useMemo, useCallback } from 'react'
import '../../css/pages/Users.css'

const Users = ({ userData, setUserData, state, setState, data, setData, itemsToDisplay, setItemsToDisplay, rights, users, setUsers }) => {

    const getFullName = (user) => {
        let fullName = user.name + ' '
        if (user.secondName) {
            fullName += user.secondName + ' '
        }
        if (user.surName) {
            fullName += user.surName + ' '
        }
        if (user.patronymic) {
            fullName += user.patronymic + ' '
        }
        return fullName
    }

    const getAccess = useCallback((user, userList) => {
        return userList.find(listItem => listItem.id === user._id)?.access
    }, [])
    
    // const usersWithAccess = useMemo(() => {
    //     return users.filter(user => users.some(listItem => listItem.id === user._id))
    //         .map(user => {
    //             const userAccess = users.find(listItem => listItem.id === user._id)?.access
    //             return { ...user, access: userAccess }
    //         });
    // }, [users])

    // const usersWithoutAccess = useMemo(() => {
    //     return users.filter(user => !users.some(listItem => listItem.id === user._id))
    //         .map(user => {
    //             return { ...user, access: null }
    //         })
    // }, [users])

    // Close the dialog

    const saveChanges = (updatedUserList) => {
        // Update state
        setState(prevState => {
            const newState = {
                ...prevState,
                currentProject: {
                    ...state.currentProject,
                    userList: updatedUserList,
                },
            }
            
            // Ensure the state is updated before sending data to the server
            setData({ action: "edit", item: newState.currentProject })
    
            // Return updated state
            return newState
        })
    }

    const handleRemoveUser = (userId) => {
        const updatedUserList = users.filter(item => item.id !== userId)
        saveChanges(updatedUserList)
    }

    const handleAddUser = (userId) => {
        const defaultAccess = rights.length - 1 //lowest
        const updatedUserList = [...users, { id: userId, access: defaultAccess }]
        saveChanges(updatedUserList)
    }

    const handleRightChange = (userId, newRight) => {
        const updatedUserList = userList.map(item => 
            item.id === userId ? { ...item, access: newRight } : item
        )
        saveChanges(updatedUserList)
    }

    return (
        <div className='itemList'>
            <h3>Users with Access</h3>
            <div className="scrollableList">
                {users.map(user => (
                    <div key={user._id} className="userItem" >
                        <span>{getFullName(user)}</span>
                        { (user.genStatus !== 0) &&
                        (userData.access) &&
                        <>
                            <select
                                value={user.access}
                                onChange={(e) => handleRightChange(user._id, e.target.value)}
                            >
                                {rights.names.map((right, index) => {
                                    if (index !== 0) { // Exclude access level 0
                                        return (
                                            <option key={index} value={index}>
                                                {right}
                                            </option>
                                        )
                                    }
                                    return null
                                })}
                            </select>
                            <button onClick={() => handleRemoveUser(user._id)}>Remove</button>
                        </>
                        }
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Users