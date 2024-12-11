import React, { useState, useEffect, useRef, useMemo, useCallback }  from 'react';
import '../../../css/pages/shared/ControlPanel.css';

const ControlPanel = ({ userData, setUserData, state, setState, data, rights, setItemsToDisplay, currentScale, setCurrentScale, editIntervalAnchor }) => {

    const filterOptions = {
        sort: ["A-Z", "Z-A", "start date", "end date"],
        state: ["all", "expired", "expiring"]
    }

    const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
    const [isStateDropdownOpen, setIsStateDropdownOpen] = useState(false);
    const [currentSortOption, setCurrentSortOption] = useState(userData.currentSortFilter);
    const [currentStateOption, setCurrentStateOption] = useState(userData.currentStateFilter);
    const [searchQuery, setSearchQuery] = useState("");

    const sortDropdownRef = useRef(null);
    const stateDropdownRef = useRef(null);

    useEffect(() => {
        setSearchQuery("");
    }, [state.currentProject]);

    //update filter values

    useEffect(() => {
        if (userData) {
            setCurrentSortOption(userData.currentSortFilter);
            setCurrentStateOption(userData.currentStatusFilter);
        }
    }, [userData])

    const handleSortOptionSelect = (option) => {
        setUserData(prevData => ({ ...prevData, currentSortFilter: option }));
        setIsSortDropdownOpen(false);
    }

    const handleStateOptionSelect = (option) => {
        setUserData(prevData => ({ ...prevData, currentStatusFilter: option }));
        setIsStateDropdownOpen(false);
    }

    //close filter option lists on click outside

    const handleClickOutside = useCallback((event) => {
        if (isSortDropdownOpen && sortDropdownRef.current && !sortDropdownRef.current.contains(event.target)) {
            setIsSortDropdownOpen(false);
        }
        if (isStateDropdownOpen && stateDropdownRef.current && !stateDropdownRef.current.contains(event.target)) {
            setIsStateDropdownOpen(false);
        }
    }, [isSortDropdownOpen, isStateDropdownOpen]);

    useState(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [handleClickOutside])

    //sort items

    const sortItems = useCallback((items) => {
        return items.sort((a, b) => {
            if (currentSortOption === "A-Z") {
                return a.name.localeCompare(b.name);
            }
            if (currentSortOption === "Z-A") {
                return b.name.localeCompare(a.name);
            }
            if (currentSortOption === "start date") {
                return new Date(a.startDate) - new Date(b.startDate);
            }
            if (currentSortOption === "end date") {
                return new Date(a.endDate) - new Date(b.endDate);
            }
            return 0;
        });
    }, [currentSortOption]);

    //filter items

    const filterItems = useCallback((items) => {
        let filtered = items;

        filtered = filtered.filter(item => !item.deleted || (item.deleted && rights.fullView.includes(item.access)));

        // Filter by state first
        if (currentStateOption !== "all") {
            filtered = filtered.filter(item => {

                const endDate = new Date(item.endDate);
                const timeDifference = (endDate - new Date()) / (24 * 60 * 60 * 1000); // days remaining
                if (currentStateOption === "expired" && timeDifference < 0) {
                    return true; // Expired items
                }
                if (currentStateOption === "expiring" && timeDifference < 30 && timeDifference >= 0) {
                    return true; // Expiring items (within 30 days)
                }
                return false;
            });
        }

        // Filter by search query
        if (searchQuery.trim() !== "") {
            filtered = filtered.filter(item =>
                item.name.toLowerCase().includes(searchQuery.toLowerCase()) // Case-insensitive search
            );
            console.log(filtered);
        }

        return filtered;
    }, [currentStateOption, searchQuery, rights.fullView])

    //data to display

    const projectsToDisplay = useMemo(() => {
        return data ? filterItems(sortItems([...data])) : [];
    }, [data, filterItems, sortItems]);
    
    const activitiesToDisplay = useMemo(() => {
        return state.currentProject?.activities
            ? filterItems(sortItems(state.currentProject.activities))
            : [];
    }, [state.currentProject, filterItems, sortItems]);

    //return data to display it
    useEffect(() => {
        setItemsToDisplay({
            projects: projectsToDisplay,
            activities: activitiesToDisplay
        });
    }, [projectsToDisplay, activitiesToDisplay, setItemsToDisplay])

    return (
        <div className='controlPanel'>
            <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search"
                className="searchInput"
            />
            {state.currentPage === "Schedule" &&
                <div className='scale'>
                    <select
                        id="scale"
                        value={currentScale}
                        onChange={(e) => setCurrentScale(e.target.value)}
                    >
                        <option value="week">Week</option>
                        <option value="month">Month</option>
                        <option value="year">Year</option>
                    </select>
                    <button className='moveSchedulePage' onClick={() => editIntervalAnchor(-1)}>
                        Prev.
                    </button>
                    <button className='moveSchedulePage' onClick={() => editIntervalAnchor(0)}>
                        To now
                    </button>
                    <button className='moveSchedulePage' onClick={() => editIntervalAnchor(1)}>
                        Next
                    </button>
                </div>
            }
            {(state.currentPage === "Projects" || state.currentPage === "Project") &&
                <div className='sortAndFilter'>
                    <div>
                        <button
                            className="filterButton"
                            onClick={() => {setIsSortDropdownOpen(!isSortDropdownOpen)}}
                            ref={sortDropdownRef}
                        >
                            {currentSortOption}
                        </button>
                        {isSortDropdownOpen && (
                            <ul className="dropdown">
                                {filterOptions.sort.map((option, index) => (
                                    <li key={index} onClick={() => { handleSortOptionSelect(option)}}>
                                        {option}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                    <div>
                        <button
                            className="filterButton"
                            onClick={() => setIsStateDropdownOpen(!isStateDropdownOpen)}
                            ref={stateDropdownRef}
                        >
                            {currentStateOption}
                        </button>
                        {isStateDropdownOpen && (
                            <ul className="dropdown">
                                {filterOptions.state.map((option, index) => (
                                    <li key={index} onClick={() => handleStateOptionSelect(option)}>
                                        {option}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            }
            {(((rights.edit.includes(userData.genStatus)
            && (state.currentProject) ? rights.edit.includes(state.currentProject.access) : true))
            || state.currentPage === 'Schedule')
            && (
                <button className="addItem" onClick={() => {
                    setState((prevState) => ({
                        ...prevState,
                        currentDialog: {
                            name: 'AddEditItem',
                            params: [true]},
                    }));
                }}>
                    Add item
                </button>
            )}
        </div>
    )}

export default ControlPanel