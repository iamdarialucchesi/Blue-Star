import React, {useContext, useState} from "react";
import ProviderLayout from "../../../../layouts/provider/ProviderLayout.jsx";

import PlusBlackIcon from "../../../../assets/images/icons/black-plus.svg";
import {Link, useNavigate} from "react-router-dom";
import {AuthContext} from "../../../../context/AuthContext.jsx";
import {usePatientsDataStore} from "../../../../stores/PatientsDataStore.js";
import Select, {components} from "react-select";
import DropDownArrowGreyIcon from "../../../../assets/images/icons/dropdown-arrow-down-grey.svg";
import {useAdminDataStore} from "../../../../stores/AdminDataStore.js";
import OrganizationAndPracticesService from "../../organization-and-practices/service/OrganizationAndPracticesService.js";
import {useProviderDataStore} from "../../../../stores/ProviderDataStore.js";
import Spinner from "../../../../components/Spinner.jsx";
import ProviderPatientsService from "../service/ProviderPatientsService.js";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import DustbinRedIcon from "../../../../assets/icons/trash.svg";
import PatientsService from "../../patients/service/PatientsService.js";

function ProviderAddPatient() {
    const navigate = useNavigate();
    const { providerOrganizationID, providerWhiteLabels } = useProviderDataStore();
    const { programNames,organizationsData,organizationPractices } = usePatientsDataStore();
    const { loginUser } = useAdminDataStore();
    const {authToken} = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState(false);
    const [formValues, setFormValues] = useState({
        FirstName: '',
        LastName: '',
        Program: [],
        Gender: '',
        OrganizationID: '',
        PracticeID: '',
        BloodGroup: '',
        EHR_ID: '',
        DateOfBirth: '',
        PhoneNumber: '',
        HomePhone:'',
        EmailAddress: '',
        CreatedAt: '',
        UpdatedAt: '',
        Address: {
            Street: '',
            City: '',
            State: '',
            ZipCode: ''
        },
        Insurance: {
            Provider: '',
            PolicyNumber: '',
            GroupNumber: ''
        },
        EmergencyContact: {
            Name: '',
            Relationship: '',
            PhoneNumber: ''
        },
        PrimaryCarePhysician: {
            Name: '',
            PhoneNumber: ''
        },
        HealthHistory: {
            PreExistingConditions: '',
            FamilyMedicalHistory: ''
        },
        SurgeryHistory: [{
            Procedure: '',
            Date: ''
        }],
        CurrentMedications: [{
            Name: '',
            Dosage: '',
            StartDate: '',
            EndDate: ''
        }],
        Allergies: [{
            Name: '',
            Effect: ''
        }]
    });

    const {ButtonColor} = providerWhiteLabels;

    const programOptions = Array.isArray(programNames) && programNames.length > 0
        ? programNames.map((program) => ({
            value: program.ProgramName,
            label: program.ProgramName
        }))
        : [
            { value: 'Cardiology', label: 'Cardiology' },
            { value: 'Diabetes', label: 'Diabetes' },
            { value: 'ENT', label: 'ENT' },
        ];

    const genderOptions = [
        { value: 'Male', label: 'Male' },
        { value: 'Female', label: 'Female' },
        { value: 'Other', label: 'Other' },
    ];
    const bloodGroupOptions = [
        { value: 'A+', label: 'A+' },
        { value: 'A-', label: 'A-' },
        { value: 'B+', label: 'B+' },
        { value: 'B-', label: 'B-' },
        { value: 'AB+', label: 'AB+' },
        { value: 'AB-', label: 'AB-' },
        { value: 'O+', label: 'O+' },
        { value: 'O-', label: 'O-' },
        {value: 'Unknown', label: 'Unknown'},
    ];

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

    const [errors, setErrors] = useState({});
    const [formErrors, setFormErrors] = useState({});

    const validate = () => {
        const currentDate = new Date().toISOString();
        formValues.CreatedAt = currentDate;
        formValues.UpdatedAt = currentDate;
        formValues.OrganizationID = providerOrganizationID;
        let errors = {};
        const newErrors = {};
        // Regex to check for only alphabetical characters (and allow spaces if needed)
        const namePattern = /^[A-Za-z\s]+$/;
        if (!formValues.FirstName) {
            newErrors.FirstName = 'First Name is required.';
        } else {
            if (typeof formValues.FirstName !== 'string') {
                newErrors.FirstName = 'First Name must be a string.';
            } else if (!namePattern.test(formValues.FirstName)) {
                newErrors.FirstName = 'First Name can only contain letters.';
            } else if (formValues.FirstName.length < 2 || formValues.FirstName.length > 30) {
                newErrors.FirstName = 'First Name must be between 2 and 50 characters.';
            }
        }

        if (!formValues.LastName) {
            newErrors.LastName = 'Last Name is required.';
        } else {
            if (typeof formValues.LastName !== 'string') {
                newErrors.LastName = 'Last Name must be a string.';
            } else if (!namePattern.test(formValues.LastName)) {
                newErrors.LastName = 'Last Name can only contain letters.';
            } else if (formValues.LastName.length < 2 || formValues.LastName.length > 30) {
                newErrors.LastName = 'Last Name must be between 2 and 50 characters.';
            }
        }
        if (!formValues.Gender) newErrors.Gender = 'Gender is required.';
        if (!formValues.OrganizationID) newErrors.OrganizationID = 'Organization is required.';
        if (!formValues.PracticeID) newErrors.PracticeID = 'Practice is required.';
        if (!formValues.BloodGroup) newErrors.BloodGroup = 'Blood Group is required.';

        if (!formValues.EHR_ID) {
            newErrors.EHR_ID = 'EHR ID is required.';
        } else if (formValues.EHR_ID.length > 15) {
            newErrors.EHR_ID = 'EHR ID must be 15 characters or less.';
        } else if (!/^[a-zA-Z0-9]+$/.test(formValues.EHR_ID)) {
            newErrors.EHR_ID = 'EHR ID can only contain alphanumeric characters.';
        }

        //Validate DateOfBirth
        // if (!formValues.DateOfBirth) {
        //     newErrors.DateOfBirth = "Date of birth is required.";
        // } else {
        //     const dateOfBirth = new Date(formValues.DateOfBirth);
        //     const today = new Date();
        //
        //     // Check if the input is a valid ISO 8601 date string
        //     const isoDatePattern = /^\d{4}-\d{2}-\d{2}$/;
        //
        //     if (!isoDatePattern.test(formValues.DateOfBirth)) {
        //         newErrors.DateOfBirth = "Date of birth must be in ISO 8601 format (YYYY-MM-DD).";
        //     } else if (dateOfBirth > today) {
        //         newErrors.DateOfBirth = "Date of birth cannot be in the future.";
        //     }
        // }

        if (formValues.Program.length === 0) newErrors.Program = 'At least one Program must be selected.';

        if (!formValues.PhoneNumber) {
            newErrors.PhoneNumber = 'Cell Phone is required.';
        } else {
            const formattedPhoneNumber = validatePhoneNumber(formValues.PhoneNumber);
            if (!formattedPhoneNumber) {
                newErrors.PhoneNumber = 'Enter a valid 10-digit Cell Phone in the format (XXX) XXX-XXXX.';
            } else {
                formValues.PhoneNumber = formattedPhoneNumber;
            }
        }

        if (!formValues.HomePhone) {
            newErrors.HomePhone = 'Home Phone is required.';
        } else {
            const formattedPhoneNumber = validatePhoneNumber(formValues.HomePhone);
            if (!formattedPhoneNumber) {
                newErrors.HomePhone = 'Enter a valid 10-digit Home Phone in the format (XXX) XXX-XXXX.';
            } else {
                formValues.HomePhone = formattedPhoneNumber;
            }
        }

        // const emailPattern = /\S+@\S+\.\S+/;
        const emailPattern = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
        if (formValues.EmailAddress) {
            if (!emailPattern.test(formValues.EmailAddress)) {
                newErrors.EmailAddress = 'Valid Email Address is required.';
            }
        }
        if (!formValues.Address.Street) newErrors.Address_Street = 'Street is required.';
        // Validate City
        if (!formValues.Address.City) {
            newErrors.Address_City = 'City is required.';
        } else {
            if (typeof formValues.Address.City !== 'string') {
                newErrors.Address_City = 'City must be a string.';
            } else {
                const cityPattern = /^[a-zA-Z\s]+$/;
                if (!cityPattern.test(formValues.Address.City)) {
                    newErrors.Address_City = 'City must contain only alphabetical characters.';
                } else {
                    formValues.Address.City = formValues.Address.City.toLowerCase()
                        .split(' ')
                        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                        .join(' ');
                }
            }
        }

        // Validate State
        if (!formValues.Address.State) {
            newErrors.Address_State = 'State is required.';
        } else {
            const titleCaseState = formValues.Address.State.charAt(0).toUpperCase() + formValues.Address.State.slice(1).toLowerCase();
            formValues.Address.State = titleCaseState;
        }

        if (!formValues.Address.ZipCode) {
            newErrors.Address_ZipCode = 'Zip Code is required.';
        } else if (!/^\d{5}$/.test(formValues.Address.ZipCode)) {
            newErrors.Address_ZipCode = 'Zip Code must be exactly 5 digits.';
        }

        if (!formValues.Insurance.Provider) newErrors.Insurance_Provider = 'Insurance Provider is required.';
        if (!formValues.Insurance.PolicyNumber) newErrors.Insurance_PolicyNumber = 'Insurance Policy Number is required.';
        // if (!formValues.Insurance.GroupNumber) newErrors.Insurance_GroupNumber = 'Insurance Group Number is required.';
        // if (!formValues.EmergencyContact.Name) newErrors.EmergencyContact_Name = 'Emergency Contact Name is required.';
        // if (!formValues.EmergencyContact.Relationship) newErrors.EmergencyContact_Relationship = 'Emergency Contact Relationship is required.';
        //
        // if (!formValues.EmergencyContact.PhoneNumber) {
        //     newErrors.EmergencyContact_PhoneNumber = 'Emergency Contact Cell Phone is required.';
        // } else {
        //     const formattedPhoneNumber = validatePhoneNumber(formValues.EmergencyContact.PhoneNumber);
        //     if (!formattedPhoneNumber) {
        //         newErrors.EmergencyContact_PhoneNumber = 'Enter a valid 10-digit Cell Phone in the format (XXX) XXX-XXXX.';
        //     }else {
        //         formValues.EmergencyContact.PhoneNumber = formattedPhoneNumber;
        //     }
        // }



        if (!formValues.PrimaryCarePhysician.Name) newErrors.PrimaryCarePhysician_Name = 'Primary Care Physician Name is required.';
        if (!formValues.PrimaryCarePhysician.PhoneNumber) {
            newErrors.PrimaryCarePhysician_PhoneNumber = 'Primary Care Physician Phone Number is required.';
        } else {
            const formattedPhoneNumber = validatePhoneNumber(formValues.PrimaryCarePhysician.PhoneNumber);
            if (!formattedPhoneNumber) {
                newErrors.PrimaryCarePhysician_PhoneNumber = 'Enter a valid 10-digit Phone Number in the format (XXX) XXX-XXXX.';
            }else {
                formValues.PrimaryCarePhysician.PhoneNumber = formattedPhoneNumber;
            }
        }

        if (!formValues.HealthHistory.PreExistingConditions) newErrors.HealthHistory_PreExistingConditions = 'Pre Existing Conditions is required.';
        if (!formValues.HealthHistory.FamilyMedicalHistory) newErrors.HealthHistory_FamilyMedicalHistory = 'Family Medical History is required.';
        // Add additional validation checks as needed
        setErrors(newErrors);

        // formValues.SurgeryHistory.forEach((procedure, index) => {
        //     if (!procedure.Procedure) {
        //         errors[`SurgeryHistory-${index}-procedure`] = "Procedure is required";
        //     }
        //     const procedureDate = new Date(procedure.Date);
        //     const today = new Date();
        //     if (!procedure.Date) {
        //         errors[`SurgeryHistory-${index}-date`] = "Date is required";
        //     }
        //     else if (procedureDate > today) {
        //         errors[`SurgeryHistory-${index}-date`] = "Procedure date cannot be in the future.";
        //     }
        // });

        // formValues.CurrentMedications.forEach((medication, index) => {
        //     if (!medication.Name || typeof medication.Name !== 'string' || medication.Name.trim() === '') {
        //         errors[`CurrentMedications-${index}-name`] = "Medication name is required.";
        //     }
        //     const dosageValue = medication.Dosage.match(/\d+/);
        //
        //     // If there's no numeric value, mark it as invalid
        //     if (!dosageValue) {
        //         errors[`CurrentMedications-${index}-dosage`] = 'Dosage is required';
        //     }
        //
        //     if (!medication.StartDate) {
        //         errors[`CurrentMedications-${index}-startDate`] = "Start date is required";
        //     }
        //     if (!medication.EndDate) {
        //         errors[`CurrentMedications-${index}-endDate`] = "End date is required";
        //     }
        //
        //     // Ensure Start Date is not after End Date
        //     if (medication.StartDate && medication.EndDate) {
        //         const startDate = new Date(medication.StartDate);
        //         const endDate = new Date(medication.EndDate);
        //
        //         if (startDate > endDate) {
        //             errors[`CurrentMedications-${index}-startDate`] = "Start date cannot be later than end date.";
        //             errors[`CurrentMedications-${index}-endDate`] = "End date must be after start date.";
        //         }
        //     }
        //
        // });

        // formValues.Allergies.forEach((allergy, index) => {
        //     if (!allergy.Name) {
        //         errors[`Allergies-${index}-name`] = "Allergy name is required";
        //     }
        //     if (!allergy.Effect) {
        //         errors[`Allergies-${index}-effect`] = "Effect is required";
        //     }
        // });

        setFormErrors(errors);
        return Object.keys(newErrors).length === 0 && Object.keys(errors).length === 0;

        // return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormValues({ ...formValues, [id]: value });
        // setFormValues((prevValues) => ({ ...prevValues, [id]: value }));
    };

    const handleChangeProgram = (selected) => {
        setFormValues({ ...formValues, Program: selected });

    };

    const handleAddressChange = (e) => {
        const { id, value } = e.target;
        setFormValues((prevValues) => ({
            ...prevValues,
            Address: { ...prevValues.Address, [id]: value },
        }));
    };

    const handleInsuranceChange = (e) => {
        const { id, value } = e.target;
        setFormValues((prevValues) => ({
            ...prevValues,
            Insurance: { ...prevValues.Insurance, [id]: value },
        }));
    };

    const handleEmergencyContactChange = (e) => {
        const { id, value } = e.target;
        setFormValues((prevValues) => ({
            ...prevValues,
            EmergencyContact: { ...prevValues.EmergencyContact, [id]: value },
        }));
    };

    const handlePrimaryCarePhysicianChange = (e) => {
        const { id, value } = e.target;
        setFormValues((prevValues) => ({
            ...prevValues,
            PrimaryCarePhysician: { ...prevValues.PrimaryCarePhysician, [id]: value },
        }));
    };

    const handleHealthHistoryChange = (e) => {
        const { id, value } = e.target;
        setFormValues((prevValues) => ({
            ...prevValues,
            HealthHistory: { ...prevValues.HealthHistory, [id]: value },
        }));
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        if (validate()) {
            try {
                setIsLoading(true);
                const result = await ProviderPatientsService.createPatient(authToken,formValues,loginUser);
                if (result.status === 200) {
                    navigate('/provider/patients');
                }
                setIsLoading(false);
            } catch (error) {
                setIsLoading(false);
                // Check if we have a 409 conflict error
                if (error.response && error.response.status === 409) {
                    const errorMessage = error.response.data;

                    // Determine the field to apply the error to based on the message content
                    if (errorMessage.includes('EHR_ID Conflict')) {
                        console.log("EHR_ID Conflict");
                        setErrors(prevErrors => ({
                            ...prevErrors,
                            EHR_ID: 'This EHR_ID is already in use for the organization.'
                        }));
                    } else if (errorMessage.includes('Email Conflict')) {
                        setErrors(prevErrors => ({
                            ...prevErrors,
                            EmailAddress: 'This EmailAddress is already in use.'
                        }));
                    }
                } else {
                    console.error('Update failed:', error);
                }
            }
        }
    };


    // Handle adding more fields in Surgery History
    const handleAddMoreSurgery = (e) => {
        e.preventDefault();
        setFormValues(prevValues => ({
            ...prevValues,
            SurgeryHistory: [...prevValues.SurgeryHistory, { Procedure: "", Date: "" }]
        }));
    };
    const handleSurgeryChange = (index, e) => {
        const { name, value } = e.target;
        const updatedSurgeryHistory = formValues.SurgeryHistory.map((procedure, i) =>
            i === index ? { ...procedure, [name]: value } : procedure
        );
        setFormValues(prevValues => ({ ...prevValues, SurgeryHistory: updatedSurgeryHistory }));
    };

    const handleRemoveSurgery = (e, index) => {
        e.preventDefault();
        const updatedSurgeryHistory = formValues.SurgeryHistory.filter((_, i) => i !== index);
        setFormValues({
            ...formValues,
            SurgeryHistory: updatedSurgeryHistory,
        });
    };

    // Handle adding more fields in Current Medications
    const handleAddMoreMedications = (e) => {
        e.preventDefault();
        setFormValues(prevValues => ({
            ...prevValues,
            CurrentMedications: [...prevValues.CurrentMedications, { Name: "", Dosage: "",StartDate: "", EndDate: "" }]
        }));
    };
    const handleMedicationsChange = (index, e) => {
        const { name, value } = e.target;
        const updatedSurgeryHistory = formValues.CurrentMedications.map((procedure, i) =>
            i === index ? { ...procedure, [name]: value } : procedure
        );
        setFormValues(prevValues => ({ ...prevValues, CurrentMedications: updatedSurgeryHistory }));
    };

    const handleRemoveMedication = (e, index) => {
        e.preventDefault();
        const updatedMedicationHistory = formValues.CurrentMedications.filter((_, i) => i !== index);
        setFormValues({
            ...formValues,
            CurrentMedications: updatedMedicationHistory,
        });
    };

    const handleDosageChange = (index, amount, unit) => {
        const updatedMedications = [...formValues.CurrentMedications];
        updatedMedications[index].Dosage = `${amount}${unit}`; // Combine numeric and unit parts

        setFormValues({
            ...formValues,
            CurrentMedications: updatedMedications
        });
    };

    // Handle adding more fields in Allergies
    const handleAddMoreAllergies = (e) => {
        // if (allergies.length < 5) {
        //     setAllergies([...allergies, { name: '', effect: '' }]);
        // }
        e.preventDefault();
        setFormValues(prevValues => ({
            ...prevValues,
            Allergies: [...prevValues.Allergies, { Name: "", Effect: ""}]
        }));
    };
    const handleAllergiesChange = (index, e) => {
        const { name, value } = e.target;
        const updatedAllergies = formValues.Allergies.map((allergy, i) =>
            i === index ? { ...allergy, [name]: value } : allergy
        );
        setFormValues(prevValues => ({ ...prevValues, Allergies: updatedAllergies }));
    };

    const handleRemoveAllergy = (e, index) => {
        e.preventDefault();
        const updatedAllergies = formValues.Allergies.filter((_, i) => i !== index);
        setFormValues({
            ...formValues,
            Allergies: updatedAllergies,
        });
    };

    const customStyles = {
        menu: (base) => ({
            ...base,
            padding: "25px 15px",
        }),
        option: (base) => ({
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
            alignItems: "center",           // Center the content vertically
            margin: "2px 7px 2px 0",
            minWidth: 'fit-content',        // Adjust to fit content without wrapping
            whiteSpace: 'nowrap',           // Prevent the text from wrapping
        }),
        multiValueLabel: (base) => ({
            ...base,
            color: '#4A4A4A',
            fontSize: 12,
            fontWeight: 400,
            padding: "3px 10px",            // Adjust padding as needed
        }),
        multiValueRemove: (base) => ({
            ...base,
            display: 'none !important',
        }),
        indicatorSeparator: () => ({
            display: 'none !important',
        }),
        control: (base) => ({
            ...base,
            display: 'flex',
            flexWrap: 'nowrap',              // Prevent items from wrapping
            overflowX: 'auto',               // Allow horizontal scrolling
            width: '100%',
            backgroundColor: '#FAFAFA',
            border: "1px solid #0A263F24",
            '&:focus': {
                border: '1px solid #0A263F24',
            },
            boxShadow: "none",
            padding: '2px 0',               // Add vertical padding if needed
        }),
        valueContainer: (base) => ({
            ...base,
            display: 'flex',
            flexWrap: 'nowrap',
            overflowX: 'auto',
            padding: '2px 8px',              // Adjust padding
            minHeight: '38px',
        }),
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

    return <ProviderLayout headerTitle={"Add Patient"} isDashboard={true}>
        <div className='add-patient-content pt-1'>
            <form>
                <div className="accordion" id="personal-information">
                    <div className="accordion-item rounded-3">
                        <h2 className="accordion-header rounded-3">
                            <button className="accordion-button rounded-3 section-heading-3d3d3d-18px fw-bold"
                                    type="button"
                                    data-bs-toggle="collapse"
                                    data-bs-target="#personal-details">
                                Personal Information
                            </button>
                        </h2>
                        <div id="personal-details" className="accordion-collapse collapse show"
                             data-bs-parent="#personal-information">
                            <div className="accordion-body py-0">
                                <div className="row px-2">
                                    <div className="col-md-6 col-lg-3 px-1 pb-3">
                                        <label htmlFor='FirstName' className='section-heading-3d3d3d-14px fw-normal pb-1'>First Name</label>
                                        <input
                                            id='FirstName'
                                            type='text'
                                            placeholder='Austin'
                                            className="form-control form-control placeholder-add-patient bg-field py-2"
                                            value={formValues.FirstName}
                                            onChange={handleChange}
                                        />
                                        {errors.FirstName && <small className="text-danger">{errors.FirstName}</small>}
                                    </div>

                                    <div className="col-md-6 col-lg-3 px-1 pb-3">
                                        <label htmlFor='LastName' className='section-heading-3d3d3d-14px fw-normal pb-1'>Last Name</label>
                                        <input type='text' id='LastName' name='LastName' placeholder='Mathews'
                                               className="form-control form-control placeholder-add-patient bg-field py-2"
                                               value={formValues.LastName} onChange={handleChange}/>
                                        {errors.LastName && <small className="text-danger">{errors.LastName}</small>}
                                    </div>

                                    <div className="col-md-6 col-lg-3 px-1 pb-3">
                                        <label htmlFor='Program'
                                               className="form-label pb-1 m-0 fw-normal section-heading-3d3d3d-14px">Program</label>
                                        <Select
                                            options={programOptions}
                                            isMulti
                                            inputId="Program"
                                            value={formValues.Program}
                                            onChange={handleChangeProgram}
                                            closeMenuOnSelect={false}
                                            hideSelectedOptions={false}
                                            components={{
                                                Option: CheckboxOption,
                                                DropdownIndicator: CustomDropdownIndicator,
                                            }}
                                            styles={customStyles}
                                        />
                                        {errors.Program && <small className="text-danger">{errors.Program}</small>}
                                    </div>

                                    <div className="col-md-6 col-lg-3 px-1 pb-3">
                                        <label htmlFor='Gender'
                                               className="form-label pb-1 m-0 fw-normal section-heading-3d3d3d-14px">Gender</label>
                                        <select
                                            name="Gender"
                                            value={formValues.Gender}
                                            onChange={handleChange}
                                            className="form-select form-select-lg form-select-placeholder bg-field"
                                            id='Gender'
                                        >
                                            <option value="">Select Gender</option>
                                            {genderOptions.map(option => (
                                                <option key={option.value} value={option.value}>
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.Gender && <small className="text-danger">{errors.Gender}</small>}
                                    </div>
                                </div>

                                <div className="row px-2">
                                    <div className=" col-md-6 col-lg-3 px-1 pb-3">
                                        <label htmlFor='OrganizationID'
                                               className="form-label pb-1 m-0 fw-normal section-heading-3d3d3d-14px">
                                            Organization</label>

                                        <input
                                            id='OrganizationID'
                                            name='OrganizationID'
                                            className="form-control form-control placeholder-add-patient bg-field py-2"
                                            value={organizationsData.OfficialName}
                                            readOnly
                                        />
                                        {errors.OrganizationID && <small className="text-danger">{errors.OrganizationID}</small>}
                                    </div>
                                    <div className=" col-md-6 col-lg-3 px-1 pb-3">
                                        <label htmlFor='PracticeID'
                                               className="form-label pb-1 m-0 fw-normal section-heading-3d3d3d-14px">Organization Practice</label>
                                        <select
                                            name="PracticeID"
                                            value={formValues.PracticeID}
                                            onChange={handleChange}
                                            className="form-select form-select-lg form-select-placeholder bg-field"
                                            id='PracticeID'
                                        >
                                            <option value="">Select Practice</option>
                                            {organizationPractices.map(option => (
                                                <option key={option.OrganizationPracticeID} value={option.OrganizationPracticeID}>
                                                    {option.PracticeName}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.PracticeID && <small className="text-danger">{errors.PracticeID}</small>}
                                    </div>
                                    <div className=" col-md-6 col-lg-3 px-1">
                                        <label htmlFor='BloodGroup'
                                               className="form-label pb-1 m-0 fw-normal section-heading-3d3d3d-14px">Blood
                                            Group</label>
                                        <select
                                            name="BloodGroup"
                                            value={formValues.BloodGroup}
                                            onChange={handleChange}
                                            className="form-select form-select-lg form-select-placeholder bg-field"
                                            id='BloodGroup'
                                        >
                                            <option value="">Select Group</option>
                                            {bloodGroupOptions.map(option => (
                                                <option key={option.value} value={option.value}>
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.BloodGroup && <small className="text-danger">{errors.BloodGroup}</small>}
                                    </div>

                                    <div className=" col-md-6 col-lg-3 px-1">
                                        <label htmlFor='EHR_ID'
                                               className="form-label pb-1 m-0 fw-normal section-heading-3d3d3d-14px">EHR ID</label>
                                        <input
                                            id='EHR_ID'
                                            type='text'
                                            placeholder='EHR_ID'
                                            className="form-control form-control placeholder-add-patient bg-field py-2"
                                            value={formValues.EHR_ID}
                                            onChange={handleChange}
                                        />
                                        {errors.EHR_ID && <small className="text-danger">{errors.EHR_ID}</small>}
                                    </div>

                                </div>

                                <div className="row px-2">
                                    <div className="col-md-6 col-lg-3 px-1 pb-3">
                                        <label htmlFor='HomePhone'
                                               className='section-heading-3d3d3d-14px fw-normal pb-1'>Home Phone</label>
                                        <input
                                            type='text'
                                            placeholder='(123) 456-7890'
                                            id='HomePhone'
                                            value={formValues.HomePhone}
                                            onChange={handleChange}
                                            className="form-control form-control placeholder-add-patient scroll-hide bg-field py-2"
                                        />
                                        {errors.HomePhone &&
                                            <small className='text-danger'>{errors.HomePhone}</small>}
                                    </div>

                                    <div className="col-md-6 col-lg-3 px-1 pb-3">
                                        <label htmlFor='PhoneNumber'
                                               className='section-heading-3d3d3d-14px fw-normal pb-1'>Cell Phone</label>
                                        <input
                                            type='text'
                                            placeholder='(123) 456-7890'
                                            id='PhoneNumber'
                                            value={formValues.PhoneNumber}
                                            onChange={handleChange}
                                            className="form-control form-control placeholder-add-patient scroll-hide bg-field py-2"
                                        />
                                        {errors.PhoneNumber &&
                                            <small className='text-danger'>{errors.PhoneNumber}</small>}
                                    </div>

                                    <div className="col-md-6 col-lg-3 px-1">
                                        <label htmlFor='EmailAddress'
                                               className='section-heading-3d3d3d-14px fw-normal pb-1'>Email Address
                                            (optional)</label>
                                        <input
                                            type='email'
                                            id='EmailAddress'
                                            placeholder='austinmathews12345@gmail.com'
                                            value={formValues.EmailAddress}
                                            onChange={handleChange}
                                            className="form-control form-control placeholder-add-patient scroll-hide bg-field py-2"/>
                                        {errors.EmailAddress &&
                                            <small className='text-danger'>{errors.EmailAddress}</small>}
                                    </div>

                                </div>

                                <div className="row px-2">
                                    <div className="col-md-6 col-lg-4 px-1 pb-3">
                                        <label htmlFor='Street'
                                               className="form-label pb-1 m-0 fw-normal section-heading-3d3d3d-14px">Address</label>
                                        <input type='text'
                                               id="Street"
                                               placeholder="15208 West 119th Street, Olahe, Kansas 666062"
                                               className="form-control placeholder-add-patient bg-field py-2"
                                               value={formValues.Address.Street}
                                               onChange={handleAddressChange}
                                        />
                                        {errors.Address_Street && <small className='text-danger'>{errors.Address_Street}</small>}
                                    </div>

                                    <div className="col-md-6 col-lg-3 px-1 pb-3">
                                        <label htmlFor='City'
                                               className='section-heading-3d3d3d-14px fw-normal pb-1'>City</label>
                                        <input
                                            type='text'
                                            id='City'
                                            value={formValues.Address.City}
                                            onChange={handleAddressChange}
                                            placeholder='Olahe'
                                            className="form-control form-control placeholder-add-patient bg-field py-2"
                                        />
                                        {errors.Address_City && <small className='text-danger'>{errors.Address_City}</small>}
                                    </div>

                                    <div className="col-md-6 col-lg-3 px-1 pb-3">
                                        <label htmlFor='State'
                                               className='section-heading-3d3d3d-14px fw-normal pb-1'>State</label>
                                        <input
                                            type='text'
                                            id='State'
                                            value={formValues.Address.State}
                                            onChange={handleAddressChange}
                                            placeholder='Kansas'
                                            className="form-control form-control placeholder-add-patient bg-field py-2"
                                        />
                                        {errors.Address_State && <small className='text-danger'>{errors.Address_State}</small>}
                                    </div>

                                    <div className="col-md-6 col-lg-2 px-1 pb-3">
                                        <label htmlFor='ZipCode'
                                               className='section-heading-3d3d3d-14px fw-normal pb-1'>Zip Code</label>
                                        <input
                                            type='number'
                                            id='ZipCode'
                                            placeholder='66606'
                                            value={formValues.Address.ZipCode}
                                            onChange={handleAddressChange}
                                            className="form-control form-control placeholder-add-patient scroll-hide bg-field py-2"
                                        />
                                        {errors.Address_ZipCode && <small className='text-danger'>{errors.Address_ZipCode}</small>}
                                    </div>

                                </div>

                                <div className="row  px-2">
                                    <div className="col-md-6 col-lg-5 px-1 pb-3">
                                        <label htmlFor='Provider'
                                               className="form-label pb-1 m-0 fw-normal section-heading-3d3d3d-14px">Insurance
                                            Provider</label>
                                        <input type='text'
                                               id="Provider"
                                               placeholder="Zee Insurance Company"
                                               className="form-control placeholder-add-patient bg-field py-2"
                                               value={formValues.Insurance.Provider}
                                               onChange={handleInsuranceChange}
                                        />
                                        {errors.Insurance_Provider && <small className='text-danger'>{errors.Insurance_Provider}</small>}
                                    </div>

                                    <div className="col-md-6 col-lg-3 px-1 pb-3">
                                        <label htmlFor='PolicyNumber'
                                               className='section-heading-3d3d3d-14px fw-normal pb-1'>Policy
                                            Number</label>
                                        <input
                                            type='number'
                                            id='PolicyNumber'
                                            value={formValues.Insurance.PolicyNumber}
                                            onChange={handleInsuranceChange}
                                            placeholder='123456'
                                            className="form-control form-control placeholder-add-patient scroll-hide bg-field py-2"
                                        />
                                        {errors.Insurance_PolicyNumber && <small className='text-danger'>{errors.Insurance_PolicyNumber}</small>}
                                    </div>

                                    <div className="col-lg-4 px-1 pb-3">
                                        <label htmlFor='GroupNumber'
                                               className='section-heading-3d3d3d-14px fw-normal pb-1'>Group
                                            Number (optional)</label>
                                        <input
                                            value={formValues.Insurance.GroupNumber}
                                            onChange={handleInsuranceChange}
                                            type='number'
                                            id='GroupNumber'
                                            placeholder='1234'
                                            className="form-control form-control placeholder-add-patient scroll-hide bg-field py-2"
                                        />
                                        {errors.Insurance_GroupNumber && <small className='text-danger'>{errors.Insurance_GroupNumber}</small>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="accordion mt-4" id="emergency-contact">
                    <div className="accordion-item rounded-3">
                        <h2 className="accordion-header rounded-3">
                            <button className="accordion-button rounded-3 fw-normal section-heading-3d3d3d-18px fw-bold"
                                    type="button"
                                    data-bs-toggle="collapse"
                                    data-bs-target="#emergency-info">
                                Emergency Contact
                            </button>
                        </h2>
                        <div id="emergency-info" className="accordion-collapse collapse show"
                             data-bs-parent="#emergency-contact">
                            <div className="accordion-body py-0">
                                <div className="row px-2">
                                    <div className="col-md-6 col-lg-5 px-1 pb-3">
                                        <label htmlFor='Name'
                                               className='section-heading-3d3d3d-14px fw-normal pb-1'>Name</label>
                                        <input
                                            value={formValues.EmergencyContact.Name}
                                            onChange={handleEmergencyContactChange}
                                            type='text'
                                            id='Name'
                                            placeholder='Zella Isabella'
                                            className="form-control form-control placeholder-add-patient bg-field py-2"
                                        />
                                        {errors.EmergencyContact_Name &&
                                            <small className='text-danger'>{errors.EmergencyContact_Name}</small>}
                                    </div>

                                    <div className="col-md-6 col-lg-3 px-1 pb-3">
                                        <label htmlFor='Relationship'
                                               className='section-heading-3d3d3d-14px fw-normal pb-1'>Relationship</label>
                                        <input
                                            type='text'
                                            id='Relationship'
                                            value={formValues.EmergencyContact.Relationship}
                                            onChange={handleEmergencyContactChange}
                                            placeholder='Daughter'
                                            className="form-control form-control placeholder-add-patient bg-field py-2"
                                        />
                                        {errors.EmergencyContact_Relationship && <small
                                            className='text-danger'>{errors.EmergencyContact_Relationship}</small>}
                                    </div>

                                    <div className="col-lg-4 px-1 pb-3">
                                        <label htmlFor='PhoneNumber'
                                               className='section-heading-3d3d3d-14px fw-normal pb-1'>Phone
                                            Number</label>
                                        <input
                                            type='text'
                                            id='PhoneNumber'
                                            value={formValues.EmergencyContact.PhoneNumber}
                                            onChange={handleEmergencyContactChange}
                                            placeholder='(123) 456-7890'
                                            className="form-control form-control placeholder-add-patient scroll-hide bg-field py-2"
                                        />
                                        {errors.EmergencyContact_PhoneNumber && <small
                                            className='text-danger'>{errors.EmergencyContact_PhoneNumber}</small>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="accordion mt-4" id="primary-care-physician">
                    <div className="accordion-item rounded-3">
                        <h2 className="accordion-header rounded-3">
                            <button className="accordion-button rounded-3 section-heading-3d3d3d-18px fw-bold"
                                    type="button"
                                    data-bs-toggle="collapse"
                                    data-bs-target="#primary-care-physician-info">
                                Primary Care Physician
                            </button>
                        </h2>
                        <div id="primary-care-physician-info" className="accordion-collapse collapse show"
                             data-bs-parent="#primary-care-physician">
                            <div className="accordion-body py-0">
                                <div className="row px-2">
                                    <div className="col-md-6 col-lg-7 px-1 pb-3">
                                        <label htmlFor='Name'
                                               className='section-heading-3d3d3d-14px fw-normal pb-1'>Name</label>
                                        <input
                                            type='text'
                                            id='Name'
                                            placeholder='Linda Laurence'
                                            className="form-control form-control placeholder-add-patient bg-field py-2"
                                            value={formValues.PrimaryCarePhysician.Name}
                                            onChange={handlePrimaryCarePhysicianChange}
                                        />
                                        {errors.PrimaryCarePhysician_Name && <small className='text-danger'>{errors.PrimaryCarePhysician_Name}</small>}
                                    </div>

                                    <div className="col-md-6 col-lg-5 px-1 pb-3">
                                        <label htmlFor='PhoneNumber'
                                               className='section-heading-3d3d3d-14px fw-normal pb-1'>Phone
                                            Number</label>
                                        <input
                                            value={formValues.PrimaryCarePhysician.PhoneNumber}
                                            onChange={handlePrimaryCarePhysicianChange}
                                            type='text'
                                            id='PhoneNumber'
                                            placeholder='(123) 456-7890'
                                            className="form-control form-control placeholder-add-patient scroll-hide bg-field py-2"
                                        />
                                        {errors.PrimaryCarePhysician_PhoneNumber && <small className='text-danger'>{errors.PrimaryCarePhysician_PhoneNumber}</small>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="accordion mt-4" id="health-history">
                    <div className="accordion-item rounded-3">
                        <h2 className="accordion-header rounded-3">
                            <button className="accordion-button rounded-3 section-heading-3d3d3d-18px fw-bold"
                                    type="button"
                                    data-bs-toggle="collapse"
                                    data-bs-target="#health-history-info">
                                Health History
                            </button>
                        </h2>
                        <div id="health-history-info" className="accordion-collapse collapse show"
                             data-bs-parent="#health-history">
                            <div className="accordion-body py-0">
                                <div className="row px-2">
                                    <div className="col-12 px-1 pb-3">
                                        <label htmlFor='PreExistingConditions'
                                               className='section-heading-3d3d3d-14px fw-normal pb-1'>Pre-existing
                                            conditions</label>
                                        <input
                                            value={formValues.HealthHistory.PreExistingConditions}
                                            onChange={handleHealthHistoryChange}
                                            type='text'
                                            id='PreExistingConditions'
                                            placeholder='Hypertension (I10)'
                                            className="form-control form-control placeholder-add-patient bg-field py-2"
                                        />
                                        {errors.HealthHistory_PreExistingConditions && <small className='text-danger'>{errors.HealthHistory_PreExistingConditions}</small>}
                                    </div>

                                    <div className="col-12 px-1 pb-3">
                                        <label htmlFor='FamilyMedicalHistory'
                                               className='section-heading-3d3d3d-14px fw-normal pb-1'>Family Medical
                                            History</label>
                                        <input
                                            value={formValues.HealthHistory.FamilyMedicalHistory}
                                            onChange={handleHealthHistoryChange}
                                            type='text'
                                            id='FamilyMedicalHistory'
                                            placeholder='Depression, Schizophrenia'
                                            className="form-control form-control placeholder-add-patient bg-field py-2"
                                        />
                                        {errors.HealthHistory_FamilyMedicalHistory && <small className='text-danger'>{errors.HealthHistory_FamilyMedicalHistory}</small>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


                <div className="accordion mt-4" id="surgery-history">
                    <div className="accordion-item rounded-3">
                        <h2 className="accordion-header rounded-3">
                            <button
                                className="accordion-button rounded-3 section-heading-3d3d3d-18px fw-bold"
                                type="button"
                                data-bs-toggle="collapse"
                                data-bs-target="#surgery-history-info"
                            >
                                Surgery History (optional)
                            </button>
                        </h2>
                        <div
                            id="surgery-history-info"
                            className="accordion-collapse collapse show"
                            data-bs-parent="#surgery-history"
                        >
                            <div className="accordion-body py-0">
                                {formValues.SurgeryHistory.map((procedure, index) => (
                                    <div className="row px-2" key={index}>
                                        <div className="col-lg-6 px-1 pb-3">
                                            <label
                                                htmlFor={`procedure-${index}`}
                                                className="section-heading-3d3d3d-14px fw-normal pb-1"
                                            >
                                                Procedure {index + 1}
                                            </label>
                                            <input
                                                type="text"
                                                id={`procedure-${index}`}
                                                name="Procedure"
                                                value={procedure.Procedure}
                                                placeholder="Heart Transplant"
                                                className="form-control form-control placeholder-add-patient bg-field py-2"
                                                onChange={(e) => handleSurgeryChange(index, e)}
                                            />
                                            {formErrors[`SurgeryHistory-${index}-procedure`] && (
                                                <small
                                                    className='text-danger'>{formErrors[`SurgeryHistory-${index}-procedure`]}</small>
                                            )}
                                        </div>

                                        <div className="col-lg-6 px-1 pb-3">
                                            <div className="d-flex justify-content-between align-items-start gap-2">
                                                <div className="custom-width-90">
                                                    <label
                                                        htmlFor={`date-${index}`}
                                                        className="section-heading-3d3d3d-14px fw-normal pb-1"
                                                    >
                                                        Date
                                                    </label>
                                                    <div className="position-relative">
                                                        <input
                                                            type="date"
                                                            id={`date-${index}`}
                                                            name="Date"
                                                            value={procedure.Date}
                                                            className="form-control form-control placeholder-add-patient left-date bg-field py-2"
                                                            onChange={(e) => handleSurgeryChange(index, e)}
                                                        />
                                                        {formErrors[`SurgeryHistory-${index}-date`] && (
                                                            <small
                                                                className='text-danger'>{formErrors[`SurgeryHistory-${index}-date`]}</small>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="custom-width-10">
                                                    {/* Add a cross button to delete the row, except for the first row */}
                                                    {index > 0 && (
                                                        <button
                                                            onClick={(e) => handleRemoveSurgery(e, index)}
                                                            className="btn p-0 border-0">
                                                            <img src={DustbinRedIcon} alt="delete icon" width={38}/>
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <div className="row">
                                    <div className="col-12 text-end pb-3">
                                        {formValues.SurgeryHistory.length < 5 && (
                                            <button
                                                className="btn add-button detail-text px-3 py-1"
                                                onClick={(e) => handleAddMoreSurgery(e)}
                                            >
                                                Add More +
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


                <div className="accordion mt-4" id="current-medications">
                    <div className="accordion-item rounded-3">
                        <h2 className="accordion-header rounded-3">
                            <button
                                className="accordion-button rounded-3 section-heading-3d3d3d-18px fw-bold"
                                type="button"
                                data-bs-toggle="collapse"
                                data-bs-target="#current-medications-info"
                            >
                                Current Medications (optional)
                            </button>
                        </h2>
                        <div
                            id="current-medications-info"
                            className="accordion-collapse collapse show"
                            data-bs-parent="#current-medications"
                        >
                            <div className="accordion-body py-0">
                                {formValues.CurrentMedications.map((medication, index) => (
                                    <div className="row px-2" key={index}>
                                        <div className="col-md-6 col-lg-3 px-1 pb-3">
                                            <label
                                                htmlFor={`current-medication-name-${index}`}
                                                className="section-heading-3d3d3d-14px fw-normal pb-1"
                                            >
                                                Name
                                            </label>
                                            <input
                                                type="text"
                                                id={`current-medication-name-${index}`}
                                                name="Name"
                                                value={medication.Name}
                                                placeholder="Leflox"
                                                className="form-control form-control placeholder-add-patient bg-field py-2"
                                                onChange={(e) => handleMedicationsChange(index, e)}
                                            />
                                            {formErrors[`CurrentMedications-${index}-name`] && (
                                                <small
                                                    className='text-danger'>{formErrors[`CurrentMedications-${index}-name`]}</small>
                                            )}
                                        </div>

                                        <div className="col-md-6 col-lg-3 px-1 pb-3">
                                            <label
                                                htmlFor={`medication-dosage-${index}`}
                                                className="form-label pb-1 m-0 fw-normal section-heading-3d3d3d-14px"
                                            >
                                                Dosage
                                            </label>
                                            <div className="d-flex">
                                                {/* Extracting the numeric part of Dosage */}
                                                <input
                                                    type="number"
                                                    className="form-control me-2"
                                                    id={`medication-dosage-amount-${index}`}
                                                    placeholder="Enter dosage"
                                                    value={medication.Dosage.match(/\d+/) ? medication.Dosage.match(/\d+/)[0] : ''} // Extract numeric part
                                                    onChange={(e) => handleDosageChange(index, e.target.value, medication.Dosage.match(/[a-zA-Z]+/) || 'mg')} // Keep the unit part unchanged
                                                    required
                                                />

                                                {/* Extracting the unit part of Dosage */}
                                                <select
                                                    className="form-select"
                                                    id={`medication-dosage-unit-${index}`}
                                                    value={medication.Dosage.match(/[a-zA-Z]+/) ? medication.Dosage.match(/[a-zA-Z]+/)[0] : 'mg'} // Extract unit part
                                                    onChange={(e) => handleDosageChange(index, medication.Dosage.match(/\d+/) || '', e.target.value)} // Keep the numeric part unchanged
                                                >
                                                    <option value="mg">mg</option>
                                                    <option value="ml">ml</option>
                                                </select>
                                            </div>

                                            {formErrors[`CurrentMedications-${index}-dosage`] && (
                                                <small
                                                    className='text-danger'>{formErrors[`CurrentMedications-${index}-dosage`]}</small>
                                            )}
                                        </div>

                                        <div className="col-md-6 col-lg-3 px-1 pb-3">
                                            <label
                                                htmlFor={`medication-start-date-${index}`}
                                                className="section-heading-3d3d3d-14px fw-normal pb-1"
                                            >
                                                Start Date
                                            </label>
                                            <div className="position-relative">
                                                <input
                                                    type="date"
                                                    id={`medication-start-date-${index}`}
                                                    name="StartDate"
                                                    value={medication.StartDate}
                                                    className="form-control form-control placeholder-add-patient left-date bg-field py-2"
                                                    onChange={(e) => handleMedicationsChange(index, e)}
                                                />
                                                {formErrors[`CurrentMedications-${index}-startDate`] && (
                                                    <small
                                                        className='text-danger'>{formErrors[`CurrentMedications-${index}-startDate`]}</small>
                                                )}
                                            </div>
                                        </div>

                                        <div className="col-md-6 col-lg-3 px-1 pb-3">
                                            <div className="d-flex justify-content-between align-items-start gap-2">
                                                <div className="custom-width-90">

                                                    <label
                                                        htmlFor={`medication-end-date-${index}`}
                                                        className="section-heading-3d3d3d-14px fw-normal pb-1"
                                                    >
                                                        End Date
                                                    </label>
                                                    <div className="position-relative">
                                                        <input
                                                            type="date"
                                                            id={`medication-end-date-${index}`}
                                                            name="EndDate"
                                                            value={medication.EndDate}
                                                            className="form-control form-control placeholder-add-patient left-date bg-field py-2"
                                                            onChange={(e) => handleMedicationsChange(index, e)}
                                                        />
                                                        {formErrors[`CurrentMedications-${index}-endDate`] && (
                                                            <small
                                                                className='text-danger'>{formErrors[`CurrentMedications-${index}-endDate`]}</small>
                                                        )}
                                                    </div>
                                                </div>
                                                {/* Add a cross button to delete the row, except for the first row */}
                                                {index > 0 && (
                                                    <div
                                                        className="col-lg-1 d-flex align-items-center pb-3 custom-width-10"
                                                    >
                                                        <button
                                                            onClick={(e) => handleRemoveMedication(e, index)}
                                                            className="btn p-0 border-0">
                                                            <img src={DustbinRedIcon} alt="delete icon" width={38}/>
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <div className="row">
                                    <div className="col-12 text-end pb-3">
                                        {formValues.CurrentMedications.length < 5 && (
                                            <button
                                                className="btn add-button detail-text px-3 py-1"
                                                onClick={(e) => handleAddMoreMedications(e)}
                                            >
                                                Add More +
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="accordion mt-4" id="allergies">
                    <div className="accordion-item rounded-3">
                        <h2 className="accordion-header rounded-3">
                            <button
                                className="accordion-button rounded-3 section-heading-3d3d3d-18px fw-bold"
                                type="button"
                                data-bs-toggle="collapse"
                                data-bs-target="#allergies-info"
                            >
                                Allergies (optional)
                            </button>
                        </h2>
                        <div
                            id="allergies-info"
                            className="accordion-collapse collapse show"
                            data-bs-parent="#allergies"
                        >
                            <div className="accordion-body py-0">
                                {formValues.Allergies.map((allergy, index) => (
                                    <div className="row px-2" key={index}>
                                        <div className="col-lg-6 px-1 pb-3">
                                            <label
                                                htmlFor={`allergies-name-${index}`}
                                                className="section-heading-3d3d3d-14px fw-normal pb-1"
                                            >
                                                Name
                                            </label>
                                            <input
                                                type="text"
                                                id={`allergies-name-${index}`}
                                                name="Name"
                                                value={allergy.Name}
                                                placeholder="Peanuts"
                                                className="form-control form-control placeholder-add-patient bg-field py-2"
                                                onChange={(e) => handleAllergiesChange(index, e)}
                                            />
                                            {formErrors[`Allergies-${index}-name`] && (
                                                <small
                                                    className='text-danger'>{formErrors[`Allergies-${index}-name`]}</small>
                                            )}
                                        </div>

                                        <div className="col-lg-6 px-1 pb-3">
                                            <div className="d-flex justify-content-between align-items-start gap-2">
                                                <div className="custom-width-90">

                                                    <label
                                                        htmlFor={`allergies-effect-${index}`}
                                                        className="section-heading-3d3d3d-14px fw-normal pb-1"
                                                    >
                                                        Effect
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id={`allergies-effect-${index}`}
                                                        name="Effect"
                                                        value={allergy.Effect}
                                                        placeholder="Anaphylaxis"
                                                        className="form-control form-control placeholder-add-patient bg-field py-2"
                                                        onChange={(e) => handleAllergiesChange(index, e)}
                                                    />
                                                    {formErrors[`Allergies-${index}-effect`] && (
                                                        <small
                                                            className='text-danger'>{formErrors[`Allergies-${index}-effect`]}</small>
                                                    )}
                                                </div>

                                                {/* Add a cross button to delete the row, except for the first row */}
                                                {index > 0 && (
                                                    <div
                                                        className="col-lg-1 d-flex align-items-center pb-3 custom-width-10"
                                                    >
                                                        <button
                                                            onClick={(e) => handleRemoveAllergy(e, index)}
                                                            className="btn p-0 border-0">
                                                            <img src={DustbinRedIcon} alt="delete icon" width={38}/>
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <div className="row">
                                    <div className="col-12 text-end pb-3">
                                        {formValues.Allergies.length < 5 && (
                                            <button
                                                className="btn add-button detail-text px-3 py-1"
                                                onClick={(e) => handleAddMoreAllergies(e)}
                                            >
                                                Add More +
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-3 d-flex justify-content-between">
                    <Link to='/patients' className="btn add-button detail-text px-3 pt-1">Cancel</Link>
                    <button onClick={(e) => handleCreate(e)}
                            className={`btn px-3 detail-text d-flex align-items-center gap-2 rounded-3 ${!ButtonColor ? "text-primary" : ""}`}
                            style={{backgroundColor: ButtonColor ? ButtonColor : ""}}>Add
                        Patient
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none"
                             xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M5.16683 0.166016C5.29944 0.166016 5.42661 0.218694 5.52038 0.312462C5.61415 0.40623 5.66683 0.533407 5.66683 0.666016V4.49935H9.50016C9.63277 4.49935 9.75995 4.55203 9.85372 4.6458C9.94748 4.73956 10.0002 4.86674 10.0002 4.99935C10.0002 5.13196 9.94748 5.25913 9.85372 5.3529C9.75995 5.44667 9.63277 5.49935 9.50016 5.49935H5.66683V9.33268C5.66683 9.46529 5.61415 9.59247 5.52038 9.68624C5.42661 9.78 5.29944 9.83268 5.16683 9.83268C5.03422 9.83268 4.90704 9.78 4.81328 9.68624C4.71951 9.59247 4.66683 9.46529 4.66683 9.33268V5.49935H0.833496C0.700888 5.49935 0.573711 5.44667 0.479943 5.3529C0.386174 5.25913 0.333496 5.13196 0.333496 4.99935C0.333496 4.86674 0.386174 4.73956 0.479943 4.6458C0.573711 4.55203 0.700888 4.49935 0.833496 4.49935H4.66683V0.666016C4.66683 0.533407 4.71951 0.40623 4.81328 0.312462C4.90704 0.218694 5.03422 0.166016 5.16683 0.166016Z"
                                fill="#0A263F"/>
                        </svg>
                    </button>
                </div>
            </form>
        </div>
    </ProviderLayout>
}

export default ProviderAddPatient;
