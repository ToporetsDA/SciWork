import React, { useState, useMemo } from 'react';
import './App.css';
import AppConnection from './Components/AppConnection'
import AppHeader from './Components/AppHeader'
import AppNav from './Components/AppNav'
import AppContent from './Components/AppContent'

function App() {

  //app

  const [state, setState] = useState({
    currentPage: 'Home Page',   //string
    currentProject: undefined,  //object
    currentActivity: undefined, //object
    currentDialog: {
      name: undefined,  //string
      params: []        //[any]
    }
  });
  
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
        access: userData.genStatus,
        activities: []
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
  }, [userData.genStatus]);

  const [projects, setProjects] = useState()

  //header

  const isCompany = true;

  //nav

  const [recentActivities, setRecentActivities] = useState([]);

  //login
  const [isLoggedIn, setLoggedIn] = useState(false);

  //connection

  const [isUserUpdatingData, setIsUserUpdatingData] = useState(false)
  const [isUserUpdatingUserData, setIsUserUpdatingUserData] = useState(false)

  const updateProjects = (data) => {
    setIsUserUpdatingData(true)
    setProjects(data)
  }

  const updateUser = (userData) => {
    setIsUserUpdatingUserData(true)
    setUserData(userData)
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
    <div>
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
            setState={setState}
            organisationType={isCompany}
            recentActivities={recentActivities}
            setRecentActivities={setRecentActivities}
          />
          <AppContent
            userData={userData}
            setUserData={updateUser}
            profileData={defaultProfileData}
            state={state}
            setState={setState}
            data={projects}
            setData={updateProjects}
            rights={rights}
            itemStructure={defaultItemStructure}
            defaultStructure={defaultStructure}
            isCompany={isCompany}
            notifications={userData.notifications}
            setNotifications={setNotifications}
            recentActivities={recentActivities}
            setRecentActivities={setRecentActivities}
          />
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
      isUserUpdatingData={isUserUpdatingData}
      setIsUserUpdatingData={setIsUserUpdatingData}
      isUserUpdatingUserData={isUserUpdatingUserData}
      setIsUserUpdatingUserData={setIsUserUpdatingUserData}
    />
  </div>
  );
}

export default App;
