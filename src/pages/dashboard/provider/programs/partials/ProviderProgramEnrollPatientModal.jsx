import React, {useState, useRef, useContext} from 'react';
import {useProviderDataStore} from "../../../../../stores/ProviderDataStore.js";
import {AuthContext} from "../../../../../context/AuthContext.jsx";

const ProviderProgramEnrollPatientModal = ({allSchedules,programNames, patientNames,handleEnrollPatient}) => {
    const {providerWhiteLabels} = useProviderDataStore();
    const {userType} = useContext(AuthContext);
    const [checkboxIndex, setCheckboxIndex] = useState(0)
    const [errors, setErrors] = useState({});
    const [formValues, setFormValues] = useState({
        PatientID: '',
        ProgramID: '',
        ProgramName: '',
        Schedule: {
            ScheduleID:'',
            Type: '',
            Name: '',
            Cron: '',
            IsPreset:''
        },
    });
    const cancelButtonRef = useRef(null);

    const [filteredProgramNames, setFilteredProgramNames] = useState(programNames);
    const {ButtonColor} = providerWhiteLabels;

    const handleChange = (e) => {
        const { id, value } = e.target;

        setFormValues({ ...formValues, [id]: value });

        if (id === 'PatientID') {
            // Get the selected patient
            const selectedPatient = patientNames.find(patient => patient.PatientID === value);

            if (selectedPatient) {
                // Filter out programs already enrolled by the selected patient
                const availablePrograms = programNames.filter(program =>
                    !selectedPatient.Program.some(enrolledProgram => enrolledProgram.value === program.ProgramName)
                );
                setFilteredProgramNames(availablePrograms);
            } else {
                setFilteredProgramNames(programNames); // Reset if no patient is selected
            }
        }
    };

    const handleScheduleChange = (e) => {
        const {id, value} = e.target;
        setFormValues((prevValues) => ({
            ...prevValues,
            Schedule: {...prevValues.Schedule, [id]: value},
        }));
    };

    const handleScheduleTypeChange = (index) => {
        setCheckboxIndex(index);

        let type = '';
        if (index === 0) {
            type = 'Default';
        } else if (index === 1) {
            type = 'Preset';
        } else if (index === 2) {
            type = 'CRON';
        }

        setFormValues((prevValues) => ({
            ...prevValues,
            Schedule: { ...prevValues.Schedule, Type: type },
        }));
    };




    const handleProgramChange = (e) => {
        const { value } = e.target;
        const selectedProgram = programNames.find(program => program.ProgramID === value);

        if (selectedProgram) {
            setFormValues({
                ...formValues,
                ProgramName: selectedProgram.ProgramName,
                ProgramID: selectedProgram.ProgramID
            });
        }
    };

    const validate = () => {
        let tempErrors = {};

        // General validation
        tempErrors.PatientID = formValues.PatientID ? "" : "This field is required.";
        tempErrors.ProgramName = formValues.ProgramName ? "" : "This field is required.";

        // Validation for CRON schedule
        if (checkboxIndex === 2) {
            if (!formValues.Schedule.Name) {
                tempErrors.Name = "Name is required for CRON schedule.";
            }
            if (!formValues.Schedule.Cron) {
                tempErrors.Cron = "CRON expression is required.";
            } else {
                const plainExpression = formValues.Schedule.Cron.trim();
                const cronRegex = new RegExp('^(\\*|[0-9]|[1-5][0-9]|[0-9],[0-9]|[1-5][0-9],[1-5][0-9]|\\*/[1-9][0-9]?|[0-9]/[1-9][0-9]?|[1-5][0-9]/[1-9][0-9]?) (\\*|[0-9]|1[0-9]|2[0-3]|[0-9],[0-9]|1[0-9],1[0-9]|2[0-3],2[0-3]|\\*/[1-9][0-9]?|[0-9]/[1-9][0-9]?|1[0-9]/[1-9][0-9]?|2[0-3]/[1-9][0-9]?) (\\?|\\*|L|W|[1-9]|[12][0-9]|3[01]|[1-9],[1-9]|[12][0-9],[12][0-9]|3[01],3[01]|\\*/[1-9][0-9]?|[1-9]/[1-9][0-9]?|[12][0-9]/[1-9][0-9]?|3[01]/[1-9][0-9]?) (\\*|[1-9]|1[0-2]|JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC|[1-9],[1-9]|1[0-2],1[0-2]|\\*/[1-9][0-9]?|[1-9]/[1-9][0-9]?|1[0-2]/[1-9][0-9]?) (\\?|\\*|[1-7]|MON|TUE|WED|THU|FRI|SAT|SUN|[1-7]#[1-5]|[1-7]L|\\*/[1-7]|[1-7]/[1-7]) (\\*|[0-9]|[12][0-9]|3[01]|[1-9],[1-9]|[12][0-9],[12][0-9]|3[01],3[01]|\\*/[1-9][0-9]?|[1-9]/[1-9][0-9]?|[12][0-9]/[1-9][0-9]?|3[01]/[1-9][0-9]?)$');
                const isValidCron = cronRegex.test(plainExpression);
                const wrappedExpression = `cron(${plainExpression})`;
                if (!isValidCron) {
                    tempErrors.Cron = "Invalid CRON expression. Use format: 0 0 ? * <day_of_week> *";
                }
                else if (allSchedules.some(schedule => schedule.Cron === wrappedExpression)) {
                    tempErrors.Cron = "This CRON expression already exists.";
                }
            }
        }

        setErrors(tempErrors);
        return Object.values(tempErrors).every((x) => x === "");
    };

    const handleEnroll = async (e) => {
        e.preventDefault();

        if (validate() && Object.values(errors).filter(error => error !== "").length === 0) {
            // Work with a local variable
            let updatedFormValues = { ...formValues };

            if (checkboxIndex === 0) {
                const expression = 'cron(0 0 ? * 2 *)';
                const matchingSchedule = allSchedules.find(schedule => schedule.Cron === expression);

                updatedFormValues.Schedule = {
                    ScheduleID: matchingSchedule ? matchingSchedule.ScheduleID : null,
                    Type: 'default',
                    Name: '',
                    Cron: '',
                    IsPreset: false,
                };
            } else if (checkboxIndex === 1) {
                updatedFormValues.Schedule = {
                    ScheduleID: formValues.Schedule.ScheduleID,
                    Type: 'preset',
                    Name: '',
                    Cron: '',
                    IsPreset: false,
                };
            } else if (checkboxIndex === 2) {
                const wrappedExpression = `cron(${formValues.Schedule.Cron})`;
                updatedFormValues.Schedule = {
                    ScheduleID: '', // No ScheduleID for CRON
                    Type: 'cron',
                    Name: formValues.Schedule.Name,
                    Cron: wrappedExpression,
                    IsPreset: formValues.Schedule.IsPreset === 'true' || formValues.Schedule.IsPreset === true,
                };
            }

            // Update state and ensure it's logged after being set
            setFormValues(updatedFormValues);

            // Use the updated values for enrollment
            // console.log("Updated Form Values:", updatedFormValues);

            handleEnrollPatient(updatedFormValues);

            // Close the modal
            if (cancelButtonRef.current) {
                cancelButtonRef.current.click();
            }
        }
    };

    const closeModal = () => {
        setFormValues({
            PatientID: "",
            ProgramID: "",
            ProgramName: "",
            Schedule: {
                ScheduleID: '',
                Type: 'Default',
                Name: '',
                Cron: '',
                IsPreset: false
            },
        });
        setErrors({}); // Reset errors
    };




    return (
        <div className="organization-detail-modal provider-program-enroll-patient-modal modal fade"
             id="provider-program-enroll-patient-modal" tabIndex={-1}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header border-bottom-0">
                        <h5 className="modal-title text-dark-grey-4 fw-bolder">Enroll Patient In Program</h5>
                        <button type="button" className="btn-close d-none" data-bs-dismiss="modal"
                                aria-label="Close"></button>
                    </div>
                    <form>
                        <div className="modal-body py-0 d-flex flex-column gap-3">

                            <div>
                                <label htmlFor="PatientID"
                                       className="form-label text-black fs-14 fw-normal">Select Patient</label>
                                <select
                                    id="PatientID"
                                    name="PatientID"
                                    className="form-select text-dark border-black-10 fw-light"
                                    aria-label="Default select example"
                                    value={formValues.PatientID}
                                    onChange={handleChange}
                                >
                                    <option value="">Select Patient</option>
                                    {patientNames && patientNames.map(option => (
                                        <option key={option.PatientID} value={option.PatientID}>
                                            {option.FirstName + ' ' + option.LastName}
                                        </option>
                                    ))}
                                </select>
                                {errors.PatientID && <div className="text-danger">{errors.PatientID}</div>}
                            </div>

                            <div>
                                <label htmlFor="ProgramID"
                                       className="form-label text-black fs-14 fw-normal">Select Program</label>
                                <select
                                    id="ProgramID"
                                    name="ProgramID"
                                    className="form-select text-dark border-black-10 fw-light"
                                    aria-label="Default select example"
                                    value={formValues.ProgramID}
                                    onChange={handleProgramChange}
                                >
                                    <option value="">Select Program</option>
                                    {filteredProgramNames && filteredProgramNames.map(option => (
                                        <option key={option.ProgramID} value={option.ProgramID}>
                                            {option.ProgramName}
                                        </option>
                                    ))}
                                </select>
                                {errors.ProgramName && <div className="text-danger">{errors.ProgramName}</div>}
                            </div>

                            <div className="enroll-patient-program-checkboxes mt-1">
                                <h6 className="form-label text-black fs-14 fw-normal">Select Schedule</h6>
                                <div className="d-flex align-items-center gap-3">
                                    <div className="provider-program-checkbox form-check">
                                        <input className="form-check-input" type="radio"
                                               name="enroll-patient-schedule"
                                               id="enroll-patient-schedule-default" checked={checkboxIndex === 0}
                                               onChange={() => handleScheduleTypeChange(0)}
                                        />
                                        <label className="form-check-label fs-14"
                                               htmlFor="enroll-patient-schedule-default">Default</label>
                                    </div>
                                    <div className="provider-program-checkbox form-check">
                                        <input className="form-check-input" type="radio"
                                               name="enroll-patient-schedule"
                                               id="enroll-patient-schedule-presets" checked={checkboxIndex === 1}
                                               onChange={() => handleScheduleTypeChange(1)}/>
                                        <label className="form-check-label fs-14"
                                               htmlFor="enroll-patient-schedule-presets">Presets</label>
                                    </div>

                                    <div className="provider-program-checkbox form-check">
                                        <input className="form-check-input" type="radio"
                                               name="enroll-patient-schedule"
                                               id="enroll-patient-schedule-cron" checked={checkboxIndex === 2}
                                               onChange={() => handleScheduleTypeChange(2)}/>
                                        <label className="form-check-label fs-14"
                                               htmlFor="enroll-patient-schedule-cron">CRON</label>
                                    </div>

                                </div>
                                <div className="mt-3">
                                    {checkboxIndex === 0 && (
                                        <div className="fs-14">
                                            <span className="fw-normal text-near-black">Default schedule: </span> <span
                                            className="fw-light text-dark-grey">Every Monday</span>
                                        </div>
                                    )}

                                    {checkboxIndex === 1 && (
                                        <div>
                                            <label htmlFor="ScheduleID"
                                                   className="form-label text-black fs-14 fw-normal">Schedule</label>
                                            <select
                                                name="ScheduleID"
                                                value={formValues.Schedule.ScheduleID}
                                                onChange={handleScheduleChange}
                                                id="ScheduleID"
                                                className="form-select bg-field border-light-grey form-select-placeholder"
                                            >
                                                <option value="">Select Schedule</option>
                                                {allSchedules.map(option => (
                                                    <option key={option.ScheduleID} value={option.ScheduleID}>
                                                        {option.Name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    )}

                                    {checkboxIndex === 2 && (
                                        <div>
                                            <div className="mb-3">
                                                <label htmlFor="Name" className="form-label text-black fs-14 fw-normal">Name</label>
                                                <input
                                                    type="text"
                                                    id="Name"
                                                    value={formValues.Schedule.Name}
                                                    onChange={handleScheduleChange}
                                                    placeholder="Name"
                                                    className="form-control bg-field fs-14 py-2"
                                                />
                                                {errors.Name && <div className="text-danger">{errors.Name}</div>}
                                            </div>

                                            <div className="mb-3">
                                                <label htmlFor="Cron" className="form-label text-black fs-14 fw-normal">CRON expression</label>
                                                <input
                                                    type="text"
                                                    id="Cron"
                                                    value={formValues.Schedule.Cron}
                                                    onChange={handleScheduleChange}
                                                    placeholder="0 0 ? * <day_of_week> *"
                                                    className="form-control bg-field fs-14 py-2"
                                                />
                                                {errors.Cron && <div className="text-danger">{errors.Cron}</div>}
                                            </div>

                                            <div className="d-flex align-items-center gap-2">
                                                <input
                                                    id="IsPreset"
                                                    className="cyan-squared-checkbox"
                                                    type="checkbox"
                                                    checked={formValues.Schedule.IsPreset}
                                                    onChange={(e) =>
                                                        setFormValues((prevValues) => ({
                                                            ...prevValues,
                                                            Schedule: {
                                                                ...prevValues.Schedule,
                                                                IsPreset: e.target.checked,
                                                            },
                                                        }))
                                                    }
                                                />

                                                <label
                                                    htmlFor="IsPreset"
                                                    className="text-near-black fw-normal fs-14">Save to presets</label>
                                            </div>
                                        </div>
                                    )}

                                </div>
                            </div>
                        </div>
                        <div
                            className="modal-footer border-top-0 justify-content-between align-items-center py-3">
                            <button type="button"
                                    ref={cancelButtonRef}
                                    onClick={closeModal}
                                    className="btn cancel-dark-blue-btn d-flex align-items-center bg-transparent border border-dark-blue text-dark-blue rounded-2 fs-14 fw-normal"
                                    data-bs-dismiss="modal"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleEnroll}
                                className={`btn ${userType === 'Admin' ? 'd-flex align-items-center bg-parrot-green border-0 py-2 px-3 rounded-2 text-decoration-none' : ''}`}
                                style={{
                                    backgroundColor: userType === 'Provider' && ButtonColor ? ButtonColor : ""
                                }}
                            >
                                Enroll
                            </button>

                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default ProviderProgramEnrollPatientModal
