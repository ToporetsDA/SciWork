import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from "react-router-dom"

import AppContent from './AppContent'

const AppDynamicContent = ({userData, setUserData, profileData, state, setState, data, setData, rights, users, itemStructure, defaultStructure, isCompany, notifications, setNotifications, recentActivities, setRecentActivities }) => {
    
  const location = useLocation()
  const navigate = useNavigate()

  const [pathMapping, setPathMapping] = useState({})
  
  useEffect(() => {
    const pathParts = location.pathname.split('/').filter(Boolean)

    const updateState = (page, project, activity) => {
      setState((prevState) => ({
        ...prevState,
        currentPage: page,
        currentProject: project,
        currentActivity: activity
      }))
    }

    switch (pathParts.length) {
      case 0: {
        navigate(`/HomePage`)
        break
      }
      case 1: {
        if (state.currentPage === pathParts[0]) return

        updateState(pathParts[0], undefined, undefined)
        break
      }
      case 2: {
        const project = data.find(project => project._id === pathParts[1]) || undefined

        if (state.currentProject !== project) {
          updateState("Projects", project, undefined)
        }
        window.history.replaceState({}, "", `/Projects/${project.name}`)
        break
      }
      case 3: {
        const project = data.find(project => project._id === pathParts[1]) || undefined
        const activity = project.activities.find(activity => activity.id === pathParts[2]) || undefined

        if (state.currentProject !== project) {
          updateState("Projects", project, activity)
        }
        window.history.replaceState({}, "", `/Projects/${project.name}/${activity.name}`)
        break
      }
      default: {}
    }

  }, [location.pathname, state, setState, data, navigate])
  
  return (
    <AppContent
      userData={userData}
      setUserData={setUserData}
      profileData={profileData}
      state={state}
      setState={setState}
      data={data}
      setData={setData}
      rights={rights}
      users={users}
      itemStructure={itemStructure}
      defaultStructure={defaultStructure}
      isCompany={isCompany}
      notifications={userData.notifications}
      setNotifications={setNotifications}
      recentActivities={recentActivities}
      setRecentActivities={setRecentActivities}
    />
  )
}

export default AppDynamicContent