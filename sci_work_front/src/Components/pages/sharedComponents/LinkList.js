import React, { useMemo }  from 'react'
import '../../../css/pages/sharedComponents/LinkList.css'
import '../../../css/pages/Notifications.css'
import * as Shared from './index'

const LinkList = ({ data, state, setState, list, setList, setRecentActivities }) => {

    const goTo = Shared.GoTo

    const projectId = (id) => {
        if (id.includes('.')) {
            return id.split('.')[0]
        }
        else {
            return id.split('.')[1]
        }
    }

    const items = useMemo(() => {
        return list.flatMap((item, i) => {

            switch(state.currentPage) {
            case "Schedule": {
                const start = new Date(`${item.startDate}T${item.startTime || "01:00"}`).toLocaleString()
                const end = new Date(`${item.endDate}T${item.endTime || "02:45"}`).toLocaleString()
                return (
                    <div key={i} className='item' onClick={() => {
                        setState((prevState) => ({
                            ...prevState,
                            ...goTo(item, data, setRecentActivities)
                        }))
                    }}>
                        <div className='content'>
                            <p>{`${item.name}`}</p>
                            <p>{`Start at ${start}`}</p>
                            <p>{`\nEnd at${end}`}</p>
                        </div>
                    </div>
                )
            }
            case "Notifications": {
                const tmpItem = (item._id < 1000000000) ? data.find(p => p._id === item._id) : data.find(p => p._id === projectId(item._id)).activities.find(a => a._id === item._id)
                
                const projectName = data.find(p => p._id === projectId(item._id)).name
                const activityName = (item._id > 1000000000) ? data.find(p => p._id === projectId(item._id)).activities.find(a => a._id === item._id).name : undefined
                
                return (
                    <div
                        key={item.notificationId}
                        className={`item ${item.state}`}
                        onClick={
                            () => {
                                setState((prevState) => ({
                                    ...prevState,
                                    ...goTo(tmpItem, data, setRecentActivities)
                                }))
                                const updatedItem = { ...item, state: 'read' }
            
                                setList(
                                    list.map((notification) =>
                                        notification.notificationId === item.notificationId ? updatedItem : notification
                                    )
                                )
                            }
                        }
                        >
                        <div className='content'>
                            <p>{projectName}</p>
                            {(item._id > 1000000000) &&
                                <p>{activityName}</p>
                            }
                            <p>{item.content}</p>
                            <h6>{`${item.generationTime} ${item.generationDate}`}</h6>
                        </div>
                        {item.state === "unread" &&
                            <span className="notification-circle"></span>
                        }
                    </div>
                );
            }
            default: return <></>
            }
            
        })
    }, [data, state, setState, list, goTo, setList, setRecentActivities])

    return (
        <div className='list'>
            {items}
        </div>
    )
}

export default LinkList