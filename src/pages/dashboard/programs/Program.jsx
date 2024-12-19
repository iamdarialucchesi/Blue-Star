import React, {useContext, useEffect, useState} from "react"
import AdminLayout from "../../../layouts/dashboard/AdminLayout.jsx";
import PlusBlackIcon from "../../../assets/images/icons/black-plus.svg"
import SearchIcon from "../../../assets/images/icons/search.svg";
import OrderByGreyIcon from "../../../assets/images/icons/order-by-grey.svg";
import EditCyanIcon from "../../../assets/images/icons/edit-cyan.svg"
import DustbinRedIcon from "../../../assets/images/icons/dustbin-red.svg"
import LeftArrowGreyIcon from "../../../assets/images/icons/arrow-left-dark-grey.svg"
import RightArrowGreyIcon from "../../../assets/images/icons/arrow-right-dark-grey.svg"
import DustbinRedWhitePicture from "../../../assets/images/dustbin-red-white.png"
import {Link, useNavigate} from "react-router-dom";
import ProgramService from "./service/ProgramService.js";
import {AuthContext} from "../../../context/AuthContext.jsx";
import {useAdminDataStore} from "../../../stores/AdminDataStore.js";
import {useProgramsDataStore} from "../../../stores/ProgramsDataStore.js";
import Spinner from "../../../components/Spinner.jsx";
import ProviderProgramEnrollPatientModal from "../provider/programs/partials/ProviderProgramEnrollPatientModal.jsx";

