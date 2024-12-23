import React, { useState, useRef, useEffect } from 'react';
import '../css/AppHeader.css';
import logo from "../logo.svg";

const AppHeader = ({ state, setState, userData, handleLoggedIn, notifications, organisationType}) => {
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    
    const pages = ['Home Page', 'Schedule', (organisationType) ? 'Projects' : 'Subjects'];
    const morePages = (userData.genStatus === 0) ? (
        ['Profile', 'User List', 'Notifications', 'Chats', 'Settings']
    ) : (
        ['Profile', 'Notifications', 'Chats', 'Settings']
    );

    //go to page
    const handleClick = (page) => {
        setState(prevState => ({
            ...prevState,
            currentPage: page,
            currentProject: undefined
        }));
        setDropdownOpen(false);
    }

    //open dropdown menu with more pages
    const handleMore = () => {
        setDropdownOpen(!isDropdownOpen);
    }

    //log out
    const handleLogOut = () => {
        handleClick(null);
        handleLoggedIn(false);
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
                    {!isDropdownOpen && notifications > 0 && (
                            <span className="notification-circle">{(notifications > 99) ? "99+" : notifications}</span>
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
                                {page === 'Notifications' && notifications > 0 && (
                                        <span className="notification-circle">{(notifications > 99) ? "99+" : notifications}</span>
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