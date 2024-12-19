import React, {useRef, useState, useEffect, useContext} from "react";
import {Link, useNavigate} from "react-router-dom";
import AdminLayout from "../../../../layouts/dashboard/AdminLayout.jsx";

import profilePicture from '../../../../assets/images/profile-picture.png';
import editPencilIcon from '../../../../assets/icons/edit-pencil-icon.svg';
import AdminProviderService from "../service/AdminProviderService.js";
import {AuthContext} from "../../../../context/AuthContext.jsx";
import {useAdminDataStore} from "../../../../stores/AdminDataStore.js";
import Spinner from "../../../../components/Spinner.jsx";
import { CognitoIdentityProviderClient ,AdminUpdateUserAttributesCommand,GetUserCommand } from "@aws-sdk/client-cognito-identity-provider";
import config from "../../../../config.json"
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

function AdminSettings() {
    const {authToken} = useContext(AuthContext);
    const navigate = useNavigate()
    const { loginUser,setLoginUser ,setGlobalProfilePicture} = useAdminDataStore();
    const fileInputRef = useRef(null);
    const [cognitoUserName, setCognitoUserName] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const [formValues, setFormValues] = useState({
        AdministratorID: '',
        ProfilePicture: '',
        FirstName: '',
        LastName: '',
        DateOfBirth: '',
        EmailAddress: '',
        PhoneNumber: '',
        Password: '',
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
        const result = await AdminProviderService.fetchAdminInformation(authToken,loginUser.UserId);
        await fetchCognitoInformation();
        setIsLoading(false);
        if (result && result.AdministratorID) {
            setFormValues({
                AdministratorID: result.AdministratorID || '',
                ProfilePicture: result.ProfilePicture || '',
                FirstName: result.FirstName || '',
                LastName: result.LastName || '',
                DateOfBirth: result.DateOfBirth || '',
                EmailAddress: result.EmailAddress || '',
                PhoneNumber: result.PhoneNumber ? result.PhoneNumber : loginUser.PhoneNumber,
                Password: result.Password || '',
            });
        }
        else {
            setFormValues({
                AdministratorID: loginUser.UserId || '',
                EmailAddress: loginUser.Email || '',
                PhoneNumber: loginUser.PhoneNumber || '',

                ProfilePicture: '',
                FirstName: '',
                LastName: '',
                DateOfBirth: '',
                Password: '',
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
        // if (!formValues.Password.trim()) formErrors.Password = "Password is required";

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

                const result = await AdminProviderService.updateAdminInformation(authToken, formValues);
                setIsLoading(false);
                if (result.status === 200) {
                    await setGlobalProfilePicture(formValues.ProfilePicture);
                    navigate('/admin/profile-view');
                }
            } catch (error) {
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




    if (isLoading) {
        return <Spinner />
    }


    return (
        <AdminLayout headerTitle={"Profile"} isDashboard={false}>
            <div className='admin-profile rounded-3 border p-3'>
                <h2 className='section-heading-3d3d3d-18px fw-bold mb-4'>Personal Information</h2>
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
                        <h1 className='text-dark fw-normal fs-6'>{formValues.FirstName + ' ' + formValues.LastName}</h1>
                    </div>
                </div>

                {/*form*/}
                <div>
                    <form onSubmit={handleSubmit}>
                        <div className='row'>
                            <div className='col-md-6'>
                                <label htmlFor='FirstName'
                                       className='text-dark detail-text fw-normal pb-1'>First Name</label>
                                <input
                                    type='text'
                                    id='FirstName'
                                    name='FirstName'
                                    value={formValues.FirstName}
                                    onChange={handleChange}
                                    className="form-control form-control placeholder-add-patient bg-field py-2 mb-3"
                                    placeholder='First Name'
                                />
                                {errors.FirstName && <div className="text-danger">{errors.FirstName}</div>}
                            </div>
                            <div className='col-md-6'>
                                <label htmlFor='LastName'
                                       className='text-dark detail-text fw-normal pb-1'>Last Name</label>
                                <input
                                    type='text'
                                    id='LastName'
                                    name='LastName'
                                    value={formValues.LastName}
                                    onChange={handleChange}
                                    className="form-control form-control placeholder-add-patient bg-field py-2 mb-3"
                                    placeholder='Last Name'
                                />
                                {errors.LastName && <div className="text-danger">{errors.LastName}</div>}
                            </div>
                            <div className='col-md-6'>
                                <label htmlFor='EmailAddress'
                                       className="text-dark detail-text fw-normal pb-1">Email</label>
                                <input type="email"
                                       className="form-control form-control-lg field-placeholder-password  bg-field mb-3"
                                       id="EmailAddress"
                                       disabled
                                       name="EmailAddress"
                                       value={formValues.EmailAddress}
                                       onChange={handleChange}
                                       placeholder='Email'
                                />
                                {errors.EmailAddress && <div className="text-danger">{errors.EmailAddress}</div>}
                            </div>
                            <div className='col-md-6'>
                                <label htmlFor='PhoneNumber'
                                       className='text-dark detail-text fw-normal pb-1'>Phone Number</label>
                                <input
                                    type='text'
                                    id='PhoneNumber'
                                    name='PhoneNumber'
                                    value={formValues.PhoneNumber}
                                    onChange={handleChange}
                                    placeholder='(XXX) XXX-XXXX'
                                    className="form-control form-control placeholder-add-patient scroll-hide bg-field py-2 mb-2"
                                />
                                {errors.PhoneNumber && <div className="text-danger">{errors.PhoneNumber}</div>}
                            </div>
                            <div className='col-12'>
                                <div className='text-end'>
                                    <button type="submit"
                                          className='btn btn-primary detail-text text-color-0a263f'>Save Changes
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    )
}

export default AdminSettings;
