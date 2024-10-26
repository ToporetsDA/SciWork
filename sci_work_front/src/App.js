import React, { useState, useEffect } from 'react';
import './App.css';
import AppLogIn from './Components/AppLogIn'
import AppHeader from './Components/AppHeader'
import AppNav from './Components/AppNav'
import AppContent from './Components/AppContent'

function App() {
  //general
  const [currentPage, setCurrentPage] = useState('Home Page');
  const [currentProject, setCurrentProject] = useState(null);
  const [currentActivity, setCurrentActivity] = useState(null);

  //header
  const [isCompany, setIsCompany] = useState(true);
  const [isLoggedIn, setLoggedIn] = useState(true);
  const [notificationsCount, setNotificationsCount] = useState(5);

  const handleMenuClick = (page) => {
    if (currentPage === page) {
      return;
    }
    setCurrentPage(page);

    console.log(`Navigating to ${page}`);
  };

  const handleLoggedIn = (val) => {
    setLoggedIn(val);
    console.log(`Logged in: ${isLoggedIn}`);
  };

  useEffect(() => {
    if (currentPage === 'Notifications') {
      setNotificationsCount(0);
    }
  }, [currentPage]);
  
  //nav
  const [recentActivities, setRecentActivities] = useState([]);
  const [projects, setProjects] = useState([//implement actual data reading from server
    { name: 'Project 1', activities: ['Activity 1.1', 'Activity 1.2'] },
    { name: 'Project 2', activities: ['Activity 2.1', 'Activity 2.2'] },
  ]);

  const setCurrent = (p, a) => {
    setCurrentProject(p);
    setCurrentActivity(a);
    console.log(`Now in: ${p} : ${a}`);
  };
  
  //main
  
  //Html
  return (
    <div>
    {(() => {
      if (isLoggedIn) {
        return (
          <div className="App">
            <AppHeader
              onMenuClick={handleMenuClick}
              handleLoggedIn={handleLoggedIn}
              currentPage={currentPage}
              notifications={notificationsCount}
              organisationType={isCompany}
            />
            <div>
              <AppNav
                projects={projects}
                currentProject={currentProject}
                recentActivities={recentActivities}
                onLogout={() => handleLoggedIn(false)}
                currentPage={currentPage}
                currentSubPage={currentActivity}
                organisationType={isCompany}
                setCurPA={setCurrent}
              />
              <AppContent
                page={currentPage}
                subPage={currentActivity}
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
