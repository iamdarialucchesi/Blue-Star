import React from "react";
import {useNavigate} from "react-router-dom";

import AdminLayout from "../../../../layouts/dashboard/AdminLayout.jsx";
import Interaction from "../../partials/interactions/Interaction.jsx";

function AdminInteractions() {
    const navigate = useNavigate();

    function handleProgramItem(patientData, programData) {
        navigate("/interactions/detail", { state: { patientData, programData } });
    }

    return (
        <AdminLayout headerTitle={"Interaction"}>
            <Interaction handleProgramItem={handleProgramItem}/>
        </AdminLayout>
    )
}

export default AdminInteractions;
