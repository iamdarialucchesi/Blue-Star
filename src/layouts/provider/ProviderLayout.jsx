import React, {useState} from "react";

import Header from "../dashboard/Header.jsx";
import ProviderSidebar from "./ProviderSidebar.jsx";

function ProviderLayout({children, headerTitle, isDashboard}){
    const [isSidebarVisible, setIsSidebarVisible] = useState(false)

    return (
        <div>
            <ProviderSidebar isSidebarVisible={isSidebarVisible} setIsSidebarVisible={setIsSidebarVisible}/>
            <div className="admin-dashboard-body">
                <Header headerTitle={headerTitle} setIsSidebarVisible={setIsSidebarVisible} isDashboard={isDashboard}/>
                <main className="pb-3 px-3 pt-1">
                    {children}
                </main>
            </div>
        </div>
    )
}

export default ProviderLayout;