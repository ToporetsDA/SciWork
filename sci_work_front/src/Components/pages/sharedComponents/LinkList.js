import React, { useMemo }  from 'react';

import '../../../css/pages/sharedComponents/LinkList.css'

import * as Shared from './index'

const DataList = ({ data, state, setState, list }) => {

    const goTo = Shared.GoTo;

    const projectId = (id) => {
        return Math.floor(id / 1000000000);
    }

    const items = useMemo(() => {
        return list.flatMap((item, i) => {

            switch(state.currentPage) {
            case "Schedule": {
                const start = new Date(`${item.startDate}T${item.startTime || "01:00"}`).toLocaleString();
                const end = new Date(`${item.endDate}T${item.endTime || "02:45"}`).toLocaleString();
                return (
                    <div key={i} className='item' onClick={() => {
                        setState((prevState) => ({
                            ...prevState,
                            ...goTo(item, data)
                        }))
                    }}>
                        <p>{`${item.name}`}</p>
                        <p>{`Start at ${start}`}</p>
                        <p>{`\nEnd at${end}`}</p>
                    </div>
                );
            }
            case "Notifications": {
                const tmpItem = (item.id < 1000000000) ? data.find(p => p.id === item.id) : data.find(p => p.id === projectId(item.id)).find(a => a.id === item.id);
                const projectName = data.find(p => p.id === item.id).name;
                const activityName = (item.id > 1000000000) ? data.find(p => p.id === projectId(item.id)).find(a => a.id === item.id).name : '';
                return (
                    <div key={item.id} className='item' onClick={() => {goTo(state, setState, data, tmpItem)}}>
                        <p>{projectName}</p>
                        {(item.id < 1000000000) &&
                            <p>{activityName}</p>
                        }
                        <p>{`${item.content}`}</p>
                    </div>
                );
            }
            default: return <></>
            }
            
        });
    }, [data, state, setState, list, goTo]);

    return (
        <>
            {items}
        </>
    );
}

export default DataList