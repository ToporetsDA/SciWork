import React, { useMemo, useCallback }  from 'react';
import '../../../css/pages/dialogs/JointEventOverlap.css';
import '../../../css/pages/dialogs/dialog.css'

const JointEventOverlapDialog = ({ data, setData, state, setState }) => {

    const goToPage = useCallback((event) => {
        if (event.type === 'project') {
            setState((prevState) => {
                const updatedState = {
                    ...prevState,
                    currentPage: 'Project',
                    currentProject: data.find(p => p.id === event.id),
                    currentDialog: {
                        name: undefined,
                        params: []
                    }
                };
                return updatedState;
            });
        }
        else if (event.page === true) {
            setState((prevState) => ({
                ...prevState,
                currentPage: 'Activity',
                currentProject:  data.find(p => p.id === event.project),
                currentActivity:  data.find(p => p.id === event.project).find(a => a.id === event.id),
                currentDialog: {
                    name: undefined,
                    params: []
                }
            }));
            // console.log(state);
        }
        else {
            setState((prevState) => ({
                ...prevState,
                currentPage: 'Project',
                currentProject:  data.find(p => p.id === event.project),
                currentDialog: {
                    name: undefined,
                    params: []
                }
            }));
        }
    }, [data, setState]);

    // Close the dialog

    const handleOutsideClick = (e) => {
        if (e.target === e.currentTarget) {
            setState((prevState) => ({
                ...prevState,
                currentDialog: {
                    name: undefined,
                    params: []
                }
            }));
        }
    };

    const events = useMemo(() => {
        return state.currentDialog.params[0].flatMap((event, i) => {

            const start = new Date(`${event.startDate}T${event.startTime || "01:00"}`).toLocaleString();
            const end = new Date(`${event.endDate}T${event.endTime || "02:45"}`).toLocaleString();

            return (
                <div key={i} className='jointEvent' onClick={() => {goToPage(event)}}>
                    <p>{`${event.name}`}</p>
                    <p>{`Start at ${start}`}</p>
                    <p>{`\nEnd at${end}`}</p>
                </div>
            );
            
        });
    }, [state.currentDialog.params, goToPage]);

    return (
        <div
            className="JointEventOverlapDialog dialogContainer"
            onClick={handleOutsideClick}
        >
            <div className="dialogContent">
                {events}
                <button
                    className='backButton'
                    onClick={handleOutsideClick}
                >
                    Back
                </button>
            </div>
        </div>
    );
}

export default JointEventOverlapDialog