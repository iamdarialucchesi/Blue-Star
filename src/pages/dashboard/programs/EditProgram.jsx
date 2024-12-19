import React, {useState, useEffect, useContext} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Select, { components } from 'react-select';
import AdminLayout from "../../../layouts/dashboard/AdminLayout.jsx";
import DropDownArrowGreyIcon from "../../../assets/images/icons/dropdown-arrow-down-grey.svg";
import ProgramService from "./service/ProgramService.js";
import {AuthContext} from "../../../context/AuthContext.jsx";
import {useAdminDataStore} from "../../../stores/AdminDataStore.js";
import Spinner from "../../../components/Spinner.jsx";
import {useProgramsDataStore} from "../../../stores/ProgramsDataStore.js";

const EditProgram = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const {authToken} = useContext(AuthContext);
    const { loginUser } = useAdminDataStore();
    const { SNSPhoneNumbers, setSNSPhoneNumbers } = useProgramsDataStore();
    const [isLoading, setIsLoading] = useState(false);
    const [program, setProgram] = useState({});
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [formValues, setFormValues] = useState({
        ProgramName: '',
        Abbreviation: '',
        Type: '',
        Channels: [],
        Description: '',
        ConsentAssistant: '',
        ConversationAssistant: '',
        AnalysisAssistant: '',
        SourceNumber: '',
        PrimaryObjective: '',
        SecondaryObjective: '',
        EligibilityCriteria: '',
        ProgramNumber: '',
        CreatedAt: ''
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (location.state && location.state.program) {

            const program = location.state.program;
            setProgram(program);

            const validChannels = program.Channels.filter(
                channel => channel.value && channel.label
            );

            setFormValues({
                ProgramID: program.ProgramID || '',
                ProgramName: program.ProgramName || '',
                Abbreviation: program.Abbreviation || '',
                Type: program.Type || '',
                Channels: validChannels.map(channel => ({
                    label: channel.label,
                    value: channel.value
                })),
                ConsentAssistant: program.ConsentAssistant || '',
                ConversationAssistant: program.ConversationAssistante || '',
                AnalysisAssistant: program.AnalysisAssistant || '',
                Description: program.Description || '',
                SourceNumber: program.SourceNumber || '',
                PrimaryObjective: program.PrimaryObjective || '',
                SecondaryObjective: program.SecondaryObjective || '',
                EligibilityCriteria: program.EligibilityCriteria || '',
                ProgramNumber: program.ProgramNumber || '',
                CreatedAt: program.CreatedAt || '',
            });

            // Ensure SNSPhoneNumbers is an array and append new SourceNumber only if it’s unique
            // if (program.SourceNumber) {
            //     setSNSPhoneNumbers([
            //         ...SNSPhoneNumbers,
            //         { SourceNumber: program.SourceNumber, Status: 'Verified' }
            //     ]);
            // }
        }
    }, [location.state]);

    const options = [
        { value: 'Email', label: 'Email' },
        { value: 'SMS', label: 'SMS' }
    ];

    const programTypeOptions = [
        { value: 'Remote Patient Monitoring (RPM)', label: 'Remote Patient Monitoring (RPM)' },
        { value: 'Chronic Care Management (CCM)', label: 'Chronic Care Management (CCM)' },
        { value: 'Population Health Monitoring (PHM)', label: 'Population Health Monitoring (PHM)' },
        { value: 'Other', label: 'Other' },
    ];

    const customStyles = {
        menu: (base) => ({
            ...base,
            padding: "25px 15px 25px 15px"
        }),
        option: (base, state) => ({
            ...base,
            display: "flex",
            alignItems: "center",
            padding: '15px 0',
            backgroundColor: 'white',
            color: "#4A4A4A",
            fontSize: "12px",
            fontWeight: 300,
        }),
        multiValue: (base) => ({
            ...base,
            backgroundColor: '#32DACB4D',
            border: "1px solid #32DACB4D",
            borderRadius: '20px',
            padding: '0',
            display: "flex",
            justifyContent: "center",
            margin: "2px 7px 2px 0"
        }),
        multiValueLabel: (base) => ({
            ...base,
            color: '#4A4A4A',
            fontSize: 12,
            fontWeight: 400,
            padding: "3px 13px 3px 13px !important"
        }),
        multiValueRemove: (base) => ({
            ...base,
            display: 'none !important',
        }),
        indicatorSeparator: () => ({
            display: 'none !important',
        }),
        control: (base, state) => ({
            ...base,
            width: '100%',
            backgroundColor: '#FAFAFA',
            border: "1px solid #0A263F24",
            '&:focus': {
                border: '1px solid #0A263F24',
            },
            boxShadow: "none",
        })
    };

    const handleChange = (selected) => {
        setFormValues({ ...formValues, Channels: selected });

    };

    const validateJson = (jsonString) => {
        try {
            JSON.parse(jsonString);
            return "";
        } catch (error) {
            return "Invalid JSON format.";
        }
    };

    if (isLoading) {
        return <Spinner />
    }
    const CheckboxOption = (props) => {
        return (
            <div className="create-program-custom-checkbox-container">
                <components.Option {...props}>
                    <input
                        className="create-program-custom-checkbox"
                        type="checkbox"
                        checked={props.isSelected}
                        onChange={() => null}
                    />{' '}
                    <label className="create-program-custom-checkbox-label">{props.label}</label>
                </components.Option>
            </div>
        );
    };

    const CustomDropdownIndicator = (props) => {
        return (
            <components.DropdownIndicator {...props}>
                <img src={DropDownArrowGreyIcon} width={16} height={12} alt="Dropdown Arrow" />
            </components.DropdownIndicator>
        );
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormValues(prevValues => ({
            ...prevValues,
            [name]: value
        }));
    };

    const validatePhoneNumber = (input) => {
        const cleaned = ('' + input).replace(/\D/g, ''); // Remove non-numeric characters
        if (cleaned.length !== 10) {
            return ''; // Ensure that the phone number has exactly 10 digits
        }
        const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);

        if (match) {
            return `(${match[1]}) ${match[2]}-${match[3]}`; // Format the number as (XXX) XXX-XXXX
        }
        return ''; // Return empty string if it doesn't match
    };
    const validate = () => {
        const currentDate = new Date().toISOString();
        // formValues.CreatedAt = currentDate;
        let tempErrors = {};
        tempErrors.ProgramName = formValues.ProgramName ?
            (formValues.ProgramName.length <= 40 ? "" : "Program Name must be 40 characters or less.")
            : "This field is required.";

        const abbreviationRegex = /^[A-Za-z]+$/;
        tempErrors.Abbreviation = formValues.Abbreviation ?
            (!abbreviationRegex.test(formValues.Abbreviation)
                    ? "Abbreviation can only contain letters."
                    : (formValues.Abbreviation.length <= 5 ? "" : "Abbreviation must be 5 characters or less.")
            )
            : "This field is required.";

        tempErrors.Type = formValues.Type ? "" : "This field is required.";
        tempErrors.Channels = formValues.Channels.length > 0 ? "" : "At least one channel must be selected.";
        tempErrors.Description = formValues.Description ?
            (formValues.Description.length <= 500 ? "" : "Description must be under 500 characters.")
            : "This field is required.";

        if (!formValues.SourceNumber) {
            tempErrors.SourceNumber = 'Source Number is required.';
        } else {
            const formattedSourceNumber = validatePhoneNumber(formValues.SourceNumber);
            if (!formattedSourceNumber) {
                tempErrors.SourceNumber = 'Enter a valid 10-digit Source Number in the format (XXX) XXX-XXXX.';
            } else {
                formValues.SourceNumber = formattedSourceNumber;
            }
        }

        tempErrors.PrimaryObjective = formValues.PrimaryObjective ?
            (formValues.PrimaryObjective.length <= 500 ? "" : "Primary Objective must be under 500 characters.")
            : "This field is required.";
        tempErrors.SecondaryObjective = formValues.SecondaryObjective ?
            (formValues.SecondaryObjective.length <= 500 ? "" : "Secondary Objective must be under 500 characters.")
            : "This field is required.";
        tempErrors.EligibilityCriteria = formValues.EligibilityCriteria ?
            (formValues.EligibilityCriteria.length <= 500 ? "" : "Eligibility Criteria must be under 500 characters.")
            : "This field is required.";
        tempErrors.ProgramNumber = formValues.ProgramNumber ? "" : "This field is required.";

        setErrors(tempErrors);
        return Object.values(tempErrors).every(x => x === "");
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        if (validate()) {
            try {
                setIsLoading(true);
                const result = await ProgramService.saveProgram(authToken, formValues, loginUser);
                if (result.status === 200) {
                    navigate('/programs');
                }
                setIsLoading(false);
            } catch (error) {
                setIsLoading(false);
                // Check if the error is related to the Abbreviation uniqueness
                if (error.response && error.response.status === 409) {
                    setErrors(prevErrors => ({
                        ...prevErrors,
                        Abbreviation: error.response.data
                    }));
                } else {
                    console.error('Update failed:', error);
                }
            }
        }
    };

    return (
        <AdminLayout headerTitle={"Edit Program"} isDashboard={true}>
            <div>
                <section className="admin-edit-program border border-light-grey rounded-3 px-3 py-3">
                    <form>
                        <div className="admin-edit-program-form column-gap-3 row-gap-4">
                            <div className="create-program-grid-col-span-md">
                                <label htmlFor="ProgramName" className="form-label text-dark-grey fs-14 fw-normal">
                                    Program name
                                </label>
                                <input
                                    type='text'
                                    placeholder="Diabetes"
                                    id="ProgramName"
                                    name="ProgramName"
                                    className="form-control border-light-grey bg-field placeholder-add-patient"
                                    value={formValues.ProgramName}
                                    onChange={handleInputChange}
                                />
                                {errors.ProgramName && <div className="text-danger">{errors.ProgramName}</div>}
                            </div>

                            <div className="create-program-grid-col-span-md">
                                <label htmlFor="Abbreviation" className="form-label text-dark-grey fs-14 fw-normal">
                                    Program Abbreviation
                                </label>
                                <input
                                    type='text'
                                    placeholder="DBT"
                                    id="Abbreviation"
                                    name="Abbreviation"
                                    className="form-control border-light-grey bg-field placeholder-add-patient"
                                    value={formValues.Abbreviation}
                                    onChange={handleInputChange}
                                />
                                {errors.Abbreviation && <div className="text-danger">{errors.Abbreviation}</div>}
                            </div>

                            <div className="create-program-grid-col-span-md">
                                <label htmlFor="Type" className="form-label text-dark-grey fs-14 fw-normal">
                                    Program Type
                                </label>
                                <select
                                    name="Type"
                                    value={formValues.Type}
                                    onChange={handleInputChange}
                                    id="Type"
                                    className="form-select bg-field border-light-grey placeholder-add-patient"
                                >
                                    <option value="">Select Type</option>
                                    {programTypeOptions.map(option => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                                {errors.Type && <div className="text-danger">{errors.Type}</div>}
                            </div>

                            <div className="create-program-grid-col-span-md">
                                <label htmlFor="Channels" className="form-label text-dark-grey fs-14 fw-normal">
                                    Channel Selections
                                </label>
                                <Select
                                    options={options}
                                    isMulti
                                    inputId="Channels"
                                    value={formValues.Channels}
                                    onChange={handleChange}
                                    closeMenuOnSelect={false}
                                    hideSelectedOptions={false}
                                    components={{
                                        Option: CheckboxOption,
                                        DropdownIndicator: CustomDropdownIndicator
                                    }}
                                    styles={customStyles}
                                    className="placeholder-add-patient"
                                />
                                {errors.Channels && <div className="text-danger">{errors.Channels}</div>}
                            </div>

                            <div className="create-program-grid-col-span-lg">
                                <label htmlFor="Description" className="form-label text-dark-grey fs-14 fw-normal">
                                    Program Description
                                </label>
                                <textarea
                                    type='text'
                                    rows="4"
                                    id="Description"
                                    name="Description"
                                    className="form-control border-light-grey bg-field placeholder-add-patient"
                                    value={formValues.Description}
                                    onChange={handleInputChange}
                                ></textarea>
                                {errors.Description && <div className="text-danger">{errors.Description}</div>}
                            </div>

                            {/* Additional fields as per the original design, with validation */}
                            <div className="admin-create-program-form-field create-program-grid-col-span-md">
                                <label htmlFor="ConsentAssistant" className="form-label text-dark-grey fs-14 fw-normal">
                                    Consent Assistant
                                </label>
                                <input
                                    type='text'
                                    placeholder='Consent Assistant ID'
                                    id="ConsentAssistant"
                                    className="form-control border-light-grey bg-field"
                                    value={formValues.ConsentAssistant}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div className="admin-create-program-form-field create-program-grid-col-span-md">
                                <label htmlFor="ConversationAssistant" className="form-label text-dark-grey fs-14 fw-normal">
                                    Conversation Assistant
                                </label>
                                <input
                                    type='text'
                                    placeholder='Conversation Assistant ID'
                                    id="ConversationAssistant"
                                    className="form-control border-light-grey bg-field"
                                    value={formValues.ConversationAssistant}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div className="admin-create-program-form-field create-program-grid-col-span-md">
                                <label htmlFor="AnalysisAssistant" className="form-label text-dark-grey fs-14 fw-normal">
                                    Analysis Assistant
                                </label>
                                <input
                                    type='text'
                                    placeholder='Analysis Assistant ID'
                                    id="AnalysisAssistant"
                                    className="form-control border-light-grey bg-field"
                                    value={formValues.AnalysisAssistant}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div className="admin-create-program-form-field create-program-grid-col-span-md">
                                <label htmlFor="SourceNumber" className="form-label text-dark-grey fs-14 fw-normal">
                                    Source Number
                                </label>
                                <input
                                    type='text'
                                    placeholder='(123) 456-7890'
                                    id="SourceNumber"
                                    name="SourceNumber"
                                    className="form-control border-light-grey bg-field"
                                    value={formValues.SourceNumber}
                                    onChange={handleInputChange}
                                />
                                {errors.SourceNumber && <div className="text-danger">{errors.SourceNumber}</div>}
                            </div>

                            {/*//For SNS SourceNumber implementation*/}
                            {/*<div className="create-program-grid-col-span-md">*/}
                            {/*    <label htmlFor="SourceNumber" className="form-label text-dark-grey fs-14 fw-normal">*/}
                            {/*        Source Number*/}
                            {/*    </label>*/}
                            {/*    <select*/}
                            {/*        name="SourceNumber"*/}
                            {/*        value={formValues.SourceNumber}*/}
                            {/*        onChange={handleInputChange}*/}
                            {/*        id="SourceNumber"*/}
                            {/*        className="form-select bg-field border-light-grey form-select-placeholder"*/}
                            {/*    >*/}
                            {/*        <option value="">Select SourceNumber</option>*/}
                            {/*        {SNSPhoneNumbers.map((option, index) => (*/}
                            {/*            <option key={index} value={option.SourceNumber}>*/}
                            {/*                {option.SourceNumber}*/}
                            {/*            </option>*/}
                            {/*        ))}*/}
                            {/*    </select>*/}
                            {/*    {errors.SourceNumber && <div className="text-danger">{errors.SourceNumber}</div>}*/}
                            {/*</div>*/}

                            <div className="create-program-grid-col-span-md">
                                <label htmlFor="PrimaryObjective" className="form-label text-dark-grey fs-14 fw-normal">
                                    Primary Objectives
                                </label>
                                <input
                                    placeholder="Primary Objective"
                                    id="PrimaryObjective"
                                    name="PrimaryObjective"
                                    className="form-control border-light-grey bg-field placeholder-add-patient"
                                    value={formValues.PrimaryObjective}
                                    onChange={handleInputChange}
                                />
                                {errors.PrimaryObjective && <div className="text-danger">{errors.PrimaryObjective}</div>}
                            </div>

                            <div className="create-program-grid-col-span-md">
                                <label htmlFor="SecondaryObjective" className="form-label text-dark-grey fs-14 fw-normal">
                                    Secondary Objectives
                                </label>
                                <input
                                    placeholder="Secondary Objective"
                                    id="SecondaryObjective"
                                    name="SecondaryObjective"
                                    className="form-control border-light-grey bg-field placeholder-add-patient"
                                    value={formValues.SecondaryObjective}
                                    onChange={handleInputChange}
                                />
                                {errors.SecondaryObjective && <div className="text-danger">{errors.SecondaryObjective}</div>}
                            </div>

                            <div className="create-program-grid-col-span-md">
                                <label htmlFor="EligibilityCriteria" className="form-label text-dark-grey fs-14 fw-normal">
                                    Eligibility Criteria
                                </label>
                                <input
                                    type='text'
                                    placeholder="Eligibility Criteria"
                                    id="EligibilityCriteria"
                                    name="EligibilityCriteria"
                                    className="form-control border-light-grey bg-field placeholder-add-patient"
                                    value={formValues.EligibilityCriteria}
                                    onChange={handleInputChange}
                                />
                                {errors.EligibilityCriteria && <div className="text-danger">{errors.EligibilityCriteria}</div>}
                            </div>

                            <div className="create-program-grid-col-span-md">
                                <label htmlFor="ProgramNumber" className="form-label text-dark-grey fs-14 fw-normal">
                                    Program Number
                                </label>
                                <input
                                    placeholder="Program Number"
                                    name="ProgramNumber"
                                    id="ProgramNumber"
                                    className="form-control border-light-grey bg-field placeholder-add-patient"
                                    value={formValues.ProgramNumber}
                                    onChange={handleInputChange}
                                />
                                {errors.ProgramNumber && <div className="text-danger">{errors.ProgramNumber}</div>}
                            </div>

                        </div>

                        <div className="d-flex justify-content-end mt-4">
                            <button
                                type="submit"
                                onClick={(e) => handleUpdate(e)}
                                className="d-flex align-items-center gap-2 bg-primary border-0 py-2 px-3 rounded-2"
                            >
                                Save
                            </button>
                        </div>
                    </form>
                </section>
            </div>
        </AdminLayout>
    );
};

export default EditProgram;
