import React from 'react'
import '../../../css/pages/dialogs/JointEventOverlap.css'
import '../../../css/pages/dialogs/dialog.css'

import * as Shared from '../sharedComponents'

const JointEventOverlapDialog = ({ data, setData, state, setState }) => {

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

    const ItemList = Shared.LinkList

    return (
        <div
            className="JointEventOverlapDialog dialogContainer"
            onClick={handleOutsideClick}
        >
            <div className="dialogContent">
                <ItemList
                    data={data}
                    state={state}
                    setState={setState}
                    list={state.currentDialog.params[0]}
                />
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

export default JointEventOverlapDialog