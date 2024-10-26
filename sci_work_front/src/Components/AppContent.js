import React, { useState, Suspense } from 'react';
import '../css/AppContent.css';

const AppContent = ({page, subPage}) => {
    
    const loadPageComponent = (pageName) => {
        const formattedPageName = pageName.replace(/\s+/g, '');
        switch (pageName) {
            case 'Subjects':
                return React.lazy(() => import('./pages/Projects.js'));
            default:
                return formattedPageName ? React.lazy(() => import(`./pages/${formattedPageName}.js`)) : null;
        }
    };

    const PageComponent = page ? loadPageComponent(page) : null;

    return (
        <main className="content">
            <Suspense fallback={<div>Loading...</div>}>
                {PageComponent && <PageComponent />}
            </Suspense>
        </main>
    )}

export default AppContent