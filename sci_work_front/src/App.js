import React, { useState, useEffect } from 'react';
import './App.css';
import AppLogIn from './Components/AppLogIn'
import AppHeader from './Components/AppHeader'
import AppNav from './Components/AppNav'
import AppContent from './Components/AppContent'

function App() {

  const [userData, setUserData] = useState({
    currentSortFilter: "A-Z",
    currentStatusFilter: "all",
  });

  const projects = [
    {
      name: "Project 1",
      startDate: "2024-03-04",
      endDate: "2024-11-08",
      access: "user",
      activities: [
        {
          name: "Team Meeting",
          startDate: "2024-03-04",
          endDate: "2024-10-04",
          repeat: true,
          interval: 7,
          thirdParty: true,
          serviceName: "Zoom"
        },
        {
          name: "Code review",
          startDate: "2024-03-04",
          endDate: "2024-11-06",
          repeat: false,
          interval: null,
          thirdParty: false,
          serviceName: null
        }
      ]
    },
    {
      name: "Project 2",
      startDate: "2024-05-07",
      endDate: "2024-11-27",
      access: "project manager",
      activities: [
        {
          name: "Sprint Planning",
          startDate: "2024-05-07",
          endDate: "2024-09-18",
          repeat: true,
          interval: 7,
          thirdParty: true,
          serviceName: "Zoom"
        },
        {
          name: "Review",
          startDate: "2024-09-16",
          endDate: "2024-09-20",
          repeat: true,
          interval: 2,
          thirdParty: true,
          serviceName: "Google Meet"
        }
      ]
    },
    {
      name: "Project 4",
      startDate: "2023-03-04",
      endDate: "2024-08-27",
      access: "project manager",
      activities: [
        {
          name: "Sprint Planning",
          startDate: "2023-03-04",
          endDate: "2024-09-18",
          repeat: true,
          interval: 7,
          thirdParty: true,
          serviceName: "Zoom"
        },
        {
          name: "Review",
          startDate: "2024-09-16",
          endDate: "2024-09-20",
          repeat: true,
          interval: 2,
          thirdParty: true,
          serviceName: "Google Meet"
        }
      ]
    },
    {
      name: "Naming pro 3",
      startDate: "2024-03-04",
      endDate: "2024-12-27",
      access: "project manager",
      activities: [
        {
          name: "Sprint Planning",
          startDate: "2024-03-04",
          endDate: "2024-09-18",
          repeat: true,
          interval: 7,
          thirdParty: true,
          serviceName: "Zoom"
        },
        {
          name: "Review",
          startDate: "2024-09-16",
          endDate: "2024-09-20",
          repeat: true,
          interval: 2,
          thirdParty: true,
          serviceName: "Google Meet"
        }
      ]
    }
  ];

  //general
  //this is for the whole app
  const [currentPage, setCurrentPage] = useState('Home Page');
  //these are for AppContent
  const [currentProject, setCurrentProject] = useState(undefined);
  const [currentActivity, setCurrentActivity] = useState(undefined);

  //header
  const [isCompany, setIsCompany] = useState(true);
  const [isLoggedIn, setLoggedIn] = useState(true);
  const [notificationsCount, setNotificationsCount] = useState(5);

  const handleLoggedIn = (val) => {
    setLoggedIn(val);
    console.log(`Logged in: ${isLoggedIn}`);
  };

  useEffect(() => {
    if (currentPage === 'Notifications') {
      setNotificationsCount(0);
    }
  }, [currentPage]);

  useEffect(() => {
    if (currentPage) {
      setCurrentProject(undefined);
    }
  }, [currentPage]);
  
  //main
  
  //Html
  return (
    <div>
    {(() => {
      if (isLoggedIn) {
        return (
          <div className="App">
            <AppHeader
              onMenuClick={setCurrentPage}
              handleLoggedIn={handleLoggedIn}
              currentPage={currentPage}
              notifications={notificationsCount}
              organisationType={isCompany}
            />
            <div>
              <AppNav
                data={projects}
                currentPage={currentPage}
                currentProject={currentProject}
                currentActivity={currentActivity}
                organisationType={isCompany}
                setCurrentProject={setCurrentProject}
                setCurrentActivity={setCurrentActivity}
              />
              <AppContent
                userData={userData}
                setUserData={setUserData}
                page={currentPage}
                subPage={currentActivity}
                data={projects}
                currentProject={currentProject}
                currentActivity={currentActivity}
                setCurrentPage={setCurrentPage}
                setCurrentProject={setCurrentProject}
                setCurrentActivity={setCurrentActivity}
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
