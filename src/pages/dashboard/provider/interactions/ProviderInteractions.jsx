import React from "react";
import {useNavigate} from "react-router-dom";

import ProviderLayout from "../../../../layouts/provider/ProviderLayout.jsx";
import Interaction from "../../partials/interactions/Interaction.jsx";


function ProviderInteractions() {
    const navigate = useNavigate();

    function handleProgramItem(patientData, programData) {
        navigate("/provider/interactions/detail", { state: { patientData, programData } });
    }

    return (
        <ProviderLayout headerTitle={"Interaction"}>
            <Interaction handleProgramItem={handleProgramItem}/>
        </ProviderLayout>
    )
}

export default ProviderInteractions;
