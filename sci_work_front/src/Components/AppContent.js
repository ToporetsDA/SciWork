import React, { useState, Suspense } from 'react';
import '../css/AppContent.css';
import * as Pages from './pages';
import AddEditItem from './pages/dialogs/AddEditItem';

const AppContent = ({userData, setUserData, state, setState, data, setData}) => {

    const loadPageComponent = (pageName) => {
        const formattedPageName = (pageName === 'Subjects' || pageName === 'Project') ? 'Projects' : pageName;
        return Pages[formattedPageName.replace(/\s+/g, '')];
    }

    const PageComponent = state.currentPage ? loadPageComponent(state.currentPage) : undefined;

    const [openAddEditItemDialog, setOpenAddEditItemDialog] = useState(undefined);

    return (
        <main className="content">
            {openAddEditItemDialog && (
                <AddEditItem
                    setData={setData}
                    currentItem={openAddEditItemDialog}
                />
            )}
            {PageComponent ? (
                <Suspense fallback={<div>Loading...</div>}>
                    <PageComponent
                        userData={userData}
                        setUserData={setUserData}
                        state={state}
                        setState={setState}
                        data={data}
                        setData={setData}
                        setOpenAddEditItemDialog={setOpenAddEditItemDialog}
                    />
                </Suspense>
            ) : (
                <div>No page to display</div>
            )}
        </main>
    )}

export default AppContent