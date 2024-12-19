import React, {useContext, useEffect, useRef, useState} from "react";
import {Link, useNavigate} from "react-router-dom";

import SearchIcon from "../../../../assets/images/icons/search.svg";
import redFlagIcon from "../../../../assets/icons/red-flag-icon.svg";
import RightArrow from "../../../../assets/icons/patient-arrow-right.svg";
import {useProviderDataStore} from "../../../../stores/ProviderDataStore.js";
import PatientProgramService from "../../partials/interactions/service/PatientsProgramsService.js";
import {AuthContext} from "../../../../context/AuthContext.jsx";


function ProviderSummary( {patients}){
    const navigate = useNavigate();
    const {authToken} = useContext(AuthContext);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [activePatientId, setActivePatientId] = useState(null);
    const {providerWhiteLabels} = useProviderDataStore();
    const [searchInput, setSearchInput] = useState('');
    const [allPatients, setAllPatients] = useState([]);
    const [duplicateAllPatients, setDuplicateAllPatients] = useState(patients);
    const [programName, setProgramName] = useState(null);
    const dropdownRef = useRef(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [patientPrograms, setPatientPrograms] = useState(null);
    const [evaluation, setEvaluation] = useState(null);


    const {LinkColor} = providerWhiteLabels;


    const fetchEvaluation = async (patientId, programId) => {
        try {
            const result = await PatientProgramService.fetchConversationEvaluation(authToken, patientId, programId);
            setEvaluation(result?.Evaluation || {});
        } catch (error) {
            console.error('Error fetching evaluation:', error);
        }
    };

    const fetchAllPatients = async (patient) => {
        try {
            const organizationId = ""
            const result = await PatientProgramService.fetchPatientPrograms(authToken, organizationId);
            if (result && result.patients && patient.PatientID) {
                const program = result.patients.filter(p => p.PatientID === patient.PatientID)[0];
                setPatientPrograms(program)
                if (program && program.Programs) {
                    fetchEvaluation(patient.PatientID, program.Programs[0].ProgramID)
                    setProgramName(program.Programs[0].ProgramName)
                } else {
                    setEvaluation({})
                }
            }
        } catch (error) {
            console.error('Error fetching results:', error);
        }
    };

    useEffect(() => {
        // Initialize states when `patients` is updated
        if (patients && patients.length > 0) {
            setSelectedPatient(patients[0]);
            setActivePatientId(patients[0].PatientID);
            setAllPatients(patients);
            setDuplicateAllPatients(patients);

            fetchAllPatients(patients[0]);

        }
    }, [patients]);

    useEffect(() => {
        // Handle search logic when `searchInput` changes
        if (searchInput) {
            const filteredPatients = duplicateAllPatients.filter((patient) =>
                patient.FirstName.toLowerCase().includes(searchInput.toLowerCase()) ||
                patient.LastName.toLowerCase().includes(searchInput.toLowerCase())
            );
            setAllPatients(filteredPatients);
        } else {
            setAllPatients(duplicateAllPatients);
        }
    }, [searchInput, duplicateAllPatients]);


    const handlePatientClick = async (patient) => {
        setSelectedPatient(patient);
        setActivePatientId(patient.PatientID);
        await fetchAllPatients(patient);
    };

    const handleProgramChange = async (program) => {
        closeDropdown();
        if (program.ProgramName !== programName) {
            setProgramName(program.ProgramName)
        }
    };

    const closeDropdown = () => {
        if (isDropdownOpen) {
            setIsDropdownOpen(false);
            dropdownRef.current.classList.remove("show");
        }
    };
    const handleDropdownToggle = (isOpen) => {
        setIsDropdownOpen(isOpen);
    };
    const handlePatientDetail = (e) => {
        e.stopPropagation()
        navigate('/provider/patients/patient-detail', { state: { patient: selectedPatient } });
    };


    return(
        <>
            <div className="whole-summary-section border rounded-3 mt-4 mt-md-0">
                <div className="row">
                    <div className="col-md-6">
                        <div className="p-3 border-end">
                            <div className="patients-summary-option-wrapper">
                                <div
                                    className="d-flex align-items-center rounded-2 border bg-field px-3 py-1 gap-1">
                                    <label htmlFor="header-searchbar-input"
                                           className="d-flex align-items-center">
                                        <img src={SearchIcon}/>
                                    </label>
                                    <input
                                        className="border-0 bg-transparent input-focus-none"
                                        placeholder="Search Patients"
                                        id="header-searchbar-input"
                                        value={searchInput}
                                        onChange={(e) => setSearchInput(e.target.value)}
                                    />
                                </div>
                                <div className="mt-3 summary-section">
                                    {allPatients && allPatients.map((patient) => (
                                        <div key={patient.PatientID}
                                             onClick={() => handlePatientClick(patient)}
                                             className={`patients-summary-option cursor-pointer py-3 px-3 mb-2 ${
                                                 activePatientId === patient.PatientID ? 'patients-summary-option-active' : ''
                                             }`}>
                                            <div className="d-flex justify-content-between">
                                                <h4 className="m-0 text-light fw-normal detail-text">{patient.FirstName + ' ' + patient.LastName}</h4>
                                            </div>
                                            <p className="m-0 fw-normal detail-text-small-size content-small-text-color">{ patient.Program.map(p => p.label).join(', ') }</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 ps-md-0">
                        <div className="summary-detials py-3 px-3 ps-md-2 pe-md-3">
                            <div className="d-flex justify-content-between border-bottom pb-2">
                                <h4 className="card-heading fw-bold m-0">AI Quick Summary</h4>
                                <div className="handle-dropdown">
                                    {patientPrograms && patientPrograms.Programs && patientPrograms.Programs.length > 0 ? (
                                        <div>
                                            <button
                                                className="btn border-0 text-light fw-light detail-text p-0 d-flex align-items-center gap-2 dropdown-toggle"
                                                data-bs-toggle="dropdown"
                                                data-bs-auto-close="outside"
                                                onClick={() => handleDropdownToggle(true)}
                                            >
                                                {programName}
                                            </button>
                                            <ul className="dropdown-menu py-0 px-3 role-accessibility-dropdown-inset cursor-pointer" ref={dropdownRef}>
                                                {patientPrograms.Programs.map((program,index) => (
                                                    <li key={index} onClick={() => handleProgramChange(program)}>
                                                        <a className="dropdown-item ps-0 py-2 border-bottom detail-text fw-normal dropdown-text-color">
                                                            {program.ProgramName}
                                                        </a>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ) : null}
                                </div>
                                {/*<Link to='/provider/interactions' className={`text-decoration-none fw-bold fs-6 ${!LinkColor ? "text-primary" : ""}`} style={{color: LinkColor ? LinkColor : ""}}>*/}
                                {/*    See Chat*/}
                                {/*    <svg width="16" height="16" viewBox="0 0 14 11" fill="currentColor"*/}
                                {/*         xmlns="http://www.w3.org/2000/svg" className="mt-n1 ms-1">*/}
                                {/*        <path*/}
                                {/*            d="M7.87217 0.75092C7.80211 0.82107 7.76276 0.916164 7.76276 1.01531C7.76276 1.11446 7.80211 1.20955 7.87217 1.2797L11.7227 5.1308L1.65154 5.1308C1.55231 5.1308 1.45715 5.17022 1.38699 5.24039C1.31682 5.31055 1.27741 5.40571 1.27741 5.50494C1.27741 5.60417 1.31682 5.69933 1.38699 5.76949C1.45715 5.83966 1.55231 5.87908 1.65154 5.87908L11.7227 5.87908L7.87217 9.73018C7.80609 9.80111 7.77011 9.89491 7.77182 9.99184C7.77353 10.0888 7.81279 10.1812 7.88134 10.2498C7.94989 10.3183 8.04237 10.3576 8.1393 10.3593C8.23622 10.361 8.33003 10.325 8.40095 10.259L12.8906 5.76933C12.9606 5.69918 13 5.60409 13 5.50494C13 5.40579 12.9606 5.3107 12.8906 5.24055L8.40095 0.75092C8.3308 0.680857 8.23571 0.641503 8.13656 0.641503C8.03742 0.641503 7.94233 0.680856 7.87217 0.75092Z"*/}
                                {/*            fill="currentColor" stroke="currentColor" strokeWidth="0.8"*/}
                                {/*        />*/}
                                {/*    </svg>*/}
                                {/*</Link>*/}
                            </div>
                            <div className="mt-3 summary-section">
                                <p onClick={(e) => handlePatientDetail(e)} className="m-0 provider-activites-text-background-color p-3 text-light detail-text fw-light rounded-4">{(evaluation?.KeyPoints?.length > 0 && evaluation?.KeyPoints[0]) || "No summary available"}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ProviderSummary;
