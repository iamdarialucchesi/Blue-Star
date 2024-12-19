import React from "react";
import {useNavigate} from "react-router-dom";

import ProviderLayout from "../../../../layouts/provider/ProviderLayout.jsx";
import Notifications from "../../partials/notifications/Notifications.jsx";

function ProviderNotifications() {
    const navigate = useNavigate();

    function handleRowClick(alert) {
        navigate("/provider/notifications/detail", { state: { alert } });
    }
    
    return (
        <ProviderLayout headerTitle={"Notifications"}>
            <Notifications handleRowClick={handleRowClick} />
        </ProviderLayout>
    )
}

export default ProviderNotifications;
