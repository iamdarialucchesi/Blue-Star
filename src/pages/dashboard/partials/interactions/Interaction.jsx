import React, { useEffect, useState, useContext } from "react";
import SearchIcon from "../../../../assets/images/icons/search.svg";
import filterIcon from "../../../../assets/icons/filter-icon.svg";
import rightArrowGreen from "../../../../assets/icons/right-arrow-green.svg";
import PatientProgramService from "./service/PatientsProgramsService.js";
import { AuthContext } from "../../../../context/AuthContext.jsx";
import Spinner from "../../../../components/Spinner.jsx";
import {useProviderDataStore} from "../../../../stores/ProviderDataStore.js";

function Interaction({ handleProgramItem }) {
    const { authToken } = useContext(AuthContext);
    const {providerOrganizationID} = useProviderDataStore();
    const [patients, setPatients] = useState([]);
    const [selectedPatientIndex, setSelectedPatientIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        fetchAllPatients();
    }, []);

    const fetchAllPatients = async () => {
        try {
            setIsLoading(true);
            const organizationId = providerOrganizationID || ""
            const result = await PatientProgramService.fetchPatientPrograms(authToken, organizationId);
            setIsLoading(false);
            if (result && result.patients) {
                setPatients(result.patients);
                setSelectedPatientIndex(0); // Default to the first patient
            }
        } catch (error) {
            console.error('Error fetching results:', error);
        }
    };

    // Function to handle selecting a patient
    const handlePatientClick = (index) => {
        setSelectedPatientIndex(index);
    };

    // Format date utility function
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    };

    if (isLoading) {
        return <Spinner />
    }

    return (
        <div className="interaction-screen interaction-bg-color border p-3 rounded-3">
            <div className="row ms-n15">
                <div className="col-md-4 p-0">
                    {/* Left panel: Patients list */}
                    <div className="px-3">
                        <h4 className="card-heading fw-bold">Patients</h4>
                        <div className="d-flex gap-2">
                            <div
                                className="d-flex align-items-center flex-grow-1 rounded-3 bg-white border border-black-10 py-2 px-3 gap-2">
                                <label htmlFor="patient-searchbar-input" className="d-flex align-items-center">
                                    <img src={SearchIcon} alt="search icon" />
                                </label>
                                <input
                                    className="border-0 bg-transparent input-focus-none fs-14 w-100"
                                    placeholder="Search" id="patient-searchbar-input" />
                            </div>
                            <img src={filterIcon} />
                        </div>
                    </div>
                    <div className="mt-3 interaction-chat-section">
                        <div className="interaction-patients-chat nav flex-column nav-pills" id="v-pills-tab" role="tablist" aria-orientation="vertical">
                            {/* Map through the patients and render each */}
                            {patients.map((patient, index) => (
                                <button
                                    key={patient.PatientID}
                                    className={`nav-link text-start rounded-0 px-3 py-0 ${index === selectedPatientIndex ? 'active' : ''}`}
                                    onClick={() => handlePatientClick(index)}
                                >
                                    <div className="d-flex gap-2 align-items-center py-3">
                                        <span className="rounded-pill">{patient.PatientName.charAt(0)}</span>
                                        <div className="">
                                            <p className="m-0 text-dark fw-normal detail-text">{patient.PatientName}</p>
                                            <p className="content-text-color detail-text-small-size fw-light m-0">
                                                <span className="">{patient.Programs[0]?.MostRecentMessage?.CreatedAt ? formatDate(patient.Programs[0].MostRecentMessage.CreatedAt) : ''}</span>
                                            </p>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="col-md-8 ps-md-0">
                    <div className="interaction-program-enrole-list p-2 p-md-3 border rounded-3 bg-white mt-2 mt-md-0">
                        <h4 className="card-heading fw-bold">Programs</h4>
                        <div className="tab-content" id="v-pills-tabContent">
                            <div className="tab-pane fade show active" id="v-pills-1" role="tabpanel" tabIndex="0">
                                {/* Check if there are any programs for the selected patient */}
                                {patients[selectedPatientIndex]?.Programs.map((program) => (
                                    <div
                                        key={program.ProgramID}
                                        className="interaction-program-item-bg p-3 mb-3 rounded-3 cursor-pointer"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleProgramItem(patients[selectedPatientIndex], program);
                                        }}
                                    >
                                        <div className="row">
                                            <div className="col-12 col-md-3">
                                                <div>
                                                    <p className="mb-1 text-dark fw-normal fs-16">{program.ProgramName}</p>
                                                    <p className="content-text-color detail-text-small-size fw-light m-0">
                                                        <span className="detail-text">{program.MostRecentMessage?.CreatedAt ? formatDate(program.MostRecentMessage.CreatedAt) : ''}</span>
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="col-11 col-md-8 my-auto">
                                                <p className="content-text-color fw-light detail-text m-0">
                                                    {program.MostRecentMessage?.Content || 'No recent messages'}
                                                </p>
                                            </div>
                                            <div className="col-1 my-auto">
                                                <img src={rightArrowGreen} />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Interaction;
