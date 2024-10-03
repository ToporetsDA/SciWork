import React, { useState, useEffect } from 'react';
import './App.css';
import AppLogIn from './Components/AppLogIn'
import AppHeader from './Components/AppHeader'
import AppMenu from './Components/AppMenu'
import AppContent from './Components/AppContent'

function App() {
  const [currentPage, setCurrentPage] = useState(null);
  const [isLoggedIn, setLoggedIn] = useState(true);
  const [notificationsCount, setNotificationsCount] = useState(5);

  //header
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

  //main
  
  //Html
  return (
    <div>
    {(() => {
      if (isLoggedIn) {
        return (
          <div className="App">
            <AppHeader onMenuClick={handleMenuClick} handleLoggedIn={handleLoggedIn} currentPage={currentPage} notifications={notificationsCount}/>
            <div>
              <AppMenu />
              <AppContent />
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
