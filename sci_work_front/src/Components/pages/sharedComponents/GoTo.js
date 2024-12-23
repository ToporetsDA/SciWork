import '../../../css/pages/sharedComponents/GoTo.css';

//item here is either Activity or Project Object

const GoTo = (destination, data) => {

    const projectId = (id) => {
        return Math.floor(id / 1000000000)
    }

    if (destination.id < 1000000000) {
        return {
            currentPage: 'Project',
            currentProject: data.find(p => p.id === destination.id),
            currentDialog: {
                name: undefined,
                params: []
            }
        };
    } else if (destination.page === true) {
        const project = data.find(p => p.id === projectId(destination.id));
        return {
            currentPage: 'Activity',
            currentProject: project,
            currentActivity: project.activities.find(a => a.id === destination.id),
            currentDialog: {
                name: undefined,
                params: []
            }
        };
    } else {
        return {
            currentPage: 'Project',
            currentProject: data.find(p => p.id === projectId(destination.id)),
            currentDialog: {
                name: undefined,
                params: []
            }
        };
    }
};

export default GoTo