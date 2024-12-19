import logo from "../assets/images/logo.svg";
import authTableImg from '../assets/images/auth-left-table.png';

function AuthSideBar() {
    return (
        <div className='custom-adjust text-end ps-lg-7 pt-3 pt-lg-5 d-flex flex-column justify-content-between gap-5'>
            <div className='d-flex flex-column gap-9'>
                <div className='text-start'>
                    <img src={logo} className='logo-width'/>
                </div>
                <div className='text-start'>
                    <h1 className='auth-heading '>Designed for Telehealth</h1>
                    <p className='auth-text mt-3'>Lorem ipsum dolor sit amet consectetur. Sed aliquet sed<br/> aliquam
                        tempus. </p>
                </div>
            </div>
            <div>
                <img src={authTableImg} className='img-fluid'/>
            </div>
        </div>
    )
}

export default AuthSideBar;