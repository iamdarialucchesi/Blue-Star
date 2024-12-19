import React, {useContext, useEffect, useRef, useState} from "react";
import ProviderLayout from "../../../../layouts/provider/ProviderLayout.jsx";
import profilePicture from "../../../../assets/images/profile-picture.png";
import editPencilIcon from "../../../../assets/icons/edit-pencil-icon.svg";
import {useNavigate} from "react-router-dom";
import ProfileSettingsChangePasswordModal from "./partials/ProfileSettingsChangePasswordModal.jsx";
import {AuthContext} from "../../../../context/AuthContext.jsx";
import {useAdminDataStore} from "../../../../stores/AdminDataStore.js";
import AdminProviderService from "../service/AdminProviderService.js";
import Spinner from "../../../../components/Spinner.jsx";
import config from "../../../../config.json";
import { CognitoIdentityProviderClient ,AdminUpdateUserAttributesCommand,GetUserCommand } from "@aws-sdk/client-cognito-identity-provider";
import Cookies from "js-cookie";


const clientAccessKey = config.REACT_APP_CLIENT_ACCESS_KEY_ID;
const clientAccessSecretKey = config.REACT_APP_CLIENT_SECRET_ACCESS_KEY_ID;
export const cognitoClient = new CognitoIdentityProviderClient({
    region: "us-east-2",
    credentials: {
        accessKeyId: clientAccessKey,
        secretAccessKey: clientAccessSecretKey
    }
});

