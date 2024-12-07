import React, { useEffect, useState, useCallback, useMemo } from 'react';
import '../../css/pages/Schedule.css';
import ControlPanel from './shared/ControlPanel';

const Schedule = ({ userData, setUserData, state, setState, data, setData, itemsToDisplay, setItemsToDisplay, rights, setOpenAddEditItemDialog }) => {
    
    const daysOfWeek = useMemo(() => ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'], []);
    const months = useMemo(() => ['Jan.', 'Feb.', 'Mar.', 'Apr.', 'May', 'Jun.', 'Jul.', 'Aug.', 'Sep.', 'Oct.', 'Nov.', 'Dec.'], []);

    //date data
    const now = useMemo(() => new Date(), []);
    const [intervalAnchor, setIntervalAnchor] = useState(now);

    const [currentScale, setCurrentScale] = useState('week');
    const [gridValues, setGridValues] = useState({ rows: 24, columns: 7 });

    //update displayed period
    const editIntervalAnchor = useCallback((val) => {
        setIntervalAnchor((prevAnchor) => {
            if (val === 0) {
                return now;
            }
    
            const newAnchor = new Date(prevAnchor);
    
            switch (currentScale) {
                case 'week':
                    newAnchor.setDate(prevAnchor.getDate() + val * 7);
                    break;
                case 'month':
                    newAnchor.setMonth(prevAnchor.getMonth() + val);
                    break;
                case 'year':
                    newAnchor.setFullYear(prevAnchor.getFullYear() + val);
                    break;
                default:
                    break;
            }
    
            return newAnchor;
        });
    }, [currentScale, now]);

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

    const getWeekOfYear = (date) => {
        const startOfYear = new Date(date.getFullYear(), 0, 1);
        const diff = date - startOfYear;
        const oneDay = 1000 * 60 * 60 * 24;
        const weekNumber = Math.floor(diff / oneDay / 7);
        return weekNumber + 1; // Week number starts from 1
    };

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
    }, [currentScale, getWeeksInMonth, intervalAnchor, setCurrentScale]);

    const scheduleBoard = {
        display: 'grid',
        gridTemplateRows: `repeat(${gridValues.rows}, 1fr)`,
        gridTemplateColumns: `repeat(${gridValues.columns}, 1fr)`,
        position: 'relative'
    };

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
    const scaledData = useMemo(() => {
        if (!data) return [];
    
        const { start, end } = rangeToDisplay[currentScale];
    
        // Filter and process activities
        const filteredActivities = data
            .flatMap(project => project.activities || [])
            .filter(activity => {
                const activityStart = new Date(activity.startDate);
                const activityEnd = new Date(activity.endDate);
                return activityEnd >= start && activityStart <= end;
            })
            .flatMap(activity => {
    
                if (activity.startDate === activity.endDate) {
                    // Single-day activity
                    return [activity];
                }
    
                // Multi-day activity
                const startItem = {
                    ...activity,
                    name: `${activity.name} - Start`,
                    startDate: activity.startDate,
                    endDate: activity.startDate,
                    type: 'activity',
                    id: activity.id + '.0'
                };
                const endItem = {
                    ...activity,
                    name: `${activity.name} - End`,
                    startDate: activity.endDate,
                    endDate: activity.endDate,
                    type: 'activity',
                    id: activity.id + '.1'
                };
    
                return [startItem, endItem];
            });
    
        // Filter and process projects for 'year' scale
        const filteredProjects = currentScale === 'year'
            ? data
                .filter(project => {
                    const projectStart = new Date(project.startDate);
                    const projectEnd = new Date(project.endDate);
                    return projectEnd >= start && projectStart <= end;
                })
                .flatMap(project => {
    
                    const startItem = {
                        ...project,
                        name: `${project.name} - Start`,
                        startDate: project.startDate,
                        endDate: project.startDate,
                        type: 'project',
                        id: project.id + '.0'
                    };
                    const endItem = {
                        ...project,
                        name: `${project.name} - End`,
                        startDate: project.endDate,
                        endDate: project.endDate,
                        type: 'project',
                        id: project.id + '.1'
                    };
    
                    return [startItem, endItem];
                })
            : [];
    
        return [...filteredActivities, ...filteredProjects];
    }, [data, rangeToDisplay, currentScale]);
    

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

    //schedule maps
    const scheduleVMap = useMemo(() => {

        if (currentScale === 'week' || currentScale === 'month') {
            
            // Get the start of the week based on the intervalAnchor
            const startOfWeek = new Date(intervalAnchor);
            const currentDay = startOfWeek.getDay();
            const mondayOffset = currentDay === 0 ? -6 : 1 - currentDay;
            startOfWeek.setDate(startOfWeek.getDate() + mondayOffset);
    
            return daysOfWeek.map((day, index) => {
                const dayDate = new Date(startOfWeek);
                dayDate.setDate(dayDate.getDate() + index); // Increment day by index
                
                const formattedDate = `${String(dayDate.getDate()).padStart(2, '0')}.${String(dayDate.getMonth() + 1).padStart(2, '0')}`;
                
                return (
                    <div key={'v-' + index} className="topLabel">
                        {day} {(currentScale === 'week') && formattedDate}
                    </div>
                );
            });
        }
        if (currentScale === 'year') {
            return months.map((month, index) => <div key={'v-' + index} className="topLabel">{month}</div>);
        }
        return [];
    }, [currentScale, intervalAnchor, daysOfWeek, months]);

    const scheduleHMap = useMemo(() => {

        let length;
        switch(currentScale) {
            case 'week': {
                length = 24;
                break;
            }
            case 'month': {
                length = gridValues.rows;
                break;
            }
            case 'year': {
                length = 31;
                break;
            }
            default: {
                length = 0;
            }
        }
        
        return Array.from({ length: length }).map((_, index) => {

            let itemInfo = '';
            switch (currentScale) {
                case 'week':
                    itemInfo = `${index}:00`;
                    break;
                case 'month':
                    itemInfo = `Week ${index + getWeekOfYear(intervalAnchor)}`;
                    break;
                case 'year':
                    itemInfo = `${index + 1}`;
                    break;
                default:
                    itemInfo = '';
            }

            return (
                <div key={`h-${index}`} className="leftLabel">
                    {itemInfo}
                </div>
            );
        });
        
    }, [currentScale, gridValues, intervalAnchor]);

    //schedule events
    const scheduleEvents = useMemo(() => {
        if (!scaledData.length) return [];
    
        return scaledData.flatMap((activity) => {
            const { startDate, endDate, startTime, endTime, name } = activity;
            const activityStart = new Date(`${startDate}T${startTime || "01:00"}`);
            const activityEnd = new Date(`${endDate}T${endTime || "02:45"}`);
    
            // Normal activities
            switch(currentScale) {
                case "week": {
                    const dayIndex = ((activityStart.getDay() === 0) ? 7 : activityStart.getDay()) - 1; // 0-6 (Monday - Sunday)
                    
                    const startHour = activityStart.getHours();
                    const startMinutes = activityStart.getMinutes();
                    const endHour = activityEnd.getHours();
                    const endMinutes = activityEnd.getMinutes();

                    const top = 100 / 24 * (startHour + (startMinutes / 60));
                    const left = 100 / 7 * dayIndex;
                    const bottom = 100 / 24 * (endHour + (endMinutes / 60))

                    return [
                        <div
                            key={'event-' + activity.id}
                            className="scheduleEvent"
                            style={{
                                zIndex: 10,
                                position: 'absolute',
                                top: `${top}%`,
                                left: `${left}%`,
                                height: `${bottom - top}%`
                            }}
                        >
                            {name}
                        </div>,
                    ];
                }
                case "month":
                case "year": {
                    const dayOfMonth = activityStart.getDate(); // 1 - 28-31
                    const dayOfWeek = activityStart.getDay() || 7;

                    return [
                        <div
                            key={'event-' + activity.id}
                            className="activityBlock"
                            style={{
                                zIndex: 10,
                                gridColumn: (currentScale === 'month')
                                    ? (dayOfWeek)
                                    : (activityStart.getMonth() + 1),
                                gridRow: (currentScale === 'month')
                                    ? Math.ceil((dayOfMonth + firstDayOfMonth) / 7)
                                    : dayOfMonth
                            }}
                        >
                            {name}
                        </div>,
                    ];
                }
                default: return [];
            }
        });
    }, [scaledData, currentScale, firstDayOfMonth]);

    return (
        <>
            <ControlPanel
                userData={userData}
                setUserData={setUserData}
                state={state}
                data={data}
                rights={rights}
                setItemsToDisplay={setItemsToDisplay}
                setOpenAddEditItemDialog={setOpenAddEditItemDialog}
                currentScale={currentScale}
                setCurrentScale={setCurrentScale}
                editIntervalAnchor={editIntervalAnchor}
            />
            <div className='scheduleContainer'>
                <p className='currentMap'>
                {currentScale!=='year' && months[intervalAnchor.getMonth()]} {intervalAnchor.getFullYear()}
                </p>
                <div
                    className="scheduleVMap"
                    style={{
                        display: 'grid',
                        gridTemplateColumns: scheduleBoard.gridTemplateColumns
                    }}>
                    {scheduleVMap}
                </div>
                <div
                    className="scheduleHMap"
                    style={{
                        display: 'grid',
                        gridTemplateRows: scheduleBoard.gridTemplateRows
                    }}
                >
                    {scheduleHMap}
                </div>
                <div
                    className="schedule"
                    style={scheduleBoard}
                >
                    {scheduleCells}
                    {scheduleEvents}
                </div>
            </div>
        </>
    )}

export default Schedule