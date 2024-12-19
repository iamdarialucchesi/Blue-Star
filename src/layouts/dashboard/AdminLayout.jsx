import React, {useState} from "react"
import Sidebar from "./Sidebar.jsx";
import Header from "./Header.jsx";
const AdminLayout = ({children, headerTitle, isDashboard}) => {
    const [isSidebarVisible, setIsSidebarVisible] = useState(false)

    return (
        <div>
            <Sidebar isSidebarVisible={isSidebarVisible} setIsSidebarVisible={setIsSidebarVisible}/>
            <div className="admin-dashboard-body">
                <Header headerTitle={headerTitle} setIsSidebarVisible={setIsSidebarVisible} isDashboard={isDashboard}/>
                <main className="pb-3 px-3 pt-1">
                    {children}
                </main>
            </div>
        </div>
    )
}

export default AdminLayout