const ProfileSettingsEdit = () => {
    const {authToken} = useContext(AuthContext);
    const navigate = useNavigate()
    const { loginUser,setLoginUser,setGlobalProfilePicture } = useAdminDataStore();
    const [isLoading, setIsLoading] = useState(false);
    const [cognitoUserName, setCognitoUserName] = useState(null);
    const fileInputRef = useRef(null);


    const [formValues, setFormValues] = useState({
        OrganizationUserID: '',
        OrganizationID: '',
        ProfilePicture: '',
        FirstName: '',
        LastName: '',
        DateOfBirth: '',
        Gender: '',
        EmailAddress: '',
        PhoneNumber: '',
        Address: '',
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        fetchUserInformations();
    }, []);

    function handleInputType() {
        fileInputRef.current.click();
    }

    const fetchUserInformations = async () => {
        setIsLoading(true);
        const result = await AdminProviderService.fetchProviderInformation(authToken,loginUser.UserId);
        await fetchCognitoInformation();
        setIsLoading(false);
        if (result && result.OrganizationUserID) {
            setFormValues({
                OrganizationUserID: result.OrganizationUserID || '',
                OrganizationID: result.OrganizationID || '',
                ProfilePicture: result.ProfilePicture || '',
                FirstName: result.FirstName || '',
                LastName: result.LastName || '',
                DateOfBirth: result.DateOfBirth || '',
                Gender: result.Gender || '',
                EmailAddress: result.EmailAddress || '',
                PhoneNumber: result.PhoneNumber || '',
                Address: result.Address || '',

                //Other fields
                Password: result.Password || '',
                Practice: result.Practice || '',
                OrganizationRole: result.OrganizationRole || '',
                PracticeRole: result.PracticeRole || '',
                City: result.City || '',
                State: result.State || '',
                ZipCode: result.ZipCode || '',
                IsDeleted: result.IsDeleted || 0,
                CreatedAt: result.CreatedAt || '',
            });
        }
    }

    const fetchCognitoInformation = async () => {
        try {
            const token = await Cookies.get('AccessToken');
            const params = {
                AccessToken: token
            };
            const command = new GetUserCommand(params);
            const response = await cognitoClient.send(command);
            if (response && response.Username){
                await setCognitoUserName(response.Username);
            }
        } catch (error) {
            console.log(error);
        }
    }


    const genderOptions = [
        { value: 'Male', label: 'Male' },
        { value: 'Female', label: 'Female' },
    ];
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValues({
            ...formValues,
            [name]: value,
        });
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

    const validateForm = () => {
        let formErrors = {};
        if (!formValues.FirstName.trim()) formErrors.FirstName = "First Name is required";
        if (!formValues.LastName.trim()) formErrors.LastName = "Last Name is required";
        // if (!formValues.DateOfBirth) formErrors.DateOfBirth = "Date of Birth is required";
        if (!/\S+@\S+\.\S+/.test(formValues.EmailAddress)) {
            formErrors.EmailAddress = "Email Address is invalid";
        }
        if (!formValues.Gender.trim()) formErrors.Gender = "Gender is required";

        // if (!formValues.PhoneNumber) {
        //     formErrors.PhoneNumber = 'Phone Number is required.';
        // } else {
        //     const formattedPhoneNumber = validatePhoneNumber(formValues.PhoneNumber);
        //     if (!formattedPhoneNumber) {
        //         formErrors.PhoneNumber = 'Enter a valid 10-digit Phone Number in the format (XXX) XXX-XXXX.';
        //     }else {
        //         formValues.PhoneNumber = formattedPhoneNumber;
        //     }
        // }

        if (!formValues.Address.trim()) formErrors.Address = "Address is required";
        setErrors(formErrors);
        return Object.keys(formErrors).length === 0;
    };


    const updateUserAttributes = async (formValues) => {
        // Add the phone number with a country code before sending
        const phoneNumberWithCountryCode = `+1${formValues.PhoneNumber.replace(/\D/g, '')}`;

        const updateParams = {
            UserPoolId: config.userPoolId,
            Username: cognitoUserName,
            UserAttributes: [
                {Name: "email_verified", Value: "true"},
                {Name: "phone_number_verified", Value: "true"},
                {Name: "phone_number", Value: phoneNumberWithCountryCode},
            ]
        };

        try {
            const updateCommand = new AdminUpdateUserAttributesCommand(updateParams);
            await cognitoClient.send(updateCommand);

            // Update the phone number in Zustand
            setLoginUser({
                ...loginUser,
                PhoneNumber: formValues.PhoneNumber,
            });
        } catch (err) {
            console.error("Error updating user attributes:", err);
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            try {
                setIsLoading(true);
                // Check if the phone number has changed
                if (formValues.PhoneNumber !== loginUser.PhoneNumber) {
                    // Update PhoneNumber in AWS Cognito
                    await updateUserAttributes(formValues);
                }
                const result = await AdminProviderService.updateProviderInformation(authToken, formValues);

                setIsLoading(false);
                if (result.status === 200) {
                    await setGlobalProfilePicture(formValues.ProfilePicture);
                    navigate('/profile/settings/view');
                }
            } catch (error) {
                setIsLoading(false);
                console.error("Error updating admin information:", error);
                // Handle error
            }
        }
    };


    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            try {
                // Directly construct the S3 upload URL
                const bucketName = 'bsai-bucket-2';
                const keyName = `profile-pictures/${loginUser.UserId}/${file.name}`;
                const uploadUrl = `https://${bucketName}.s3.amazonaws.com/${keyName}`;

                const response = await fetch(uploadUrl, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': file.type
                    },
                    body: file,
                });
                ;
                if (response.ok) {
                    if (response.url){
                        setFormValues({
                            ...formValues,
                            ProfilePicture: response.url,
                        });
                    }else {
                        setFormValues({
                            ...formValues,
                            ProfilePicture: uploadUrl,
                        });
                    }
                } else {
                    const errorText = await response.text();
                    console.error('Error uploading file:', response.status, errorText);
                }
            } catch (error) {
                // Log error details
                console.error('Error uploading file:', error);
            }
        }
    }


    const handleProfileEditFormSubmission = (e) => {
        e.preventDefault()
        navigate("/profile/settings/view")
    }

    if (isLoading) {
        return <Spinner />
    }

    return (<ProviderLayout headerTitle="Edit Profile" isDashboard={false}>
        <div>

            <section className="admin-edit-program border border-light-grey rounded-3 px-3 py-3">
                <h5 className="mb-3 fw-bolder fs-19">Personal Information</h5>

                <div className='profile-image-name mb-4 d-flex align-items-center gap-3'>
                    <div>
                        <button className='position-relative btn p-0 border-0' onClick={() => handleInputType()}>
                            <img src={formValues.ProfilePicture || profilePicture} width={50} height={50} style={{ borderRadius: '50%',objectFit: 'cover'  }}   />
                            <img src={editPencilIcon} width={20}
                                 className="position-absolute profile-edit-icon-position"/>
                        </button>
                        <input type='file' className='form-control d-none' ref={fileInputRef} onChange={handleFileChange}/>
                    </div>
                    <div className='mt-2'>
                        <h1 className='text-dark fw-normal fs-6'>Dr. John Smith</h1>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="profile-settings-edit-form column-gap-3 row-gap-4">
                        <div>
                            <label htmlFor='FirstName'
                                   className="form-label text-near-black fs-14 fw-normal">First Name</label>
                            <input
                                type='text'
                                id='FirstName'
                                name='FirstName'
                                value={formValues.FirstName}
                                onChange={handleChange}
                                className="form-control border-light-grey bg-field py-2"
                                placeholder='First Name'
                            />
                            {errors.FirstName && <div className="text-danger">{errors.FirstName}</div>}
                        </div>

                        <div>
                            <label htmlFor="LastName"
                                   className="form-label text-near-black fs-14 fw-normal">Last Name</label>
                            <input
                                type='text'
                                id='LastName'
                                name='LastName'
                                value={formValues.LastName}
                                onChange={handleChange}
                                className="form-control border-light-grey bg-field py-2"
                                placeholder='Last Name'
                            />
                            {errors.LastName && <div className="text-danger">{errors.LastName}</div>}
                        </div>

                        {/*<div*/}
                        {/*    className="organization-add-user-form-date position-relative">*/}
                        {/*    <label htmlFor="DateOfBirth"*/}
                        {/*           className="form-label text-black fs-14 fw-normal">Date of Birth</label>*/}
                        {/*    <input type='date'*/}
                        {/*           id="DateOfBirth"*/}
                        {/*           name="DateOfBirth"*/}
                        {/*           placeholder="D0B"*/}
                        {/*           className="form-control border-light-grey bg-field py-2"*/}
                        {/*           onChange={handleChange}*/}
                        {/*           value={formValues.DateOfBirth}*/}
                        {/*    />*/}
                        {/*    {errors.DateOfBirth && <div className="text-danger">{errors.DateOfBirth}</div>}*/}
                        {/*</div>*/}

                        <div>
                            <label htmlFor="Gender"
                                   className="form-label text-dark-grey fs-14 fw-normal">Gender</label>
                            <select
                                id="Gender"
                                name="Gender"
                                className="form-select bg-field border-light-grey text-grey"
                                value={formValues.Gender}
                                onChange={handleChange}
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

                        <div>
                            <label htmlFor="EmailAddress"
                                   className="form-label text-near-black fs-14 fw-normal">Email Address</label>
                            <input type="email"
                                   className="form-control border-light-grey bg-field py-2"
                                   id="EmailAddress"
                                   disabled
                                   name="EmailAddress"
                                   value={formValues.EmailAddress}
                                   onChange={handleChange}
                                   placeholder='Email'
                            />
                            {errors.EmailAddress && <div className="text-danger">{errors.EmailAddress}</div>}
                        </div>

                        <div>
                            <label htmlFor="PhoneNumber"
                                   className="form-label text-near-black fs-14 fw-normal">Phone Number</label>
                            <input
                                type='text'
                                id='PhoneNumber'
                                name='PhoneNumber'
                                value={formValues.PhoneNumber}
                                onChange={handleChange}
                                placeholder='(XXX) XXX-XXXX'
                                className="form-control border-light-grey bg-field py-2"
                            />
                            {errors.PhoneNumber && <div className="text-danger">{errors.PhoneNumber}</div>}
                        </div>

                        <div className="admin-edit-form-last-row">
                            <label htmlFor="Address"
                                   className="form-label text-near-black fs-14 fw-normal">Address</label>
                            <input
                                type='text'
                                id='Address'
                                name='Address'
                                value={formValues.Address}
                                onChange={handleChange}
                                placeholder='Address'
                                className="form-control border-light-grey bg-field py-2"
                            />
                            {errors.Address && <div className="text-danger">{errors.Address}</div>}
                        </div>
                    </div>
                    <div className="mt-4 d-flex justify-content-end">
                        <button
                            // onClick={handleProfileEditFormSubmission}
                            type="submit"
                            className="d-flex align-items-center gap-2 btn btn-primary border-0 py-2 px-3 rounded-2 text-decoration-none">
                            <span className="fs-14 text-dark-blue">Save Changes</span>
                        </button>
                    </div>
                </form>
            </section>

            {/*<section className="admin-edit-program border border-light-grey rounded-3 px-3 py-3 mt-4">*/}
            {/*    <h5 className="mb-3 fw-bolder fs-19">Privacy and Security Settings</h5>*/}
            {/*    <form>*/}
            {/*        <div className="profile-settings-edit-form column-gap-3 row-gap-4">*/}
            {/*            <div>*/}
            {/*                <label htmlFor="profile-settings-edit-email-field"*/}
            {/*                       className="form-label text-near-black fs-14 fw-normal">Email</label>*/}
            {/*                <input placeholder="johnsmith@example.com" id="profile-settings-edit-email-field"*/}
            {/*                       className="form-control border-light-grey bg-field py-2"/>*/}
            {/*            </div>*/}

            {/*            <div>*/}
            {/*                <label htmlFor="profile-settings-edit-password-field"*/}
            {/*                       className="form-label text-near-black fs-14 fw-normal">Password</label>*/}
            {/*                <input type="password" placeholder="*******************"*/}
            {/*                       id="profile-settings-edit-password-field"*/}
            {/*                       className="form-control border-light-grey bg-field py-2"/>*/}
            {/*            </div>*/}
            {/*        </div>*/}
            {/*        <div className="mt-4 d-flex justify-content-end">*/}
            {/*            <button*/}
            {/*                onClick={() => navigate("/profile/settings/change-password")}*/}
            {/*                type="button"*/}
            {/*                // data-bs-toggle="modal"*/}
            {/*                // data-bs-target="#profile-settings-change-password-modal"*/}
            {/*                className="d-flex align-items-center gap-2 btn btn-primary border-0 py-2 px-3 rounded-2 text-decoration-none">*/}
            {/*                <span className="fs-14 text-dark-blue">Change Password</span>*/}
            {/*            </button>*/}
            {/*        </div>*/}

            {/*        /!*<ProfileSettingsChangePasswordModal />*!/*/}
            {/*    </form>*/}
            {/*</section>*/}
        </div>
        </ProviderLayout>
    )
}

export default ProfileSettingsEdit
