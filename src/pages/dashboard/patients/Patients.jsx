import React, {useContext, useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";

import AdminLayout from "../../../layouts/dashboard/AdminLayout.jsx";
import PatientsFilter from "../../../components/PatientsFilter.jsx";

import PlusBlackIcon from "../../../assets/images/icons/black-plus.svg";
import SearchIcon from "../../../assets/images/icons/search.svg";
import DustbinRedWhitePicture from "../../../assets/images/dustbin-red-white.png";
import EditCyanIcon from "../../../assets/images/icons/edit-cyan.svg";
import DustbinRedIcon from "../../../assets/images/icons/dustbin-red.svg";
import LeftArrowGreyIcon from "../../../assets/images/icons/arrow-left-dark-grey.svg";
import RightArrowGreyIcon from "../../../assets/images/icons/arrow-right-dark-grey.svg";
import filterIcon from "../../../assets/icons/filter-icon.svg";
import orderIcon from "../../../assets/icons/order-icon.svg";
import PatientsService from "./service/PatientsService.js";
import {AuthContext} from "../../../context/AuthContext.jsx";
import {usePatientsDataStore} from "../../../stores/PatientsDataStore.js";
import {useAdminDataStore} from "../../../stores/AdminDataStore.js";
import Spinner from "../../../components/Spinner.jsx";

function Patients() {
    const {authToken} = useContext(AuthContext);
    const { setProgramNames, programNames ,setOrganizationsData} = usePatientsDataStore();
    const { loginUser } = useAdminDataStore();
    const [allPatients, setAllPatients] = useState([]);
    const [duplicateAllPatients, setDuplicateAllPatients] = useState([]);
    const [deletedPatient, setDeletedPatient] = useState(null);
    const [isShowDeleteBox, setIsShowDeleteBox] = useState("d-none") // d-flex
    const [isShowOrderByBox, setIsShowOrderByBox] = useState("d-none") // d-block
    const [isShowFilterModal, setIsShowFilterModal] = useState(false) // true
    const navigate = useNavigate();
    const [searchInput, setSearchInput] = useState('');
    const [order, setOrder] = useState('desc');
    const [isLoading, setIsLoading] = useState(false);

    //for Filter
    const [selectedProgramNames, setSelectedProgramNames] = useState([]);
    const [filterSelectedGender, setFilterSelectedGender] = useState('');
    const [organizationID, setOrganizationID] = useState(null);

    //for pagination
    const [totalPages, setTotalPages ] = useState(1);
    const [limit, setLimit] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [paginationHistory, setPaginationHistory] = useState([]);
    const [lastEvaluatedKey, setLastEvaluatedKey] = useState(null);
    const [isNextPageAvailable, setIsNextPageAvailable] = useState(true);
    const [isPreviousPage, setIsPreviousPage] = useState(false);





    useEffect(() => {
        fetchAllPatients(lastEvaluatedKey);
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

    const fetchAllPatients = async (evaluatedKey) => {
        try {
            // Start loading
            setIsLoading(true);

            // Fetch patients data
            const result = await PatientsService.fetchPatients(authToken, order, limit, evaluatedKey, navigate);

            // Stop loading
            setIsLoading(false);

            if (result && result.patients) {
                // Set patients and programs/organizations data
                setAllPatients(result.patients);
                setDuplicateAllPatients(result.patients);

                if (result.totalPatients) {
                    const patients = result.totalPatients;
                    const totalPages = Math.ceil(patients / limit);
                    setTotalPages(totalPages);
                }

                if (result.programs?.length) {
                    await setProgramNames(result.programs);
                }

                if (result.organizations?.length) {
                    await setOrganizationsData(result.organizations);
                }
                if (result.latest_record && result.latest_record.PatientID){
                    const patient = result.latest_record
                    const newHistory = {
                        PatientID: null
                    };
                    const patientIdExists = paginationHistory.some(
                        item => item.PatientID === newHistory.PatientID // Ensure proper comparison
                    );
                    if (!patientIdExists && !isPreviousPage) {
                        setPaginationHistory(prev => [newHistory, ...prev]);
                    }
                }

                // Handle pagination if LastEvaluatedKey is present
                if (result.LastEvaluatedKey) {
                    const { PatientID: newPatientID } = result.LastEvaluatedKey;

                    const patientIdExists = paginationHistory.some(
                        item => item.PatientID === newPatientID
                    );

                    if (!patientIdExists && !isPreviousPage) {
                        setPaginationHistory(prev => [...prev, result.LastEvaluatedKey]);
                    }

                    setLastEvaluatedKey(result.LastEvaluatedKey);
                    await setIsNextPageAvailable(true);

                    await setPaginationHistory(prevHistory =>
                        [...new Map(prevHistory.map(item => [item.PatientID, item])).values()]
                    );

                } else {
                    await setPaginationHistory(prev => prev.slice(0, -1));
                    await setIsNextPageAvailable(false);
                }
            }
        } catch (error) {
            console.error('Error fetching patients:', error);
            setIsLoading(false); // Stop loading in case of error
        }
    };


    const handleRowClick = (e,patient) => {
        if (e.target.closest('a') || e.target.closest('button')) {
            return;
        }
        navigate('/patients/patient-detail', { state: { patient } });
    };
    const handlePatientEdit = (e,patient) => {
        e.stopPropagation();
        navigate('/patients/edit-patient', { state: { patient } });
    };

    const showDeleteBox = async (e,patient) => {
        e.stopPropagation();
        await setDeletedPatient(patient)
        setIsShowDeleteBox("d-flex")
    }

    const handleProgramDelete = async (e) => {
        e.stopPropagation();
        setIsLoading(true);
        const result = await PatientsService.deletePatients(authToken,deletedPatient.PatientID,loginUser);
        if (result.status === 200) {
            setIsShowDeleteBox("d-none")
            if (result.status === 200) {
                setAllPatients(prevPatients =>
                    prevPatients.filter(p => p.PatientID !== deletedPatient.PatientID)
                );
            }
        }
        setIsLoading(false);
    }

    const handleFilterPatients = async (formValues) => {
        try {
            setIsLoading(true);
            await setSelectedProgramNames(formValues.selectedPrograms);
            await setFilterSelectedGender(formValues.selectedGender);
            const result = await PatientsService.filterPatients(authToken, formValues);
            if (result.status === 200) {
                const data = result.data;
                const patientsData = data.patients;
                if (patientsData) {
                    setAllPatients(patientsData);
                    setDuplicateAllPatients(patientsData);
                }
            }
            setIsLoading(false);
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

    const handleOrderChange = (newOrder) => {
        setOrder(newOrder);
        setIsShowOrderByBox("d-none");
    };

    const handleNextPage = async () => {
        await setIsPreviousPage(false);
        if (isNextPageAvailable) {
            await setCurrentPage(prevPage => prevPage + 1);
            await fetchAllPatients(lastEvaluatedKey);
        }
    };

    const handlePreviousPage = async () => {
        if (paginationHistory.length > 0) {
            await setIsPreviousPage(true);
            const previousKey = paginationHistory[paginationHistory.length - 1];
            await setLastEvaluatedKey(previousKey);
            await setPaginationHistory(prev => prev.slice(0, -1));
            await setCurrentPage(prevPage => prevPage - 1);
            await fetchAllPatients(previousKey);
        }
    };



    if (isLoading) {
        return <Spinner />
    }



    return (
        <AdminLayout headerTitle={"Patients"} isDashboard={false}>
            <div>
                <section className="border border-light-grey rounded-4 px-3 pt-4 pb-0">
                    <div
                        className="admin-table-top d-flex flex-md-row flex-column align-items-center justify-content-md-between">
                        <h5 className="mb-md-0 mb-3 fw-bolder fs-19">{allPatients && allPatients.length} Patients Total</h5>

                        <div className="table-top-side-btn d-flex align-items-center flex-wrap gap-2">
                            <div
                                className="admin-table-searchbar d-flex align-items-center rounded-2 bg-white border border-black-10 py-2 px-3 gap-2">
                                <label htmlFor="patient-searchbar-input" className="d-flex align-items-center">
                                    <img src={SearchIcon}/>
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
                                        <img src={filterIcon}/>
                                    </button>
                                    {
                                        (isShowFilterModal) ? (<>
                                            <PatientsFilter setIsShowFilterModal={setIsShowFilterModal}
                                                            isShowFilterModal={isShowFilterModal}
                                                            programNames={programNames}
                                                            organizationID={organizationID}
                                                            selectedProgramNames={selectedProgramNames}
                                                            filterSelectedGender={filterSelectedGender}
                                                            handleFilterPatients={handleFilterPatients}/>
                                        </>) : ""
                                    }
                                </div>

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

                                <div className=''>
                                    <Link to="/patients/add-patient"
                                          className="btn btn-primary py-2 d-flex gap-2 align-items-center justify-content-center justify-content-md-start ">Add
                                        Patient
                                        <img src={PlusBlackIcon}/>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>

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
                                    <tr key={patient.PatientID} className="admin-table-body-row fw-light fs-14"
                                        onClick={(e) => handleRowClick(e,patient)}
                                    >
                                        <td>{patient.FirstName + ' ' + patient.LastName}</td>
                                        <td>{patient.Program.map(p => p.label).join(', ')}</td>
                                        <td>Active</td>
                                        <td>
                                            {formatDate(patient.UpdatedAt)}
                                        </td>
                                        <td>
                                            <div className='d-flex gap-2'>
                                                <button onClick={(e) => handlePatientEdit(e, patient)}
                                                        className="admin-table-edit-btn border border-cyan-50 rounded-3 d-flex align-items-center justify-content-center">
                                                    <img src={EditCyanIcon}/>
                                                </button>
                                                <button
                                                    onClick={(e) => showDeleteBox(e,patient)}
                                                    className="admin-table-delete-btn border border-red-50 rounded-3 d-flex align-items-center justify-content-center">
                                                    <img src={DustbinRedIcon}/>
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
                    <div className="text-dark-grey-2">
                        Page {currentPage}/{totalPages || 1}
                    </div>
                    <div className="d-flex align-items-center gap-2">
                        <button
                            className={`admin-prev-page-btn border border-black-10 rounded-1 bg-transparent d-flex align-items-center ${currentPage === 1 ? 'disabled' : ''}`}
                            onClick={handlePreviousPage}
                            disabled={paginationHistory.length === 0}
                        >
                            <img src={LeftArrowGreyIcon}/>
                        </button>
                        <button
                            className={`admin-prev-page-btn bg-grey border-0 rounded-1 bg-transparent d-flex align-items-center justify-content-center ${!isNextPageAvailable ? 'disabled' : ''}`}
                            onClick={handleNextPage}
                            disabled={!isNextPageAvailable}
                        >
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
                                onClick={(e) => handleProgramDelete(e)}
                                className="d-flex align-items-center bg-parrot-green border-0 py-2 px-3 rounded-2 fs-14 fw-normal">
                                Yes, Delete
                            </button>
                            <button
                                onClick={() => setIsShowDeleteBox("d-none")}
                                className="d-flex align-items-center bg-transparent border border-dark-blue text-dark-blue py-2 px-3 rounded-2 fs-14 fw-normal">
                                Keep Patient
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    )
}

export default Patients;
