import AuthLayout from "../layouts/AuthLayout.jsx";
import logo from "../assets/images/logo.png";
import {Link} from "react-router-dom";

function AuthSend() {
    return (
        <AuthLayout>
            <div className='vh-100 d-flex flex-column justify-content-center px-lg-6 px-md-5 px-2 gap-lg-4 gap-3'>
                <div className='d-block d-lg-none'>
                    <img src={logo}/>
                    <h1 className=' mt-4'>Designed for Telehealth</h1>
                    <p className='mt-3'>Lorem ipsum dolor sit amet consectetur. Sed aliquet sed aliquam
                        tempus. </p>
                </div>

                <div className='two-step'>
                    <h1 className='two-step-heading login-heading fw-bold'>Two-step authentication</h1>
                    <p className='two-step-text login-text'>We will send a 4-digit code to your email.</p>
                </div>

                <div>
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
        </AuthLayout>
    )
}

export default AuthSend;