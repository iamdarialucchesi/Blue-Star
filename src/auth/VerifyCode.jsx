import AuthLayout from "../layouts/AuthLayout.jsx";
import React, { useContext, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import blackLogo from "../assets/images/black-logo.svg";
import { AuthContext } from "../context/AuthContext.jsx";
import { useAdminDataStore } from "../stores/AdminDataStore.js";
import Cookies from 'js-cookie';

function VerifyCode() {
    let mfaType = Cookies.get('MFA_Type') || '';
    const { verifyMfa, resendCode, signIn } = useContext(AuthContext);
    const { setResendTokenSend } = useAdminDataStore();
    const [code, setCode] = useState(["", "", "", "","",""]);
    const inputs = useRef([]);
    const [timeLeft, setTimeLeft] = useState(120); // 2 minutes

    const handleChange = (e, index) => {
        const value = e.target.value;

        if (value.length <= 1) {
            const newCode = [...code];
            newCode[index] = value;
            setCode(newCode);

            // Move focus to the next input box
            if (value && index < 5) {
                inputs.current[index + 1].focus();
            }
        }
    };

    const handleBackspace = (e, index) => {
        if (e.key === 'Backspace' && index > 0 && !code[index]) {
            inputs.current[index - 1].focus();
        }
    };

    useEffect(() => {
        if (timeLeft > 0) {
            const timerId = setInterval(() => {
                setTimeLeft(timeLeft - 1);
            }, 1000);
            return () => clearInterval(timerId);
        }
    }, [timeLeft]);

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
    };

    const handleVerify = async () => {
        const completeCode = code.join('');
        if (completeCode.length === 6) {
            await verifyMfa(completeCode);
        } else {
            alert("Please enter the complete 6-digit code.");
        }
    };

    const handleResendCode = async () => {
        await setResendTokenSend(false);
        resendCode();
    };

    const handleSwitchToAuthenticator = async () => {
        // Retrieve stored username and password
        const username = Cookies.get('Stored_Username');  // Set during initial login
        const password = Cookies.get('Stored_Password');  // Set during initial login
    
        if (username && password) {
            // Call signIn function with the authenticator app selected
            await signIn(username, password, 'SOFTWARE_TOKEN_MFA'); // Pass the MFA type you want here
        } else {
            alert("Unable to switch MFA method. Please log in again.");
        }
    };

    return (
        <AuthLayout>
            <div className='d-flex flex-column justify-content-center py-5 px-md-5 px-sm-2 gap-4'>
                <div className='d-block d-lg-none'>
                    <img src={blackLogo} className='logo-width'/>
                    <h1 className=' mt-4'>Designed for Telehealth</h1>
                    <p className='mt-3'>Lorem ipsum dolor sit amet consectetur. Sed aliquet sed aliquam tempus.</p>
                </div>
                <div className='verify-section'>
                    <div className='two-step'>
                        <h1 className='two-step-heading login-heading fw-bold'>Verify code</h1>
                        <p className='two-step-text login-text'>
                            Enter the 6-digit code we sent to your {!mfaType || mfaType === 'SMS_MFA' ? 'phone number' : 'authenticator app'}.
                        </p>
                    </div>

                    <form>
                        <div className='mt-4 d-flex justify-content-between'>
                            {code.map((digit, index) => (
                                <input
                                    type="number"
                                    className="verification-input scroll-hide focus-ring border py-2 display-6 bg-body-secondary rounded-3 text-center"
                                    value={digit}
                                    key={index}
                                    onChange={(e) => handleChange(e, index)}
                                    onKeyDown={(e) => handleBackspace(e, index)}
                                    ref={(el) => (inputs.current[index] = el)}
                                />
                            ))}
                        </div>
                        <p className="timer mt-3 text-end">{formatTime(timeLeft)}</p>
                        <Link onClick={handleVerify} className='text-decoration-none btn btn-primary btn-lg fw-normal d-block w-100 font-oxygen fs-6'>
                            Verify
                        </Link>
                    </form>
                    {mfaType && mfaType === 'SMS_MFA' && (
                        <p className='mt-3 text-center'>
                            <span
                                className='text-primary text-decoration-none cursor-pointer fw-normal fs-6'
                                onClick={handleSwitchToAuthenticator}
                            >
                                Use authenticator app instead
                            </span>
                        </p>
                    )}
                    {/*<p className='mt-3 text-center text-light fw-light fs-6'>Didn’t receive code? <span*/}
                    {/*    className='text-primary text-decoration-none cursor-pointer fw-normal fs-6'*/}
                    {/*    onClick={handleResendCode}>Resend code</span></p>*/}
                </div>
            </div>
        </AuthLayout>
    );
}

export default VerifyCode;
