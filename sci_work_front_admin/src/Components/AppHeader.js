import React, { useState, useRef, useEffect, useMemo } from 'react'
import { useNavigate } from "react-router-dom"
import '../css/AppHeader.css'
import logo from "../logo.svg"

const AppHeader = ({ state, setState, editorData, setEditorData, isLoggedIn, setLoggedIn, updates, setUpdates }) => {

    const navigate = useNavigate()

    const format = (str) => {
        return str.replace(/\s+/g, '')
    }

    const [isDropdownOpen, setDropdownOpen] = useState(false)
    const dropdownRef = useRef(null)
    
    const pages = ["Home Page", "Logs", "Data Type Editors", "Users"]
    const morePages = ["Updates", "Settings"]

    const updatesMark = useMemo(() => {
        if (isLoggedIn === true) {
        return updates.filter(update => update.state === "unseen").length
        }
        return -1
    }, [updates, isLoggedIn])

    const setAllSeen = () => {
        setUpdates(
            updates.map(update => {
                if (update.state === "unseen") {
                    return { ...update, state: "unread" } // Change "unseen" to "unread"
                }
                if (update.state === "unread") {
                    return { ...update, state: "seen" } // Change "unread" to "seen"
                }
                return update // Leave other states as is
            })
        )
    }

    //go to page
    const handleClick = (page) => {
        const formattedPage = (page === format("Data Type Editors")) ? "Editors" : page
        navigate(`/${formattedPage}`)
        setDropdownOpen(false)

        if (page === "Updates") {
            setAllSeen()
        }
    }

    const handleDialog = (dialog, params) => {
        setState((prevState) => ({
            ...prevState,
            currentDialog: {
                name: dialog,
                params: params
            }
        }))
    }

    //open dropdown menu with more pages
    const handleMore = () => {
        setDropdownOpen(!isDropdownOpen)
    }

    //log out
    const handleLogOut = () => {
        handleClick(format("Home Page"))
        handleDialog()
        setLoggedIn(false)
    }

    //close dropdown menu if clicked outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false)
            }
        };

        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [dropdownRef])

    const getLi = (page) => {
        return (
            <li
                key={format(page)}
                onClick={() => handleClick(format(page))}
                className={state.currentPage === format(page) ? 'active' : ''}
                style={{
                fontWeight: state.currentPage === format(page) ? 'bold' : 'normal',
                pointerEvents: state.currentPage === format(page) ? 'none' : 'auto',
                opacity: state.currentPage === format(page) ? 0.5 : 1,
                }}
            >
                <p>{page}</p>
                {format(page) === 'Notifications' && updatesMark > 0 && (
                    <span className="notification-circle">{(updatesMark > 99) ? "99+" : updatesMark}</span>
                )}
            </li>
        )
    }
    
    return (
        <header>
            <img className="logo" src={logo} alt="SciWork" />
                <ul className="menu">
                {(isLoggedIn === true) ? (
                    <>
                        {pages.map((page) => (
                            getLi(page)
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
                            {!isDropdownOpen && updatesMark > 0 && (
                                    <span className="notification-circle">{(updatesMark > 99) ? "99+" : updatesMark}</span>
                            )}
                            {isDropdownOpen && (
                                <ul className="more">
                                    {morePages.map((page) => (
                                        getLi(page)
                                    ))}
                                    <li onClick={handleLogOut}><p>Log Out</p></li>
                                </ul>
                            )}
                        </li>
                    </>
                ) : (
                    <li
                        key={"LogIn"}
                        onClick={() => handleDialog("LogIn")}
                    >
                        <p>Log In</p>
                    </li>
                )}
            </ul>
        </header>
    )}

export default AppHeader