import React, { useEffect, useState, useCallback, useMemo } from 'react';
import '../../css/pages/Schedule.css';
import ControlPanel from './shared/ControlPanel';

const Schedule = ({ userData, setUserData, state, setState, data, setData, itemsToDisplay, setItemsToDisplay, rights, setOpenAddEditItemDialog }) => {
    
    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const months = ['Jan.', 'Feb.', 'Mar.', 'Apr.', 'May', 'Jun.', 'Jul.', 'Aug.', 'Sep.', 'Oct.', 'Nov.', 'Dec.'];

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

    const [firstTmp, setFirstTmp] = useState(
        new Date(intervalAnchor.getMonth() + 1, intervalAnchor.getFullYear() - 1, 1).getDay()
    );
    const firstDayOfMonth = useMemo(() => {
        return (firstTmp === 0) ? 7 : firstTmp }, [firstTmp]
    );
    const [lastDayOfMonth, setLastDayOfMonth] = useState(
        new Date(intervalAnchor.getMonth() + 1, intervalAnchor.getFullYear(), 0).getDay()
    );
    const [totalDaysInMonth, setTotalDaysInMonth] = useState(
        getDaysInMonth(intervalAnchor.getMonth() + 1, intervalAnchor.getFullYear())
    );

    const getWeeksInMonth = useCallback((month, year) => {
        setFirstTmp(new Date(year, month - 1, 1).getDay());
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

    const scheduleBoardSize = {
        gridTemplateRows: `repeat(${gridValues.rows}, 1fr)`,
        gridTemplateColumns: `repeat(${gridValues.columns}, 1fr)`,
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

        const activities = data.flatMap(project => project.activities || []);
        const { start, end } = rangeToDisplay[currentScale];

        return activities.filter(activity => {
            const activityStart = new Date(activity.startDate);
            const activityEnd = new Date(activity.endDate);
            return activityEnd >= start && activityStart <= end;
        });
    }, [data, rangeToDisplay, currentScale]);

    //fill schedule BG like a simple calendar
    const scheduleCells = Array.from({ length: gridValues.rows * gridValues.columns }).map((_, index) => (
        <>
            {(currentScale==='week') ? (
                <div key={index} className="scheduleCell"></div>
            ) : (
                (currentScale==='month') ? (
                    <div
                        key={index}
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
                        key={index}
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

    //schedule map
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
                    <p key={index} className="topLabel">
                        {day} {(currentScale === 'week') && formattedDate}
                    </p>
                );
            });
        }
        if (currentScale === 'year') {
            return months.map((month, index) => <p key={index} className="topLabel">{month}</p>);
        }
        return [];
    }, [currentScale, intervalAnchor, daysOfWeek, months]);

    const scheduleHMap = useMemo(() => {
        if (currentScale === 'week') {
            return Array.from({ length: 24 }).map((_, index) => (
                <p key={index} className="leftLabel">{`${index}:00`}</p>
            ));
        }
        if (currentScale === 'month') {
            return Array.from({ length: gridValues.rows }).map((_, index) => (
                <p key={index} className="leftLabel">{`Week ${index + getWeekOfYear(intervalAnchor)}`}</p>
            ));
        }
        if (currentScale === 'year') {
            return Array.from({ length: 31 }).map((_, index) => (
                <p key={index} className="leftLabel">{index + 1}</p>
            ));
        }
        return [];
    }, [currentScale, gridValues, intervalAnchor]);

    //schedule events
    const scheduleEvents = useMemo(() => {
        if (!scaledData.length) return [];
    
        return scaledData.flatMap((activity) => {
            const { startDate, endDate, startTime, endTime, name, repeat } = activity;
            const activityStart = new Date(`${startDate}T${startTime || "05:00"}`);
            const activityEnd = new Date(`${endDate}T${endTime || "06:00"}`);
    
            if (!repeat && startDate !== endDate) {
                // Create two items for activities spanning multiple days
                const startDayIndex = activityStart.getDay(); // 0-6 (Sunday-Saturday)
                const endDayIndex = activityEnd.getDay();
    
                const startItem = (
                    <div
                        key={`${activity.id}-start`}
                        className="scheduleEvent"
                        style={{
                            zIndex: 10,
                            gridColumn: startDayIndex === 0 ? 7 : startDayIndex, // Sunday to Saturday
                            gridRowStart: activityStart.getHours() + 1,
                            gridRowEnd: activityStart.getHours() + 2,
                        }}
                    >
                        {`${name} (Start)`}
                    </div>
                );
    
                const endItem = (
                    <div
                        key={`${activity.id}-end`}
                        className="scheduleEvent"
                        style={{
                            zIndex: 10,
                            gridColumn: endDayIndex === 0 ? 7 : endDayIndex, // Sunday to Saturday
                            gridRowStart: 1, // Midnight to 1 AM
                            gridRowEnd: 2,
                        }}
                    >
                        {`${name} (End)`}
                    </div>
                );
    
                return [startItem, endItem];
            }
    
            // Normal activities
            if (currentScale === "week") {
                const dayIndex = activityStart.getDay(); // 0-6 (Sunday-Saturday)
                const startHour = activityStart.getHours();
                const endHour = activityEnd.getHours();
    
                return [
                    <div
                        key={activity.id}
                        className="scheduleEvent"
                        style={{
                            zIndex: 10,
                            gridColumn: dayIndex === 0 ? 7 : dayIndex, // Sunday to Saturday
                            gridRowStart: startHour + 1,
                            gridRowEnd: endHour + 1,
                        }}
                    >
                        {name}
                    </div>,
                ];
            }
    
            if (currentScale === "month" || currentScale === "year") {
                const dayOfMonth = activityStart.getDate(); // 1-31
                return [
                    <div
                        key={activity.id}
                        className="activityBlock"
                        style={{
                            zIndex: 10,
                            gridColumn:
                                currentScale === "month"
                                    ? activityStart.getDay() || 7
                                    : activityStart.getMonth() + 1,
                            gridRow:
                                currentScale === "month"
                                    ? Math.ceil(dayOfMonth / 7)
                                    : dayOfMonth,
                        }}
                    >
                        {name}
                    </div>,
                ];
            }
    
            return [];
        });
    }, [scaledData, currentScale]);

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
                        gridTemplateColumns: scheduleBoardSize.gridTemplateColumns
                    }}>
                    {scheduleVMap}
                </div>
                <div
                    className="scheduleHMap"
                    style={{
                        display: 'grid',
                        gridTemplateRows: scheduleBoardSize.gridTemplateRows
                    }}
                >
                    {scheduleHMap}
                </div>
                <div
                    className="schedule"
                    style={scheduleBoardSize}
                >
                    {scheduleCells}
                    {/* {scheduleEvents} */}
                </div>
            </div>
        </>
    )}

export default Schedule