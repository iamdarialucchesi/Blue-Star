import ProviderLayout from "../../../../layouts/provider/ProviderLayout.jsx";
import { useLocation } from "react-router-dom";
import NotificationDetails from "../../partials/notifications/NotificationDetails.jsx";

function ProviderNotificationDetail() {
    const location = useLocation();
    const { alert } = location.state || {};
    return (
        <ProviderLayout headerTitle={"Notifications"} isDashboard={true}>
            <NotificationDetails alert={alert}/>
        </ProviderLayout>
    )
}

export default ProviderNotificationDetail;
