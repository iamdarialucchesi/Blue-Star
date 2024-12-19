import AuthLayout from "../layouts/AuthLayout.jsx";
import blackLogo from "../assets/images/black-logo.svg";
import {Link, useNavigate} from "react-router-dom";
import React, {useContext, useEffect, useState} from "react";
import {AuthContext} from "../context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import Cookies from "js-cookie";

function Login() {

    const {signIn} = useContext(AuthContext);
    const navigate = useNavigate();


    const [formState, setFormState] = useState({
        email: '',
        password: '',
        emailErr: '',
        passwordErr: '',
        loginErr: ''
    });

    const [showPassword, setShowPassword] = useState({
        password: false
    });

    const togglePasswordVisibility = (field) => {
        setShowPassword({ ...showPassword, [field]: !showPassword[field] });
    };
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormState((prevState) => ({
            ...prevState,
            [name]: value,
            [`${name}Err`]: ''
        }));
    };

    const validateForm = () => {
        const { email, password } = formState;
        let emailErr = '';
        let passwordErr = '';

        if (!email) emailErr = "Email is required";
        if (!password) passwordErr = "Password is required";
        else if (password.length < 6) passwordErr = "Password must be at least 6 characters";
        console.log(passwordErr);

        setFormState((prevState) => ({
            ...prevState,
            emailErr,
            passwordErr
        }));

        return !emailErr && !passwordErr;
    };

    const handleClick = () => {
        if (validateForm()) {
            const { email, password } = formState;
            signIn(email, password);
        }
    };

    const handleForgotPassword = async (e) => {
        e.stopPropagation();
        await Cookies.set('isResetPassword', true);
        navigate('/forget-password');
    };

    const { email, password, emailErr, passwordErr,loginErr } = formState;

    return (
        <AuthLayout>
            <div className='d-flex flex-column justify-content-center py-lg-0 py-4 px-lg-6 px-md-5 px-sm-2 gap-lg-5 gap-4'>
                <div className='d-block d-lg-none'>
                    <img src={blackLogo} className='logo-width'/>
                    <h1 className=' mt-4'>Designed for Telehealth</h1>
                    <p className='mt-3'>Lorem ipsum dolor sit amet consectetur. Sed aliquet sed aliquam
                        tempus. </p>
                </div>
                <div className='align-items-start'>
                    <h1 className='login-heading fw-bold'>Welcome back!</h1>
                    <p className='login-text'>Lorem ipsum dolor sit amet consectetur.</p>
                </div>
                <div>
                    <form>
                        {/*<div className='mb-3'>*/}
                        {/*    <label htmlFor="role" className="form-label text-dark fw-normal">Select your role</label>*/}
                        {/*    <select className="form-select form-select-lg field-placeholder bg-field" id="role">*/}
                        {/*        <option defaultValue='Provider'>Provider</option>*/}
                        {/*        <option value="Administrator">Administrator</option>*/}
                        {/*    </select>*/}
                        {/*</div>*/}
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label fw-normal">Email</label>
                            <input type="email" className={`form-control form-control-lg field-placeholder bg-field ${emailErr ? 'is-invalid' : ''}`}
                                   value={email}
                                   name="email"
                                   onChange={handleInputChange}
                                   id="email"
                                   placeholder='Enter your email'
                            />
                            {emailErr && <div className="invalid-feedback">{emailErr}</div>}
                        </div>

                        <div className="mb-3">
                            <label htmlFor="password" className="form-label fw-normal">Password</label>
                            <div className="input-group">
                                <input type="password"
                                       className={`form-control form-control-lg field-placeholder bg-field ${passwordErr ? 'is-invalid' : ''}`}
                                       value={password}
                                       type={showPassword.password ? "text" : "password"}
                                       name="password"
                                       onChange={handleInputChange}
                                       id="password"
                                       placeholder='Password'
                                />
                                <span className="input-group-text"
                                      onClick={() => togglePasswordVisibility('password')}>
                                        <FontAwesomeIcon icon={showPassword.password ? faEyeSlash : faEye}/>
                            </span>
                                {passwordErr && <div className="invalid-feedback">{passwordErr}</div>}
                            </div>
                        </div>

                        <div className='mb-4 text-end'>
                            <Link onClick={(e) => handleForgotPassword(e)} className='w-100 text-decoration-none text-primary '>Forgot
                                Password?</Link>
                        </div>
                        {/*<Link to='/two-factor-authentication'*/}
                        <Link onClick={handleClick}
                              className="btn btn-primary btn-lg fw-normal w-100 fs-6"
                        >
                            Sign In
                        </Link>
                    </form>
                    {loginErr && <div className="alert alert-danger mt-3">{loginErr}</div>}
                    {/*<p className='mt-3 text-center text-light'>Don’t have an account? <a*/}
                    {/*    className='text-primary text-decoration-none cursor-pointer'>Sign up</a></p>*/}
                </div>
            </div>
        </AuthLayout>
    )
}

export default Login;
