import React, { useState, useEffect } from 'react';
import './App.css';
import AppLogIn from './Components/AppLogIn'
import AppHeader from './Components/AppHeader'
import AppNav from './Components/AppNav'
import AppContent from './Components/AppContent'

function App() {

  const rights = {
    fullView: [0, 2],
    interact: [0, 1, 3],
    edit: [0, 1]
  }

  const [userData, setUserData] = useState({
    genStatus: 1,//0 - item creator/organisation owner, 1 - manager (add/edit items), 2 - supervisor, 3 - user
    currentSortFilter: "A-Z",
    currentStatusFilter: "all",
  })

  const itemStructure = {
    project: {
      name: 'text',
      startDate: 'date',
      endDate: 'date',
    },
    activity: {
      name: 'text',
      startDate: 'date',
      endDate: 'date',
      repeat: 'checkbox',
      interval: 'number',
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
      page: false,
      repeat: false,
      interval: -1,
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
          name: "Team Meeting",
          startDate: "2024-03-04",
          endDate: "2024-10-04",
          page: false,
          repeat: true,
          interval: 7,
          thirdParty: true,
          serviceName: "Zoom",
          id: 11
        },
        {
          name: "Code review",
          startDate: "2024-03-04",
          endDate: "2024-11-06",
          page: false,
          repeat: false,
          interval: null,
          thirdParty: false,
          serviceName: null,
          id: 12
        }
      ],
      id: 1
    },
    {
      name: "Project 2",
      startDate: "2024-05-07",
      endDate: "2024-11-27",
      access: 1,
      activities: [
        {
          name: "Sprint Planning",
          startDate: "2024-05-07",
          endDate: "2024-09-18",
          page: false,
          repeat: true,
          interval: 7,
          thirdParty: true,
          serviceName: "Zoom",
          id: 21
        },
        {
          name: "Review",
          startDate: "2024-09-16",
          endDate: "2024-09-20",
          page: false,
          repeat: true,
          interval: 2,
          thirdParty: true,
          serviceName: "Google Meet",
          id: 22
        }
      ],
      id: 2
    },
    {
      name: "Project 4",
      startDate: "2023-03-04",
      endDate: "2024-12-27",
      access: 1,
      activities: [
        {
          name: "Sprint Planning",
          startDate: "2023-03-04",
          endDate: "2024-09-18",
          page: false,
          repeat: true,
          interval: 7,
          thirdParty: true,
          serviceName: "Zoom",
          id: 31
        },
        {
          name: "Review",
          startDate: "2024-09-16",
          endDate: "2024-12-12",
          page: false,
          repeat: true,
          interval: 2,
          thirdParty: true,
          serviceName: "Google Meet",
          id: 32
        }
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
          name: "Sprint Planning",
          startDate: "2024-03-04",
          endDate: "2024-09-18",
          page: false,
          repeat: true,
          interval: 7,
          thirdParty: true,
          serviceName: "Zoom",
          id: 41
        },
        {
          name: "Review",
          startDate: "2024-09-16",
          endDate: "2024-09-20",
          page: false,
          repeat: true,
          interval: 2,
          thirdParty: true,
          serviceName: "Google Meet",
          id: 42
        }
      ],
      id: 4
    }
  ])

  //general
  //this is for the whole app
  const [state, setState] = useState({
    currentPage: 'Home Page',
    currentProject: undefined,
    currentActivity: undefined
  });

  //header
  const isCompany = true;
  const [isLoggedIn, setLoggedIn] = useState(true);
  const [notificationsCount, setNotificationsCount] = useState(5);

  const handleLoggedIn = (val) => {
    setLoggedIn(val);
    console.log(`Logged in: ${isLoggedIn}`);
  }

  useEffect(() => {
    if (state.currentPage === 'Notifications') {
      setNotificationsCount(0);
    }
  }, [state.currentPage])

  useEffect(() => {
    if (state.currentPage) {
      setState(prevState => ({
        ...prevState,
        currentProject: undefined
      }));
    }
  }, [state.currentPage])
  
  //main
  
  //Html
  return (
    <div>
    {(() => {
      if (isLoggedIn) {
        return (
          <div className="App">
            <AppHeader
              state={state}
              setState={setState}
              handleLoggedIn={handleLoggedIn}
              notifications={notificationsCount}
              organisationType={isCompany}
            />
            <div>
              <AppNav
                data={projects}
                state={state}
                setState={setState}
                organisationType={isCompany}
              />
              <AppContent
                userData={userData}
                setUserData={setUserData}
                state={state}
                setState={setState}
                data={projects}
                setData={setProjects}
                rights={rights}
                itemStructure={itemStructure}
                defaultStructure={defaultStructure}
                isCompany={isCompany}
              />
            </div>
          </div>
        );
      } else {
        return <AppLogIn onLogIn={handleLoggedIn} />
      }
    })()}
  </div>
  );
}

export default App;
