import React, { useState, useRef, useEffect, useMemo } from 'react';
import '../css/AppHeader.css';
import logo from "../logo.svg";

const AppHeader = ({ state, setState, userData, setLoggedIn, notifications, setNotifications, organisationType}) => {

    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    
    const pages = ['Home Page', 'Schedule', (organisationType) ? 'Projects' : 'Subjects'];
    const morePages = (userData.genStatus === 0) ? (
        ['Profile', 'User List', 'Notifications', 'Chats', 'Settings']
    ) : (
        ['Profile', 'Notifications', 'Chats', 'Settings']
    );

    const notificationsMark = useMemo(() => {
        return notifications.filter(notification => notification.state === "unseen").length
    }, [notifications]);

    const setAllSeen = () => {
        setNotifications(
            notifications.map(n => {
                if (n.state === "unseen") {
                    return { ...n, state: "unread" }; // Change "unseen" to "unread"
                }
                if (n.state === "unread") {
                    return { ...n, state: "seen" }; // Change "unread" to "seen"
                }
                return n; // Leave other states as is
            })
        );
    }

    //go to page
    const handleClick = (page) => {
        setState(prevState => ({
            ...prevState,
            currentPage: page,
            currentProject: undefined,
            currentActivity: undefined,
            currentDialog: {
                name: undefined,
                params: []
            }
        }));
        setDropdownOpen(false);

        if (page === "Notifications") {
            setAllSeen();
        }
    }

    //open dropdown menu with more pages
    const handleMore = () => {
        setDropdownOpen(!isDropdownOpen);
    }

    //log out
    const handleLogOut = () => {
        handleClick(null);
        setLoggedIn(false);
    }

    //close dropdown menu if clicked outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [dropdownRef])

    return (
        <header>
            <img className="logo" src={logo} alt="SciWork" />
            <ul className="menu">
                {pages.map((page) => (
                <li
                    key={page}
                    onClick={() => handleClick(page)}
                    className={state.currentPage === page ? 'active' : ''}
                    style={{
                    fontWeight: state.currentPage === page ? 'bold' : 'normal',
                    pointerEvents: state.currentPage === page ? 'none' : 'auto',
                    opacity: state.currentPage === page ? 0.5 : 1,
                    }}
                >
                    <p>{page}</p>
                </li>
                ))}
                <li
                    onClick={handleMore}
                    ref={dropdownRef}
                >
                    <p
                        onClick={handleMore}
                        style={{
                            fontWeight: isDropdownOpen ? 'bold' : 'normal',
                            pointerEvents: 'auto',
                            opacity: isDropdownOpen ? 0.5 : 1,
                        }}
                    >
                        More
                    </p>
                    {!isDropdownOpen && notificationsMark > 0 && (
                            <span className="notification-circle">{(notificationsMark > 99) ? "99+" : notificationsMark}</span>
                    )}
                    {isDropdownOpen && (
                        <ul className="more">
                            {morePages.map((page) => (
                            <li
                                key={page}
                                onClick={() => handleClick(page)}
                                className={state.currentPage === page ? 'active' : ''}
                                style={{
                                fontWeight: state.currentPage === page ? 'bold' : 'normal',
                                pointerEvents: state.currentPage === page ? 'none' : 'auto',
                                opacity: state.currentPage === page ? 0.5 : 1
                                }}
                            >
                                <p>{page}</p>
                                {page === 'Notifications' && notificationsMark > 0 && (
                                        <span className="notification-circle">{(notificationsMark > 99) ? "99+" : notificationsMark}</span>
                                )}
                            </li>
                            ))}
                            <li onClick={handleLogOut}><p>Log Out</p></li>
                        </ul>
                    )}
                </li>
            </ul>
        </header>
    )}

export default AppHeader