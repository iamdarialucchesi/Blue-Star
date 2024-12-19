import React, {useContext, useEffect, useState} from "react";
import ProviderLayout from "../../../../layouts/provider/ProviderLayout.jsx";
import {Link, useNavigate} from "react-router-dom";
import SearchIcon from "../../../../assets/images/icons/search.svg";
import DustbinRedWhitePicture from "../../../../assets/images/dustbin-red-white.png";
import DustbinRedIcon from "../../../../assets/images/icons/dustbin-red.svg";
import LeftArrowGreyIcon from "../../../../assets/images/icons/arrow-left-dark-grey.svg";
import RightArrowGreyIcon from "../../../../assets/images/icons/arrow-right-dark-grey.svg";
import FilterDarkBlue from "../../../../assets/images/icons/filter-dark-blue.svg"
import OrderByDarkBlue from "../../../../assets/images/icons/order-by-dark-blue.svg"
import MessagePurple from "../../../../assets/images/icons/message-purple.svg"
import ProviderProgramEnrollPatientModal from "./partials/ProviderProgramEnrollPatientModal.jsx";
import ProviderProgramFilterModal from "./partials/ProviderProgramFilterModal.jsx";
import {AuthContext} from "../../../../context/AuthContext.jsx";
import {useAdminDataStore} from "../../../../stores/AdminDataStore.js";
import ProgramService from "../../programs/service/ProgramService.js";
import EditCyanIcon from "../../../../assets/images/icons/edit-cyan.svg";
import PatientsFilter from "../../../../components/PatientsFilter.jsx";
import ProviderProgramService from "./service/ProviderProgramService.js";
import {useProviderDataStore} from "../../../../stores/ProviderDataStore.js";
import Spinner from "../../../../components/Spinner.jsx";

