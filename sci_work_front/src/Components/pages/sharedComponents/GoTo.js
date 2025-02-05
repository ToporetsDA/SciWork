import '../../../css/pages/sharedComponents/GoTo.css'

//item here is either Activity or Project Object

const GoTo = (destination, data, setRecentActivities) => {

    const projectId = (id) => {
        return id.split('.')[0]
    }

    if (!destination.id) {
        setRecentActivities((prevActivities) => [
            ...prevActivities,
            destination
        ])
    }

    if (!destination.id) {
        const project = data.find(p => p._id === destination._id)
        return `/Projects/${project._id}`
    }
    else if (destination.page === true) {
        const project = data.find(p => p._id === projectId(destination.id))
        const activity = project.activities.find(a => a._id === destination._id)
        return `/Projects/${project._id}/${activity.id}`
    }
    else {
        const project = data.find(p => p._id === projectId(destination.id))
        return `/Projects/${project._id}`
    }
}

export default GoTo