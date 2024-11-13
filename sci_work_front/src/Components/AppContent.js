import React, { Suspense } from 'react';
import '../css/AppContent.css';
import * as Pages from './pages';

const AppContent = ({userData, page, subPage, data, currentProject, currentActivity, setCurrentPage, setCurrentProject, setCurrentActivity}) => {

    const loadPageComponent = (pageName) => {
        const formattedPageName = (pageName === 'Subjects' || pageName === 'Project') ? 'Projects' : pageName;
        return Pages[formattedPageName.replace(/\s+/g, '')];
    };

    const PageComponent = page ? loadPageComponent(page) : undefined;

    const pagesThatRequireData = ['Projects', 'Schedule']; // Adjust or add more activity names as needed
    //Also handle activity pages when added

    return (
        <main className="content">
            {PageComponent ? (
                <Suspense fallback={<div>Loading...</div>}>
                    <PageComponent
                        userData={userData}
                        data={data}
                        currentProject={currentProject}
                        setCurrentPage={setCurrentPage}
                        setCurrentProject={setCurrentProject}
                        setCurrentActivity={setCurrentActivity}
                    />
                </Suspense>
            ) : (
                <div>No page to display</div>
            )}
        </main>
    )}

export default AppContent