const ProviderProgram = () => {
    const navigate = useNavigate();
    const {authToken} = useContext(AuthContext);
    const { providerOrganizationID, providerWhiteLabels } = useProviderDataStore();
    const { loginUser } = useAdminDataStore();
    const [deletedProgram, setDeletedProgram] = useState({}) // d-flex
    const [isShowDeleteBox, setIsShowDeleteBox] = useState("d-none") // d-flex
    const [isShowOrderByBox, setIsShowOrderByBox] = useState("d-none") // d-block
    const [isEnrollResponse, setIsEnrollResponse] = useState(false) // true
    const [isShowFilterModal, setIsShowFilterModal] = useState(false)
    const [allPatients, setAllPatients] = useState([]);
    const [allProviders, setAllProviders] = useState([]);
    const [allPracticesNames, setAllPracticesNames] = useState([]);
    const [selectedPracticesInFilter, setSelectedPracticesInFilter] = useState([]);
    const [allPrograms, setAllPrograms] = useState([]);
    const [duplicateAllPrograms, setDuplicateAllPrograms] = useState([]);
    const [allSchedules, setAllSchedules] = useState([]);
    const [searchInput, setSearchInput] = useState('');
    const [order, setOrder] = useState('desc');
    const [isLoading, setIsLoading] = useState(false);
    const {ButtonColor} = providerWhiteLabels;

    // const handleProgramDelete = (e) => {
    //     setIsShowDeleteBox("d-flex")
    //     e.stopPropagation();
    // }

    useEffect(() => {
        fetchAllPrograms();
    }, [order]);

    const fetchAllPrograms = async () => {
        setIsLoading(true);
        const result = await ProviderProgramService.fetchProviderPrograms(authToken,providerOrganizationID,order);
        setIsLoading(false);
        if (result.programs || result.patients || result.practices) {
            setAllPrograms(result.programs);
            setDuplicateAllPrograms(result.programs);
            setAllPatients(result.patients);
            setAllPracticesNames(result.practices);
            setAllProviders(result.providers);
        }
        if (result && result.schedules){
            setAllSchedules(result.schedules);
        }
    }

    const handleEnrollPatient = async (formValues) => {
        try {
            setIsLoading(true);
            const result = await ProviderProgramService.enrollPatientInProgram(authToken, formValues,loginUser);
            if (result.status === 200) {
                console.log("result");
                console.log(result);
            }
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
            console.error('Update failed:', error);
        }
    }
    const handleFilterPrograms = async (formValues) => {
        try {
            await setSelectedPracticesInFilter(formValues.selectedPractices);
            setIsLoading(true);
            const result = await ProgramService.filterPrograms(authToken, formValues);
            setIsLoading(false);
            if (result.status === 200) {
                const data = result.data;
                if (data.programs || data.patients || data.practices) {
                    setAllPrograms(data.programs);
                    setDuplicateAllPrograms(data.programs);
                    setAllPatients(data.patients);
                    setAllPracticesNames(data.practices);
                    setAllProviders(data.providers);
                }
                if (data && data.schedules){
                    setAllSchedules(data.schedules);
                }
            }
        } catch (error) {
            setIsLoading(false);
            console.error('Update failed:', error);
        }
    }

    useEffect(() => {
        if (searchInput) {
            const filteredPrograms = allPrograms.filter(
                (program) =>
                    program.ProgramName.toLowerCase().includes(searchInput.toLowerCase()) ||
                    program.Description.toLowerCase().includes(searchInput.toLowerCase()) ||
                    program.ProgramNumber.toLowerCase().includes(searchInput.toLowerCase())
            );
            setAllPrograms(filteredPrograms);
        } else {
            setAllPrograms(duplicateAllPrograms);
        }
    }, [searchInput]);

    const handleProgramEdit = (e, program) => {
        e.stopPropagation();
        navigate('/programs/edit-program', { state: { program } });
    }
    const showDeleteBox = async (e,program) => {
        e.stopPropagation();
        await setDeletedProgram(program)
        setIsShowDeleteBox("d-flex")
    }
    const handleProgramDelete = async (e) => {
        e.stopPropagation();
        const result = await ProviderProgramService.deleteProviderProgram(authToken,deletedProgram.ProgramID,loginUser);
        if (result.status === 200) {
            setIsShowDeleteBox("d-none")
            if (result.status === 200) {
                setAllPrograms(prevPrograms =>
                    prevPrograms.filter(p => p.ProgramID !== deletedProgram.ProgramID)
                );
            }
        }
    }
    const handleRowClick = (e,program) => {
        // Prevent navigation when clicking on Link or button
        if (e.target.closest('a') || e.target.closest('button')) {
            return;
        }
        navigate('/provider/programs/program-detail', { state: { program,providerOrganizationID  } });
    };

    const handleOrderChange = (newOrder) => {
        setOrder(newOrder);
        setIsShowOrderByBox("d-none");
    };

    if (isLoading) {
        return <Spinner />
    }

    return (
        <ProviderLayout headerTitle="Programs List" isDashboard={false}>
            <div>
                <section className="border border-light-grey rounded-4 px-3 pt-4 pb-0">
                    <div
                        className="admin-program-table-top d-flex flex-md-row flex-column align-items-center justify-content-md-between">
                        <h5 className="mb-md-0 mb-3 fw-bolder fs-19">{allPrograms && allPrograms.length} Programs Total</h5>

                        <div className="d-flex align-items-stretch gap-2 position-relative">
                            <div
                                className="admin-program-table-searchbar d-flex align-items-center rounded-2 bg-white border border-black-10 px-3 py-1 gap-1">
                                <label htmlFor="header-searchbar-input" className="d-flex align-items-center">
                                    <img src={SearchIcon}/>
                                </label>
                                <input
                                    className="border-0 bg-transparent input-focus-none flex-grow-1 flex-shrink-1 fs-14"
                                    placeholder="Search"
                                    id="header-searchbar-input"
                                    value={searchInput}
                                    onChange={(e) => setSearchInput(e.target.value)}
                                />
                            </div>
                            <button
                                onClick={() => setIsShowFilterModal(true)}
                                aria-expanded="false"
                                className="admin-program-filter-btn bg-white border border-grey rounded-3 d-flex align-items-center justify-content-center">
                                <img src={FilterDarkBlue}/>
                            </button>
                            <button
                                onClick={() => setIsShowOrderByBox("d-block")}
                                className="admin-program-filter-btn bg-transparent border border-grey rounded-3 d-flex align-items-center justify-content-center">
                                <img src={OrderByDarkBlue}/>
                            </button>
                            <button
                                type="button" data-bs-toggle="modal"
                                data-bs-target="#provider-program-enroll-patient-modal"
                                className="d-flex align-items-center gap-2 btn border-0 py-2 px-3 rounded-2 text-decoration-none"
                                style={{backgroundColor: ButtonColor ? ButtonColor : "btn-primary"}}>
                                <span className="d-md-inline-block d-none fs-14 text-dark-blue">Enroll Patient</span>
                            </button>

                            <ProviderProgramEnrollPatientModal allSchedules={allSchedules} programNames={allPrograms} patientNames={allPatients}
                                                               handleEnrollPatient={handleEnrollPatient}
                            />

                            {/* FILTER MODAL POPUP*/}
                            {
                                (isShowFilterModal) ? (<>
                                    <ProviderProgramFilterModal isShowFilterModal={isShowFilterModal}
                                                                setIsShowFilterModal={setIsShowFilterModal}
                                                                practicesNames={allPracticesNames}
                                                                selectedPracticesNames={selectedPracticesInFilter}
                                                                organizationID={providerOrganizationID}
                                                                handleFilterPrograms={handleFilterPrograms}
                                    />
                                </>) : ""
                            }
                            {/*ORDER BY POPUP*/}
                            <div onClick={() => setIsShowOrderByBox("d-none")}
                                 className={`admin-program-table-delete-confirm ${isShowOrderByBox} bg-black-10`}></div>
                            <ul className={`admin-program-order-by-popup ${isShowOrderByBox} list-unstyled mb-0 border border-light-grey rounded-3 overflow-hidden position-absolute end-0`}>
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
                    </div>

                    <div className="mt-3">
                        <div className="table-responsive">
                            {/*DELETE POPUP*/}
                            <div
                                onClick={() => setIsShowDeleteBox("d-none")}
                                className={`admin-program-table-delete-confirm bg-black-10 ${isShowDeleteBox} d-flex align-items-center justify-content-center`}>
                                <div
                                    onClick={(e) => e.stopPropagation()}
                                    className="admin-program-table-delete-confirm-box mx-3 py-4 bg-white border border-black-20 rounded-2 d-flex flex-column align-items-center justify-content-center text-center">
                                    <img src={DustbinRedWhitePicture}/>
                                    <h5 className="mb-1 mt-2 fw-normal fs-18">Delete Program?</h5>
                                    <p className="mb-0 text-dark-grey fw-light fs-14">Are you sure you want to
                                        delete this program?</p>

                                    <div className="d-flex align-items-center gap-2 mt-3">
                                        <button
                                            onClick={(e) => handleProgramDelete(e)}
                                            className={`d-flex align-items-center border-0 py-2 px-3 rounded-2 fs-14 fw-normal ${!ButtonColor ? "bg-primary" : ""}`}
                                            style={{backgroundColor: ButtonColor ? ButtonColor : ""}}>
                                            Yes, Delete
                                        </button>
                                        <button
                                            onClick={() => setIsShowDeleteBox("d-none")}
                                            className="d-flex align-items-center add-button py-2 px-3 rounded-2 fs-14 fw-normal">
                                            Keep Program
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <table className="table provider-program-table text-dark-grey">
                                <thead>
                                <tr className="provider-program-table-heading-row">
                                    <th scope="col" className="fw-normal fs-17">Program Name</th>
                                    <th scope="col" className="fw-normal fs-17">All Patients</th>
                                    <th scope="col" className="fw-normal fs-17">Active Patients</th>
                                    <th scope="col" className="fw-normal fs-17">Number</th>
                                    <th scope="col" className="fw-normal fs-17">Actions</th>
                                </tr>
                                </thead>
                                <tbody>

                                {allPrograms && allPrograms.map((program) => (
                                    <tr key={program.ProgramID}
                                        className="provider-program-table-body-row fw-light fs-14" onClick={(e) => handleRowClick(e,program)}>
                                        <td>{program.ProgramName}</td>
                                        <td>{program.PatientCount}</td>
                                        <td>{program.PatientCount}</td>
                                        <td>{program.ProgramNumber}</td>
                                        <td>
                                            <div className="d-flex gap-2">
                                                <Link onClick={(e) => e.stopPropagation()}
                                                      className="provider-program-table-message-btn border border-purple-50 rounded-3 d-flex align-items-center justify-content-center">
                                                    <img src={MessagePurple}/>
                                                </Link>
                                                <button
                                                    onClick={(e) => showDeleteBox(e,program)}
                                                    className="provider-program-table-delete-btn border border-red-50 rounded-3 d-flex align-items-center justify-content-center">
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
                    <div className="text-dark-grey-2">Page 1/9</div>
                    <div className="d-flex align-items-center gap-2">
                        <button
                            className="admin-program-prev-page-btn border border-black-10 rounded-1 bg-transparent d-flex align-items-center">
                            <img src={LeftArrowGreyIcon}/>
                        </button>
                        <button
                            className="admin-program-prev-page-btn bg-grey border-0 rounded-1 bg-transparent d-flex align-items-center justify-content-center">
                            <img src={RightArrowGreyIcon}/>
                        </button>
                    </div>
                </div>
            </div>
        </ProviderLayout>
    )
}

export default ProviderProgram
