import React, { useEffect, useState, useCallback, useMemo } from 'react';
import '../../../css/pages/pageComponents/ScheduleBoard.css';
import ScheduleBoardOverlaps from './ScheduleBoardOverlaps'

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

    const weeksInMonth = useCallback((month, year) => {
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
                rows: weeksInMonth(intervalAnchor.getMonth() + 1, intervalAnchor.getFullYear()),
                columns: 7
            });
        } else if (currentScale === 'year') {
            setGridValues({
                rows: 31,
                columns: 12
            });
        }
    }, [currentScale, weeksInMonth, intervalAnchor, setCurrentScale, setGridValues]);

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

    // Determine data to display based on the scale
    //I need to modify data first! I mean creating start-end activities before filtering by rangeToDisplay

    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');  // Add leading zero if needed
        const day = date.getDate().toString().padStart(2, '0');  // Add leading zero if needed
        return `${year}-${month}-${day}`;
    };

    // ranged data for current scale
    const scaledData = useMemo(() => {
        if (!data) return [];

        const { start, end } = rangeToDisplay[currentScale];
    
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
        
        const rangedData = filteredActivities.concat(filteredProjects)
            .filter(project => {
                const projectStart = new Date(project.startDate);
                const projectEnd = new Date(project.endDate);
                return projectEnd >= start && projectStart <= end;
            });
    
        return rangedData;
    }, [data, currentScale, rangeToDisplay]);

    //---Overlaps---//

    // ranged data for current scale, with grouped overlaps
    const scaledDataWithOverlaps = useMemo(() => {

        const overlaps = [];
        // Sort events by start time/date
        scaledData.sort((a, b) => (currentScale === "week" ? a.startTime - b.startTime : a.startDate - b.startDate));
      
        // Group overlapping events
        scaledData.forEach((event, i) => {

            const overlapGroup = [event];

            for (let j = i + 1; j < scaledData.length; j++) {

                const nextEvent = scaledData[j];

                if (
                    (currentScale === "week" && nextEvent.startTime < event.endTime) ||
                    (currentScale !== "week" && nextEvent.startDate === event.startDate)//on month and year scales all events last 1 day
                ) {
                    overlapGroup.push(nextEvent);
                }
            }
            overlaps.push(overlapGroup);
        });
      
        return overlaps;
    }, [currentScale, scaledData]);

    // scaledDataWithOverlaps rendered as list of <div></div>s
    const renderEvents = useCallback((group, i, content) => {

        const eventStart = new Date(`${group[0].startDate}T${group[0].startTime || "01:00"}`);
        const tmp = group;
        if (currentScale === "week" && group.length > 4) {
            tmp.sort((a, b) => (b.endTime - a.endTime));
        }
        const eventEnd = new Date(`${tmp[0].endDate}T${tmp[0].endTime || "02:45"}`);
        
        const dayOfWeek = ((eventStart.getDay() === 0) ? 7 : eventStart.getDay()) - 1; // 0-6 (Monday - Sunday)
        const dayOfMonth = eventStart.getDate(); // 1 - 28-31
                
        const startHour = eventStart.getHours();
        const startMinutes = eventStart.getMinutes();
        const endHour = eventEnd.getHours();
        const endMinutes = eventEnd.getMinutes();

        let part = group.length; //size of group element

        let top = 0;
        let left = 0;
        let bottom = 0;
        let right = 0;

        switch(currentScale) {
            case "week": {
                part = 100 / 7 / part;

                top = 100 / 24 * (startHour + (startMinutes / 60));
                left = (100 / 7 * dayOfWeek) + (part * i);
                bottom = 100 / 24 * (endHour + (endMinutes / 60));
                right = left + (part);
                break;
            }
            case "month": {
                part = 100 / weeksInMonth / part;

                top = (100 / weeksInMonth * Math.floor((dayOfMonth + firstDayOfMonth - 1) / 7)) + (part * i);
                left = 100 / 7 * dayOfWeek;
                bottom = top + (part);
                right = left + (100 / 7);
                break;
            }
            case "year": {
                part = 100 / 31 / part;

                top = (100 / 31 * (dayOfMonth - 1)) + (part * i);
                left = 100 / 12 * new Date(group[0].startDate).getMonth;
                bottom = top + (part);
                right = left + (100 / 12);
                break;
            }
            default: ;
        }

        return (
            <div
                key={'event-' + group[0].eventId}
                className="scheduleEvent"
                style={{
                    zIndex: 10,
                    width: `${right - left}%`,
                    height: `${bottom - top}%`,
                    position: 'absolute',
                    top: `${top}%`,
                    left: `${left}%`
                }}
                onClick={() => goToPage(group[0])}
            >
                {content}
            </div>
        );
    }, [currentScale, firstDayOfMonth, goToPage, weeksInMonth]);

    const dataToDisplay = useMemo(() => {

        const eventDivs = scaledDataWithOverlaps.flatMap((group, i) => {

            if (group.length > 1 && group.length <= 4) { // overlaps (all events are visible)

                const groupDivs = group.flatMap((event, i) => {
                    // event data to display
                    let content = ``;
                    if (group[i].type === 'activity') {
                        content += `${data.find(p => p.id === group[i].project).name}: `
                    }
                    content += `${group[i].name}\nStart at ${group[i].eventStart}\nEnd at${group[i].eventEnd}`
                
                    return renderEvents(group, i, content);
                });
                return groupDivs;
            }
            else if (group.length === 1 || group.length > 4) { // Normal activity or Joint block

                // event data to display
                let content = ``;
                if (group.length === 1) {
                    if (group[0].type === 'activity') {
                        content += `${data.find(p => p.id === group[0].project).name}: `
                    }
                    content += `${group[0].name}\nStart at ${group[0].eventStart}\nEnd at${group[0].eventEnd}`
                }
                else {
                    group.forEach((event, i) => {
                        if (event.type === 'activity') {
                            content += `${data.find(p => p.id === event.project).name}: `
                        }
                        content += `${event.name}\n`
                    });
                }

                return [renderEvents(group, 0, content)];
            }
            else {
                return [];
            }
        });

        return eventDivs;
        
    }, [data, renderEvents, scaledDataWithOverlaps]);

    function openOverlapDialog(events) {
        // Open a modal displaying the full list of events
        setModalContent(
            <div>
                {events.map((event) => (
                    <div key={event.id}>
                        {event.projectName}: {event.activityName}
                    </div>
                ))}
            </div>
        );
        setModalVisible(true);
    }
    
    function adjustTextVisibility(events) {
        events.forEach((event) => {
            const overlapEvent = document.querySelector(`.overlapEvent[data-id="${event.id}"]`);
            if (overlapEvent) {
                const eventText = document.querySelector(`.event[data-id="${event.id}"] .text`);
                if (eventText) {
                  eventText.style.top = `${overlapEvent.offsetHeight}px`; // Adjust text to visible area
                }
            }
        });
    }

    //---Overlaps---//

    //schedule events
    const scheduleEvents = useMemo(() => {
        if (!scaledData.length) return [];
    
        return scaledData
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
    }, [scaledData, currentScale, firstDayOfMonth, goToPage]);

    return (
        <div
            className="schedule"
            style={scheduleBoard}
        >
            {scheduleCells}
            {scheduleEvents}
            {ScheduleBoardOverlaps}
        </div>
    )}

export default ScheduleBoard