import React from 'react'
import '../../../css/pages/dialogs/LogIn.css'
import '../../../css/pages/dialogs/dialog.css'


const Action = ({ editorData, setEditorData ,orgData, setOrgData, state, setState, rights, users, setUsers, itemStructure, defaultStructure, isCompany }) => {

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

    return (
        <div className="ActionDialog dialogContainer"  onClick={handleOutsideClick}>
            <div className="dialogContent">
                
            </div>
        </div>
    )
}

export default Action