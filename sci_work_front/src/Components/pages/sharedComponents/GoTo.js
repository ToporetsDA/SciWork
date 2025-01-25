import '../../../css/pages/sharedComponents/GoTo.css'

//item here is either Activity or Project Object

const GoTo = (destination, data, setRecentActivities) => {

    const projectId = (id) => {
        return id.split('.')[0]
    }

    if (destination._id > 1000000000) {
        setRecentActivities((prevActivities) => [
            ...prevActivities,
            destination
        ])
    }

    if (destination._id < 1000000000) {
        return {
            currentPage: 'Project',
            currentProject: data.find(p => p._id === destination._id),
            currentDialog: {
                name: undefined,
                params: []
            }
        }
    }
    else if (destination.page === true) {
        const project = data.find(p => p._id === projectId(destination.id))
        return {
            currentPage: 'Activity',
            currentProject: project,
            currentActivity: project.activities.find(a => a._id === destination._id),
            currentDialog: {
                name: undefined,
                params: []
            }
        }
    }
    else {
        return {
            currentPage: 'Project',
            currentProject: data.find(p => p._id === projectId(destination._id)),
            currentDialog: {
                name: undefined,
                params: []
            }
        }
    }
}

export default GoTo