const Program = () => {
    const navigate = useNavigate();
    const {authToken} = useContext(AuthContext);
    const { loginUser } = useAdminDataStore();
    const { setSNSPhoneNumbers } = useProgramsDataStore();
    const [deletedProgram, setDeletedProgram] = useState({}) // d-flex
    const [isShowDeleteBox, setIsShowDeleteBox] = useState("d-none") // d-flex
    const [isShowOrderByBox, setIsShowOrderByBox] = useState("d-none") // d-block
    const [allPrograms, setAllPrograms] = useState([]);
    const [allPatients, setAllPatients] = useState([]);
    const [allSchedules, setAllSchedules] = useState([]);
    const [duplicateAllPrograms, setDuplicateAllPrograms] = useState([]);
    const [searchInput, setSearchInput] = useState('');
    const [order, setOrder] = useState('desc');
    const [isLoading, setIsLoading] = useState(false);


    useEffect(() => {
        fetchAllPrograms();
    }, [order]);

    const fetchAllPrograms = async () => {
        setIsLoading(true);
        const result = await ProgramService.fetchPrograms(authToken,order,navigate);
        setIsLoading(false);
        if (result && result.programs) {
            setAllPatients(result.patients);
            setAllPrograms(result.programs);
            setDuplicateAllPrograms(result.programs);
        }
        if (result && result.schedules){
            setAllSchedules(result.schedules);
        }

        // For SNS SourceNumber Implementation
        // if (result && result.phoneNumbers){
        //     if (result.phoneNumbers.length > 0){
        //         setSNSPhoneNumbers(result.phoneNumbers);
        //     }
        //     else {
        //         setSNSPhoneNumbers([]);
        //     }
        // }
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
        setIsLoading(true);
        const result = await ProgramService.deleteProgram(authToken,deletedProgram.ProgramID,loginUser);
        if (result.status === 200) {
            setIsShowDeleteBox("d-none")
            if (result.status === 200) {
                setAllPrograms(prevPrograms =>
                    prevPrograms.filter(p => p.ProgramID !== deletedProgram.ProgramID)
                );
            }
        }
        setIsLoading(false);
    }
    const handleRowClick = (e,program) => {
        // Prevent navigation when clicking on Link or button
        if (e.target.closest('a') || e.target.closest('button')) {
            return;
        }
        navigate('/programs/program-detail', { state: { program ,allPatients} });
    };

    const handleOrderChange = (newOrder) => {
        setOrder(newOrder);
        setIsShowOrderByBox("d-none");
    };

    const handleEnrollPatient = async (formValues) => {
        try {
            setIsLoading(true);
            const result = await ProgramService.enrollPatientInProgram(authToken, formValues,loginUser);
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


    if (isLoading) {
        return <Spinner />
    }


    return (<AdminLayout headerTitle={"Programs"} isDashboard={false}>
            <div>
                <section className="border border-light-grey rounded-4 px-3 pt-4 pb-0">
                    <div
                        className="admin-program-table-top d-flex flex-md-row flex-column align-items-center justify-content-md-between">
                        <h5 className="mb-md-0 mb-3 fw-bolder fs-19">{allPrograms.length} Programs Total</h5>

                        <div className="d-flex align-items-stretch gap-2 position-relative">
                            <Link to="/programs/create-program"
                                  className="d-flex align-items-center gap-2 bg-parrot-green border-0 py-2 px-3 rounded-2 text-decoration-none">
                                <span className="d-md-inline-block d-none fs-14 text-dark-blue">Create</span>
                                <img width={10} height={10} src={PlusBlackIcon}/>
                            </Link>
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
                                onClick={() => setIsShowOrderByBox("d-block")}
                                className="admin-program-filter-btn bg-transparent border border-grey rounded-3 d-flex align-items-center justify-content-center">
                                <img src={OrderByGreyIcon}/>
                            </button>
                            <button
                                type="button" data-bs-toggle="modal"
                                data-bs-target="#provider-program-enroll-patient-modal"
                                className="d-flex align-items-center gap-2 bg-parrot-green border-0 py-2 px-3 rounded-2 text-decoration-none">
                                <span className="d-md-inline-block d-none fs-14 text-dark-blue">Enroll Patient</span>
                            </button>

                            <ProviderProgramEnrollPatientModal allSchedules={allSchedules} programNames={allPrograms} patientNames={allPatients}
                                                               handleEnrollPatient={handleEnrollPatient}
                            />

                            {/*ORDER BY POPUP*/}
                            <div onClick={() => setIsShowOrderByBox("d-none")}
                                 className={`admin-program-table-delete-confirm ${isShowOrderByBox} bg-black-10`}></div>
                            <ul className={`admin-program-order-by-popup ${isShowOrderByBox} list-unstyled mb-0 border border-light-grey rounded-3 overflow-hidden position-absolute end-0`}>
                                <li role="button"
                                    className="px-3 py-2 text-dark-grey bg-white border-bottom"
                                    onClick={() => handleOrderChange('desc')}
                                >
                                    Newest First
                                </li>

                                <li role="button"
                                    className="px-3 py-2 text-dark-grey bg-white"
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
                                            className="d-flex align-items-center bg-parrot-green border-0 py-2 px-3 rounded-2 fs-14 fw-normal">
                                            Yes, Delete
                                        </button>
                                        <button
                                            onClick={() => setIsShowDeleteBox("d-none")}
                                            className="d-flex align-items-center bg-transparent border border-dark-blue text-dark-blue py-2 px-3 rounded-2 fs-14 fw-normal">
                                            Keep Program
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <table className="table admin-program-table text-dark-grey">
                                <thead>
                                <tr className="admin-program-table-heading-row">
                                    <th scope="col" className="fw-normal fs-17">Program Name</th>
                                    <th scope="col" className="fw-normal fs-17">Description</th>
                                    <th scope="col" className="fw-normal fs-17">Patients</th>
                                    <th scope="col" className="fw-normal fs-17">Number</th>
                                    <th scope="col" className="fw-normal fs-17">Actions</th>
                                </tr>
                                </thead>
                                <tbody>
                                {allPrograms && allPrograms.map((program) => (
                                    <tr key={program.ProgramID}
                                        className="admin-program-table-body-row fw-light fs-14" onClick={(e) => handleRowClick(e,program)}>
                                        <td>{program.ProgramName}</td>
                                        <td>{program.Description}</td>
                                        <td>{program.PatientCount}</td>
                                        <td>{program.ProgramNumber}</td>
                                        <td>
                                            <div className="d-flex gap-2">
                                                <button onClick={(e) => handleProgramEdit(e, program)}
                                                      className="admin-program-table-edit-btn border border-cyan-50 rounded-3 d-flex align-items-center justify-content-center">
                                                    <img src={EditCyanIcon}/>
                                                </button>
                                                <button
                                                    onClick={(e) => showDeleteBox(e,program)}
                                                    className="admin-program-table-delete-btn border border-red-50 rounded-3 d-flex align-items-center justify-content-center">
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
        </AdminLayout>)
}

export default Program
