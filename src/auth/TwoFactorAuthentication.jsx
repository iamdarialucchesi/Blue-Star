import React, {useState} from 'react';
import AuthLayout from '../layouts/AuthLayout.jsx';
import phoneIcon from '../assets/icons/phone.svg';
import smsIcon from '../assets/icons/sms.svg';
import rightArrow from '../assets/icons/simple-line-icons_arrow-up.svg';
import {Link} from 'react-router-dom';
import blackLogo from "../assets/images/black-logo.svg";

function TwoFactorAuthentication() {
    const [authMethod, setAuthMethod] = useState('');

    const renderAuthComponent = () => {
        switch (authMethod) {
            case 'phone':
                return <PhoneAuth/>;
            case 'email':
                return <EmailAuth/>;
            default:
                return (
                    <>
                        <div className='two-step'>
                            <h1 className='two-step-heading login-heading fw-bold'>Two-step authentication</h1>
                            <p className='two-step-text login-text'>Protect your account in just two steps.</p>
                        </div>
                        <div className='d-grid'>
                            <button onClick={() => setAuthMethod('phone')}
                                    className='d-flex align-items-center justify-content-between border bg-transparent rounded-3 p-2 p-md-3 text-decoration-none text-dark mb-3'>
                                <span className='text-start sm-fs'><img src={phoneIcon} className='pe-2 pe-md-3' alt='Phone Icon'/>Receive code via phone number</span>
                                <img src={rightArrow} alt='Right Arrow'/>
                            </button>

                            <button onClick={() => setAuthMethod('email')}
                                    className='d-flex align-items-center justify-content-between border bg-transparent rounded-3 p-2 p-md-3 text-decoration-none text-dark'>
                                <span className='text-start sm-fs'><img src={smsIcon} className='pe-2 pe-md-3' alt='SMS Icon'/>Receive code via Email</span>
                                <img src={rightArrow} alt='Right Arrow'/>
                            </button>
                        </div>
                    </>
                );
        }
    };

    return (
        <AuthLayout>
            <div className='d-flex flex-column justify-content-center py-5 px-md-5 px-sm-2 gap-4'>
                <div className='d-block d-lg-none'>
                    <img src={blackLogo} className='logo-width'/>
                    <h1 className='mt-4'>Designed for Telehealth</h1>
                    <p className='mt-3'>
                        Lorem ipsum dolor sit amet consectetur. Sed aliquet sed aliquam tempus.
                    </p>
                </div>
                {renderAuthComponent()}
            </div>
        </AuthLayout>
    );
}

function PhoneAuth() {
    return (
        <div>
            <h1 className='two-step-heading login-heading fw-bold'>Two-step authentication</h1>
            <p className='two-step-text login-text'>We will send a 4-digit code to your phone number.</p>
            <div className='mt-5'>
                <form>
                    <div className="mb-4">
                    <label htmlFor="phone" className="form-label fw-normal">Phone</label>
                        <input type="number" className="form-control form-control-lg scroll-hide field-placeholder bg-field"
                               id="phone" placeholder='Enter your phone number'/>
                    </div>
                    <Link to='/verify-code' className="btn btn-primary btn-lg fw-normal w-100 font-oxygen fs-6">
                        Send Code
                    </Link>
                </form>
            </div>
        </div>
    );
}

function EmailAuth() {
    return (
        <div>
            <h1 className='two-step-heading login-heading fw-bold'>Two-step authentication</h1>
            <p className='two-step-text login-text'>We will send a 4-digit code to your email.</p>
            <div className='mt-5'>
                <form>
                    <div className="mb-4">
                    <label htmlFor="email" className="form-label fw-normal">Email</label>
                        <input type="email" className="form-control form-control-lg field-placeholder bg-field"
                               id="email" placeholder='Enter your email'/>
                    </div>
                    <Link to='/verify-code' className="btn btn-primary btn-lg fw-normal w-100 font-oxygen fs-6">
                        Send Code
                    </Link>
                </form>
            </div>
        </div>
    );
}

export default TwoFactorAuthentication;
