import React, { useEffect } from 'react';
import '../css/AppNav.css';

import * as Shared from '../Components/pages/sharedComponents'

const AppNav = ({ data, state, setState, organisationType, recentActivities, setRecentActivities }) => {
  
  //project.name and activity.name pairs

  const clearRecent = () => {
    setRecentActivities([{project: state.currentProject, activity: state.currentActivity}])
  }

  useEffect(() => {
    console.log(state)
    if (state.currentProject !== undefined && state.currentActivity !== undefined) {
      setRecentActivities((prevActivities) => {
        // Check if the current project/activity is already in the recentActivities
        const activityExists = prevActivities.some(recent => 
          recent.activity === state.currentActivity && recent.project === state.currentProject.name);
        if (!activityExists) {
          return [...prevActivities, { project: state.currentProject.name, activity: state.currentActivity }];
        }
        return prevActivities;
      });
    }
  }, [state, recentActivities, setRecentActivities])

  //project and activity are objects
  //recent.project and recent.activity are strings

  const goTo = Shared.GoTo

  const handleClick = (project, activity) => {
    const activityExists = recentActivities.some(recent =>
      recent.activity === activity.name && recent.project === project.name);

    if (!activityExists) {
      setRecentActivities((prevActivities) => [
        ...prevActivities,
        { project: project.id, activity: activity.id }
      ])
    }
    console.log(project)
    setState((prevState) => ({
      ...prevState,
      ...goTo(activity, data)
    }))
  }

  return (
    <nav>
      <ul className="projects">
        <h4
          className={state.currentPage === 'Projects' ? 'active' : ''}
          style={{
          fontWeight: state.currentPage === 'Projects' ? 'bold' : 'normal',
          pointerEvents: state.currentPage === 'Projects' ? 'none' : 'auto',
          opacity: state.currentPage === 'Projects' ? 0.5 : 1,
          }}
        >
          {organisationType ? 'Projects' : 'Subjects'}
        </h4>

        {data.map((project) => (
          <li key={project.name}>
            <details>
              <summary>{project.name}</summary>
              <ul>
                {project.activities.map((activity) => (
                <li
                  key={activity.name}
                  onClick={() => {handleClick(project, activity)}}
                  className={state.currentPage === activity.name ? 'active' : ''}
                  style={{
                  fontWeight: state.currentPage === activity.name ? 'bold' : 'normal',
                  pointerEvents: state.currentPage === activity.name ? 'none' : 'auto',
                  opacity: state.currentPage === activity.name ? 0.5 : 1,
                  }}
                >{activity.name}</li>
                ))}
              </ul>
            </details>
          </li>
          ))}
      </ul>
        
      <ul className="recent">
        <h4>Recent</h4>
        {data.map((project) => {

          const projectRecentActivities = recentActivities.filter(recent => recent.project === project.id)
          if (projectRecentActivities.length > 0) {

            return (
              <li key={project.name}>
                <details>
                  <summary>{project.name}</summary>
                  <ul>
                    {project.activities.map((activity) => {
                      const recentActivity = recentActivities.filter(recent => recent.activity === activity.id)
                      if (recentActivity.length > 0) {
                        return (
                          <li
                            key={activity.id}
                            onClick={() => {handleClick(project, activity)}}
                            className={state.currentActivity === undefined ? 'active' : ''}
                            style={{
                              fontWeight: state.currentPage === undefined ? 'bold' : 'normal',
                              pointerEvents: state.currentPage === undefined ? 'none' : 'auto',
                              opacity: state.currentPage === undefined ? 0.5 : 1,
                            }}
                          >
                            {activity.activity}
                          </li>
                        )
                      }
                      return null
                  })}
                  </ul>
                </details>
              </li>
            );
          }
          else {
            return null;
          }
        })}

        <button
          style={{ display: recentActivities.length === 1 ? 'none' : 'block' }}
          onClick={clearRecent}
        >
          Close all
        </button>
      </ul>
    </nav>
  );
};

export default AppNav;
