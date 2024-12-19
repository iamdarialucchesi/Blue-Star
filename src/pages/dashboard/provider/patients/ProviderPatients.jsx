import React, {useContext, useEffect, useRef, useState} from "react";
import {Link, useNavigate} from "react-router-dom";

import ProviderLayout from "../../../../layouts/provider/ProviderLayout.jsx";
import PatientsFilter from "../../../../components/PatientsFilter.jsx";

import SearchIcon from "../../../../assets/images/icons/search.svg";
import filterIcon from "../../../../assets/icons/filter-icon.svg";
import orderIcon from "../../../../assets/icons/order-icon.svg";
import PlusBlackIcon from "../../../../assets/images/icons/black-plus.svg";
import EditCyanIcon from "../../../../assets/icons/lightest-blue-edit-icon.svg";
import DustbinRedIcon from "../../../../assets/icons/trash.svg";
import LeftArrowGreyIcon from "../../../../assets/images/icons/arrow-left-dark-grey.svg";
import RightArrowGreyIcon from "../../../../assets/images/icons/arrow-right-dark-grey.svg";
import DustbinRedWhitePicture from "../../../../assets/images/dustbin-red-white.png";
import messageLavenderIcon from "../../../../assets/icons/message-lavender-blue-outline-icon.svg";
import blueUploaderIcon from "../../../../assets/icons/blue-uploader-icon.svg";
import whiteTickIcon from "../../../../assets/icons/white-circle-icon.svg";
import {AuthContext} from "../../../../context/AuthContext.jsx";
import {usePatientsDataStore} from "../../../../stores/PatientsDataStore.js";
import {useAdminDataStore} from "../../../../stores/AdminDataStore.js";
import ProviderPatientsService from "../service/ProviderPatientsService.js";
import PatientsService from "../../patients/service/PatientsService.js";
import {useProviderDataStore} from "../../../../stores/ProviderDataStore.js";
import Spinner from "../../../../components/Spinner.jsx";

