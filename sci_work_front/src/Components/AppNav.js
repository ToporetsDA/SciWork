import React, { useState, useEffect } from 'react';
import '../css/AppNav.css';

const AppNav = ({ data, currentPage, currentProject, currentActivity, organisationType, setCurrentProject, setCurrentActivity }) => {
  
  //project.name and activity.name pairs
  const [recentActivities, setRecentActivities] = useState([{project: currentProject, activity: currentActivity}]);

  const clearRecent = () => {
    setRecentActivities([{project: currentProject, activity: currentActivity}]);
  };

  useEffect(() => {
    if (currentProject && currentActivity) {
      setRecentActivities((prevActivities) => {
        // Check if the current project/activity is already in the recentActivities
        const activityExists = prevActivities.some(recent => 
          recent.activity === currentActivity && recent.project === currentProject);
        if (!activityExists) {
          return [...prevActivities, { project: currentProject, activity: currentActivity }];
        }
        return prevActivities;
      });
    }
  }, [currentProject, currentActivity, recentActivities]);

  //project, activity, recent.project, recent.activity are strings, not objects
  const handleClick = (project, activity) => {
    const activityExists = recentActivities.some(recent =>
      recent.activity === activity && recent.project === project);

    if (!activityExists) {
      console.log(`before ${recentActivities}`);
        setRecentActivities((prevActivities) => [
          ...prevActivities,
          { project: project, activity: activity }
        ]);
      }
      setCurrentProject(project);
      setCurrentActivity(activity);

    console.log(`after ${recentActivities}`);
  };

  return (
    <nav>
      <ul className="projects">
        <h4
          className={currentPage === 'Projects' ? 'active' : ''}
          style={{
          fontWeight: currentPage === 'Projects' ? 'bold' : 'normal',
          pointerEvents: currentPage === 'Projects' ? 'none' : 'auto',
          opacity: currentPage === 'Projects' ? 0.5 : 1,
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
                  onClick={() => handleClick(project.name, activity.name)}
                  className={currentPage === activity.name ? 'active' : ''}
                  style={{
                  fontWeight: currentPage === activity.name ? 'bold' : 'normal',
                  pointerEvents: currentPage === activity.name ? 'none' : 'auto',
                  opacity: currentPage === activity.name ? 0.5 : 1,
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
          if (projectRecentActivities) {

            return (
              <li key={project.name}>
                <details>
                  <summary>{project.name}</summary>
                  <ul>
                    {projectRecentActivities.map((recent) => (
                      <li
                        key={recent.activity}
                        onClick={() => handleClick(recent.project, recent.activity)}
                        className={currentPage === recent.activity ? 'active' : ''}
                        style={{
                          fontWeight: currentPage === recent.activity ? 'bold' : 'normal',
                          pointerEvents: currentPage === recent.activity ? 'none' : 'auto',
                          opacity: currentPage === recent.activity ? 0.5 : 1,
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
