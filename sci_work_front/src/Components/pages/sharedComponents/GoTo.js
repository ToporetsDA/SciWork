import '../../../css/pages/sharedComponents/GoTo.css'

//item here is either Activity or Project Object

const GoTo = (destination, data, recentActivities, setRecentActivities) => {

    const projectId = (id) => {
        return id.split('.')[0]
    }

    if (destination.id) {
        const activityExists = recentActivities.some(recent => recent._id === destination.id)
        if (activityExists === false) {
            setRecentActivities((prevActivities) => [
                ...prevActivities,
                destination
            ])
        }
    }

    if (!destination.id) {
        const project = data.find(p => p._id === destination._id)
        return `/Project/${project._id}`
    }
    else if (destination.page === true) {
        const project = data.find(p => p._id === projectId(destination.id))
        const activity = project.activities.find(a => a._id === destination._id)
        return `/Activity/${project._id}/${activity.id}`
    }
    else {
        const project = data.find(p => p._id === projectId(destination.id))
        return `/Activity/${project._id}`
    }
}

export default GoTo