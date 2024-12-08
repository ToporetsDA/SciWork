import React, { useEffect, useState, useCallback, useMemo } from 'react';
import '../../../css/pages/pageComponents/ScheduleBoard.css';

const ScheduleBoard = ({ data, state, setState, currentScale, setCurrentScale, gridValues, setGridValues, intervalAnchor, scheduleBoard }) => {

    const goToPage = useCallback((event) => {
        if (event.type === 'project') {
            setState((prevState) => {
                const updatedState = {
                    ...prevState,
                    currentPage: 'Project',
                    currentProject: data.find(p => p.id === event.id)
                };
                console.log("Updated State:", updatedState);
                return updatedState;
            });
        }
        else if (event.page === true) {
            setState((prevState) => ({
                ...prevState,
                currentPage: 'Activity',
                currentProject:  data.find(p => p.id === event.project),
                currentActivity:  data.find(p => p.id === event.project).find(a => a.id === event.id),
            }));
            // console.log(state);
        }
        else {
            setState((prevState) => ({
                ...prevState,
                currentPage: 'Project',
                currentProject:  data.find(p => p.id === event.project)
            }));
        }
    }, [data, setState]);

    //calculate scale values
    const getDaysInMonth = useCallback((month, year) => {
        return new Date(year, month, 0).getDate();
    }, []);

    const [firstDay, setFirstDay] = useState(
        new Date(intervalAnchor.getMonth() + 1, intervalAnchor.getFullYear() - 1, 1).getDay()
    );

    const firstDayOfMonth = useMemo(() => {
        return (firstDay === 0) ? 7 : firstDay
    }, [firstDay]);

    const [lastDayOfMonth, setLastDayOfMonth] = useState(
        new Date(intervalAnchor.getMonth() + 1, intervalAnchor.getFullYear(), 0).getDay()
    );
    
    const [totalDaysInMonth, setTotalDaysInMonth] = useState(
        getDaysInMonth(intervalAnchor.getMonth() + 1, intervalAnchor.getFullYear())
    );

    const getWeeksInMonth = useCallback((month, year) => {
        setFirstDay(new Date(year, month - 1, 1).getDay());
        setLastDayOfMonth(new Date(year, month, 0).getDay());
        setTotalDaysInMonth(getDaysInMonth(month, year));
        const fullWeeks = Math.floor((totalDaysInMonth + firstDayOfMonth) / 7);
        // Return total weeks: full weeks + 1 if there's a partial week at the end of month
        return fullWeeks + (lastDayOfMonth !== 0 ? 1 : 0);
    }, [getDaysInMonth, firstDayOfMonth, lastDayOfMonth, totalDaysInMonth]);

    //set grid resolution
    useEffect(() => {
        if (currentScale === 'week') {
            setGridValues({
                rows: 24,
                columns: 7
            });
        } else if (currentScale === 'month') {
            setGridValues({
                rows: getWeeksInMonth(intervalAnchor.getMonth() + 1, intervalAnchor.getFullYear()),
                columns: 7
            });
        } else if (currentScale === 'year') {
            setGridValues({
                rows: 31,
                columns: 12
            });
        }
    }, [currentScale, getWeeksInMonth, intervalAnchor, setCurrentScale, setGridValues]);

    const rangeToDisplay = useMemo(() => ({
        week: {
            start: new Date(intervalAnchor.getFullYear(), intervalAnchor.getMonth(), intervalAnchor.getDate() - intervalAnchor.getDay()),
            end: new Date(intervalAnchor.getFullYear(), intervalAnchor.getMonth(), intervalAnchor.getDate() - intervalAnchor.getDay() + 6),
        },
        month: {
            start: new Date(intervalAnchor.getFullYear(), intervalAnchor.getMonth(), 1),
            end: new Date(intervalAnchor.getFullYear(), intervalAnchor.getMonth() + 1, 0),
        },
        year: {
            start: new Date(intervalAnchor.getFullYear(), 0, 1),
            end: new Date(intervalAnchor.getFullYear(), 11, 31),
        },
    }), [intervalAnchor]);

    // Determine data to display based on the scale
    //I need to modify data first! I mean creating start-end activities before filtering by rangeToDisplay

    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');  // Add leading zero if needed
        const day = date.getDate().toString().padStart(2, '0');  // Add leading zero if needed
        return `${year}-${month}-${day}`;
    };

    const scaledData = useMemo(() => {
        if (!data) return [];
    
        // Filter and process activities
        const filteredActivities = data
            .flatMap(project => project.activities?.map(activity => ({ ...activity, project: project.id })) || [])
            .flatMap(activity => {
    
                if (activity.startDate === activity.endDate) {
                    // Single-day activity
                    return [{
                        ...activity,
                        eventId: activity.id
                    }]
                }
    
                // Multi-day activity
                const startItem = {
                    ...activity,
                    name: `${activity.name} - Start`,
                    startDate: activity.startDate,
                    endDate: activity.startDate,
                    type: 'activity',
                    eventId: activity.id + '.start'
                };
                const endItem = {
                    ...activity,
                    name: `${activity.name} - End`,
                    startDate: activity.endDate,
                    endDate: activity.endDate,
                    type: 'activity',
                    eventId: activity.id + '.end'
                };

                let repeatItems = [startItem];

                if (activity.repeat === true) {
                    const start = new Date(activity.startDate);
                    const end = new Date(activity.endDate);
                    const daysOfWeek = activity.days.map(day => {
                        switch(day) {
                            case 'Mon': return 1;
                            case 'Tue': return 2;
                            case 'Wed': return 3;
                            case 'Thu': return 4;
                            case 'Fri': return 5;
                            case 'Sat': return 6;
                            case 'Sun': return 0;
                            default: return -1;
                        }
                    });
            
                    // Loop through the days between startDate and endDate
                    for (let d = new Date(start + 1); d < end; d.setDate(d.getDate() + 1)) {
                        // Check if the day is one of the repeating days
                        if (daysOfWeek.includes(d.getDay())) {

                            const repeatItem = {
                                ...activity,
                                name: `${activity.name} - Repeat (${d.toLocaleDateString()})`,
                                startDate: formatDate(d),
                                endDate: formatDate(d),
                                type: 'activity',
                                eventId: activity.id + '_' + d.toLocaleDateString() // Use the date as part of the ID to make it unique
                            };
            
                            repeatItems.push(repeatItem);
                        }
                    }
                }

                repeatItems.push(endItem);
    
                return repeatItems;
            });
    
        // Filter and process projects for 'year' scale
        const filteredProjects = currentScale === 'year'
            ? data
                .flatMap(project => {
    
                    const startItem = {
                        ...project,
                        name: `${project.name} - Start`,
                        startDate: project.startDate,
                        endDate: project.startDate,
                        type: 'project',
                        eventId: project.id + '_0',
                        page: true
                    };
                    const endItem = {
                        ...project,
                        name: `${project.name} - End`,
                        startDate: project.endDate,
                        endDate: project.endDate,
                        type: 'project',
                        eventId: project.id + '_1',
                        page: true
                    };
    
                    return [startItem, endItem];
                })
            : [];
    
        return filteredActivities.concat(filteredProjects);
    }, [data, currentScale]);
    

    //schedule BG like a simple calendar
    const scheduleCells = Array.from({ length: gridValues.rows * gridValues.columns }).map((_, index) => (
        <>
            {(currentScale==='week') ? (
                <div key={index} className="scheduleCell"></div>
            ) : (
                (currentScale==='month') ? (
                    <div
                        key={'cell-' + index}
                        className="scheduleCell"
                        style={{
                            backgroundColor: (index+1 - (firstDayOfMonth-1) <= 0 || index+1 - (firstDayOfMonth-1) > totalDaysInMonth)
                            ? 'lightgray'
                            : ''
                        }}
                    >
                        {index+1 - (firstDayOfMonth-1) > 0 && index+1 - (firstDayOfMonth-1) <= totalDaysInMonth &&
                            `${index+1 - (firstDayOfMonth-1)}`
                        }
                    </div>
                ) : (
                    <div
                        key={'cell-' + index}
                        className="scheduleCell"
                        style={{
                            backgroundColor: (Math.floor(index/12)+1 > getDaysInMonth(index % 12 + 1, intervalAnchor.getFullYear()))
                            ? 'lightgray'
                            : ''
                        }}
                    >
                        {(Math.floor(index/12)+1 <= getDaysInMonth(index % 12 + 1, intervalAnchor.getFullYear())) && `${Math.floor(index/12)+1}`}
                    </div>
                )
            )}
        </>
    ));

    //schedule events
    const scheduleEvents = useMemo(() => {
        if (!scaledData.length) return [];

        const { start, end } = rangeToDisplay[currentScale];

        const rangedData = scaledData
            .filter(project => {
                const projectStart = new Date(project.startDate);
                const projectEnd = new Date(project.endDate);
                return projectEnd >= start && projectStart <= end;
            });
    
        return rangedData
            .flatMap((event) => {
                const { startDate, endDate, startTime, endTime, name } = event;
                const eventStart = new Date(`${startDate}T${startTime || "01:00"}`);
                const eventEnd = new Date(`${endDate}T${endTime || "02:45"}`);
        
                // Normal activities
                switch(currentScale) {
                    case "week": {
                        const dayIndex = ((eventStart.getDay() === 0) ? 7 : eventStart.getDay()) - 1; // 0-6 (Monday - Sunday)
                        
                        const startHour = eventStart.getHours();
                        const startMinutes = eventStart.getMinutes();
                        const endHour = eventEnd.getHours();
                        const endMinutes = eventEnd.getMinutes();

                        const top = 100 / 24 * (startHour + (startMinutes / 60));
                        const left = 100 / 7 * dayIndex;
                        const bottom = 100 / 24 * (endHour + (endMinutes / 60))

                        return [
                            <div
                                key={'event-' + event.eventId}
                                className="scheduleEvent"
                                style={{
                                    zIndex: 10,
                                    position: 'absolute',
                                    top: `${top}%`,
                                    left: `${left}%`,
                                    height: `${bottom - top}%`
                                }}
                                onClick={() => goToPage(event)}
                            >
                                {name}
                            </div>,
                        ];
                    }
                    case "month":
                    case "year": {
                        const dayOfMonth = eventStart.getDate(); // 1 - 28-31
                        const dayOfWeek = eventStart.getDay() || 7;

                        return [
                            <div
                                key={'event-' + event.eventId}
                                className="eventBlock"
                                style={{
                                    zIndex: 10,
                                    gridColumn: (currentScale === 'month')
                                        ? (dayOfWeek)
                                        : (eventStart.getMonth() + 1),
                                    gridRow: (currentScale === 'month')
                                        ? Math.ceil((dayOfMonth + firstDayOfMonth) / 7)
                                        : dayOfMonth
                                }}
                                onClick={() => goToPage(event)}
                            >
                                {name}
                            </div>,
                        ];
                    }
                    default: return [];
                }
            });
    }, [scaledData, currentScale, firstDayOfMonth, rangeToDisplay, goToPage]);

    return (
        <div
            className="schedule"
            style={scheduleBoard}
        >
            {scheduleCells}
            {scheduleEvents}
        </div>
    )}

export default ScheduleBoard