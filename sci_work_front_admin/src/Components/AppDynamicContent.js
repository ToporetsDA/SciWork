import React, { useEffect } from 'react'
import { useLocation, useNavigate } from "react-router-dom"

import AppContent from './AppContent'

const AppDynamicContent = ({userData, setUserData, editorData, setEditorData, profileData, state, setState, orgData, setOrgData, rights, users, setUsers, itemStructure, defaultStructure, isCompany, updates, setUpdates, recentActivities, setRecentActivities }) => {
    
  const location = useLocation()
  const navigate = useNavigate()
  
  useEffect(() => {
    const pathParts = location.pathname.split('/').filter(Boolean)

    const updateState = (page, DT) => {
      setState((prevState) => ({
        ...prevState,
        currentPage: page,
        currentEditor: DT
      }))
    }

    switch (pathParts.length) {
      case 0: {
        navigate(`/HomePage`)
        break
      }
      case 1: {
        if (state.currentPage === pathParts[0]) return
        if (pathParts[0] === "Users") {
          navigate(`/${pathParts[0]}/Users`)
        }
        updateState(pathParts[0], undefined)
        break
      }
      case 2:
      case 3: {
        if (state.currentEditor !== pathParts[1]) {
          updateState(pathParts[0], pathParts[1])
        }
        break
      }
      default: {}
    }

  }, [location.pathname, state, setState, orgData, navigate])
  
  return (
    <AppContent
      userData={userData}
      setUserData={setUserData}
      editorData={editorData}
      setEditorData={setEditorData}
      profileData={profileData}
      state={state}
      setState={setState}
      orgData={orgData}
      setOrgData={setOrgData}
      rights={rights}
      users={users}
      setUsers={setUsers}
      itemStructure={itemStructure}
      defaultStructure={defaultStructure}
      isCompany={isCompany}
      updates={updates}
      setUpdates={setUpdates}
      recentActivities={recentActivities}
      setRecentActivities={setRecentActivities}
    />
  )
}

export default AppDynamicContent