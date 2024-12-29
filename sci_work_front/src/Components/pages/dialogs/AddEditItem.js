import React, { useState, useMemo }  from 'react';
import '../../../css/pages/dialogs/AddEditItem.css';
import '../../../css/pages/dialogs/dialog.css'

const AddEditItem = ({ data, setData, state, setState, rights, itemStructure, defaultStructure, isCompany }) => {

    const currentItem = state.currentDialog.params[0];
    const [selectedType, setSelectedType] = useState(state.currentProject ? "Activity" : "Project"); // Default to "Project"

    // Initialize form values based on default type

    const initializeFormValues = (defaultValues, structure) => {
        if (currentItem === true) {
            // If currentItem is 'true', return default values for a new item
            return Object.keys(defaultValues).reduce((acc, key) => {
                acc[key] = defaultValues[key] || (structure[key] === 'checkbox' ? false : ''); // Fallback to empty string if no default
                return acc;
            }, {});
        } else if (currentItem !== undefined) {
            // If currentItem is an object, fill with its values
            return Object.keys(defaultValues).reduce((acc, key) => {
                acc[key] = currentItem[key] !== undefined ? currentItem[key] : defaultValues[key] || (structure[key] === 'checkbox' ? false : ''); // Fallback to default if missing
                return acc;
            }, {});
        }
        return {}; // Return empty object if currentItem is undefined
    };

    const [formValues, setFormValues] = useState(() => {
        return initializeFormValues(defaultStructure[selectedType.toLowerCase()], itemStructure[selectedType.toLowerCase()]);
    });

    // Reset form values for the new type

    const handleTypeChange = (e) => {
        const type = e.target.value;
        setSelectedType(type);
        setFormValues(initializeFormValues(defaultStructure[type.toLowerCase()], itemStructure[selectedType.toLowerCase()]));
        setErrors({});
        if (type === "Project") {
            setState((prevState) => ({
                ...prevState,
                currentProject: undefined,
            }));
        }
    };

    const handleInputChange = (e) => {
        const { name, type, checked, value } = e.target;
        setFormValues((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    // Update set of selected days
    const toggleDaySelection = (day) => {
        setFormValues((prev) => {
            const currentDays = prev.days || [];
            const updatedDays = currentDays.includes(day)
                ? currentDays.filter((d) => d !== day) // Remove the day if already selected
                : [...currentDays, day]; // Add the day if not selected
            return { ...prev, days: updatedDays };
        });
    };

    //show item-fields
    const showItemFields = useMemo(() => {
        return (state.currentPage !== 'Schedule' || selectedType === 'Project' ||
        (selectedType === 'Activity' && state.currentProject !== undefined)) &&
        ((state.currentProject !== undefined) ? rights.edit.includes(state.currentProject.access) : true);
    }, [state, selectedType, rights.edit]);

    //conditions for fields that should appear based on other fields values
    const fieldsChecks = useMemo(() => {
        return {
            days: (formValues?.repeat === true) || false,
            serviceName: (formValues?.thirdParty === true) || false
        }
    }, [formValues]);

    // Close the dialog

    const [errors, setErrors] = useState({});

    const handleSubmit = (e) => {
        e.preventDefault();

        let newItem = {
            ...formValues,
            access: 0,
            id: currentItem?.id || (state.currentProject === undefined ? data.length + 1 : (state.currentProject.id * 1000000000) + state.currentProject.activities.length + 1),
        };

        if (selectedType === "Project") {
            newItem.activities = [];
        }

        //validation
        const newErrors = {};

        //empty check
        Object.keys(formValues).forEach((key) => {
            if (formValues[key] === '' && itemStructure[key] !== 'checkbox' && fieldsChecks[key] === true) {
                newErrors[key] = 'This field is required.';
            }
        });

        //name check
        if (formValues.name.length < 3) {
            newErrors.name = 'Too short';
        }

        //date checks
        if (formValues.startDate && formValues.endDate) {

            const startDate = new Date(formValues.startDate);
            const endDate = new Date(formValues.endDate);

            if (startDate > endDate) {
                if ((startDate === endDate && selectedType === 'Project') || selectedType === 'Activity') {
                    newErrors.startDate = 'Start date must be before end date.';
                }
            }

            if (endDate < new Date()) {
                newErrors.endDate = 'Trying to create expired project';
            }

            if (selectedType === 'Activity') {
                if (startDate < state.currentProject.startDate || startDate >= state.currentProject.endDate) {
                    newErrors.startDate = "Start date must be within project's lifetime.";
                }

                if (endDate < state.currentProject.startDate || endDate > state.currentProject.endDate) {
                    newErrors.startDate = "End date must be within project's lifetime.";
                }
            }
        }

        //time check
        if (formValues.startDate && formValues.endDate && formValues.startTime && formValues.endTime) {
            const startDate = new Date(formValues.startDate);
            const endDate = new Date(formValues.endDate);

            const [startHour, startMinute] = formValues.startTime.split(':').map(Number);
            const [endHour, endMinute] = formValues.endTime.split(':').map(Number);
        
            const startInMinutes = startHour * 60 + startMinute;
            const endInMinutes = endHour * 60 + endMinute;

            if(startDate === endDate && startInMinutes > endInMinutes) {
                newErrors.startTime = "Activity can not start after it has ended";
            }
        
            if (startDate === endDate && startInMinutes + 15 >= endInMinutes) {
                newErrors.endTime = "Activity must exist at least 15 minutes.";
            }
        }

        //repeat check
        if (formValues.repeat === true && formValues.days.length === 0) {
            newErrors.repeat = "Select at least 1 day to repeat the activity.";
        }

        // If there are any errors, update the state and stop submission
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            alert('Please fix the errors before saving.');
            return;
        }
        
        // submit
        
        if (selectedType === "Activity" && state.currentProject !== undefined) {
            setData((prev) => {
                const updatedData = prev.map((project) => {
                    if (project.id === state.currentProject.id) {
                        // Check if the activity already exists in the project
                        const existingIndex = project.activities?.findIndex((item) => item.id === newItem.id);
                        
                        const updatedActivities = existingIndex !== -1
                        ? project.activities.map((item, idx) => idx === existingIndex ? newItem : item) // Update activity
                        : [...(project.activities || []), newItem]; // Add activity

                        const updatedProject = {
                            ...project,
                            activities: updatedActivities,
                        };

                        // Update state.currentProject
                        if (state.currentProject.id === project.id) {
                            setState((prevState) => ({
                                ...prevState,
                                currentProject: updatedProject,
                            }));
                        }
                        return updatedProject;
                    }
                    return project;
                });
                return updatedData;
            });
        } else {
            setData((prev) => {
                const existingIndex = prev.findIndex((item) => item.id === currentItem.id);
        
                if (existingIndex !== -1) {
                    // Update project
                    const updatedData = [...prev];
                    updatedData[existingIndex] = { ...prev[existingIndex], ...formValues };
                    return updatedData;
                } else {
                    // Add project
                    return [...prev, newItem];
                }
            });
        }

        setState((prevState) => ({
            ...prevState,
            currentDialog: {
                name: undefined,
                params: []
            }
        }));
    };

    const handleOutsideClick = (e) => {
        if (e.target === e.currentTarget) {
            setState((prevState) => ({
                ...prevState,
                currentDialog: {
                    name: undefined,
                    params: []
                }
            }));
        }
    };

    const formatLabel = (key) => key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase());

    const currentStructure = itemStructure[selectedType.toLowerCase()];

    return (
        <div className="addEditItemDialog dialogContainer" onClick={handleOutsideClick}>
            <div className="dialogContent">
                <h2>{currentItem === true 
                    ? (state.currentProject ? 'Add new Activity' : 'Add New Project')
                    : `Edit: ${currentItem.name}`}

                </h2>
                <form onSubmit={handleSubmit}>
                    {currentItem === true && state.currentPage === 'Schedule' &&
                    <>
                        <select id="itemType" value={selectedType} onChange={handleTypeChange}>
                            <option value="Project">{isCompany ? 'Project' : 'Subject'}</option>
                            <option value="Activity">Activity</option>
                        </select>
                        {selectedType === 'Activity' &&
                            <select
                                id="projectList"
                                value={state.currentProject?.id || ""}
                                onChange={(e) => {
                                    const selectedProject = data.find((project) => String(project.id) === e.target.value);
                                    if (selectedProject) {
                                        setState((prevState) => ({
                                            ...prevState,
                                            currentProject: selectedProject,
                                        }));
                                    }
                                }}
                            >
                                <option value="" disabled>
                                    Select a Project
                                </option>
                                {data.map((project) => (
                                    <option key={project.id} value={project.id}>
                                        {project.name}
                                    </option>
                                ))}
                            </select>
                        }
                    </>
                    }
                    {(showItemFields) && (
                        Object.keys(currentStructure).map((key) => (
                            <div key={key} className="formGroup">
                                {(key === 'days') ? (
                                <>
                                    {fieldsChecks.days &&
                                    <>
                                        <label htmlFor={key}>{formatLabel(key)}</label>
                                        <div className="daysButtons">
                                            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                                                <button
                                                    key={day}
                                                    type="button"
                                                    className={formValues.days?.includes(day) ? 'selected' : ''}
                                                    onClick={() => toggleDaySelection(day)}
                                                >
                                                    {day}
                                                </button>
                                            ))}
                                        </div>
                                    </>
                                    }
                                </>
                                ) : (
                                <>
                                    {((key === 'serviceName' && fieldsChecks.serviceName) || key !== 'serviceName') &&
                                    <>
                                        <label htmlFor={key}>{formatLabel(key)}</label>
                                        <input
                                        id={key}
                                        name={key}
                                        type={currentStructure[key]}
                                        value={formValues[key] || ''}
                                        checked={currentStructure[key] === 'checkbox' ? formValues[key] : undefined}
                                        onChange={handleInputChange}
                                        />
                                    </>
                                    }
                                </>
                                )}
                                {errors[key] && <span className="errorMessage">{errors[key]}</span>}
                            </div>
                        ))
                    )}
                    <button type="submit" className="submitButton">Save</button>
                </form>
            </div>
        </div>
    );
}

export default AddEditItem