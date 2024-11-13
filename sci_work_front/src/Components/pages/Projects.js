import React, { useState, useEffect, Suspense }  from 'react';
import '../../css/pages/Projects.css';

const Projects = ({ userData, data, currentProject, setCurrentPage, setCurrentProject, setCurrentActivity }) => {

    const [selectedProject, setSelectedProject] = useState(undefined);

    const goToPage = (project) => {
        setSelectedProject(data.find(p => p.name === project));
        setCurrentPage('Project');
        setCurrentProject(project);
    }

    useEffect(() => {
        if (currentProject) {
            const project = data.find(p => p.name === currentProject);
            setSelectedProject(project);
        }
    }, [currentProject, data]);

    return (
        <>
            <div className='controlPanel'>
                
            </div>
            <div className='itemList'>
                {(!currentProject) ?
                    <Suspense fallback={<div>Loading projects...</div>}>
                        {data.map((project, index) => (
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
                :
                    <Suspense fallback={<div>Loading activities...</div>}>
                        {selectedProject && selectedProject.activities ? (
                            selectedProject.activities.map((activity, index) => (
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
                }
            </div>
        </>
    )}

export default Projects