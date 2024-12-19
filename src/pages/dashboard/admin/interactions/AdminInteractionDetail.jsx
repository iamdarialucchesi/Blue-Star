import React from "react";
import { useLocation } from "react-router-dom";
import AdminLayout from "../../../../layouts/dashboard/AdminLayout.jsx";
import InteractionDetail from "../../partials/interactions/InteractionDetail.jsx";

function AdminInteractionDetail() {

    const location = useLocation();
    const { patientData, programData } = location.state || {};

    return (
        <AdminLayout headerTitle={"Interaction"} isDashboard={true}>
            <InteractionDetail patientData={patientData} programData={programData} />
        </AdminLayout>
    )
}


export default AdminInteractionDetail;
