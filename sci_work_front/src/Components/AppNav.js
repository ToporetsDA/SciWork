import React, { useState, useEffect } from 'react';
import '../css/AppNav.css';

const AppNav = ({ data, state, setState, organisationType }) => {
  
  //project.name and activity.name pairs
  const [recentActivities, setRecentActivities] = useState([{project: state.currentProject, activity: state.currentActivity}]);

  const clearRecent = () => {
    setRecentActivities([{project: state.currentProject, activity: state.currentActivity}]);
  }

  useEffect(() => {
    if (state.currentProject && state.currentActivity) {
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
  }, [state.currentProject, state.currentActivity, recentActivities])

  //project and activity are objects
  //recent.project and recent.activity are strings
  const handleClick = (project, activity) => {
    const activityExists = recentActivities.some(recent =>
      recent.activity === activity.name && recent.project === project.name);

    if (!activityExists) {
      console.log(`before ${recentActivities}`);
        setRecentActivities((prevActivities) => [
          ...prevActivities,
          { project: project.name, activity: activity.name }
        ]);
      }
      setState({
        currentPage: (activity.page) ? 'Activity' : 'Projects',
        currentProject: project,
        currentActivity: activity
      });

    console.log(`after ${recentActivities}`);
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
                  onClick={() => handleClick(project, activity)}
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

          const projectRecentActivities = recentActivities.filter(recent => recent.project === project.name);
          if (projectRecentActivities.length > 0) {

            return (
              <li key={project.name}>
                <details>
                  <summary>{project.name}</summary>
                  <ul>
                    {projectRecentActivities.map((recent) => (
                      <li
                        key={recent.activity}
                        onClick={() => handleClick(recent.project, recent.activity)}
                        className={state.currentPage === recent.activity ? 'active' : ''}
                        style={{
                          fontWeight: state.currentPage === recent.activity ? 'bold' : 'normal',
                          pointerEvents: state.currentPage === recent.activity ? 'none' : 'auto',
                          opacity: state.currentPage === recent.activity ? 0.5 : 1,
                        }}
                      >
                        {recent.activity}
                      </li>
                    ))}
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
