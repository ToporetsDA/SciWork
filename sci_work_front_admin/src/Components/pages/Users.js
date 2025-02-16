import React, { useState } from 'react'
import '../../css/pages/Users.css'
import ControlPanel from './sharedComponents/ControlPanel'
import * as Shared from './sharedComponents/index'

const Users = ({ userData, setUserData, state, setState, data, setData, itemsToDisplay, setItemsToDisplay, rights, users, setUsers }) => {

    const ShowFullData = Shared.ShowFullData

    const [expandedUser, setExpandedUser] = useState(null)

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

    const handleRightChange = (id, data) => {
        setUsers("edit", id, data)
    }

    const toggleExpand = (userId) => {
        setExpandedUser(prev => (prev === userId ? null : userId))
    }

    const OpenDialog = (name, params) => {
        setState((prevState) => ({
            ...prevState,
            currentDialog: {
                name: name,
                params: params},
        }))
    }

    return (
        <div className='itemList'>
            {/* <ControlPanel
                userData={userData}
                setUserData={setUserData}
                state={state}
                setState={setState}
                data={data}
                rights={rights}
                setItemsToDisplay={setItemsToDisplay}
            /> */}
            <div className="scrollableList">
                {users
                .sort((a, b) => a.genStatus - b.genStatus)
                .map(user => {
                    return (
                        (user._id !== userData._id) &&
                        <div key={user._id} className="userItem" >
                            <span>{getFullName(user)}</span>
                            { (user.genStatus !== 0) &&
                            <>
                                <select
                                    value={user.genStatus}
                                    onChange={(e) => handleRightChange(user._id, { genStatus: e.target.value })}
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
                                <button onClick={() => toggleExpand(user._id)}>
                                    {expandedUser === user._id ? "Hide Details" : "Show Details"}
                                </button>
                                <button onClick={() => {OpenDialog("Action", [user, (!user.ban) ? "ban" : "unban"])}}>
                                    {(!user.ban) ? "Ban" : "Unban"}
                                </button>
                                {expandedUser === user._id && (
                                    <div className="extraData">
                                        {ShowFullData(user)}
                                    </div>
                                )}
                            </>
                            }
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default Users