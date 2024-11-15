import React, { useState, useEffect, useRef, useMemo, useCallback }  from 'react';
import '../../../css/pages/shared/ControlPanel.css';

const ControlPanel = ({ userData, setUserData, state, data, setItemsToDisplay, setOpenAddEditItemDialog }) => {

    const filterOptions = {
        sort: ["A-Z", "Z-A", "start date", "end date"],
        state: ["all", "expired", "expiring"]
    }

    const [isDropdownOpen, setIsDropdownOpen] = useState({
        sort: false,
        state: false
    });

    const [currentItemDisplaySettings, setCurrentItemDisplaySettings] = useState({
        sort: userData.currentSortFilter,
        state: userData.currentStateFilter,
        searchQuery: ''
    });

    const sortDropdownRef = useRef(null);
    const stateDropdownRef = useRef(null);

    useEffect(() => {
        setCurrentItemDisplaySettings(prevData => ({
            ...prevData,
            searchQuery: ''
        }));
    }, [state.currentProject]);

    //update filter values

    useEffect(() => {
        if (userData) {
            setCurrentItemDisplaySettings(prevData => ({
                ...prevData,
                sort: userData.currentSortFilter,
                state: userData.currentStatusFilter
            }));
        }
    }, [userData])

    const handleSortOptionSelect = (option) => {
        setUserData(prevData => ({ ...prevData, currentSortFilter: option }));
        setIsDropdownOpen(prevState => ({
            ...prevState,
            sort: false
        }));
    }

    const handleStateOptionSelect = (option) => {
        setUserData(prevData => ({ ...prevData, currentStatusFilter: option }));
        setIsDropdownOpen(prevState => ({
            ...prevState,
            state: false
        }));
    }

    //close filter option lists on click outside

    const handleClickOutside = useCallback((event) => {
        if (isDropdownOpen.sort && sortDropdownRef.current && !sortDropdownRef.current.contains(event.target)) {
            setIsDropdownOpen(prevState => ({
                ...prevState,
                sort: false
            }));
        }
        if (isDropdownOpen.state && stateDropdownRef.current && !stateDropdownRef.current.contains(event.target)) {
            setIsDropdownOpen(prevState => ({
                ...prevState,
                state: false
            }));
        }
    }, [isDropdownOpen]);

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [handleClickOutside])

    //sort items

    const sortItems = useCallback((items) => {
        return items.sort((a, b) => {
            if (currentItemDisplaySettings.sort === "A-Z") {
                return a.name.localeCompare(b.name);
            }
            if (currentItemDisplaySettings.sort === "Z-A") {
                return b.name.localeCompare(a.name);
            }
            if (currentItemDisplaySettings.sort === "start date") {
                return new Date(a.startDate) - new Date(b.startDate);
            }
            if (currentItemDisplaySettings.sort === "end date") {
                return new Date(a.endDate) - new Date(b.endDate);
            }
            return 0;
        });
    }, [currentItemDisplaySettings.sort]);

    //filter items

    const filterItems = useCallback((items) => {
        let filtered = items;

        // Filter by state first
        if (currentItemDisplaySettings.state !== "all") {
            filtered = filtered.filter(item => {
                const endDate = new Date(item.endDate);
                const timeDifference = (endDate - new Date()) / (24 * 60 * 60 * 1000); // days remaining
                if (currentItemDisplaySettings.state === "expired" && timeDifference < 0) {
                    return true; // Expired items
                }
                if (currentItemDisplaySettings.state === "expiring" && timeDifference < 30 && timeDifference >= 0) {
                    return true; // Expiring items (within 30 days)
                }
                return false;
            });
        }

        // Filter by search query
        if (currentItemDisplaySettings.searchQuery.trim() !== "") {
            filtered = filtered.filter(item =>
                item.name.toLowerCase().includes(currentItemDisplaySettings.searchQuery.toLowerCase()) // Case-insensitive search
            );
            console.log(filtered);
        }

        return filtered;
    }, [currentItemDisplaySettings])

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
                value={currentItemDisplaySettings.searchQuery}
                onChange={(e) => setCurrentItemDisplaySettings(prevData => ({
                    ...prevData,
                    searchQuery: e.target.value
                }))}
                placeholder="Search"
                className="search-input"
            />
            <button
                className="filter-button"
                onClick={() => setIsDropdownOpen(prevState => ({...prevState, sort: !isDropdownOpen.sort }))}
                ref={sortDropdownRef}
            >
                {currentItemDisplaySettings.sort}
            </button>
            {isDropdownOpen.sort && (
                <ul className="dropdown">
                    {filterOptions.sort.map((option, index) => (
                        <li key={index} onClick={() => handleSortOptionSelect(option)}>
                            {option}
                        </li>
                    ))}
                </ul>
            )}

            <button
                className="filter-button"
                onClick={() => setIsDropdownOpen(prevState => ({...prevState, state: !isDropdownOpen.state }))}
                ref={stateDropdownRef}
            >
                {currentItemDisplaySettings.state}
            </button>
            {isDropdownOpen.state && (
                <ul className="dropdown">
                    {filterOptions.state.map((option, index) => (
                        <li key={index} onClick={() => handleStateOptionSelect(option)}>
                            {option}
                        </li>
                    ))}
                </ul>
            )}
            {(userData.genStatus < 2) && (
                <button className="add-item" onClick={() => setOpenAddEditItemDialog()}>
                    Add
                </button>
            )}
        </div>
    )}

export default ControlPanel