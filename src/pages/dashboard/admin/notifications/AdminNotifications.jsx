import React from "react";
import {useNavigate} from "react-router-dom";

import AdminLayout from "../../../../layouts/dashboard/AdminLayout.jsx";
import Notifications from "../../partials/notifications/Notifications.jsx";

function AdminNotifications() {
    const navigate = useNavigate();

    function handleRowClick(alert) {
        navigate("/notifications/detail", { state: { alert } });
    }

    return (
        <AdminLayout headerTitle={"Notifications"}>
            <Notifications handleRowClick={handleRowClick} />
        </AdminLayout>
    )
}

export default AdminNotifications;
