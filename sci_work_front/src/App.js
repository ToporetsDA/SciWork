import React, { useState } from 'react';
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
  const [userData, setUserData] = useState({
    name: 'Dmytro',
    middleName: '',
    surName: 'Toporets',
    patronimic: '',
    photo: undefined,
    statusName: 'owner',
    genStatus: 0,
    mail: 'dmytro.toporets@nure.ua',
    safetyMail: '',
    phone: '',
    safetyPhone: '',

    currentSettings: {
      sortFilter: "A-Z",
      statusFilter: "all",
    },

    id: 1
  })

  const [rights, setRights] = useState(() => ({
    fullView: [0, 2],
    interact: [0, 1, 3],
    edit: [0, 1]
  }))

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

  const defaultStructure = {
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
  };

  const [projects, setProjects] = useState([
    {
      name: "Project 1",
      startDate: "2024-03-04",
      endDate: "2024-11-08",
      access: 3,
      activities: [
        {
          name: "Team Meeting 1",
          startDate: "2024-10-04",
          endDate: "2024-10-12",
          startTime: "14:30",
          endTime: "15:45",
          page: false,
          repeat: true,
          days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          thirdParty: true,
          serviceName: "Zoom",
          id: 1000000001
        },
        {
          name: "Code review 1",
          startDate: "2024-10-28",
          endDate: "2024-11-06",
          startTime: "15:10",
          endTime: "16:45",
          page: false,
          repeat: false,
          days: [],
          thirdParty: false,
          serviceName: null,
          id: 1000000002
        }
      ],
      userList: [
        { id: 1, access: 3 },
        { id: 2, access: 0 },
      ],
      id: 1
    },
    {
      name: "Project 2",
      startDate: "2024-10-07",
      endDate: "2025-01-27",
      access: 1,
      activities: [
        {
          name: "Sprint Planning 2",
          startDate: "2024-12-16",
          endDate: "2024-12-22",
          startTime: "11:15",
          endTime: "13:10",
          page: false,
          repeat: true,
          days: ['Mon', 'Tue', 'Fri', 'sun'],
          thirdParty: true,
          serviceName: "Zoom",
          id: 2000000001
        },
        {
          name: "Review 2",
          startDate: "2024-12-16",
          endDate: "2024-12-27",
          startTime: "08:30",
          endTime: "09:45",
          page: false,
          repeat: true,
          days: ['Mon', 'Fri', 'sun'],
          thirdParty: true,
          serviceName: "Google Meet",
          id: 2000000002
        }
      ],
      userList: [
        { id: 1, access: 1 },
        { id: 2, access: 0 },
      ],
      id: 2
    },
    {
      name: "Project 4",
      startDate: "2023-03-04",
      endDate: "2024-12-27",
      access: 0,
      activities: [
        {
          name: "Sprint Planning 4",
          startDate: "2023-12-04",
          endDate: "2024-01-18",
          startTime: "16:30",
          endTime: "18:45",
          page: false,
          repeat: true,
          days: ['Tue', 'Wed', 'Fri'],
          thirdParty: true,
          serviceName: "Zoom",
          id: 3000000001
        },
        {
          name: "Review 4",
          startDate: "2023-12-16",
          endDate: "2024-01-12",
          startTime: "16:30",
          endTime: "17:45",
          page: false,
          repeat: true,
          days: ['Tue'],
          thirdParty: true,
          serviceName: "Google Meet",
          id: 3000000002
        }
      ],
      userList: [
        { id: 1, access: 0 },
        { id: 2, access: 2 },
      ],
      id: 3
    },
    {
      name: "Naming pro 3",
      startDate: "2024-03-04",
      endDate: "2024-12-27",
      access: 2,
      activities: [
        {
          name: "Sprint Planning 3",
          startDate: "2024-09-04",
          endDate: "2024-09-18",
          startTime: "04:30",
          endTime: "05:45",
          page: false,
          repeat: true,
          days: ['Tue', 'Wed', 'Thu'],
          thirdParty: true,
          serviceName: "Zoom",
          id: 4000000001
        },
        {
          name: "Review 3",
          startDate: "2024-09-16",
          endDate: "2024-09-20",
          startTime: "12:30",
          endTime: "13:45",
          page: false,
          repeat: true,
          days: ['Fri'],
          thirdParty: true,
          serviceName: "Google Meet",
          id: 4000000002
        }
      ],
      userList: [
        { id: 1, access: 2 },
        { id: 2, access: 0 },
      ],
      id: 4
    },
    {
      name: "Notification Test",
      startDate: "2024-12-18",
      endDate: "2025-12-27",
      access: 2,
      activities: [],
      userList: [
        { id: 1, access: 2 },
        { id: 2, access: 0 },
      ],
      id: 5
    }
  ])

  //notifications

  const [notifications, setNotifications] = useState([
    {
      id: 2000000002,
      page: false,
      state: "read",
      content: "Starts soon",
      generationDate: "2024-12-16",
      generationTime: "08:20",
      notificationId: 1
    },
    {
      id:  2000000001,
      page: false,
      state: "read",
      content: "Starts soon",
      generationDate: "2024-12-16",
      generationTime: "08:20",
      notificationId: 2
    },
    {
      id: 2000000001,
      page: false,
      state: "read",
      content: "Starts soon",
      generationDate: "2024-12-17",
      generationTime: "08:20",
      notificationId: 3
    },
    {
      id: 5,
      page: true,
      state: "read",
      content: "Starts today",
      generationDate: "2024-12-18",
      generationTime: "00:00",
      notificationId: 4
    },
    {
      id: 2000000002,
      page: false,
      state: "seen",
      content: "Starts soon",
      generationDate: "2024-12-20",
      generationTime: "08:20",
      notificationId: 5
    },
    {
      id: 2000000001,
      page: false,
      state: "unseen",
      content: "Starts soon",
      generationDate: "2024-12-20",
      generationTime: "08:20",
      notificationId: 6
    },
    {
      id: 2000000002,
      page: false,
      state: "unseen",
      content: "Starts soon",
      generationDate: "2024-12-22",
      generationTime: "08:20",
      notificationId: 7
    },
    {
      id: 2000000001,
      page: false,
      state: "unseen",
      content: "Starts soon",
      generationDate: "2024-12-22",
      generationTime: "08:20",
      notificationId: 8
    }
  ])

  //header

  const isCompany = true;

  //nav

  const [recentActivities, setRecentActivities] = useState([]);

  //login
  const [isLoggedIn, setLoggedIn] = useState(false);
  
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
          notifications={notifications}
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
            setUserData={setUserData}
            profileData={defaultProfileData}
            state={state}
            setState={setState}
            data={projects}
            setData={setProjects}
            rights={rights}
            itemStructure={defaultItemStructure}
            defaultStructure={defaultStructure}
            isCompany={isCompany}
            notifications={notifications}
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
      setLoggedIn={setLoggedIn}
      setRights={setRights}
    />
  </div>
  );
}

export default App;
