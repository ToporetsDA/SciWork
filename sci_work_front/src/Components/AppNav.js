import React from 'react'
import '../css/AppNav.css'

import * as Shared from '../Components/pages/sharedComponents'

const AppNav = ({ data, state, setState, organisationType, recentActivities, setRecentActivities }) => {
  
  //project.name and activity.name pairs
  const clearRecent = () => {
    setRecentActivities([])
  }

  //project and activity are objects
  //recent.project and recent.activity are strings

  const goTo = Shared.GoTo

  const handleClick = (activity) => {
    const activityExists = recentActivities.some(recent => recent.id === activity.id);

    if (activityExists === false) {
      setRecentActivities((prevActivities) => [
        ...prevActivities,
        activity
      ])
    }
    setState((prevState) => ({
      ...prevState,
      ...goTo(activity, data, setRecentActivities)
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
          {organisationType === true ? 'Projects' : 'Subjects'}
        </h4>

        {data.map((project) => (
          <li key={project.name}>
            <details>
              <summary>{project.name}</summary>
              <ul>
                {project.activities.map((activity) => (
                <li
                  key={activity.name}
                  onClick={() => {handleClick(activity)}}
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

          const projectRecentActivities = recentActivities.filter(recent => Math.floor(recent.id / 1000000000) === project.id)

          if (projectRecentActivities.length > 0) {

            return (
              <li key={project.name}>
                <details>
                  <summary>{project.name}</summary>
                  <ul>
                    {project.activities.map((activity) => {
                      const recentActivity = recentActivities.filter(recent => recent.id === activity.id)
                      if (recentActivity.length > 0) {
                        return (
                          <li
                            key={activity.id}
                            onClick={() => {handleClick(activity)}}
                            className={state.currentActivity === undefined ? 'active' : ''}
                            style={{
                              fontWeight: state.currentPage === undefined ? 'bold' : 'normal',
                              pointerEvents: state.currentPage === undefined ? 'none' : 'auto',
                              opacity: state.currentPage === undefined ? 0.5 : 1,
                            }}
                          >
                            {activity.name}
                          </li>
                        )
                      }
                      return null
                  })}
                  </ul>
                </details>
              </li>
            )
          }
          else {
            return null
          }
        })}

        <button
          style={{ display: recentActivities.length === 0 ? 'none' : 'block' }}
          onClick={clearRecent}
        >
          Close all
        </button>
      </ul>
    </nav>
  )
}

export default AppNav
