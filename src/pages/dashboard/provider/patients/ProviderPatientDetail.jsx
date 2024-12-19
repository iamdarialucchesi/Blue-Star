import {Link, useLocation, useNavigate} from "react-router-dom";
import React, {useContext, useEffect, useRef, useState} from "react";

import ProviderLayout from "../../../../layouts/provider/ProviderLayout.jsx";

import pencilIcon from '../../../../assets/icons/pencil.svg';
import trashIcon from '../../../../assets/icons/trash.svg';
import RightArrow from '../../../../assets/icons/patient-arrow-right.svg';
import UploadIcon from '../../../../assets/icons/upload-icon.svg';
import MriIcon from '../../../../assets/icons/MRI-icon.svg';
import BloodTest from '../../../../assets/icons/blood-test-icon.svg';
import Prescriptions from '../../../../assets/icons/prescriptions-icon.svg';
import Surgery from '../../../../assets/icons/surgery-icon.svg';
import {useProviderDataStore} from "../../../../stores/ProviderDataStore.js";
import { AuthContext } from "../../../../context/AuthContext.jsx";
import PatientProgramService from "../../partials/interactions/service/PatientsProgramsService.js";
import Spinner from "../../../../components/Spinner.jsx";
import {useAdminDataStore} from "../../../../stores/AdminDataStore.js";
import PatientsService from "../../patients/service/PatientsService.js";
import ProviderPatientsService from "../service/ProviderPatientsService.js";
import DustbinRedWhitePicture from "../../../../assets/images/dustbin-red-white.png";
import {usePatientsDataStore} from "../../../../stores/PatientsDataStore.js";

