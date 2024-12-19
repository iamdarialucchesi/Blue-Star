import React, {useContext, useState} from "react";
import AdminLayout from "../../../layouts/dashboard/AdminLayout.jsx";
import { useNavigate } from "react-router-dom";
import OrganizationAndPracticesService from "./service/OrganizationAndPracticesService.js";
import {AuthContext} from "../../../context/AuthContext.jsx";
import {useOrganizationDataStore} from "../../../stores/OrganizationDataStore.js";
import {useAdminDataStore} from "../../../stores/AdminDataStore.js";
import config from "../../../config.json"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { CognitoIdentityProviderClient, AdminUpdateUserAttributesCommand,SignUpCommand, AdminConfirmSignUpCommand,AdminAddUserToGroupCommand } from "@aws-sdk/client-cognito-identity-provider";
// const clientAccessKey = process.env.REACT_APP_CLIENT_ACCESS_KEY_ID;
// const clientAccessSecretKey = process.env.REACT_APP_CLIENT_SECRET_ACCESS_KEY_ID;
const clientAccessKey = config.REACT_APP_CLIENT_ACCESS_KEY_ID;
const clientAccessSecretKey = config.REACT_APP_CLIENT_SECRET_ACCESS_KEY_ID;
export const cognitoClient = new CognitoIdentityProviderClient({
    region: "us-east-2",
    credentials: {
        accessKeyId: clientAccessKey,
        secretAccessKey: clientAccessSecretKey
    }
});
const OrganizationAddUser = () => {
    const navigate = useNavigate();
    const {authToken} = useContext(AuthContext);
    const { loginUser } = useAdminDataStore();
    const { organizationData,organizationPracticeNames,organizationRoles, practiceRoles } = useOrganizationDataStore();
    // Step 1: Form State
    const [formValues, setFormValues] = useState({
        OrganizationUserID:"",
        OrganizationID: "",
        FirstName: "",
        LastName: "",
        DateOfBirth: "",
        Gender: "",
        EmailAddress: "",
        Password: "",
        PhoneNumber: "",
        Practice: "",
        OrganizationRole: "",
        PracticeRole: "",
        Address: "",
        City: "",
        State: "",
        ZipCode: "",
        IsDeleted: "",
        CreatedAt: ""
    });

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

    // Step 2: Validation Function
    const validateForm = () => {
        const currentDate = new Date().toISOString();
        formValues.CreatedAt = currentDate;
        formValues.IsDeleted = 0;
        let formErrors = {};
        if (!formValues.FirstName) formErrors.FirstName = "First Name is required";
        if (!formValues.LastName) formErrors.LastName = "Last Name is required";
        // if (!formValues.DateOfBirth) formErrors.DateOfBirth = "Date of Birth is required";
        if (!formValues.Gender) formErrors.Gender = "Gender is required";
        if (!formValues.EmailAddress) formErrors.EmailAddress = "Email Address is required";
        if (!formValues.Password) formErrors.Password = "Password is required";
        if (!formValues.PhoneNumber) {
            formErrors.PhoneNumber = 'Phone Number is required.';
        } else {
            const formattedPhoneNumber = validatePhoneNumber(formValues.PhoneNumber);
            if (!formattedPhoneNumber) {
                formErrors.PhoneNumber = 'Enter a valid 10-digit Phone Number in the format (XXX) XXX-XXXX.';
            }else {
                formValues.PhoneNumber = formattedPhoneNumber;
            }
        }
        // if (!formValues.Practice) formErrors.Practice = "Practice is required";
        // if (!formValues.OrganizationRole) formErrors.OrganizationRole = "Organization Role is required";
        // if (!formValues.PracticeRole) formErrors.PracticeRole = "Practice Role is required";
        if (!formValues.Address) formErrors.Address = "Address is required";
        if (!formValues.City) formErrors.City = "City is required";
        if (!formValues.State) formErrors.State = "State is required";
        if (!formValues.ZipCode) formErrors.ZipCode = "Zip Code is required";

        setErrors(formErrors);

        return Object.keys(formErrors).length === 0;
    };

    // const OrganizationRoles = [
    //     { value: 'Administrator', label: 'Administrator' },
    //     { value: 'Super Administrator', label: 'Super Administrator' },
    // ];
    // const PracticeRoles = [
    //     { value: 'Providers', label: 'Providers' },
    //     { value: 'Clinical Staff', label: 'Clinical Staff' },
    //     { value: 'Admin Staff', label: 'Admin Staff' },
    // ];
    const genderOptions = [
        { value: 'Male', label: 'Male' },
        { value: 'Female', label: 'Female' },
    ];

    // Step 3: Handle Submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            try {
                formValues.OrganizationID = organizationData.OrganizationID;
                const userId = await signUpUser();
                if (userId) {
                    formValues.OrganizationUserID = userId;
                    const result = await OrganizationAndPracticesService.addOrganizationUser(authToken, formValues, loginUser);
                    if (result.status === 200) {
                        navigate('/organizations/organization-detail');
                    }
                }
            } catch (error) {
                console.error('Update failed:', error);
            }
        }
    };


    const signUpUser = async () => {
        // Add +1 to the phone number just before submission, without modifying the input field value
        const phoneNumberWithCountryCode = `+1${formValues.PhoneNumber.replace(/\D/g, '')}`;
        const signUpParams = {
            ClientId: config.clientId,
            Username: formValues.EmailAddress,
            Password: formValues.Password,
            UserAttributes: [
                { Name: "email", Value: formValues.EmailAddress },
                { Name: "phone_number", Value: phoneNumberWithCountryCode }
            ]
        };

        try {
            const command = new SignUpCommand(signUpParams);
            const response = await cognitoClient.send(command);

            await confirmUser(formValues.EmailAddress);

            await addUserToGroup(formValues.EmailAddress, 'Provider'); // Replace 'YourGroupName'

            return response.UserSub; // Extract user_id

        } catch (err) {
            if (err.name === 'UsernameExistsException'){
                let err = {};
                err.EmailAddress = "User already exists with this email";
                setErrors(err);
            }
            console.log(err);
        }
    };

    const confirmUser = async (username) => {
        const confirmSignUpParams = {
            UserPoolId: config.userPoolId,
            Username: username
        };

        try {
            const command = new AdminConfirmSignUpCommand(confirmSignUpParams);
            await cognitoClient.send(command);
            await updateUserAttributes(username);

        } catch (err) {
            console.error("Error confirming user:", err);
        }
    };

    const updateUserAttributes = async (username) => {
        const updateParams = {
            UserPoolId: config.userPoolId,
            Username: username,
            UserAttributes: [
                { Name: "email_verified", Value: "true" },
                { Name: "phone_number_verified", Value: "true" }
            ]
        };

        try {
            const updateCommand = new AdminUpdateUserAttributesCommand(updateParams);
            await cognitoClient.send(updateCommand);
        } catch (err) {
            console.error("Error updating user attributes:", err);
            // Handle specific errors
            if (err.name === 'NotAuthorizedException') {
                console.error("Authorization error: Ensure the attribute is allowed to be updated.");
            }
        }
    };

    const addUserToGroup = async (username, groupName) => {
        const addGroupParams = {
            UserPoolId: config.userPoolId,
            Username: username,
            GroupName: groupName
        };

        try {
            const addGroupCommand = new AdminAddUserToGroupCommand(addGroupParams);
            await cognitoClient.send(addGroupCommand);
            console.log(`User ${username} added to group ${groupName}`);
        } catch (err) {
            console.error("Error adding user to group:", err);
        }
    };

    const validatePassword = (password) => {
        const passwordCriteria = [
            { test: /[a-z]/, message: 'Password must contain a lower case letter.' },
            { test: /[A-Z]/, message: 'Password must contain an upper case letter.' },
            { test: /\d/, message: 'Password must contain a number.' },
            { test: /.{8,}/, message: 'Password must contain at least 8 characters.' },
            { test: /[!@#$%^&*(),.?":{}|<> ]/, message: 'Password must contain a special character or a space.' },
            { test: /^[^\s].*[^\s]$/, message: 'Password must not contain a leading or trailing space.' },
        ];

        const passwordErrors = passwordCriteria
            .filter(criteria => !criteria.test.test(password))
            .map(criteria => criteria.message);

        return passwordErrors.length > 0 ? passwordErrors : null;
    };

    // Step 4: Handle Input Changes
    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormValues((prevValues) => ({
            ...prevValues,
            [id]: value,
        }));

        // Validate password if the changed field is 'Password'
        if (id === 'Password') {
            const passwordErrors = validatePassword(value);
            if (passwordErrors) {
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    Password: passwordErrors.join(' '), // Join multiple error messages into one string
                }));
            } else {
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    Password: null, // Clear error if valid
                }));
            }
        }
    };

    const [showPassword, setShowPassword] = useState({
        Password: false
    });

    const togglePasswordVisibility = (field) => {
        setShowPassword({ ...showPassword, [field]: !showPassword[field] });
    };

    // const handleInputChange = (e) => {
    //     const { id, value } = e.target;
    //     setFormValues({
    //         ...formValues,
    //         [id]: value
    //     });
    // };

    return (
        <AdminLayout headerTitle="Add User" isDashboard={true}>
            <div>
                <section className="border border-light-grey rounded-3 px-3 pt-3 pb-4">
                    <form onSubmit={handleSubmit}>
                        <div className="organization-add-user-form column-gap-3 row-gap-4">
                            <div className="organization-add-user-form-field">
                                <label htmlFor="FirstName" className="form-label text-black fs-14 fw-normal">First Name</label>
                                <input
                                    placeholder="First Name"
                                    id="FirstName"
                                    className="form-control placeholder-add-patient border-light-grey bg-field"
                                    value={formValues.FirstName}
                                    onChange={handleInputChange}
                                />
                                {errors.FirstName && <div className="text-danger fs-12">{errors.FirstName}</div>}
                            </div>

                            <div className="organization-add-user-form-field">
                                <label htmlFor="LastName" className="form-label text-black fs-14 fw-normal">Last Name</label>
                                <input
                                    placeholder="Last Name"
                                    id="LastName"
                                    className="form-control placeholder-add-patient border-light-grey bg-field"
                                    value={formValues.LastName}
                                    onChange={handleInputChange}
                                />
                                {errors.LastName && <div className="text-danger fs-12">{errors.LastName}</div>}
                            </div>

                            {/*<div className="organization-add-user-form-field organization-add-user-form-date position-relative">*/}
                            {/*    <label htmlFor="DateOfBirth" className="form-label text-black fs-14 fw-normal">Date of Birth</label>*/}
                            {/*    <input*/}
                            {/*        placeholder="DOB"*/}
                            {/*        id="DateOfBirth"*/}
                            {/*        type="date"*/}
                            {/*        className="form-control placeholder-add-patient border-light-grey bg-field"*/}
                            {/*        value={formValues.DateOfBirth}*/}
                            {/*        onChange={handleInputChange}*/}
                            {/*    />*/}
                            {/*    {errors.DateOfBirth && <div className="text-danger fs-12">{errors.DateOfBirth}</div>}*/}
                            {/*</div>*/}

                            <div className="organization-add-user-form-field">
                                <label htmlFor="Gender" className="form-label text-black fs-14 fw-normal">Gender</label>
                                <select
                                    id="Gender"
                                    name="Gender"
                                    className="form-select placeholder-add-patient bg-field border-light-grey"
                                    value={formValues.Gender}
                                    onChange={handleInputChange}
                                >
                                    <option value="">Select Gender</option>
                                    {genderOptions.map(option => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                                {errors.Gender && <div className="text-danger fs-12">{errors.Gender}</div>}
                            </div>

                            <div className="grid-three-md-one-cols grid-row-col-span-full gap-3">
                                <div className="organization-add-user-form-field">
                                    <label htmlFor="EmailAddress" className="form-label text-black fs-14 fw-normal">Email
                                        Address</label>
                                    <input
                                        placeholder="Email"
                                        id="EmailAddress"
                                        type="email"
                                        className="form-control placeholder-add-patient border-light-grey bg-field"
                                        value={formValues.EmailAddress}
                                        onChange={handleInputChange}
                                    />
                                    {errors.EmailAddress &&
                                        <div className="text-danger fs-12">{errors.EmailAddress}</div>}
                                </div>

                                <div className="organization-add-user-form-field">
                                    <label htmlFor="Password"
                                           className="form-label text-black fs-14 fw-normal">Password</label>
                                    <div className="input-group">
                                        <input
                                            placeholder="Password"
                                            id="Password"
                                            name="Password"
                                            type={showPassword.Password ? "text" : "password"}
                                            className={`form-control border-light-grey bg-field placeholder-add-patient ${errors.Password ? 'is-invalid' : ''}`}
                                            value={formValues.Password}
                                            onChange={handleInputChange}
                                        />
                                        <span className="input-group-text"
                                              onClick={() => togglePasswordVisibility('Password')}>
                                        <FontAwesomeIcon icon={showPassword.Password ? faEyeSlash : faEye}/>
                            </span>
                                        {errors.Password &&
                                            <div className="text-danger fs-12">{errors.Password}</div>}
                                    </div>
                                </div>

                                <div className="organization-add-user-form-field">
                                    <label htmlFor="PhoneNumber" className="form-label text-black fs-14 fw-normal">Phone
                                        Number</label>
                                    <input
                                        placeholder='(123) 456-7890'
                                        id="PhoneNumber"
                                        className="form-control placeholder-add-patient border-light-grey bg-field"
                                        value={formValues.PhoneNumber}
                                        onChange={handleInputChange}
                                    />
                                    {errors.PhoneNumber &&
                                        <div className="text-danger fs-12">{errors.PhoneNumber}</div>}
                                </div>
                            </div>
                            <div className="grid-three-md-one-cols grid-row-col-span-full gap-3">
                                <div className="organization-add-user-form-field">
                                    <label htmlFor="Practice"
                                           className="form-label text-black fs-14 fw-normal">Practice</label>
                                    <select
                                        id="Practice"
                                        name="Practice"
                                        className="form-select placeholder-add-patient bg-field border-light-grey"
                                        value={formValues.Practice}
                                        onChange={handleInputChange}
                                    >
                                        <option value="">Select Practice</option>
                                        {organizationPracticeNames.map(option => (
                                            <option key={option} value={option}>
                                                {option}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.Practice && <div className="text-danger fs-12">{errors.Practice}</div>}
                                </div>

                                <div className="organization-add-user-form-field">
                                    <label htmlFor="OrganizationRole"
                                           className="form-label text-black fs-14 fw-normal">Organization
                                        Role</label>
                                    <select
                                        id="OrganizationRole"
                                        name="OrganizationRole"
                                        className="form-select placeholder-add-patient bg-field border-light-grey"
                                        value={formValues.OrganizationRole}
                                        onChange={handleInputChange}
                                    >
                                        <option value="">Select Role</option>
                                        {organizationRoles.map(option => (
                                            <option key={option.OrganizationRoleID} value={option.OrganizationRoleName}>
                                                {option.OrganizationRoleName}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.OrganizationRole &&
                                        <div className="text-danger fs-12">{errors.OrganizationRole}</div>}
                                </div>
                                <div className="organization-add-user-form-field">
                                    <label htmlFor="PracticeRole" className="form-label text-black fs-14 fw-normal">Practice
                                        Role</label>
                                    <select
                                        id="PracticeRole"
                                        name="PracticeRole"
                                        className="form-select placeholder-add-patient bg-field border-light-grey"
                                        value={formValues.PracticeRole}
                                        onChange={handleInputChange}
                                    >
                                        <option value="">Select Role</option>
                                        {practiceRoles.map(option => (
                                            <option key={option.PracticeRoleID} value={option.PracticeRoleName}>
                                                {option.PracticeRoleName}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.PracticeRole &&
                                        <div className="text-danger fs-12">{errors.PracticeRole}</div>}
                                </div>
                            </div>

                            <div className="organization-add-user-form-last-row grid-row-col-span-full gap-3">
                                <div className="organization-add-user-form-field">
                                    <label htmlFor="Address" className="form-label text-black fs-14 fw-normal">Address</label>
                                    <input
                                        placeholder="15208 West 119th Street, Olahe, Kansas 666062"
                                        id="Address"
                                        className="form-control placeholder-add-patient border-light-grey bg-field"
                                        value={formValues.Address}
                                        onChange={handleInputChange}
                                    />
                                    {errors.Address && <div className="text-danger fs-12">{errors.Address}</div>}
                                </div>

                                <div className="organization-add-user-form-field">
                                    <label htmlFor="City" className="form-label text-black fs-14 fw-normal">City</label>
                                    <input
                                        placeholder="Olahe"
                                        id="City"
                                        className="form-control placeholder-add-patient border-light-grey bg-field"
                                        value={formValues.City}
                                        onChange={handleInputChange}
                                    />
                                    {errors.City && <div className="text-danger fs-12">{errors.City}</div>}
                                </div>

                                <div className="organization-add-user-form-field">
                                    <label htmlFor="State" className="form-label text-black fs-14 fw-normal">State</label>
                                    <input
                                        placeholder="Kansas"
                                        id="State"
                                        className="form-control placeholder-add-patient border-light-grey bg-field"
                                        value={formValues.State}
                                        onChange={handleInputChange}
                                    />
                                    {errors.State && <div className="text-danger fs-12">{errors.State}</div>}
                                </div>

                                <div className="organization-add-user-form-field">
                                    <label htmlFor="ZipCode" className="form-label text-black fs-14 fw-normal">Zip Code</label>
                                    <input
                                        placeholder="666062"
                                        id="ZipCode"
                                        className="form-control placeholder-add-patient border-light-grey bg-field"
                                        value={formValues.ZipCode}
                                        onChange={handleInputChange}
                                    />
                                    {errors.ZipCode && <div className="text-danger fs-12">{errors.ZipCode}</div>}
                                </div>
                            </div>

                        </div>

                        <div className="d-flex justify-content-end mt-4">
                            <button
                                type="submit"
                                className="d-flex align-items-center gap-2 bg-parrot-green text-decoration-none border-0 py-2 px-3 rounded-2 text-dark-blue"
                            >
                                Add User
                            </button>
                        </div>
                    </form>
                </section>
            </div>
        </AdminLayout>
    );
}

export default OrganizationAddUser;
