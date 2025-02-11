import React, { useState, Suspense } from 'react'
import '../css/AppContent.css'
import * as Pages from './pages'
import * as Dialogs from './pages/dialogs'

const AppContent = ({editorData, setEditorData, profileData, state, setState, rights, orgData, setOrgData, users, setUsers, itemStructure, defaultStructure, isCompany, updates, setUpdates, recentActivities, setRecentActivities }) => {

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
        return (state.currentEditor) ? editorData : orgData.dataTypes
    }, [state.currentProject, orgData])

    return (
        <main className="content">
            {DialogComponent &&
                <DialogComponent
                    editorData={editorData}
                    setEditorData={setEditorData}
                    orgData={orgData}
                    setOrgData={setOrgData}
                    state={state}
                    setState={setState}
                    rights={rights}
                    users={users}
                    setUsers={setUsers}
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
                        orgData={orgData}
                        setOrgData={setOrgData}
                        itemsToDisplay={itemsToDisplay}
                        setItemsToDisplay={setItemsToDisplay}
                        rights={rights}
                        users={users}
                        setUsers={setUsers}
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