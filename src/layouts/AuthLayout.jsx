import AuthSideBar from "../components/AuthSideBar.jsx";

// eslint-disable-next-line react/prop-types
function AuthLayout({children}) {
    return (
        <div>
            <div className='row m-0'>
                <div className='col-12 col-lg-6 leftAuthSide-bg p-0 d-none d-lg-block'>
                    <AuthSideBar/>
                </div>
                <div className='col-12 col-lg-6 my-auto'>
                    {children}
                </div>
            </div>
        </div>
    )
}

export default AuthLayout;