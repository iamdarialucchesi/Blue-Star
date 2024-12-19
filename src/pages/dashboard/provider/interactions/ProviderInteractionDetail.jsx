import React from "react";
import ProviderLayout from "../../../../layouts/provider/ProviderLayout.jsx";
import { useLocation } from "react-router-dom";
import InteractionDetail from "../../partials/interactions/InteractionDetail.jsx";

function ProviderInteractionDetail() {

    const location = useLocation();
    const { patientData, programData } = location.state || {};

    return (
        <ProviderLayout headerTitle={"Interaction"} isDashboard={true}>
            <InteractionDetail patientData={patientData} programData={programData}/>
        </ProviderLayout>
    )
}

export default ProviderInteractionDetail;
