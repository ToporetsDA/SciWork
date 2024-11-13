import React, { useState, useEffect, useRef, useCallback, Suspense }  from 'react';
import '../../css/pages/Projects.css';

const Projects = ({ userData, setUserData, data, currentProject, setCurrentPage, setCurrentProject, setCurrentActivity }) => {

    const filterOptions = {
        sort: ["A-Z", "Z-A", "start date", "end date"],
        state: ["all", "expired", "expiring"]
    }

    const [selectedProject, setSelectedProject] = useState(undefined);
    const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
    const [isStateDropdownOpen, setIsStateDropdownOpen] = useState(false);
    const [currentSortOption, setCurrentSortOption] = useState(userData.currentSortFilter);
    const [currentStateOption, setCurrentStateOption] = useState(userData.currentStateFilter);
    const [searchQuery, setSearchQuery] = useState("");

    const sortDropdownRef = useRef(null);
    const stateDropdownRef = useRef(null);

    //open project

    const goToPage = (project) => {
        setSelectedProject(data.find(p => p.name === project));
        setCurrentPage('Project');
        setCurrentProject(project);
    }

    useEffect(() => {
        if (currentProject) {
            const project = data.find(p => p.name === currentProject);
            setSelectedProject(project);
        }
    }, [currentProject, data]);

    //update filter values

    useEffect(() => {
        if (userData) {
            setCurrentSortOption(userData.currentSortFilter);
            setCurrentStateOption(userData.currentStatusFilter);

        }
    }, [userData]);

    const handleSortOptionSelect = (option) => {
        setUserData(prevData => ({ ...prevData, currentSortFilter: option }));
        setIsSortDropdownOpen(false);
    };

    const handleStateOptionSelect = (option) => {
        setUserData(prevData => ({ ...prevData, currentStatusFilter: option }));
        setIsStateDropdownOpen(false);
    };

    //close filter option lists on click outside

    const handleClickOutside = useCallback((event) => {
        if (isSortDropdownOpen && sortDropdownRef.current && !sortDropdownRef.current.contains(event.target)) {
          setIsSortDropdownOpen(false);
        }
        if (isStateDropdownOpen && stateDropdownRef.current && !stateDropdownRef.current.contains(event.target)) {
          setIsStateDropdownOpen(false);
        }
    }, [isSortDropdownOpen, isStateDropdownOpen]);

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    //sort items

    const sortItems = (items) => {
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
    };

    //filter items

    const filterItems = (items) => {
        let filtered = items;

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
            console.log(filtered);
            console.log(searchQuery);
            filtered = filtered.filter(item =>
                item.name.toLowerCase().includes(searchQuery.toLowerCase()) // Case-insensitive search
            );
            console.log(filtered);
        }

        return filtered;
    };

    //data to display

    const projectsToDisplay = filterItems(sortItems([...data]));
    const activitiesToDisplay = filterItems(selectedProject?.activities ? sortItems(selectedProject.activities) : []);

    return (
        <>
            <div className='controlPanel'>
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search"
                    className="search-input"
                />
                <button className="filter-button" onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)} ref={sortDropdownRef}>
                    {currentSortOption}
                </button>
                {isSortDropdownOpen && (
                    <ul className="dropdown">
                        {filterOptions.sort.map((option, index) => (
                            <li key={index} onClick={() => handleSortOptionSelect(option)}>
                                {option}
                            </li>
                        ))}
                    </ul>
                )}

                <button className="filter-button" onClick={() => setIsStateDropdownOpen(!isStateDropdownOpen)} ref={stateDropdownRef}>
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
            <div className='itemList'>
                {(!currentProject) ?
                    <Suspense fallback={<div>Loading projects...</div>}>
                        {projectsToDisplay.map((project, index) => (
                            <div
                                key={index}
                                className={`
                                    card
                                    ${(new Date(project.endDate) - new Date()) / (24 * 60 * 60 * 1000) < 30 ? 'expiring' : ''}
                                    ${(new Date(project.endDate) < new Date()) ? 'expired' : ''}
                                `}
                                onClick={() => goToPage(project.name)}
                            >
                                <h3 className='name'>
                                    {project.name}
                                </h3>
                                <p className='timeLimit'>
                                    {project.startDate ? project.startDate : 'N/A'} - {project.endDate}
                                </p>
                            </div>
                        ))}
                    </Suspense>
                :
                    <Suspense fallback={<div>Loading activities...</div>}>
                        {selectedProject && selectedProject.activities ? (
                            activitiesToDisplay.map((activity, index) => (
                                <div
                                    key={index}
                                    className={`
                                        card
                                        ${(new Date(activity.endDate) - new Date()) / (24 * 60 * 60 * 1000) < 30 ? 'expiring' : ''}
                                        ${(new Date(activity.endDate) < new Date()) ? 'expired' : ''}
                                    `}
                                >
                                    <h3 className='name'>{activity.name}</h3>
                                    <p className='timeLimit'>
                                        {activity.startDate ? activity.startDate : 'N/A'} - {activity.endDate}
                                    </p>
                                    <p className='details'>
                                        {activity.thirdParty ? `Service: ${activity.serviceName}` : 'No third-party service'}
                                    </p>
                                </div>
                            ))
                        ) : (
                            <div>No activities available</div>
                        )}
                    </Suspense>
                }
            </div>
        </>
    )}

export default Projects