function ProviderPatients() {
    const navigate = useNavigate();
    const {authToken} = useContext(AuthContext);
    const {providerOrganizationID, providerWhiteLabels} = useProviderDataStore();
    const {setProgramNames, programNames, setOrganizationsData, setOrganizationPractices} = usePatientsDataStore();
    const {loginUser} = useAdminDataStore();
    const [allPatients, setAllPatients] = useState([]);
    const [duplicateAllPatients, setDuplicateAllPatients] = useState([]);
    const [deletedPatient, setDeletedPatient] = useState(null);
    const [searchInput, setSearchInput] = useState('');
    const [order, setOrder] = useState('desc');

    const [isShowDeleteBox, setIsShowDeleteBox] = useState("d-none") // d-flex
    const [isShowOrderByBox, setIsShowOrderByBox] = useState("d-none") // d-block
    const [isShowFilterModal, setIsShowFilterModal] = useState(false) // true
    const [isAddPatient, setisAddPatient] = useState("d-none");
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isCompleted, setIsCompleted] = useState(false);
    const [isImport, setIsImport] = useState("");
    const fileInputRef = useRef(null);
    const [isLoading, setIsLoading] = useState(false);

    //for Filter
    const [selectedProgramNames, setSelectedProgramNames] = useState([]);
    const [filterSelectedGender, setFilterSelectedGender] = useState('');

    const {ButtonColor, PrimaryColor} = providerWhiteLabels;

    useEffect(() => {
        fetchAllPatients();
    }, [order]);

    useEffect(() => {
        if (searchInput) {
            const filteredPatients = allPatients.filter(
                (patient) =>
                    patient.FirstName.toLowerCase().includes(searchInput.toLowerCase()) ||
                    patient.LastName.toLowerCase().includes(searchInput.toLowerCase())
            );
            setAllPatients(filteredPatients);
        } else {
            setAllPatients(duplicateAllPatients);
        }
    }, [searchInput]);

    const fetchAllPatients = async () => {
        setIsLoading(true);
        const result = await ProviderPatientsService.fetchPatients(authToken, providerOrganizationID, order);
        setIsLoading(false);
        const patientsData = result.patients;
        if (patientsData) {
            setAllPatients(patientsData);
            setDuplicateAllPatients(patientsData);
            if (result.programs) {
                await setProgramNames(result.programs);
            }
            if (result.organization) {
                await setOrganizationsData(result.organization);
            }
            await setOrganizationPractices(result.practices);
        }
    }

    const handleFilterPatients = async (formValues) => {
        try {
            setIsLoading(true);
            await setSelectedProgramNames(formValues.selectedPrograms);
            await setFilterSelectedGender(formValues.selectedGender);
            const result = await ProviderPatientsService.filterAllPatients(authToken, formValues);
            setIsLoading(false);
            if (result.status === 200) {
                const data = result.data;
                const patientsData = data.patients;
                if (patientsData) {
                    setAllPatients(patientsData);
                    setDuplicateAllPatients(patientsData);
                }
            }
        } catch (error) {
            setIsLoading(false);
            console.error('Update failed:', error);
        }
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const today = new Date();

        const yesterday = new Date();
        yesterday.setDate(today.getDate() - 1);

        const tomorrow = new Date();
        tomorrow.setDate(today.getDate() + 1);

        const isSameDay = (d1, d2) =>
            d1.getDate() === d2.getDate() &&
            d1.getMonth() === d2.getMonth() &&
            d1.getFullYear() === d2.getFullYear();

        if (isSameDay(date, today)) {
            return 'Today';
        } else if (isSameDay(date, yesterday)) {
            return 'Yesterday';
        } else if (isSameDay(date, tomorrow)) {
            return 'Tomorrow';
        } else {
            return date.toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
            });
        }
    };

    const showDeleteBox = async (e, patient) => {
        e.stopPropagation();
        await setDeletedPatient(patient)
        setIsShowDeleteBox("d-flex")
    }
    const handlePatientDelete = async (e) => {
        e.stopPropagation();
        setIsLoading(true);
        const result = await ProviderPatientsService.deletePatient(authToken, deletedPatient.PatientID, loginUser);
        setIsLoading(false);
        if (result.status === 200) {
            setIsShowDeleteBox("d-none")
            if (result.status === 200) {
                setAllPatients(prevPatients =>
                    prevPatients.filter(p => p.PatientID !== deletedPatient.PatientID)
                );
            }
        }
    }

    const handlePatientEdit = (e, patient) => {
        e.stopPropagation();
        navigate('/provider/patients/edit-patient', {state: {patient}});
    };


    function handleInputType() {
        fileInputRef.current.click();
    }

    const handleRowClick = (e, patient) => {
        // Prevent navigation when clicking on Link or button
        if (e.target.closest('a') || e.target.closest('button')) {
            return;
        }
        navigate("/provider/patients/patient-detail", {state: {patient}});
    };

    const handleFileChange = (e) => {
        if (e) setSelectedFile(e.target.files[0]);
        setUploadProgress(0);
    };

    const handleUpload = (e) => {
        e.stopPropagation();
        if (!isImport && !selectedFile) return;

        setUploading(true);
        setUploadProgress(0);

        // Simulate the upload progress
        const simulateUpload = setInterval(() => {
            setUploadProgress((prevProgress) => {
                if (prevProgress >= 100) {
                    clearInterval(simulateUpload);
                    setIsCompleted(true);
                    return 100;
                }
                return prevProgress + 10;
            });
        }, 250);
    };

    const handleImportUrl = (e) => {
        const importUrl = e.target.value;

        setIsImport(importUrl);

        handleFileChange(null, importUrl);
    }

    const handleOrderChange = (newOrder) => {
        setOrder(newOrder);
        setIsShowOrderByBox("d-none");
    };

    const handleResetStates = () => {
        setSelectedFile(null);
        setUploading(false);
        setUploadProgress(0);
        setIsCompleted(false);
        setIsImport("");
    }


    if (isLoading) {
        return <Spinner />
    }

    return (
        <ProviderLayout headerTitle={"Patients"} isDashboard={false}>
            <div>
                <section className="border border-light-grey rounded-4 px-3 pt-4 pb-0">
                    <div
                        className="admin-table-top d-flex flex-md-row flex-column align-items-center justify-content-md-between">
                        <h5 className="mb-md-0 mb-3 fw-bolder fs-19">{allPatients && allPatients.length} Patients
                            Total</h5>

                        <div className="table-top-side-btn d-flex align-items-center flex-wrap gap-2">
                            <div
                                className="admin-table-searchbar d-flex align-items-center rounded-2 bg-white border border-black-10 py-2 px-3 gap-2">
                                <label htmlFor="patient-searchbar-input" className="d-flex align-items-center">
                                    <img src={SearchIcon} alt="search icon"/>
                                </label>
                                <input
                                    className="border-0 bg-transparent input-focus-none flex-grow-1 flex-shrink-1 fs-14"
                                    placeholder="Search"
                                    id="patient-searchbar-input"
                                    value={searchInput}
                                    onChange={(e) => setSearchInput(e.target.value)}
                                />
                            </div>

                            <div className='table-top-right-btns d-flex align-items-center gap-2'>
                                <div className="position-relative">
                                    <button className="btn p-0 border-0" onClick={() => setIsShowFilterModal(true)}>
                                        <img src={filterIcon} alt="filter icon"/>
                                    </button>
                                    {
                                        (isShowFilterModal) ? (<>
                                            <PatientsFilter setIsShowFilterModal={setIsShowFilterModal}
                                                            isShowFilterModal={isShowFilterModal}
                                                            programNames={programNames}
                                                            organizationID={providerOrganizationID}
                                                            selectedProgramNames={selectedProgramNames}
                                                            filterSelectedGender={filterSelectedGender}
                                                            handleFilterPatients={handleFilterPatients}/>
                                        </>) : ""
                                    }
                                </div>

                                {/*Order Popup*/}
                                <div className='position-relative'>
                                    <button
                                        onClick={() => setIsShowOrderByBox("d-block")}
                                        className="btn p-0 border-0">
                                        <img src={orderIcon}/>
                                    </button>
                                    {/*ORDER BY POPUP*/}
                                    <div onClick={() => setIsShowOrderByBox("d-none")}
                                         className={`admin-table-delete-confirm ${isShowOrderByBox} bg-black-10`}></div>
                                    <ul className={`admin-order-by-popup ${isShowOrderByBox} list-unstyled mb-0 border border-light-grey rounded-3 overflow-hidden position-absolute`}>
                                        <li role="button" className="px-3 py-2 text-dark-grey bg-white border-bottom"
                                            onClick={() => handleOrderChange('desc')}
                                        >
                                            Newest First
                                        </li>

                                        <li role="button" className="px-3 py-2 text-dark-grey bg-white"
                                            onClick={() => handleOrderChange('asc')}
                                        >
                                            Oldest First
                                        </li>
                                    </ul>
                                </div>

                                <div className="dropdown-center">
                                    <button
                                        onClick={() => setisAddPatient("d-block")}
                                        className={`btn py-2 d-flex gap-2 align-items-center justify-content-center justify-content-md-start ${!ButtonColor ? "text-primary" : ""}`}
                                        style={{backgroundColor: ButtonColor ? ButtonColor : ""}}
                                        data-bs-toggle="dropdown">Add
                                        Patient
                                        <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor"
                                             xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                d="M5.16683 0.166016C5.29944 0.166016 5.42661 0.218694 5.52038 0.312462C5.61415 0.40623 5.66683 0.533407 5.66683 0.666016V4.49935H9.50016C9.63277 4.49935 9.75995 4.55203 9.85372 4.6458C9.94748 4.73956 10.0002 4.86674 10.0002 4.99935C10.0002 5.13196 9.94748 5.25913 9.85372 5.3529C9.75995 5.44667 9.63277 5.49935 9.50016 5.49935H5.66683V9.33268C5.66683 9.46529 5.61415 9.59247 5.52038 9.68624C5.42661 9.78 5.29944 9.83268 5.16683 9.83268C5.03422 9.83268 4.90704 9.78 4.81328 9.68624C4.71951 9.59247 4.66683 9.46529 4.66683 9.33268V5.49935H0.833496C0.700888 5.49935 0.573711 5.44667 0.479943 5.3529C0.386174 5.25913 0.333496 5.13196 0.333496 4.99935C0.333496 4.86674 0.386174 4.73956 0.479943 4.6458C0.573711 4.55203 0.700888 4.49935 0.833496 4.49935H4.66683V0.666016C4.66683 0.533407 4.71951 0.40623 4.81328 0.312462C4.90704 0.218694 5.03422 0.166016 5.16683 0.166016Z"
                                                fill="currentColor"/>
                                        </svg>
                                    </button>

                                    {/*dropdown Add button*/}
                                    <div onClick={() => setisAddPatient("d-none")}
                                         className={`admin-table-delete-confirm ${isAddPatient} bg-black-10`}></div>
                                    <ul className="dropdown-menu border-0 px-3">
                                        <li><Link to="/provider/patients/add-patient"
                                                  onClick={() => setisAddPatient("d-none")}
                                                  className="dropdown-item content-text-color fw-normal detail-text border-bottom py-1 px-0">Add
                                            Patient</Link></li>
                                        <li>
                                            <button
                                                onClick={() => setisAddPatient("d-none")}
                                                className="dropdown-item content-text-color fw-normal detail-text py-1 px-0"
                                                data-bs-toggle="modal" data-bs-target="#exampleModal">Bulk Add
                                            </button>
                                        </li>
                                    </ul>

                                    {/*CSV Modal*/}
                                    <div className="modal fade " id="exampleModal" tabIndex={-1}
                                         onClick={() => handleResetStates()}>
                                        <div className="modal-dialog modal-dialog-centered">
                                            <div className="modal-content border-0">
                                                <div className="p-3">
                                                    <div className="d-flex justify-content-between align-items-center">
                                                        <h1 className="card-heading fw-bold fs-18">Upload CSV</h1>
                                                        <button type="button"
                                                                className="btn-close reminder-modal-close-btn me-1 mt-n1"
                                                                data-bs-dismiss="modal" onClick={handleResetStates}
                                                                aria-label="Close"></button>
                                                    </div>
                                                    <div className="modal-body py-3 px-0">
                                                        <div className="d-grid">
                                                            <button
                                                                className={`${!uploading ? "btn csv-uploader-modal rounded-3 text-light fw-light detail-text pt-4 pb-3" : "uploader-background"}`}
                                                                onClick={handleInputType}>
                                                                {!uploading ?
                                                                    <>
                                                                        <div className="mb-2">
                                                                            <img src={blueUploaderIcon}/>
                                                                        </div>
                                                                        {selectedFile ? (
                                                                            <span>{selectedFile.name}</span>
                                                                        ) : (
                                                                            <span>Drag & Drop or <span
                                                                                className={`fw-bold ${!PrimaryColor ? "text-primary" : ""}`}
                                                                                style={{color: PrimaryColor ? PrimaryColor : ""}}>choose files</span> to upload</span>
                                                                        )}
                                                                    </>
                                                                    :
                                                                    (
                                                                        <div
                                                                            className="my-4">
                                                                            {isCompleted ?
                                                                                <div><img src={whiteTickIcon}/></div>
                                                                                :
                                                                                <div
                                                                                    className="spinner-border text-white"
                                                                                    role="status">
                                                                                    <span
                                                                                        className="visually-hidden">Loading...</span>
                                                                                </div>
                                                                            }
                                                                            <div className="loader-container mt-2">
                                                                                <div className="loader-bar"
                                                                                     style={{width: `${uploadProgress}%`}}></div>
                                                                                {uploading && (
                                                                                    <div
                                                                                        className="loader-text text-white">
                                                                                        {uploadProgress < 100 ? `${uploadProgress}%` : "Your file is uploaded!"}
                                                                                    </div>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    )
                                                                }
                                                            </button>
                                                            <input type='file' className='form-control d-none'
                                                                   onChange={handleFileChange}
                                                                   ref={fileInputRef}/>
                                                        </div>
                                                        <div
                                                            className="divider-csv-modal d-flex justify-content-center align-items-center my-3">
                                                            <span className="flex-grow-1"><hr/></span>
                                                            <span
                                                                className="content-small-text-color fw-light mx-2 mt-n1">or</span>
                                                            <span className="flex-grow-1"><hr/></span>
                                                        </div>
                                                        <div>
                                                            <h4 className="text-dark fw-bold detail-text">Import from
                                                                URL</h4>
                                                            <input className="border w-100 px-3 py-2 rounded-3"
                                                                   value={isImport}
                                                                   placeholder="Add file URL"
                                                                   onChange={(e) => handleImportUrl(e)}/>
                                                        </div>
                                                    </div>
                                                    <div className="d-flex justify-content-between pt-2">
                                                        <button type="button" data-bs-dismiss="modal"
                                                                onClick={handleResetStates}
                                                                className="btn add-button detail-text px-3 py-1">Cancel
                                                        </button>
                                                        <button type="button" onClick={(e) => handleUpload(e)}
                                                                className={`btn z-2 text-color-0a263f ${!ButtonColor ? "btn-primary" : ""}`}
                                                                style={{backgroundColor: ButtonColor ? ButtonColor : ""}}>Upload
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>

                    {/*table*/}
                    <div className="mt-3">
                        <div className="table-responsive">
                            <table className="table admin-table text-dark-grey m-0">
                                <thead>
                                <tr className="admin-table-heading-row">
                                    <th scope="col" className="fw-normal fs-17 pe-7 pe-md-3">Name</th>
                                    <th scope="col" className="fw-normal fs-17 pe-7 pe-md-3">Program(s)</th>
                                    <th scope="col" className="col-2 fw-normal fs-17 pe-7 pe-md-3">Status</th>
                                    <th scope="col" className="fw-normal fs-17 pe-7 pe-md-3">Last Interaction</th>
                                    <th scope="col" className="fw-normal fs-17">Action</th>
                                </tr>
                                </thead>
                                <tbody>
                                {allPatients && allPatients.map((patient) => (
                                    <tr key={patient.PatientID}
                                        className="admin-table-body-row fw-light fs-14 cursor-pointer"
                                        onClick={(e) => handleRowClick(e, patient)}>
                                        <td>{patient.FirstName + ' ' + patient.LastName}</td>
                                        <td>{patient.Program.map(p => p.label).join(', ')}</td>
                                        <td>Active</td>
                                        <td>
                                            {formatDate(patient.UpdatedAt)}
                                        </td>
                                        <td>
                                            <div className='d-flex align-items-center gap-0'>
                                                <button className="btn border-0 p-0">
                                                    <img src={messageLavenderIcon} alt="message lavender icon"/>
                                                </button>
                                                <button className="btn border-0"
                                                        onClick={(e) => handlePatientEdit(e, patient)}>
                                                    <img src={EditCyanIcon} alt="edit icon"/>
                                                </button>
                                                <button
                                                    onClick={(e) => showDeleteBox(e, patient)}
                                                    className="btn p-0 border-0">
                                                    <img src={DustbinRedIcon} alt="delete icon" width={32}/>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>

                <div className="d-flex justify-content-end align-items-center mt-4 gap-4">
                    <div className="text-dark-grey-2">Page 1/9</div>
                    <div className="d-flex align-items-center gap-2">
                        <button
                            className="admin-prev-page-btn border border-black-10 rounded-1 bg-transparent d-flex align-items-center">
                            <img src={LeftArrowGreyIcon}/>
                        </button>
                        <button
                            className="admin-prev-page-btn bg-grey border-0 rounded-1 bg-transparent d-flex align-items-center justify-content-center">
                            <img src={RightArrowGreyIcon}/>
                        </button>
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
                        <h5 className="mb-1 mt-2 fw-normal fs-18">Delete Patient?</h5>
                        <p className="mb-0 text-dark-grey fw-light fs-14">Are you sure you want to
                            delete this patient?</p>

                        <div className="d-flex align-items-center gap-2 mt-3">
                            <button
                                onClick={(e) => handlePatientDelete(e)}
                                className={`d-flex align-items-center ${!ButtonColor ? "bg-parrot-green" : ""} border-0 py-2 px-3 rounded-2 fs-14 fw-normal`}
                                style={{backgroundColor: ButtonColor ? ButtonColor : ""}}>
                                Yes, Delete
                            </button>
                            <button
                                onClick={() => setIsShowDeleteBox("d-none")}
                                className="d-flex align-items-center add-button py-2 px-3 rounded-2 fs-14 fw-normal">
                                Keep Patient
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </ProviderLayout>
    )
}

export default ProviderPatients;
