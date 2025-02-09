import React from 'react'
import '../../css/pages/Updates.css'

import * as Shared from './sharedComponents/index'

const Updates = ({data, setData, state, setState, notifications, setNotifications, setRecentActivities}) => {

    const ItemList = Shared.LinkList

    return (
        <div className="updatesContainer">
            <ItemList
                data={data}
                state={state}
                setState={setState}
                list={notifications}
                setList={setNotifications}
                setRecentActivities={setRecentActivities}
            />
        </div>
    );
}

export default Updates