function PatientDetail() {
    const location = useLocation();
    const navigate = useNavigate();
    const { loginUser } = useAdminDataStore();
    const [patientDocuments, setPatientDocuments] = useState([]);
    const [patientPrograms, setPatientPrograms] = useState(null);
    const [programName, setProgramName] = useState(null);
    const fileInputRef = useRef(null);
    const [deletedDocumentID, setDeletedDocumentID] = useState(null);
    const [isShowDeleteBox, setIsShowDeleteBox] = useState("d-none") // d-flex
    const { authToken } = useContext(AuthContext);
    const [activeTab, setActiveTab] = useState('Conditions');
    const [patient, setPatient] = useState(null);
    const {providerOrganizationID, providerWhiteLabels} = useProviderDataStore();
    const {LinkColor, ButtonColor, SecondaryColor, BackgroundColor} = providerWhiteLabels;
    const [evaluation, setEvaluation] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const fetchEvaluation = async (patientId, programId) => {
        try {
            const result = await PatientProgramService.fetchConversationEvaluation(authToken, patientId, programId);
            setEvaluation(result?.Evaluation || {});
        } catch (error) {
            console.error('Error fetching evaluation:', error);
        }
    };

    const fetchAllPatients = async () => {
        try {
            const organizationId = providerOrganizationID
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

    const fetchAllPatientDocuments = async (patient_id) => {
        try {
            const result = await ProviderPatientsService.fetchPatientPatientDocuments(authToken, patient_id);
            if (result && result.documents){
                setPatientDocuments(result.documents);
            }

        } catch (error) {
            console.error('Error fetching patients:', error);
        }
    };

    useEffect(() => {
        if (location.state && location.state.patient) {
            const patient = location.state.patient;
            setPatient(patient)
        }
    }, [location.state]);

    useEffect(() => {
        if (patient && patient.PatientID) {
            fetchAllPatientDocuments(patient.PatientID);
            fetchAllPatients();
        }
    }, [patient]);

    const showDeleteBox = async (e,DocumentID) => {
        await setDeletedDocumentID(DocumentID);
        e.stopPropagation();
        setIsShowDeleteBox("d-flex")
    }

    function handleInputType() {
        fileInputRef.current.click();
    }

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            try {
                setIsLoading(true);
                // Directly construct the S3 upload URL
                const bucketName = 'bsai-bucket-2';
                const keyName = `patient-documents/${patient.PatientID}/${file.name}`;
                const uploadUrl = `https://${bucketName}.s3.amazonaws.com/${keyName}`;

                const response = await fetch(uploadUrl, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': file.type
                    },
                    body: file,
                });
                setIsLoading(false);

                if (response.ok) {
                    if (response.url){
                        await handleUploadDocument(response.url,file.name)
                    }
                } else {
                    const errorText = await response.text();
                    console.error('Error uploading file:', response.status, errorText);
                }
            } catch (error) {
                // Log error details
                console.error('Error uploading file:', error);
            }
        }
    }

    const handleUploadDocument = async (imageUrl, fileName) => {
        try {
            setIsLoading(true);
            const formValues = {
                PatientID: patient.PatientID,
                DocumentName: fileName,
                DocumentURL: imageUrl
            }
            const result = await ProviderPatientsService.uploadPatientDocument(authToken, formValues);
            setIsLoading(false);
            if (result.status === 200) {
                const data = result.data;
                const newDocument = data.Document;
                setPatientDocuments((prevDocuments) => [
                    newDocument, // Add new document at the top
                    ...prevDocuments,
                ]);
            }
        } catch (error) {
            // Log error details
            console.error('Error uploading file:', error);
        }
    }

    const handleDocumentDelete = async (e) => {
        try {
            e.stopPropagation();
            setIsLoading(true);
            const result = await ProviderPatientsService.deletePatientDocument(authToken, loginUser, deletedDocumentID);
            setIsLoading(false);
            setIsShowDeleteBox("d-none")
            if (result.status === 200) {
                setPatientDocuments(prevDocuments =>
                    prevDocuments.filter(p => p.DocumentID !== deletedDocumentID)
                );
            }
        } catch (error) {
            console.error(error);
        }
    }

    const handleDropdownToggle = (isOpen) => {
        setIsDropdownOpen(isOpen);
    };

    const closeDropdown = () => {
        if (isDropdownOpen) {
            setIsDropdownOpen(false);
            dropdownRef.current.classList.remove("show");
        }
    };

    const handleProgramChange = async (program) => {
        closeDropdown();
        if (program.ProgramName !== programName) {
            setEvaluation(null)
            fetchEvaluation(patient.PatientID, program.ProgramID)
            setProgramName(program.ProgramName)
        }
    };

    const handlePatientEdit = (e,patient) => {
        e.stopPropagation();
        navigate('/provider/patients/edit-patient', { state: { patient } });
    };

    if (!patient || !evaluation || !patientDocuments || isLoading) {
        return <Spinner />
    }

    return (
        <ProviderLayout headerTitle={"Patient Detail"} isDashboard={true}>
            <div className='patient-detail-secreen pt-2'>
                <div className="card mb-3">
                    <div
                        className={`card-header py-3 d-flex justify-content-between align-items-center ${!BackgroundColor && "patient-card-background-color"}`}
                        style={{backgroundColor: BackgroundColor && BackgroundColor}}>
                        <h4 className='card-heading fw-bold m-0'>{patient.FirstName} {patient.LastName}</h4>
                        <div className='card-icons d-flex gap-2'>
                            <button type="button" className="btn border-0"
                                    onClick={(e) => handlePatientEdit(e, patient)}>
                                <img src={pencilIcon} className='icon-sizing'/>
                            </button>
                            {/*<Link>*/}
                            {/*    <img src={trashIcon} className='icon-sizing'/>*/}
                            {/*</Link>*/}
                        </div>
                    </div>
                    <div className="card-body px-4">
                        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-5 g-2 g-lg-3">
                            <div className="col d-flex flex-column justify-content-between gap-3 gap-lg-0 p-0">
                                <div className='mb-0 mb-lg-4'>
                                    <p className='patient-card-detail-heading m-0'>Phone</p>
                                    <p className='detail-text text-light fw-normal m-0'>{patient.PhoneNumber}</p>
                                </div>
                                <div>
                                    <p className='patient-card-detail-heading m-0'>Programs</p>
                                    <p className='detail-text text-light fw-normal m-0'>{patient.Program.map(p => p.label).join(', ')}</p>
                                </div>
                            </div>

                            <div className="col d-flex flex-column justify-content-between gap-3 gap-lg-0 p-0">
                                <div className='mb-0 mb-lg-4'>
                                    <p className='patient-card-detail-heading m-0'>Email</p>
                                    <p className='detail-text text-light fw-normal m-0'>{patient.EmailAddress}</p>
                                </div>
                                <div>
                                    <p className='patient-card-detail-heading m-0'>Registered date</p>
                                    <p className='detail-text text-light fw-normal m-0'>
                                        {new Date(patient.CreatedAt).toLocaleDateString('en-GB', {
                                            day: '2-digit',
                                            month: 'short',
                                            year: 'numeric',
                                        })}
                                    </p>
                                </div>
                            </div>

                            <div className="col d-flex flex-column justify-content-between gap-3 gap-lg-0 p-0">
                                {/*<div className='mb-0 mb-lg-4'>*/}
                                {/*    <p className='patient-card-detail-heading m-0'>Date of Birth</p>*/}
                                {/*    <p className='detail-text text-light fw-normal m-0'>*/}
                                {/*        {new Date(patient.DateOfBirth).toLocaleDateString('en-GB', {*/}
                                {/*            day: '2-digit',*/}
                                {/*            month: 'short',*/}
                                {/*            year: 'numeric',*/}
                                {/*        })}*/}
                                {/*    </p>*/}
                                {/*</div>*/}
                                <div>
                                    <p className='patient-card-detail-heading m-0'>Status</p>
                                    <p className='detail-text text-light fw-normal m-0'>Active</p>
                                </div>
                                <div>
                                    <p className='patient-card-detail-heading m-0'>Blood</p>
                                    <p className='detail-text text-light fw-normal m-0'>{patient.BloodGroup}</p>
                                </div>
                            </div>

                            <div className="col d-flex flex-column justify-content-between gap-3 gap-lg-0 p-0">
                                {/*<div className='mb-0 mb-lg-4'>*/}
                                {/*    <p className='patient-card-detail-heading m-0'>Age</p>*/}
                                {/*    <p className='detail-text text-light fw-normal m-0'>{calculateAge(patient.DateOfBirth)} Yrs</p>*/}
                                {/*</div>*/}
                                <div>
                                    <p className='patient-card-detail-heading m-0'>Gender</p>
                                    <p className='detail-text text-light fw-normal m-0'>{patient.Gender}</p>
                                </div>
                            </div>

                            <div className="col d-flex flex-column justify-content-between gap-3 gap-lg-0 p-0">
                                <div className='mb-0 mb-lg-4'>
                                    <p className='patient-card-detail-heading m-0'>Address</p>
                                    <p className='detail-text text-light fw-normal m-0'>{`${patient.Address.Street}, ${patient.Address.City}, ${patient.Address.State}, ${patient.Address.ZipCode}`}</p>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

                <div className='row'>
                    <div className='col-12 col-lg-6'>
                            <div className='custom-scrollbar-section patient-section-border rounded-3 px-3'>
                                <div className='d-flex justify-content-between border-bottom pt-3'>
                                    <h2 className='section-heading-3d3d3d-18px fw-bold'>AI Quick Summary</h2>

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

                                {/* <Link
                                    className={`${!LinkColor ? "patient-section-text" : ""} text-decoration-none fw-bold`}
                                    style={{color: LinkColor ? LinkColor : ""}}>Show More
                                    <svg width="14" height="11" viewBox="0 0 14 11" fill="currentColor"
                                         xmlns="http://www.w3.org/2000/svg" className="mt-n1 ms-1">
                                        <path
                                            d="M7.87217 0.75092C7.80211 0.82107 7.76276 0.916164 7.76276 1.01531C7.76276 1.11446 7.80211 1.20955 7.87217 1.2797L11.7227 5.1308L1.65154 5.1308C1.55231 5.1308 1.45715 5.17022 1.38699 5.24039C1.31682 5.31055 1.27741 5.40571 1.27741 5.50494C1.27741 5.60417 1.31682 5.69933 1.38699 5.76949C1.45715 5.83966 1.55231 5.87908 1.65154 5.87908L11.7227 5.87908L7.87217 9.73018C7.80609 9.80111 7.77011 9.89491 7.77182 9.99184C7.77353 10.0888 7.81279 10.1812 7.88134 10.2498C7.94989 10.3183 8.04237 10.3576 8.1393 10.3593C8.23622 10.361 8.33003 10.325 8.40095 10.259L12.8906 5.76933C12.9606 5.69918 13 5.60409 13 5.50494C13 5.40579 12.9606 5.3107 12.8906 5.24055L8.40095 0.75092C8.3308 0.680857 8.23571 0.641503 8.13656 0.641503C8.03742 0.641503 7.94233 0.680856 7.87217 0.75092Z"
                                            fill="currentColor" stroke="currentColor" strokeWidth="0.8"
                                        />
                                    </svg>
                                </Link> */}
                            </div>

                            {/* Key Points */}
                            {/* <div className='mt-3'>
                                <p className='detail-text text-dark fw-normal mb-2'>Key Points</p>
                                <ol className="list-group list-group-numbered">
                                    <li className="list-group-item detail-text border-0 py-1 fw-normal text-light">ut
                                        aliquip ex ea
                                        commodo consequat.
                                    </li>
                                    <li className="list-group-item detail-text border-0 py-1 fw-normal text-light">Sed
                                        do
                                        eiusmod
                                        tempor incididunt ut labore et
                                        dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
                                        laboris nisi.
                                    </li>
                                    <li className="list-group-item detail-text border-0 py-1 fw-normal text-light">Patient
                                        suffers
                                        from Lorem ipsum dolor sit
                                        amet, consectetur adipiscing elit.
                                    </li>
                                </ol>
                            </div> */}

                            {/* Summary */}
                            <div className='mt-3'>
                                <p className='detail-text text-dark fw-normal mb-2'>Summary</p>
                                <p className="text-light fw-light detail-text">
                                    {(evaluation?.KeyPoints?.length > 0 && evaluation?.KeyPoints[0]) || "No summary available"}
                                </p>
                            </div>

                            {/* Actionable Items */}
                            <div className='mt-5 mb-4'>
                                <p className='text-dark fs-6 fw-normal detail-text '>Actionable Items</p>
                                {evaluation?.ActionableItems?.length > 0 ? (
                                    evaluation.ActionableItems.map((item, index) => (
                                        <p key={index} className='patient-label-background-color text-light detail-text fw-normal px-3 py-2 rounded-4'>
                                            {item.action}
                                        </p>
                                    ))
                                ) : (
                                    <p className='text-light detail-text'>No actionable items available.</p>
                                )}
                            </div>

                        </div>
                    </div>
                    <div className='col-12 col-lg-6'>
                        <div className='custom-scrollbar-section patient-section-border rounded-3 px-3'>
                            <div className="tabs-header d-flex justify-content-between border-bottom gap-4 pt-3">
                                <button onClick={() => setActiveTab('Conditions')}
                                        className={`btn border-0 rounded-0 p-0 pb-2 ${activeTab === 'Conditions' ? 'patient-tab-active' : 'detail-text '}`}>Conditions
                                </button>
                                <button onClick={() => setActiveTab('Medications')}
                                        className={`btn border-0 rounded-0 p-0 pb-2 ${activeTab === 'Medications' ? 'patient-tab-active' : 'detail-text '}`}>Medications
                                </button>
                                <button onClick={() => setActiveTab('Allergies')}
                                        className={`btn border-0 rounded-0 p-0 pb-2 ${activeTab === 'Allergies' ? 'patient-tab-active' : 'detail-text '}`}>Allergies
                                </button>
                                <button onClick={() => setActiveTab('SurgicalHistory')}
                                        className={`btn border-0 rounded-0 p-0 pb-2 ${activeTab === 'SurgicalHistory' ? 'patient-tab-active' : 'detail-text '}`}>Surgical
                                    History
                                </button>
                            </div>
                            <div className="tabs-content">
                                <RenderContent activeTab={activeTab} patient={patient}/>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Overlay */}
                {isDropdownOpen && (
                    <div className="dropdown-overlay" onClick={closeDropdown}></div>
                )}

                <div className='row'>
                    <div className='col-12 col-lg-6'>
                        <div className='custom-scrollbar-section patient-section-border rounded-3 px-3'>
                            <div className='d-flex justify-content-between border-bottom pt-3'>
                                <h2 className='section-heading-3d3d3d-18px fw-bold'>Recommended Follow-up Care</h2>
                            </div>
                            <div className='mt-1 detail-text'>
                                {/* <div
                                    className='text-light border-bottom d-flex justify-content-between align-items-center py-3'>Alcohol
                                    Screening
                                    <button className={`detail-text btn px-2 py-1 ${!ButtonColor ? "btn-primary" : ""}`}
                                            style={{backgroundColor: ButtonColor ? ButtonColor : ""}}>Schedule</button>
                                </div> */}
                                {evaluation?.RecommendedFollowUpCare?.length > 0 ? (
                                    evaluation.RecommendedFollowUpCare.map((item, index) => (
                                    <div key={index} className='text-light border-bottom d-flex justify-content-between align-items-center py-3'>
                                        <span style={{maxWidth: "80%"}}>{item.action}</span>
                                        <button style={{marginBottom: "auto"}} className='detail-text btn text-light px-2 py-1'>{item.date}</button>
                                    </div>
                                    ))
                                ) : (
                                    <p className='text-light border-bottom d-flex justify-content-between align-items-center py-3'>No recommended follow-ups available.</p>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className='col-12 col-lg-6'>
                        <div className='custom-scrollbar-section patient-section-border rounded-3 px-3'>
                            <div className='d-flex justify-content-between border-bottom pt-3'>
                                <h2 className='section-heading-3d3d3d-18px fw-bold'>Documents & Reports</h2>
                                <div>
                                    <button className='btn border-0 pb-2 patient-section-text text-decoration-none fw-bold' onClick={() => handleInputType()}>Upload <span
                                        className='ps-1'><img
                                        src={UploadIcon}/></span>
                                    </button>
                                    <input type='file' className='form-control d-none' ref={fileInputRef} onChange={handleFileChange}/>
                                </div>
                            </div>
                            <div className='mt-2 detail-text'>
                                {patientDocuments && patientDocuments.map((document) => (
                                    <div key={document.DocumentID} className='border-bottom d-flex justify-content-between align-items-center py-3'>
                                        <div className='report-details d-flex gap-3'>
                                            <img src={MriIcon}/>
                                            <div className='report-content'>
                                                <p className='m-0 text-light detail-text'>{document.DocumentName}</p>
                                                <p className='m-0 detail-text-small-size content-small-text-color'>
                                                    {new Date(document.CreatedAt).toLocaleDateString('en-GB', {
                                                        day: '2-digit',
                                                        month: 'short',
                                                        year: 'numeric',
                                                    })}
                                                </p>
                                            </div>
                                        </div>
                                        <button onClick={(e) => showDeleteBox(e,document.DocumentID)}
                                                className="admin-table-delete-btn border border-red-50 rounded-3 d-flex align-items-center justify-content-center"
                                        >
                                            <img src={trashIcon} className='icon-sizing'/>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/*DELETE POPUP*/}
                <div
                    onClick={() => setIsShowDeleteBox("d-none")}
                    className={`admin-table-delete-confirm bg-black-10 ${isShowDeleteBox} d-flex align-items-center justify-content-center`}>
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="admin-table-delete-confirm-box mx-3 py-4 bg-white border border-black-20 rounded-2 d-flex flex-column align-items-center justify-content-center text-center">
                        <img src={DustbinRedWhitePicture}/>
                        <h5 className="mb-1 mt-2 fw-normal fs-18">Delete Document?</h5>
                        <p className="mb-0 text-dark-grey fw-light fs-14">Are you sure you want to
                            delete this document?</p>

                        <div className="d-flex align-items-center gap-2 mt-3">
                            <button
                                onClick={(e) => handleDocumentDelete(e)}
                                className="d-flex align-items-center bg-parrot-green border-0 py-2 px-3 rounded-2 fs-14 fw-normal">
                                Yes, Delete
                            </button>
                            <button
                                onClick={() => setIsShowDeleteBox("d-none")}
                                className="d-flex align-items-center bg-transparent border border-dark-blue text-dark-blue py-2 px-3 rounded-2 fs-14 fw-normal">
                                Keep Document
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </ProviderLayout>
    )
}

function calculateAge(dob) {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}


function RenderContent({activeTab, patient}) {
    switch (activeTab) {
        case 'Conditions':
            return <Conditions conditions={patient?.HealthHistory?.PreExistingConditions || ''}/>;
        case 'Medications':
            return <Medications medications={patient?.CurrentMedications || []}/>;
        case 'Allergies':
            return <Allergies allergies={patient?.Allergies || []}/>;
        case 'SurgicalHistory':
            return <SurgicalHistory surgeries={patient?.SurgeryHistory || []}/>;
        default:
            return null;
    }
}

function Conditions({conditions}) {
    if (conditions) {
        return (
            <div className='mt-3'>
                <p className='tab-content-background-color content-text-color detail-text  fw-light px-3 py-2 rounded-4'>{conditions}</p>
            </div>
        )

    }
}

function Medications(medications) {
    return <div className='mt-2'>
        <p className='text-dark fw-normal detail-text  px-3 py-2 rounded-4 d-flex justify-content-between align-items-center mb-1'>
            <span className='w-75'>Names</span> <span className='w-25'>Dose</span>
        </p>
        {medications.medications.map((medication, index) => (
            <p key={index}
               className='tab-content-background-color content-text-color detail-text  fw-light px-3 py-2 rounded-4 d-flex justify-content-between align-items-center'>
                <span className='w-75'>{medication.Name}</span><span className='w-25'>{medication.Dosage}g</span>
            </p>
        ))}
    </div>
}


function Allergies(allergies) {
    return <div className='mt-2'>
        <p className='text-dark fw-normal fs-6 px-3 py-2 rounded-4 d-flex justify-content-between align-items-center mb-1'>
            <span className='w-50'>Names</span> <span className='w-50'>Effects</span>
        </p>
        {allergies.allergies.map((allergie, index) => (
            <p key={index}
               className='tab-content-background-color content-text-color detail-text  fw-light px-3 py-2 rounded-4 d-flex justify-content-between align-items-center'>
                <span className='w-50'>{allergie.Name}</span><span className='w-50'>{allergie.Effect}</span>
            </p>
        ))}

    </div>
}

function SurgicalHistory(surgeries) {
    return <div className='mt-2'>
        <p className='text-dark fw-normal detail-text px-3 py-2 rounded-4 d-flex justify-content-between align-items-center mb-1'>
            <span>Names</span> <span>Performed</span>
        </p>
        {surgeries.surgeries.map((surgery, index) => (
            <p key={index}
               className='tab-content-background-color content-text-color detail-text  fw-light px-3 py-2 rounded-4 d-flex justify-content-between align-items-center'>
                <span>{surgery.Procedure}</span><span>{surgery.Date}</span>
            </p>
        ))}

    </div>
}

export default PatientDetail;
