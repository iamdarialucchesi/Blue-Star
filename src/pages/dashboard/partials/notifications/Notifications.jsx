import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";

import AlertFilterModal from "./fliter Modal/AlertFilterModal.jsx";
import ReminderFilterModal from "./fliter Modal/ReminderFilterModal.jsx";
import ReminderApprovalModal from "./fliter Modal/ReminderApprovalModal";

import alertRedIcon from "../../../../assets/icons/alert-red-icon.svg";
import orderIcon from "../../../../assets/icons/order-icon.svg";
import filterIcon from "../../../../assets/icons/filter-icon.svg";
import FlagRedIcon from "../../../../assets/images/icons/flag-red.svg";
import FlagGreenIcon from "../../../../assets/images/icons/flag-green.svg";
import FlagOrangeIcon from "../../../../assets/images/icons/flag-orange.svg";
import PlusBlackIcon from "../../../../assets/images/icons/black-plus.svg";
import {useAdminDataStore} from "../../../../stores/AdminDataStore.js";
import {AuthContext} from "../../../../context/AuthContext.jsx";
import NotificationAndReminderService from "./service/NotificationAndReminderService.js";
import Spinner from "../../../../components/Spinner.jsx";
import { useProviderDataStore } from "../../../../stores/ProviderDataStore.js";
import PatientProgramService from "../../partials/interactions/service/PatientsProgramsService.js";

