import AuthLayout from "../layouts/AuthLayout.jsx";
import {Link, useNavigate} from "react-router-dom";
import blackLogo from "../assets/images/black-logo.svg";
import React, {useContext, useState} from "react";
import Cookies from "js-cookie";
import {AuthContext} from "../context/AuthContext.jsx";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEye, faEyeSlash} from "@fortawesome/free-solid-svg-icons";

function ForgetPassword() {
    const navigate = useNavigate();
    const {forgotPassword, confirmForgotPassword} = useContext(AuthContext);
    const [step, setStep] = useState(1);

    const [showPassword, setShowPassword] = useState({
        newPassword: false,
        confirmNewPassword: false,
    });

    const togglePasswordVisibility = (field) => {
        setShowPassword({...showPassword, [field]: !showPassword[field]});
    };

    const [formValues, setFormValues] = useState({
        userPhoneNumber: '',
        newPassword: '',
        confirmNewPassword: '',
        verificationCode: ''
    });

    const [formErrors, setFormErrors] = useState({
        userPhoneNumber: '',
        newPassword: '',
        confirmNewPassword: '',
        verificationCode: ''
    });

    const validatePhoneNumber = (input) => {
        const cleaned = ('' + input).replace(/\D/g, ''); // Remove non-numeric characters
        if (cleaned.length !== 10) {
            return '';
        }
        const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);

        if (match) {
            return `(${match[1]}) ${match[2]}-${match[3]}`; // Format the number as (XXX) XXX-XXXX
        }
        return '';
    };

    const validate = () => {
        let errors = {};
        if (!formValues.userPhoneNumber) {
            errors.userPhoneNumber = 'Phone Number is required.';
        }
        else {
            const formattedPhoneNumber = validatePhoneNumber(formValues.userPhoneNumber);
            if (!formattedPhoneNumber) {
                errors.userPhoneNumber = 'Enter a valid 10-digit Phone Number in the format (XXX) XXX-XXXX.';
            } else {
                formValues.userPhoneNumber = formattedPhoneNumber;
            }
        }
        if (step === 2) {
            if (!formValues.verificationCode) {
                errors.verificationCode = 'Verification Code is required';
            }
            if (!formValues.newPassword) {
                errors.newPassword = 'New password is required';
            }
            if (!formValues.confirmNewPassword) {
                errors.confirmNewPassword = 'Please confirm your new password';
            } else if (formValues.newPassword !== formValues.confirmNewPassword) {
                errors.confirmNewPassword = 'Passwords do not match';
            }
        }
        return errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setFormErrors(validationErrors);
            return;
        }

        setFormErrors({});

        if (step === 1) {
            await forgotPassword(formValues);
            setStep(2);  // Move to the next step to enter the new password
        } else if (step === 2) {
            await confirmForgotPassword(formValues);
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

    const handleInputChange = (e) => {
        const {id, value} = e.target;
        setFormValues((prevValues) => ({
            ...prevValues,
            [id]: value,
        }));
        if (id === 'newPassword') {
            const passwordErrors = validatePassword(value);
            if (passwordErrors) {
                setFormErrors((prevErrors) => ({
                    ...prevErrors,
                    newPassword: passwordErrors.join(' '), // Join multiple error messages into one string
                }));
            } else {
                setFormErrors((prevErrors) => ({
                    ...prevErrors,
                    newPassword: null, // Clear error if valid
                }));
            }
        }
    };

    const handleCancel = async (e) => {
        e.stopPropagation();
        await Cookies.remove('isResetPassword');
        navigate('/login');
    };

    return (
        <AuthLayout>
            <div className='d-flex flex-column justify-content-center py-5 px-md-5 px-sm-2 gap-lg-5 gap-5'>
                <div className='d-block d-lg-none'>
                    <img src={blackLogo} className='logo-width'/>
                    <h1 className=' mt-4'>Designed for Telehealth</h1>
                    <p className='mt-3'>Lorem ipsum dolor sit amet consectetur. Sed aliquet sed aliquam tempus.</p>
                </div>
                <div className='two-step'>
                    <h1 className='two-step-heading login-heading fw-bold'>{step === 1 ? "Reset password" : "Change password"}</h1>
                    <p className='two-step-text login-text'>{step === 1 ? "Enter your registered phone number below to receive reset password verification code" : "Enter your new password"}.</p>
                </div>

                <div className='mt-2'>
                    {step === 1 && (
                        <>
                            <form>
                                <div className="mb-3">
                                    <label htmlFor="userPhoneNumber" className="form-label fw-normal">Phone
                                        Number</label>
                                    <input
                                        type="text"
                                        name="userPhoneNumber"
                                        value={formValues.userPhoneNumber}
                                        onChange={handleInputChange}
                                        className="form-control form-control-lg field-placeholder bg-field"
                                        id="userPhoneNumber"
                                        placeholder='(xxx) xxx-xxxx'
                                    />
                                    {formErrors.userPhoneNumber &&
                                        <small className="text-danger">{formErrors.userPhoneNumber}</small>}
                                </div>
                                <button onClick={(e) => handleSubmit(e)}
                                        className='text-decoration-none btn btn-primary mt-3 btn-lg fw-normal w-100 font-oxygen fs-6'>
                                    Send Verification Code
                                </button>
                                <div className='text-center mt-3'>
                                    <button onClick={(e) => handleCancel(e)}
                                            className='text-decoration-none btn border-0 text-primary border-primary fw-bold'>Cancel
                                    </button>
                                </div>
                            </form>
                        </>
                    )}
                    {step === 2 && (
                        <>
                            <form>
                                <div className="mb-3">
                                    <label htmlFor="verificationCode" className="form-label fw-normal">Verification
                                        Code</label>
                                    <input
                                        type="number"
                                        name="verificationCode"
                                        value={formValues.verificationCode}
                                        onChange={handleInputChange}
                                        className="form-control form-control-lg field-placeholder bg-field"
                                        id="verificationCode"
                                        placeholder='Verification Code'
                                    />
                                    {formErrors.verificationCode &&
                                        <small className="text-danger">{formErrors.verificationCode}</small>}
                                </div>
                                <div className="mb-3 position-relative">
                                    <label htmlFor="newPassword" className="form-label fw-normal">New Password</label>
                                    <div className="input-group">
                                        <input type="password"
                                               className={`form-control form-control-lg field-placeholder bg-field ${formErrors.newPassword ? 'is-invalid' : ''}`}
                                               value={formValues.newPassword}
                                               type={showPassword.newPassword ? "text" : "password"}
                                               name="newPassword"
                                               onChange={handleInputChange}
                                               id="newPassword"
                                               placeholder='Password'
                                        />
                                        <span className="input-group-text"
                                              onClick={() => togglePasswordVisibility('newPassword')}>
                                        <FontAwesomeIcon icon={showPassword.newPassword ? faEyeSlash : faEye}/>
                            </span>
                                        {formErrors.newPassword &&
                                            <div className="invalid-feedback">{formErrors.newPassword}</div>}
                                    </div>

                                </div>
                                <div className="mb-3 position-relative">
                                    <label htmlFor="confirmNewPassword" className="form-label fw-normal">Retype
                                        Password</label>
                                    <div className="input-group">
                                        <input type="password"
                                               className={`form-control form-control-lg field-placeholder bg-field ${formErrors.confirmNewPassword ? 'is-invalid' : ''}`}
                                               value={formValues.confirmNewPassword}
                                               type={showPassword.confirmNewPassword ? "text" : "password"}
                                               name="confirmNewPassword"
                                               onChange={handleInputChange}
                                               id="confirmNewPassword"
                                               placeholder='Confirm New Password'
                                        />
                                        <span className="input-group-text"
                                              onClick={() => togglePasswordVisibility('confirmNewPassword')}>
                                        <FontAwesomeIcon icon={showPassword.confirmNewPassword ? faEyeSlash : faEye}/>
                            </span>
                                        {formErrors.confirmNewPassword &&
                                            <div className="invalid-feedback">{formErrors.confirmNewPassword}</div>}
                                    </div>

                                </div>
                                <button onClick={(e) => handleSubmit(e)}
                                        className='text-decoration-none btn btn-primary mt-3 btn-lg fw-normal w-100 font-oxygen fs-6'>
                                    Change Password
                                </button>
                                <div className='text-center mt-3'>
                                    <button onClick={(e) => handleCancel(e)}
                                            className='text-decoration-none btn border-0 text-primary border-primary fw-bold'>Cancel
                                    </button>
                                </div>
                            </form>
                        </>
                    )}
                </div>
            </div>
        </AuthLayout>
    )
}

export default ForgetPassword;
