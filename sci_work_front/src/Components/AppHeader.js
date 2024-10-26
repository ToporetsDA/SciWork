import React, { useState, useRef, useEffect } from 'react';
import '../css/AppHeader.css';
import logo from "../logo.svg";

const AppHeader = ({ onMenuClick, handleLoggedIn, currentPage, notifications, organisationType}) => {
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    

    //go to page
    const handleClick = (page) => {
        onMenuClick(page);
        setDropdownOpen(false);
    };

    //open dropdown menu with more pages
    const handleMore = () => {
        setDropdownOpen(!isDropdownOpen);
    };

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
    }, [dropdownRef]);

    return (
        <header>
            <img className="logo" src={logo} alt="SciWork" />
            <ul className="menu">
                {['Main Page', 'Schedule', (organisationType) ? 'Projects' : 'Subjects'].map((page) => (
                <li
                    key={page}
                    onClick={() => handleClick(page)}
                    className={currentPage === page ? 'active' : ''}
                    style={{
                    fontWeight: currentPage === page ? 'bold' : 'normal',
                    pointerEvents: currentPage === page ? 'none' : 'auto',
                    opacity: currentPage === page ? 0.5 : 1,
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
                            {['Profile', 'Notifications', 'Chats', 'Settings'].map((page) => (
                            <li
                                key={page}
                                onClick={() => handleClick(page)}
                                className={currentPage === page ? 'active' : ''}
                                style={{
                                fontWeight: currentPage === page ? 'bold' : 'normal',
                                pointerEvents: currentPage === page ? 'none' : 'auto',
                                opacity: currentPage === page ? 0.5 : 1
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