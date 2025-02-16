import React, { useState, useMemo } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'

import AppConnection from './Components/AppConnection'
import AppHeader from './Components/AppHeader'
import AppDynamicContent from './Components/AppDynamicContent'

const App = () => {

  const [state, setState] = useState({
    currentPage: 'HomePage',   //string
    currentEditor: undefined,
    currentDialog: {
      name: undefined,  //string
      params: []        //[any]
    }
  })
  
  //user
  
  //genStatus: 0 - item creator/organisation owner, 1 - manager (add/edit items), 2 - supervisor, 3 - user
  const [userData, setUserData] = useState({ genStatus: -1})

  const [editorData, setEditorData] = useState({ genStatus: -1})

  const [orgData, setOrgData] = useState({rights: undefined, dataTypes: []})

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

  //header
  const isCompany = true;

  //nav
  const [recentActivities, setRecentActivities] = useState([])

  //login
  const [isLoggedIn, setLoggedIn] = useState(false);

  //connection

  const [isUserUpdatingData, setIsUserUpdatingData] = useState(false)

  const [users, setUsers] = useState([])

  const editUserList = (action, id, data) => {
    setIsUserUpdatingData(id)
    if (action === "add") {
      setUsers(prev => [ ...prev, data ])
    }
    if (action === "edit") {
      setUsers(prev => 
        prev.map(prevUser => 
          prevUser._id === id ? { ...prevUser, ...data } : prevUser
        )
      )
    }
  }

  //updates

  const [updates, setUpdates] = useState([])
  
  //Html
  return (
    <Router>
      <div className="App">
        <AppHeader
          state={state}
          setState={setState}
          editorData={editorData}
          setEditorData={setEditorData}
          isLoggedIn={isLoggedIn}
          setLoggedIn={setLoggedIn}
          updates={updates}
          setUpdates={setUpdates}
          organisationType={isCompany}
        />
        <Routes>
          <Route path="*" element={
            <AppDynamicContent
              userData={userData}
              setUserData={setUserData}
              editorData={editorData}
              setEditorData={setEditorData}
              profileData={defaultProfileData}
              state={state}
              setState={setState}
              orgData={orgData}
              setOrgData={setOrgData}
              rights={orgData.rights}
              users={users}
              setUsers={editUserList}
              itemStructure={defaultItemStructure}
              defaultStructure={defaultStructure}
              isCompany={isCompany}
              updates={updates}
              setUpdates={setUpdates}
              setNotifications={setUpdates}
              recentActivities={recentActivities}
              setRecentActivities={setRecentActivities}
            />
          }
          />
        </Routes>
      </div>
    <AppConnection
      state={state}
      setState={setState}
      editorData={editorData}
      setEditorData={setEditorData}
      userData={userData}
      setUserData={setUserData}
      isLoggedIn={isLoggedIn}
      setLoggedIn={setLoggedIn}
      setOrgData={setOrgData}
      users={users}
      setUsers={setUsers}
      isUserUpdatingData={isUserUpdatingData}
      setIsUserUpdatingData={setIsUserUpdatingData}
    />
  </Router>
  )
}

export default App