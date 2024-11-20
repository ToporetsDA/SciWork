import React, { useState}  from 'react';
import '../../../css/pages/dialogs/AddEditItem.css';

const ControlPanel = ({ data, setData, currentItem, state, setState, itemStructure, defaultStructure, isCompany, setOpenAddEditItemDialog }) => {

    const [selectedType, setSelectedType] = useState(state.currentProject ? "Activity" : "Project"); // Default to "Project"

    // Initialize form values based on default type

    const initializeFormValues = (defaultValues) => {
        if (currentItem === true) {
            // If currentItem is 'true', return default values for a new item
            return Object.keys(defaultValues).reduce((acc, key) => {
                acc[key] = defaultValues[key] || (itemStructure[key] === 'checkbox' ? false : ''); // Fallback to empty string if no default
                return acc;
            }, {});
        } else if (currentItem) {
            // If currentItem is an object, fill with its values
            return Object.keys(defaultValues).reduce((acc, key) => {
                acc[key] = currentItem[key] !== undefined ? currentItem[key] : defaultValues[key] || (itemStructure[key] === 'checkbox' ? false : ''); // Fallback to default if missing
                return acc;
            }, {});
        }
        return {}; // Return empty object if currentItem is undefined
    };

    const [formValues, setFormValues] = useState(() => {
        return initializeFormValues(defaultStructure.project);
    });

     // Reset form values for the new type  -   -   -   -   -   -   -   -   -   -   I'll need it while making schedule

    // const handleTypeChange = (e) => {
    //     const type = e.target.value;
    //     setSelectedType(type);
    //     setFormValues(initializeFormValues(defaultStructure[type.toLowerCase()]));
    //     setErrors({});
    // };

    const handleInputChange = (e) => {
        const { name, type, checked, value } = e.target;
        setFormValues((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    // Close the dialog

    const [errors, setErrors] = useState({});

    const handleSubmit = (e) => {
        e.preventDefault();

        //validation
        const newErrors = {};

        //empty check
        Object.keys(formValues).forEach((key) => {
            if (formValues[key] === '' && itemStructure[key] !== 'checkbox') {
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

            if (startDate >= endDate) {
                if ((startDate === endDate && selectedType === 'Project') || selectedType === 'Activity') {
                    newErrors.startDate = 'Start date must be before end date.';
                }
            }

            if (endDate < new Date()) {
                newErrors.endDate = 'Trying to create expired project';
            }

            // if (selectedType === 'Activity') {
            //     if (startDate < state.currentProject.startDate || startDate >= state.currentProject.endDate) {
            //         newErrors.startDate = "Start date must be within project's lifetime.";
            //     }

            //     if (endDate < state.currentProject.startDate || endDate > state.currentProject.endDate) {
            //         newErrors.startDate = "End date must be within project's lifetime.";
            //     }
            // }
        }

        // If there are any errors, update the state and stop submission
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            alert('Please fix the errors before saving.');
            return;
        }
        
        // submit
        
        if (selectedType === "Activity" && state.currentProject) {
            setData((prev) => {
                const updatedData = prev.map((project) => {
                    if (project.name === state.currentProject.name) {
                        // Update the project activities
                        const updatedProject = {
                            ...project,
                            activities: project.activities ? [...project.activities, formValues] : [formValues]
                        };
        
                        // Update the state.currentProject
                        if (state.currentProject.name === project.name) {
                            setState((prevState) => ({
                                ...prevState,
                                currentProject: updatedProject
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
                const existingIndex = prev.findIndex((item) => item.name === currentItem.name);
        
                if (existingIndex !== -1) {
                    // Update
                    const updatedData = [...prev];
                    updatedData[existingIndex] = { ...prev[existingIndex], ...formValues };
                    return updatedData;
                } else {
                    // Add
                    return [...prev, formValues];
                }
            });
        }

        setOpenAddEditItemDialog(undefined);
    };

    const handleOutsideClick = (e) => {
        if (e.target.className === "addEditItemDialog") {
            setOpenAddEditItemDialog(undefined);
        }
    };

    const formatLabel = (key) => key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase());

    const currentStructure = itemStructure[selectedType.toLowerCase()];

    return (
        <div className="addEditItemDialog" onClick={handleOutsideClick}>
            <div className="dialogContent">
                <h2>{currentItem === true 
                    ? (state.currentProject ? 'Add new Activity' : 'Add New Project')
                    : `Edit: ${currentItem.name}`}

                </h2>
                <form onSubmit={handleSubmit}>
                    {/* {currentItem === true && state.currentProject &&
                        <select id="itemType" value={selectedType} onChange={handleTypeChange}>
                            <option value="Project">{isCompany ? 'Project' : 'Subject'}</option>
                            <option value="Activity">Activity</option>
                        </select>
                    } */}
                    {Object.keys(currentStructure).map((key) => (
                        <div key={key} className="formGroup">
                            <label htmlFor={key}>{formatLabel(key)}</label>
                            <input
                                id={key}
                                name={key}
                                type={currentStructure[key]}
                                value={formValues[key] || ''}
                                checked={itemStructure[selectedType.toLowerCase()][key] === 'checkbox' ? formValues[key] : false}
                                onChange={handleInputChange}
                            />
                            {errors[key] && <span className="errorMessage">{errors[key]}</span>}
                        </div>
                    ))}
                    <button type="submit" className="submitButton">Save</button>
                </form>
            </div>
        </div>
    );
}

export default ControlPanel