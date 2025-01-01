import React, { Suspense }  from 'react';
import '../../css/pages/Projects.css';
import ControlPanel from './sharedComponents/ControlPanel';

import * as Shared from './sharedComponents'

const Projects = ({ userData, setUserData, state, setState, data, setData, itemsToDisplay, setItemsToDisplay, rights, recentActivities, setRecentActivities }) => {

    //open project
    const goTo = Shared.GoTo;

    // Delete item
    const handleDelete = (itemToDelete) => {
        setData(prevProjects =>
            prevProjects.map(project => {
                if (project.name === state.currentProject?.name) {

                    // Update the project activities
                    const updatedProject = {
                        ...project,
                        activities: project.activities.map(activity =>
                            activity.name === (itemToDelete.name) ? { ...activity, deleted: true } : activity
                        )
                    };
    
                    // Update the state.currentProject
                    if (state.currentProject.name === project.name) {
                        setState((prevState) => ({
                            ...prevState,
                            currentProject: updatedProject
                        }));
                    }
    
                    return updatedProject;
                }
                return (project.name === itemToDelete.name ? { ...project, deleted: true } : project);
            })
        );
    };

    return (
        <>
            <ControlPanel
                userData={userData}
                setUserData={setUserData}
                state={state}
                setState={setState}
                data={data}
                rights={rights}
                setItemsToDisplay={setItemsToDisplay}
            />
            <div className='itemList'>
                {(!state.currentProject) ? (
                    <Suspense fallback={<div>Loading projects...</div>}>
                        {itemsToDisplay.projects.map((project, index) => (
                            <div
                                key={index}
                                className={`
                                    card
                                    ${(new Date(project.endDate) - new Date()) / (24 * 60 * 60 * 1000) < 30 ? 'expiring' : ''}
                                    ${(new Date(project.endDate) < new Date()) ? 'expired' : ''}
                                `}
                                onClick={() => {
                                    setState((prevState) => ({
                                        ...prevState,
                                        ...goTo(project, data, setRecentActivities)
                                    }))
                                }}
                            >
                                <h3 className='name'>
                                    {project.name}
                                </h3>
                                <p className='timeLimit'>
                                    {project.startDate ? project.startDate : 'N/A'} - {project.endDate}
                                </p>
                                {!project.deleted && rights.edit.includes(project.access) &&
                                    <div className='actions'>
                                        {!project.deleted && rights.edit.includes(project.access) &&
                                        <button
                                            className='gearButton'
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setState((prevState) => ({
                                                    ...prevState,
                                                    currentDialog: {
                                                        name: 'AddEditItem',
                                                        params: [project]},
                                                }));
                                            }}
                                        >
                                            ⚙️
                                        </button>
                                        }
                                        {!project.deleted && rights.edit.includes(project.access) &&
                                        <button
                                            className='deleteButton'
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDelete(project);
                                            }}
                                        >
                                            🗑️
                                        </button>
                                        }
                                    </div>
                                }
                            </div>
                        ))}
                    </Suspense>
                ) : (
                    <Suspense fallback={<div>Loading activities...</div>}>
                        {state.currentProject && state.currentProject.activities ? (
                            itemsToDisplay.activities.map((activity, index) => (
                                <div
                                    key={index}
                                    className={`
                                        card
                                        ${(new Date(activity.endDate) - new Date()) / (24 * 60 * 60 * 1000) < 30 ? 'expiring' : ''}
                                        ${(new Date(activity.endDate) < new Date()) ? 'expired' : ''}
                                    `}
                                    onClick={() => {
                                        setState((prevState) => ({
                                            ...prevState,
                                            ...goTo(activity, data, setRecentActivities)
                                        }))
                                    }}
                                >
                                    <h3 className='name'>{activity.name}</h3>
                                    <p className='timeLimit'>
                                        {activity.startDate ? activity.startDate : 'N/A'} - {activity.endDate}
                                    </p>
                                    <p className='details'>
                                        {activity.thirdParty ? `Service: ${activity.serviceName}` : 'No third-party service'}
                                    </p>
                                    {!activity.deleted && rights.edit.includes(state.currentProject.access) &&
                                        <div className='actions'>
                                        <button
                                            className='gearButton'
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setState((prevState) => ({
                                                    ...prevState,
                                                    currentDialog: {
                                                        name: 'AddEditItem',
                                                        params: [activity]},
                                                }));
                                            }}
                                        >
                                            ⚙️
                                        </button>
                                        <button
                                            className='deleteButton'
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDelete(activity)
                                            }}
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                    }
                                </div>
                            ))
                        ) : (
                            <div>No activities available</div>
                        )}
                    </Suspense>
                )}
            </div>
        </>
    )}

export default Projects

// Separate list to display condition from state?