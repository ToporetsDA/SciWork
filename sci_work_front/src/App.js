import React, { useState, useMemo } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'

import AppConnection from './Components/AppConnection'
import AppHeader from './Components/AppHeader'
import AppNav from './Components/AppNav'
import AppDynamicContent from './Components/AppDynamicContent'

const App = () => {

  const [state, setState] = useState({
    currentPage: 'Home Page',   //string
    currentProject: undefined,  //object
    currentActivity: undefined, //object
    currentDialog: {
      name: undefined,  //string
      params: []        //[any]
    }
  })
  
  //user
  
  //genStatus: 0 - item creator/organisation owner, 1 - manager (add/edit items), 2 - supervisor, 3 - user
  const [userData, setUserData] = useState({ genStatus: -1})

  const [rights, setRights] = useState()

  const defaultProfileData = {// [isOptional, type]
    basic: {
      name:         [true,  'string'],
      middleName:   [false, 'string'],
      surName:      [true,  'string'],
      patronimic:   [false, 'string'],
      statusName:   [true,  'string'],
      mail:         [true,  'mail'],
      safetyMail:   [false, 'mail'],
      phone:        [false, 'phone'],
      safetyPhone:  [false, 'phone'],
    },
    fixed: ['genStatus', 'statusName', 'id'],//fields that can not be edited
    additional: {
      //will be added in beta-version
    }
  }

  //items

  const defaultItemStructure = {
    project: {
      name: 'text',
      startDate: 'date',
      endDate: 'date',
    },
    activity: {
      name: 'text',
      startDate: 'date',
      endDate: 'date',
      startTime: 'time',
      endTime: 'time',
      repeat: 'checkbox',
      days: 'days',
      thirdParty: 'checkbox',
      serviceName: 'text'
    }
  }

  const defaultStructure = useMemo(() => {
    return {
      project: {
        name: '',
        startDate: '',
        endDate: '',
        activities: [],
        userList: []
      },
      activity: {
        name: '',
        startDate: '',
        endDate: '',
        startTime: '',
        endTime: '',
        page: false,
        repeat: false,
        days: [],
        thirdParty: false,
        serviceName: ''
      }
    }
  }, [])

  const [projects, setProjects] = useState()

  //header
  const isCompany = true;

  //nav
  const [recentActivities, setRecentActivities] = useState([])

  //login
  const [isLoggedIn, setLoggedIn] = useState(false);

  //connection

  const [isUserUpdatingData, setIsUserUpdatingData] = useState(false)
  const [isUserUpdatingUserData, setIsUserUpdatingUserData] = useState(false)

  const [editedProject, setEditedProject] = useState()

  const [users, setUsers] = useState()

  const updateProjects = (data) => {

    setIsUserUpdatingData(true)
    const { action, item } = data
    setEditedProject(item)

    if (action === "add") {
      setProjects(prevProjects => [ ...prevProjects, item ])
    }
    if (action === "edit") {
      setProjects(prevProjects => 
        prevProjects.map(project => 
            project._id === item._id ? item : project
        )
      )
    }
    console.log("from updateProjects: ", projects)
  }

  const updateUser = (newData) => {
    setIsUserUpdatingUserData(true)
    setUserData((prevUserData) => ({
        ...prevUserData,
        ...newData,
    }))
  }

  //notifications
  const setNotifications = (notifications) => {
    setIsUserUpdatingUserData(true)
    setUserData((prevData) => ({
      ...prevData,
      notifications
    }))
  }
  
  //Html
  return (
    <Router>
    {isLoggedIn === true && (
      <div className="App">
        <AppHeader
          state={state}
          setState={setState}
          userData={userData}
          setLoggedIn={setLoggedIn}
          notifications={userData.notifications}
          setNotifications={setNotifications}
          organisationType={isCompany}
        />
        <div>
          <AppNav
            data={projects}
            state={state}
            organisationType={isCompany}
            recentActivities={recentActivities}
            setRecentActivities={setRecentActivities}
          />
          <Routes>
            <Route path="*" element={
              <AppDynamicContent
                userData={userData}
                setUserData={updateUser}
                profileData={defaultProfileData}
                state={state}
                setState={setState}
                data={projects}
                setData={updateProjects}
                rights={rights}
                users={users}
                itemStructure={defaultItemStructure}
                defaultStructure={defaultStructure}
                isCompany={isCompany}
                notifications={userData.notifications}
                setNotifications={setNotifications}
                recentActivities={recentActivities}
                setRecentActivities={setRecentActivities}
              />
            } />
          </Routes>
        </div>
      </div>
    )}
    <AppConnection
      setState={setState}
      userData={userData}
      setUserData={setUserData}
      data={projects}
      setData={setProjects}
      isLoggedIn={isLoggedIn}
      setLoggedIn={setLoggedIn}
      setRights={setRights}
      setUsers={setUsers}
      isUserUpdatingData={isUserUpdatingData}
      setIsUserUpdatingData={setIsUserUpdatingData}
      isUserUpdatingUserData={isUserUpdatingUserData}
      setIsUserUpdatingUserData={setIsUserUpdatingUserData}
      editedProject={editedProject}
      setEditedProject={setEditedProject}
    />
  </Router>
  )
}

export default App