import React, { Suspense } from 'react';
import '../css/AppContent.css';
import * as Pages from './pages';

const AppContent = ({userData, setUserData, state, setState, data, setData}) => {

    const loadPageComponent = (pageName) => {
        const formattedPageName = (pageName === 'Subjects' || pageName === 'Project') ? 'Projects' : pageName;
        return Pages[formattedPageName.replace(/\s+/g, '')];
    }

    const PageComponent = state.currentPage ? loadPageComponent(state.currentPage) : undefined;

    return (
        <main className="content">
            {PageComponent ? (
                <Suspense fallback={<div>Loading...</div>}>
                    <PageComponent
                        userData={userData}
                        setUserData={setUserData}
                        state={state}
                        setState={setState}
                        data={data}
                        setData={setData}
                    />
                </Suspense>
            ) : (
                <div>No page to display</div>
            )}
        </main>
    )}

export default AppContent