function Notifications({ handleRowClick }) {
    const navigate = useNavigate();
    const { authToken,userType } = useContext(AuthContext);
    const { providerWhiteLabels ,providerOrganizationID} = useProviderDataStore();
    const [evaluations, setEvaluations] = useState([]);
    const [isShowOrderAlert, setIsShowOrderAlert] = useState("d-none")
    const [isShowOrderReminder, setIsShowOrderReminder] = useState("d-none")
    const [isShowFilterModalAlert, setIsShowFilterModalAlert] = useState(false)
    const [isShowFilterModalReminder, setIsShowFilterModalReminder] = useState(false)
    const [sortOrder, setSortOrder] = useState("newest");
    const [filterSeverity, setFilterSeverity] = useState([]);
    const [tempFilterSeverity, setTempFilterSeverity] = useState([]);
    const [filterResolvedStatus, setFilterResolvedStatus] = useState([false]);
    const [tempFilterResolvedStatus, setTempFilterResolvedStatus] = useState([false]);
    const [isLoading, setIsLoading] = useState(false);
    const { ButtonColor } = providerWhiteLabels;
    const { loginUser } = useAdminDataStore();
    const [showModal, setShowModal] = useState(false);
    const [resetKey, setResetKey] = useState(0); // State variable to force re-render
    const [allReminders, setAllReminders] = useState([]);
    const [allPatients, setAllPatients] = useState([]);
    const [order, setOrder] = useState('desc');
    const [status, setStatus] = useState(0);
    const [errors, setErrors] = useState({});
    const [selectedReminder, setSelectedReminder] = useState(null);
    const [showReminderModal, setShowReminderModal] = useState(false);

    //for Filter
    const [filteredTypes, setFilteredTypes] = useState([]);
    const [filteredDueDate, setFilteredDueDate] = useState('');
    const [filteredPriority, setFilteredPriority] = useState('');
    const [filteredStatus, setFilteredStatus] = useState('');

    const [formValues, setFormValues] = useState({
        PatientID: "",
        PatientName: "",
        Type: "",
        DueDate: "",
        Status: "",
        Description: "",
        Priority: "",
        CreatedAt: ""
    });

    useEffect(() => {
        fetchAllReminders();
    }, [order]);

    const fetchAllReminders = async () => {
        let result = null;
        if (userType && userType === 'Admin'){
            result = await NotificationAndReminderService.fetchReminders(authToken,order,status);
        }
        else if (userType && userType === 'Provider'){
            result = await NotificationAndReminderService.fetchProviderReminders(authToken,order,status,providerOrganizationID);
        }
        if (result && result.reminders) {
            await setAllReminders(result.reminders);
            await setAllPatients(result.patients);
        }
    }

    const options = [
        {value: 'Low', label: 'Low'},
        {value: 'Medium', label: 'Medium'},
        {value: 'High', label: 'High'}
    ];

    const types = [
        {value: 'Appointments', label: 'Appointments'},
        {value: 'Medication Review', label: 'Medication Review'},
        {value: 'Treatment Follow-up', label: 'Treatment Follow-up'},
        {value: 'Routine Check-up', label: 'Routine Check-up'},
        {value: 'Test Results Review', label: 'Test Results Review'},
    ];
    const handleAddClick = () => {
        setShowModal(true);
    };
    const handleCloseModal = () => {
        setShowModal(false);
        setFormValues({
            PatientID: "",
            PatientName: "",
            Type: "",
            DueDate: "",
            Description: "",
            Priority: "",
            CreatedAt: ""
        });
        setErrors({});
    };

    const handleChange = (e) => {
        const {id,name,value} = e.target;

        if (name === "PatientID") {
            const selectedPat = allPatients.find(option => option.PatientID === value);
            setFormValues({
                ...formValues,
                PatientID: selectedPat ? selectedPat.PatientID : "",
                PatientName: selectedPat ? selectedPat.FirstName + ' ' + selectedPat.LastName  : ""
            });
        }
        else {
            setFormValues({...formValues, [id]: value});
        }
        // setFormValues((prevValues) => ({ ...prevValues, [id]: value }));
    };

    const validateForm = () => {
        const newErrors = {};
        const currentDate = new Date().toISOString();
        formValues.CreatedAt = currentDate;
        formValues.Status = 0;
        if (!formValues.PatientID) newErrors.PatientID = "Patient is required";
        if (!formValues.Type) newErrors.Type = "Type is required";
        if (!formValues.DueDate) newErrors.DueDate = "DueDate is required";
        if (!formValues.Description) newErrors.Description = "Description is required";
        if (!formValues.Priority) newErrors.Priority = "Priority is required";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (validateForm()) {
            try {
                setIsLoading(true);
                let result = null;
                if (userType && userType === 'Admin') {
                    result = await NotificationAndReminderService.saveReminder(authToken, formValues, loginUser);
                } else if (userType && userType === 'Provider') {
                    result = await NotificationAndReminderService.saveProviderReminder(authToken, formValues, loginUser);
                }
                setIsLoading(false);
                if (result.status === 200) {
                    await fetchAllReminders();
                    handleCloseModal();
                }
            } catch (error) {
                setIsLoading(false);
                console.error('Update failed:', error);
            }
        }
    }

    const handleOrderChange = (newOrder) => {
        setOrder(newOrder);
        setIsShowOrderReminder("d-none");
    };
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const formattedDate = date.toLocaleDateString('en-US');
        const formattedTime = date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        });
        return `${formattedDate + ' ' + formattedTime}`;
    };

    const handleFilterReminders = async (formValues) => {
        try {
            setIsLoading(true);
            await setFilteredTypes(formValues.selectedTypes);
            await setFilteredDueDate(formValues.selectedDueDate);
            await setFilteredPriority(formValues.selectedPriority);
            await setFilteredStatus(formValues.selectedStatus);
            let result = null;
            if (userType && userType === 'Admin') {
                formValues.OrganizationID = null
                result = await NotificationAndReminderService.filterReminders(authToken, formValues);
            }
            else if (userType && userType === 'Provider') {
                formValues.OrganizationID = providerOrganizationID;
                result = await NotificationAndReminderService.filterProviderReminders(authToken, formValues);
            }
            if (result.status === 200) {
                const data = result.data;
                const remindersData = data.reminders;
                if (remindersData) {
                    setAllReminders(remindersData);
                }
            }
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
            console.error('Update failed:', error);
        }
    }

    const handleReminderRowClick = (e,reminder) => {
        e.stopPropagation();
        setSelectedReminder(reminder);
        setShowReminderModal(true);
    };
    const handleApproveReminder = async (formValues) => {
        if (formValues.Status === 0) {
            try {
                setIsLoading(true);
                let result = null;
                if (userType && userType === 'Admin') {
                    result = await NotificationAndReminderService.approveReminder(authToken, formValues, loginUser);
                }
                else if (userType && userType === 'Provider') {
                    result = await NotificationAndReminderService.approveProviderReminder(authToken, formValues, loginUser);
                }
                setIsLoading(false);
                if (result.status === 200) {
                    await fetchAllReminders();
                    setShowReminderModal(false);
                }
            } catch (error) {
                setIsLoading(false);
                console.error('Update failed:', error);
            }
        }
    };

    useEffect(() => {
        fetchAllPatients();
    }, []);

    // Fetch evaluation data for all patients and their programs
    const fetchEvaluation = async (patientId, programId) => {
        try {
            const result = await PatientProgramService.fetchConversationEvaluation(authToken, patientId, programId);
            if (result && result.Evaluation) {
                return result;
            } else{
                return null;
            }

        } catch (error) {
            console.error('Error fetching evaluation:', error);
            return null;
        }
    };

    const fetchAllPatients = async () => {
        try {
            const organizationId = providerOrganizationID || "";
            setIsLoading(true)
            const result = await PatientProgramService.fetchPatientPrograms(authToken, organizationId);

            if (result && result.patients) {
                const evaluationData = [];

                // Loop through all patients
                for (const patient of result.patients) {
                    const patientId = patient.PatientID;

                    // Loop through all programs for each patient
                    if (patient.Programs && patient.Programs.length > 0) {
                        for (const program of patient.Programs) {
                            const programId = program.ProgramID;

                            // Fetch evaluation for each patient-program combination
                            const evaluation = await fetchEvaluation(patientId, programId);
                            if (evaluation) {
                                evaluationData.push({
                                    Patient: patient,
                                    Program: program,
                                    Alerts: evaluation.Alerts,
                                });
                            }
                        }
                    }
                }

                // Update state with all fetched evaluations
                setEvaluations(evaluationData);
                setIsLoading(false)
            }
        } catch (error) {
            console.error('Error fetching patients or evaluations:', error);
            setIsLoading(false)
        }
    };

    const getFlagIcon = (severity) => {
        switch (severity) {
            case "1":
                return <img src={FlagRedIcon} alt="Red Flag" />;
            case "2":
                return <img src={FlagOrangeIcon} alt="Orange Flag" />;
            case "3":
                return <img src={FlagGreenIcon} alt="Green Flag" />;
            default:
                return null;
        }
    };

    function handleNavigate(patientData, programData) {
        navigate("/interactions/detail", { state: { patientData, programData } });
    }

    const sortedAndFilteredAlerts = evaluations.flatMap((evaluation) => {
        const { Patient, Program, Alerts } = evaluation;
    
        // Filter based on severity and resolved status
        const filteredAlerts = Alerts.filter(
            (alert) =>
                (filterSeverity.length === 0 || filterSeverity.includes(parseInt(alert.Severity))) &&
                (filterResolvedStatus.length === 0 || filterResolvedStatus.includes(alert.Resolved))
        );
    
        // Sort alerts by DueDate (ascending or descending based on sortOrder)
        return filteredAlerts
            .map((alert) => ({
                ...alert,
                Patient: Patient,
                Program: Program,
                DueDate: new Date(alert.DueDate),
            }))
            .sort((a, b) => {
                return sortOrder === "newest" ? b.DueDate - a.DueDate : a.DueDate - b.DueDate;
            });
    });

    const handleSortOrderChange = (order) => {
        setSortOrder(order); // Update sort order state
        setIsShowOrderAlert("d-none");
    };
    
    const applyFilters = () => {
        setFilterSeverity(tempFilterSeverity); // Apply the severity filters when "Apply Filter" is clicked
        setFilterResolvedStatus(tempFilterResolvedStatus); // Apply the status filters when "Apply Filter" is clicked
        setIsShowFilterModalAlert(false); // Close the modal
    };
    
    const clearFilters = () => {
        setTempFilterSeverity([]); // Clear all temporary severity filters
        setFilterSeverity([]); // Clear the applied severity filters
        setTempFilterResolvedStatus([]); // Show only unresolved alerts by default
        setFilterResolvedStatus([]); // Clear the applied status filters, default to unresolved
        setIsShowFilterModalAlert(false); // Close the modal
    };

    if (isLoading) {
        return <Spinner />
    }

    return (
        <div>
            {/* Alert Section */}
            <section className="border border-light-grey rounded-3 px-3 pt-3 pb-0 custom-scrollbar-section-1">
                <div className="admin-table-top d-flex border-bottom pb-2 align-items-center justify-content-between">
                    <div className="d-flex align-items-center gap-1">
                        <h5 className="m-0 fw-bolder fs-19">Alerts</h5>
                        <a className="text-decoration-none mt-n1" data-bs-toggle="tooltip" data-bs-placement="right" data-bs-title="Tooltip on right">
                            <img src={alertRedIcon} width={15} className="mb-n1" alt="alert red icon" />
                        </a>
                    </div>

                    <div className="table-top-side-btn d-flex align-items-center flex-wrap gap-2">
                        <div className="table-top-right-btns d-flex align-items-center gap-2">
                            <div className="position-relative">
                                <button onClick={() => setIsShowOrderAlert("d-block")} className="btn p-0 border-0">
                                    <img src={orderIcon} alt="order icon" />
                                </button>
                                {/* ORDER BY POPUP */}
                                <div onClick={() => setIsShowOrderAlert("d-none")} className={`admin-table-delete-confirm ${isShowOrderAlert} bg-black-10`}></div>
                                <ul className={`admin-order-by-popup ${isShowOrderAlert} list-unstyled mb-0 border border-light-grey rounded-3 overflow-hidden position-absolute`}>
                                    <li role="button" className="px-3 py-2 text-dark-grey bg-white border-bottom" onClick={() => handleSortOrderChange("newest")}>
                                        Newest First
                                    </li>
                                    <li role="button" className="px-3 py-2 text-dark-grey bg-white" onClick={() => handleSortOrderChange("oldest")}>
                                        Oldest First
                                    </li>
                                </ul>
                            </div>

                            <div className="position-relative">
                                <button className="btn p-0 border-0" onClick={() => setIsShowFilterModalAlert(true)}>
                                    <img src={filterIcon} alt="filter icon" />
                                </button>
                                {isShowFilterModalAlert && (
                                    <AlertFilterModal
                                        isShowFilterModalAlert={isShowFilterModalAlert}
                                        setIsShowFilterModalAlert={setIsShowFilterModalAlert}
                                        tempFilterSeverity={tempFilterSeverity}
                                        setTempFilterSeverity={setTempFilterSeverity}
                                        tempFilterResolvedStatus={tempFilterResolvedStatus}
                                        setTempFilterResolvedStatus={setTempFilterResolvedStatus}
                                        applyFilters={applyFilters}
                                        clearFilters={clearFilters}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-3 alert-table-height">
                    <div className="table-responsive">
                        <table className="table admin-table text-dark-grey m-0">
                            <thead>
                                <tr className="admin-table-heading-row">
                                    <th scope="col" className="fw-normal fs-17 pe-5 pe-md-3">Patient Name</th>
                                    <th scope="col" className="col-6 fw-normal fs-17 pe-9 pe-md-3">Description</th>
                                    <th scope="col" className="fw-normal fs-17 pe-7 pe-md-3">Severity</th>
                                    <th scope="col" className="fw-normal fs-17">Action Required</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sortedAndFilteredAlerts && sortedAndFilteredAlerts.map((alert, index) => (
                                    <tr className="admin-table-body-row fw-light fs-14 cursor-pointer" key={index} onClick={() => handleRowClick(alert)}>
                                        <td>{alert.Patient.PatientName}</td>
                                        <td className="pe-2">{alert.Message}</td>
                                        <td>{getFlagIcon(alert.Severity)}</td>
                                        <td>
                                            <Link className="fw-bold text-decoration-none" onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                handleNavigate(alert.Patient, alert.Program);
                                            }}>
                                                Message {alert.Patient.PatientName.split(" ")[0]}
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            {/*Reminder Screen*/}
            <section className="mt-3 border border-light-grey rounded-3 px-3 pt-3 pb-0 custom-scrollbar-section-1">
                <div
                    className="admin-table-top border-bottom pb-2 d-flex flex-column flex-sm-row align-items-center justify-content-between gap-3">
                    <h5 className="m-0 fw-bolder fs-19">Reminders</h5>

                    <div className="table-top-side-btn d-flex align-items-center flex-wrap gap-2">
                        <div className='table-top-right-btns d-flex align-items-center gap-2'>
                            <div>
                                <button onClick={handleAddClick}
                                        className={`btn py-2 d-flex gap-2 align-items-center justify-content-center justify-content-md-start ${!ButtonColor && "btn-primary"}`}
                                        style={{backgroundColor: ButtonColor && ButtonColor}}>
                                    Add
                                    <img src={PlusBlackIcon} alt="plus black icon" />
                                </button>
                                {
                                    (showModal) ? (
                                        <>
                                            <div key={resetKey}>
                                                <div onClick={() => setShowModal(false)}
                                                     className={`light-black-modal-overlay ${showModal} bg-black-10`}>
                                                </div>
                                                {/* Add Modal */}
                                                <div className={`modal ${showModal ? "show" : ""}`}
                                                     style={{display: showModal ? "block" : "none"}}
                                                     aria-labelledby="editModalLabel" aria-hidden={!showModal}>
                                                    <div className="modal-dialog modal-lg modal-dialog-centered">
                                                        <div className="modal-content">
                                                            <div className="modal-header">
                                                                <h5 className="modal-title" id="editModalLabel">Add Reminder</h5>
                                                                <button type="button" className="btn-close"
                                                                        onClick={handleCloseModal}
                                                                        aria-label="Close"></button>
                                                            </div>
                                                            <div className="modal-body">
                                                                <form>
                                                                    <div className="row">
                                                                        <div className="col-md-6">
                                                                            <div className="mb-3">
                                                                                <label htmlFor='PatientID'
                                                                                       className="form-label pb-1 m-0 fw-normal section-heading-3d3d3d-14px">Patient</label>
                                                                                <select
                                                                                    name="PatientID"
                                                                                    value={formValues.PatientID}
                                                                                    onChange={handleChange}
                                                                                    className="form-select form-select-lg form-select-placeholder bg-field"
                                                                                    id='PatientID'
                                                                                >
                                                                                    <option value="">Select Patient</option>
                                                                                    {allPatients.map(option => (
                                                                                        <option key={option.PatientID}
                                                                                                value={option.PatientID}>
                                                                                            {option.FirstName + ' ' + option.LastName}
                                                                                        </option>
                                                                                    ))}
                                                                                </select>
                                                                                {errors.PatientID &&
                                                                                    <small
                                                                                        className="text-danger">{errors.PatientID}</small>}

                                                                            </div>
                                                                        </div>
                                                                        <div className="col-md-6">
                                                                            <div className="mb-3">
                                                                                <label htmlFor='Type'
                                                                                       className="form-label pb-1 m-0 fw-normal section-heading-3d3d3d-14px">Type</label>
                                                                                <select
                                                                                    name="Type"
                                                                                    value={formValues.Type}
                                                                                    onChange={handleChange}
                                                                                    className="form-select form-select-lg form-select-placeholder bg-field"
                                                                                    id='Type'
                                                                                >
                                                                                    <option value="">Select Type
                                                                                    </option>
                                                                                    {types.map(option => (
                                                                                        <option key={option.value}
                                                                                                value={option.value}>
                                                                                            {option.label}
                                                                                        </option>
                                                                                    ))}
                                                                                </select>
                                                                                {errors.Type &&
                                                                                    <small
                                                                                        className="text-danger">{errors.Type}</small>}
                                                                            </div>
                                                                        </div>
                                                                        <div className="col-md-6">
                                                                            <div className="mb-3">
                                                                                <label htmlFor='Priority'
                                                                                       className="form-label pb-1 m-0 fw-normal section-heading-3d3d3d-14px">Priority</label>
                                                                                <select
                                                                                    name="Priority"
                                                                                    value={formValues.Priority}
                                                                                    onChange={handleChange}
                                                                                    className="form-select form-select-lg form-select-placeholder bg-field"
                                                                                    id='Priority'
                                                                                >
                                                                                    <option value="">Select Priority
                                                                                    </option>
                                                                                    {options.map(option => (
                                                                                        <option key={option.value}
                                                                                                value={option.value}>
                                                                                            {option.label}
                                                                                        </option>
                                                                                    ))}
                                                                                </select>
                                                                                {errors.Priority &&
                                                                                    <small
                                                                                        className="text-danger">{errors.Priority}</small>}
                                                                            </div>
                                                                        </div>
                                                                        <div className="col-md-6">
                                                                            <div className="mb-3">
                                                                                <label htmlFor="DueDate" className="form-label pb-1 m-0 fw-normal section-heading-3d3d3d-14px">Due Date</label>
                                                                                <input
                                                                                    type="date"
                                                                                    name="DueDate"
                                                                                    value={formValues.DueDate}
                                                                                    onChange={handleChange}
                                                                                    className="form-control form-control bg-field"
                                                                                    id="DueDate"
                                                                                />
                                                                                {errors.DueDate && <small className="text-danger">{errors.DueDate}</small>}
                                                                            </div>
                                                                        </div>

                                                                        <div className="col-12">
                                                                            <div className="mb-3">
                                                                                <label htmlFor='Description'
                                                                                       className='section-heading-3d3d3d-14px fw-normal pb-1'>Description</label>
                                                                                <textarea type='text' id='Description'
                                                                                       name='Description'
                                                                                       placeholder='Your message here...'
                                                                                       className="form-control form-control placeholder-add-patient bg-field py-2"
                                                                                       value={formValues.Description}
                                                                                       onChange={handleChange}/>
                                                                                {errors.Description && <small
                                                                                    className="text-danger">{errors.Description}</small>}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </form>
                                                            </div>
                                                            <div className="modal-footer border-0 pt-0">
                                                                <button type="button" className="btn btn-secondary"
                                                                        onClick={handleCloseModal}>Close
                                                                </button>
                                                                <button type="button" className="btn btn-primary"
                                                                        onClick={handleSubmit}>Add
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                            </div>
                                        </>) : ""
                                }
                            </div>

                            <div className='position-relative'>
                                <button onClick={() => setIsShowOrderReminder("d-block")}
                                    className="btn p-0 border-0">
                                    <img src={orderIcon} />
                                </button>
                                {/*ORDER BY POPUP*/}
                                <div onClick={() => setIsShowOrderReminder("d-none")}
                                    className={`admin-table-delete-confirm ${isShowOrderReminder} bg-black-10`}></div>
                                <ul className={`admin-order-by-popup ${isShowOrderReminder} list-unstyled mb-0 border border-light-grey rounded-3 overflow-hidden position-absolute`}>
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

                            <div className="position-relative">
                                <button className="btn p-0 border-0"
                                    onClick={() => setIsShowFilterModalReminder(true)}>
                                    <img src={filterIcon} />
                                </button>
                                {
                                    (isShowFilterModalReminder) ?
                                        <ReminderFilterModal
                                            isShowFilterModalReminder={isShowFilterModalReminder}
                                            setIsShowFilterModalReminder={setIsShowFilterModalReminder}
                                            filteredTypes={filteredTypes}
                                            filteredDueDate={filteredDueDate}
                                            filteredPriority={filteredPriority}
                                            filteredStatus={filteredStatus}
                                            handleFilterReminders={handleFilterReminders}
                                        /> : ""
                                }
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-3 reminder-table-height">
                    <div className="table-responsive">
                        <table className="table admin-table text-dark-grey m-0">
                            <thead>
                                <tr className="admin-table-heading-row">
                                    <th scope="col" className="fw-normal fs-17 pe-9 pe-md-3">Type</th>
                                    <th scope="col" className="fw-normal fs-17 pe-5 pe-md-3">Patient Name</th>
                                    <th scope="col" className="col-4 fw-normal fs-17 pe-7 pe-md-3">Description</th>
                                    <th scope="col" className="fw-normal fs-17 pe-7 pe-md-3">Due Date</th>
                                    <th scope="col" className="fw-normal fs-17">Priority</th>
                                </tr>
                            </thead>
                            <tbody>
                            {allReminders && allReminders.map((reminder) => (
                                <tr
                                    key={reminder.ReminderID}
                                    className="admin-table-body-row fw-light fs-14 cursor-pointer"
                                    onClick={(e) => handleReminderRowClick(e,reminder)} // Add this line
                                >
                                    <td>{reminder.Type}</td>
                                    <td>{reminder.PatientName}</td>
                                    <td>{reminder.Description}</td>
                                    <td>{formatDate(reminder.DueDate)}</td>
                                    <td>{reminder.Priority}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>

                        {
                            (showReminderModal) ?
                                <ReminderApprovalModal
                                    showReminderModal={showReminderModal}
                                    setShowReminderModal={setShowReminderModal}
                                    reminder={selectedReminder}
                                    handleApproveReminder={handleApproveReminder}
                                /> : ""
                        }
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Notifications;
