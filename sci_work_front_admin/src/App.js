import React, { useState, useMemo } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'

import AppConnection from './Components/AppConnection'
import AppHeader from './Components/AppHeader'
import AppDynamicContent from './Components/AppDynamicContent'

const App = () => {

  const [state, setState] = useState({
    currentPage: 'Home Page',   //string
    currentEditor: undefined,
    currentDialog: {
      name: undefined,  //string
      params: []        //[any]
    }
  })
  
  //user
  
  //genStatus: 0 - item creator/organisation owner, 1 - manager (add/edit items), 2 - supervisor, 3 - user
  const [editorData, setEditorData] = useState({ genStatus: -1})

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

  //organisation data
  const [data, setData] = useState()

  //header
  const isCompany = true;

  //nav
  const [recentActivities, setRecentActivities] = useState([])

  //login
  const [isLoggedIn, setLoggedIn] = useState(false);

  //connection

  const [isUserUpdatingData, setIsUserUpdatingData] = useState(false)

  const [users, setUsers] = useState()

  //updates

  const [updates, setUpdates] = useState()
  
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
              editorData={editorData}
              setEditorData={setEditorData}
              profileData={defaultProfileData}
              state={state}
              setState={setState}
              data={data}
              setData={setData}
              rights={rights}
              users={users}
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
      data={data}
      setData={setData}
      isLoggedIn={isLoggedIn}
      setLoggedIn={setLoggedIn}
      setRights={setRights}
      setUsers={setUsers}
      isUserUpdatingData={isUserUpdatingData}
      setIsUserUpdatingData={setIsUserUpdatingData}
    />
  </Router>
  )
}

export default App