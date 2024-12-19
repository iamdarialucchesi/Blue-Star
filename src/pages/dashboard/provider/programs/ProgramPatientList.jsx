import ProviderLayout from "../../../../layouts/provider/ProviderLayout.jsx";
import React, {useContext, useEffect, useState} from "react";
import {Link, useLocation} from "react-router-dom";
import PlusBlackIcon from "../../../../assets/images/icons/black-plus.svg";
import ArrowRightParrotGreenIcon from "../../../../assets/images/icons/arrow-right-parrot-green.svg";
import MessageLavenderBlueIcon from "../../../../assets/images/icons/message-lavender-blue.svg";
import EditCyanIcon from "../../../../assets/images/icons/edit-cyan.svg";
import SearchIcon from "../../../../assets/images/icons/search.svg";
import FilterDarkBlue from "../../../../assets/images/icons/filter-dark-blue.svg";
import OrderByDarkBlue from "../../../../assets/images/icons/order-by-dark-blue.svg";
import ProviderProgramFilterModal from "./partials/ProviderProgramFilterModal.jsx";
import ProviderPatientsFilter from "./partials/ProviderPatientsFilter.jsx";
import LeftArrowGreyIcon from "../../../../assets/images/icons/arrow-left-dark-grey.svg";
import RightArrowGreyIcon from "../../../../assets/images/icons/arrow-right-dark-grey.svg";
import ProviderProgramService from "./service/ProviderProgramService.js";
import {AuthContext} from "../../../../context/AuthContext.jsx";
import {useProviderDataStore} from "../../../../stores/ProviderDataStore.js";

const ProviderProgramPatientList = () => {
    const {authToken} = useContext(AuthContext);
    const { providerOrganizationID } = useProviderDataStore();
    const location = useLocation();
    const [allPatients, setAllPatients] = useState([]);
    const [duplicateAllPatients, setDuplicateAllPatients] = useState([])
    const [searchInput, setSearchInput] = useState('');
    const [isShowOrderByBox, setIsShowOrderByBox] = useState("d-none") // d-block
    const [isShowFilterModal, setIsShowFilterModal] = useState(false) // true


    useEffect(() => {
        if (location.state && location.state.program) {
            const program = location.state.program;
            fetchProgramDetail(program);
        }
    }, [location.state]);

    const fetchProgramDetail = async (program) => {
        const result = await ProviderProgramService.fetchProgramDetail(authToken,program.ProgramName,providerOrganizationID);
        if (result.patients) {
            setAllPatients(result.patients);
            setDuplicateAllPatients(result.patients);
        }
    }

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

    const ProgramDetailProgressBar = ({progressPercentage}) => {
        return <div className="admin-program-table-progress-bar rounded-pill overflow-hidden">
            <div style={{width: progressPercentage+"%"}}
                 className={`${(progressPercentage >= 70) ? "progress-above-70" : (progressPercentage >= 33) ? "progress-below-70" : "progress-below-33"} h-100 rounded-pill`}></div>
        </div>
    }

    return (<ProviderLayout headerTitle={"Patients List"} isDashboard={true}>
            <div>
                <section
                    className="provider-patients-list overflow-hidden border border-light-grey rounded-3 px-3 pt-4 pb-0">
                    <div
                        className="admin-program-table-top d-flex flex-md-row flex-column align-items-center justify-content-md-between">
                        <h5 className="mb-md-0 mb-3 fw-bolder fs-19">Total Patients</h5>

                        <div className="d-flex align-items-stretch gap-2 position-relative">
                            <div
                                className="admin-program-table-searchbar d-flex align-items-center rounded-2 bg-white border border-black-10 px-3 py-1 gap-1">
                                <input
                                    className="border-0 bg-transparent input-focus-none flex-grow-1 flex-shrink-1 fs-14"
                                    placeholder="Search Patient"
                                    id="header-searchbar-input"
                                    value={searchInput}
                                    onChange={(e) => setSearchInput(e.target.value)}
                                />
                                <label htmlFor="header-searchbar-input" className="d-flex align-items-center">
                                    <img src={SearchIcon}/>
                                </label>
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
                            <Link
                                className="d-flex align-items-center gap-2 bg-parrot-green border-0 py-2 px-3 rounded-2 text-decoration-none">
                                <span className="d-md-inline-block d-none fs-14 text-dark-blue">Add Patient</span>
                                <img width={10} height={10} src={PlusBlackIcon}/>
                            </Link>

                            {/* FILTER MODAL POPUP*/}
                            {
                                (isShowFilterModal) &&
                                <ProviderPatientsFilter setIsShowFilterModal={setIsShowFilterModal}
                                                        isShowFilterModal={isShowFilterModal}/>}
                            {/*ORDER BY POPUP*/}
                            <div onClick={() => setIsShowOrderByBox("d-none")}
                                 className={`admin-program-table-delete-confirm ${isShowOrderByBox} bg-black-10`}></div>
                            <ul className={`admin-program-order-by-popup ${isShowOrderByBox} list-unstyled mb-0 border border-light-grey rounded-3 overflow-hidden position-absolute end-0`}>
                                <li role="button" className="px-3 py-2 text-dark-grey bg-white border-bottom"
                                    onClick={() => setIsShowOrderByBox("d-none")}
                                >
                                    Newest First
                                </li>

                                <li role="button" className="px-3 py-2 text-dark-grey bg-white"
                                    onClick={() => setIsShowOrderByBox("d-none")}
                                >
                                    Oldest First
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="mt-2">
                        <div className="table-responsive">
                            <table className="table admin-program-detail-table">
                                <thead>
                                <tr className="admin-program-detail-table-heading-row">
                                    <th scope="col" className="fw-normal py-3">Patient Name</th>
                                    <th scope="col" className="fw-normal py-3">Patient Status</th>
                                    <th scope="col" className="fw-normal py-3">Status</th>
                                    <th scope="col" className="fw-normal py-3">Last Interaction</th>
                                    <th scope="col" className="fw-normal py-3">Actions</th>
                                </tr>
                                </thead>
                                <tbody>
                                {allPatients && allPatients.map((patient) => (
                                    <tr key={patient.PatientID} className="admin-program-detail-table-body-row fw-light fs-14">
                                        <td className="py-3">{patient.FirstName + ' ' + patient.LastName}</td>
                                        <td className="py-3">
                                            <ProgramDetailProgressBar progressPercentage={88}/>
                                        </td>
                                        <td className="py-3">no</td>
                                        <td className="py-3"> {formatDate(patient.UpdatedAt)}</td>
                                        <td className="py-3">
                                            <div className="d-flex gap-2">
                                                <button
                                                    className="admin-program-detail-table-edit-btn border border-cyan-50 bg-cyan-10 rounded-3 d-flex align-items-center justify-content-center">
                                                    <img src={EditCyanIcon}/>
                                                </button>
                                                <button
                                                    className="admin-program-detail-table-message-btn border border-lavender-blue-50 bg-lavender-blue-10 rounded-3 d-flex align-items-center justify-content-center">
                                                    <img src={MessageLavenderBlueIcon}/>
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

export default ProviderProgramPatientList
