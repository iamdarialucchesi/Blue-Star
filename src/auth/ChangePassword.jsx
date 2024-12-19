import AuthLayout from "../layouts/AuthLayout.jsx";
import {Link} from "react-router-dom";
import blackLogo from "../assets/images/black-logo.svg";

function ChangePassword() {
    return (
        <AuthLayout>
            <div className='d-flex flex-column justify-content-center py-5 px-md-5 px-sm-2 gap-4'>
                <div className='d-block d-lg-none'>
                    <img src={blackLogo} className='logo-width'/>
                    <h1 className=' mt-4'>Designed for Telehealth</h1>
                    <p className='mt-3'>Lorem ipsum dolor sit amet consectetur. Sed aliquet sed aliquam
                        tempus. </p>
                </div>
                <div className='two-step'>
                    <h1 className='two-step-heading login-heading fw-bold text-start'>Change password</h1>
                    <p className='two-step-text login-text'>Enter your new password.</p>
                </div>

                <div>
                    <form>
                        <div className="mb-3">
                            <label htmlFor="password" className="form-label fw-normal">New Password</label>
                            <input type="password"
                                   className="form-control form-control-lg field-placeholder bg-field"
                                   id="new-password" placeholder='Password'/>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="password" className="form-label fw-normal">Retype Password</label>
                            <input type="password"
                                   className="form-control form-control-lg field-placeholder bg-field"
                                   id="retry-password" placeholder='Password'/>
                        </div>
                        <Link to=''
                              className='text-decoration-none btn btn-primary mt-3 btn-lg fw-normal w-100 font-oxygen fs-6'>
                            Send Link
                        </Link>
                        <div className='text-center mt-3'>
                            <Link to='/login'
                                  className='text-decoration-none border-bottom text-primary border-primary fw-bold'>Cancel</Link>
                        </div>
                    </form>
                </div>
            </div>
        </AuthLayout>
    )
}

export default ChangePassword;
