import React from 'react';
import '../../css/pages/Notifications.css';

import * as Shared from './sharedComponents/index'

const Notifications = (data, setData, state, setState, notifications, setNotifications) => {

    const ItemList = Shared.LinkList;

    return (
        <div className="">
            <ItemList
                data={data}
                setData={setData}
                state={state}
                setState={setState}
                list={notifications}
            />
        </div>
    );
}

export default Notifications