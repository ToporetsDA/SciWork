import React, { useState, useEffect, Suspense }  from 'react';
import '../../css/pages/Projects.css';
import ControlPanel from './shared/ControlPanel';
import AddEditItem from './dialogs/AddEditItem';

const Projects = ({ userData, setUserData, state, setState, data, setData }) => {

    //open project

    const goToPage = (project) => {
        setState({
            currentPage: 'Project',
            currentProject: data.find(p => p.name === project),
            currentActivity: undefined
          });
    }

    //data to display

    const [itemsToDisplay, setItemsToDisplay] = useState({
        projects: data,
        activities: state.currentProject?.activities ? state.currentProject.activities : []
    }, [state.currentProject, data]);

    const [openAddEditItemDialog, setOpenAddEditItemDialog] = useState(undefined);

    return (
        <>
            <ControlPanel
                userData={userData}
                setUserData={setUserData}
                state={state}
                data={data}
                setItemsToDisplay={setItemsToDisplay}
                setOpenAddEditItemDialog={setOpenAddEditItemDialog}
            />
            {openAddEditItemDialog && (
                <AddEditItem
                    setData={setData}
                    currentItem={openAddEditItemDialog}
                />
            )}
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
                                onClick={() => goToPage(project.name)}
                            >
                                <h3 className='name'>
                                    {project.name}
                                </h3>
                                <p className='timeLimit'>
                                    {project.startDate ? project.startDate : 'N/A'} - {project.endDate}
                                </p>
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
                                >
                                    <h3 className='name'>{activity.name}</h3>
                                    <p className='timeLimit'>
                                        {activity.startDate ? activity.startDate : 'N/A'} - {activity.endDate}
                                    </p>
                                    <p className='details'>
                                        {activity.thirdParty ? `Service: ${activity.serviceName}` : 'No third-party service'}
                                    </p>
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