import React, { useState, useEffect } from 'react';
import '../css/AppNav.css';

const AppNav = ({ projects, currentProject, recentActivities, onLogout, currentPage, currentActivity, organisationType, setCurPA }) => {
  
  const [updatedRecentActivities, setUpdatedRecentActivities] = useState(recentActivities);

  useEffect(() => {
    if (recentActivities.length > 0) {
      setUpdatedRecentActivities(recentActivities);
    }
  }, [recentActivities]);

  const clearRecent = () => {
    setUpdatedRecentActivities([]);
  };

  const handleClick = (project, activity) => {
    const activityExists = updatedRecentActivities.some(recent =>
      recent.activity === activity && recent.project.name === project.name);

    if (!activityExists) {
      console.log(`before ${updatedRecentActivities}`);
        setUpdatedRecentActivities((prevActivities) => [
          ...prevActivities,
          { project: project, activity }
        ]);
      }
    setCurPA(project, activity);
    console.log(`after ${updatedRecentActivities}`);
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

        {projects.map((project) => (
          <li key={project.name}>
            <details>
              <summary>{project.name}</summary>
              <ul>
                {project.activities.map((activity) => (
                <li
                  key={activity}
                  onClick={() => handleClick(project.name, activity)}
                  className={currentPage === activity ? 'active' : ''}
                  style={{
                  fontWeight: currentPage === activity ? 'bold' : 'normal',
                  pointerEvents: currentPage === activity ? 'none' : 'auto',
                  opacity: currentPage === activity ? 0.5 : 1,
                  }}
                >{activity}</li>
                ))}
              </ul>
            </details>
          </li>
          ))}
      </ul>
        
      <ul className="recent">
        <h4>Recent</h4>
        {projects.map((project) => {

          const projectRecentActivities = updatedRecentActivities.filter(recent => recent.project === project.name);

          if (projectRecentActivities.length > 0) {
            return (
              <li key={project.name}>
                <details>
                  <summary>{project.name}</summary>
                  <ul>
                    {projectRecentActivities.map((recent, index) => (
                      <li
                        key={index}
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
          style={{ display: updatedRecentActivities.length === 0 ? 'none' : 'block' }}
          onClick={clearRecent}
        >
          Close all
        </button>
      </ul>
    </nav>
  );
};

export default AppNav;
