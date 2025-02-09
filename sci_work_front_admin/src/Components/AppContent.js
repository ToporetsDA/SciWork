import React, { useState, Suspense } from 'react'
import '../css/AppContent.css'
import * as Pages from './pages'
import * as Dialogs from './pages/dialogs'

const AppContent = ({editorData, setEditorData, profileData, state, setState, data, setData, rights, users, itemStructure, defaultStructure, isCompany, updates, setUpdates, recentActivities, setRecentActivities }) => {

    // dialogs

    const loadDialogComponent = (dialogName) => {
        return Dialogs[dialogName.replace(/\s+/g, '')]
    }

    const DialogComponent = (state.currentDialog.name !== undefined && state.currentDialog.name !== "LogIn") ? loadDialogComponent(state.currentDialog.name) : undefined

    // pages
    
    const loadPageComponent = (pageName) => {
        const formattedPageName = (pageName === 'Editor') ? 'Editors' : pageName
        console.log(pageName)
        return Pages[formattedPageName.replace(/\s+/g, '')]
    }

    const PageComponent = state.currentPage ? loadPageComponent(state.currentPage) : undefined

    // more for pages

    const [itemsToDisplay, setItemsToDisplay] = useState(() => {
        return (state.currentEditor !== undefined) ? editorData : data.dataTypes;
    }, [state.currentProject, data]);

    return (
        <main className="content">
            {DialogComponent &&
                <DialogComponent
                    editorData={editorData}
                    setEditorData={setEditorData}
                    data={data}
                    setData={setData}
                    state={state}
                    setState={setState}
                    rights={rights}
                    users={users}
                    itemStructure={itemStructure}
                    defaultStructure={defaultStructure}
                    isCompany={isCompany}
                />
            }
            {PageComponent ? (
                <Suspense fallback={<div>Loading...</div>}>
                    <PageComponent
                        editorData={editorData}
                        setEditorData={setEditorData}
                        profileData={profileData}
                        state={state}
                        setState={setState}
                        data={data}
                        setData={setData}
                        itemsToDisplay={itemsToDisplay}
                        setItemsToDisplay={setItemsToDisplay}
                        rights={rights}
                        updates={updates}
                        setUpdates={setUpdates}
                        recentActivities={recentActivities}
                        setRecentActivities={setRecentActivities}
                    />
                </Suspense>
            ) : (
                <div>No page to display</div>
            )}
        </main>
    )
}

export default AppContent