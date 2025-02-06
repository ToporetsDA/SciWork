import React from 'react'
import { useNavigate } from "react-router-dom"
import '../css/AppNav.css'

import * as Shared from '../Components/pages/sharedComponents'

const AppNav = ({ data, state, organisationType, recentActivities, setRecentActivities }) => {
  
  const navigate = useNavigate()
  const goTo = Shared.GoTo

  const projectId = (id) => {
    return id.split('.')[0]
  }

  //project.name and activity.name pairs
  const clearRecent = () => {
    setRecentActivities([])
  }

  const getLi = (activity) => {
    return (
      <li
        key={activity.id}
        onClick={() => {navigate(goTo(activity, data, recentActivities, setRecentActivities))}}
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
          <li key={project._id}>
            <details>
              <summary>{project.name}</summary>
              <ul>
                {project.activities.map((activity) => (
                  getLi(activity)
                ))}
              </ul>
            </details>
          </li>
          ))}
      </ul>
        
      <ul className="recent">
        <h4>Recent</h4>
        {data.map((project) => {

          const projectRecentActivities = recentActivities.filter(recent => projectId(recent.id) === project._id)
          
          if (projectRecentActivities.length > 0) {

            return (
              <li key={project._id}>
                <details>
                  <summary>{project.name}</summary>
                  <ul>
                    {project.activities.map((activity) => {
                      const recentActivity = recentActivities.filter(recent => recent.id === activity.id)
                      if (recentActivity.length > 0) {
                        return getLi(activity)
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
