import React, {useContext, useEffect, useState} from "react";
import ProviderLayout from "../../../../layouts/provider/ProviderLayout.jsx";

import {Link, useNavigate} from "react-router-dom";
import profilePicture from "../../../../assets/images/profile-picture.png";
import editPencilIcon from "../../../../assets/icons/edit-pencil-icon.svg";
import profileEditIcon from "../../../../assets/icons/profile-view-pencil.svg";
import ProfileSettingsChangePasswordModal from "./partials/ProfileSettingsChangePasswordModal.jsx";
import {CognitoIdentityProviderClient, AssociateSoftwareTokenCommand, VerifySoftwareTokenCommand} from "@aws-sdk/client-cognito-identity-provider";
import {AuthContext} from "../../../../context/AuthContext.jsx";
import config from "../../../../config.json";
import {useAdminDataStore} from "../../../../stores/AdminDataStore.js";
import AdminProviderService from "../service/AdminProviderService.js";
import Spinner from "../../../../components/Spinner.jsx";
import { QRCodeSVG } from 'qrcode.react';
import Cookies from 'js-cookie';

export const cognitoClient = new CognitoIdentityProviderClient({
    region: config.region,
});
function ProfileSettingsView() {
    const {authToken} = useContext(AuthContext);
    const { setLoginUser, loginUser,setGlobalUserName,globalUserName } = useAdminDataStore();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [currentUser, setCurrentUser] = useState({});
    const [totpSecret, setTotpSecret] = useState(null);  // To hold the TOTP secret
    const [otpCode, setOtpCode] = useState('');  // For OTP input
    const [isTotpSetup, setIsTotpSetup] = useState(false);

    useEffect(() => {
        fetchUserDetails(loginUser.UserId);
    }, []);

    const fetchUserDetails = async (userId) => {
        try {
            setIsLoading(true);
            const result = await AdminProviderService.fetchProviderInformation(authToken,userId);
            if (result.OrganizationUserID) {
                setCurrentUser(result);
                if (result.FirstName){
                    const userName = result.FirstName + ' ' + result.LastName;
                    setGlobalUserName(userName);
                }
            }
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
            console.error("Error updating admin information:", error);
        }
    };

    const setupTotp = async () => {
        const token = await Cookies.get('AccessToken');
        try {
            const command = new AssociateSoftwareTokenCommand({
                AccessToken: token
            });
            const response = await cognitoClient.send(command);
            setTotpSecret(response.SecretCode);  // Store the TOTP secret
        } catch (error) {
            console.error("Error setting up TOTP:", error);
        }
    };

    const verifyTotp = async () => {
        try {
            const token = await Cookies.get('AccessToken');
            const command = new VerifySoftwareTokenCommand({
                AccessToken: token,
                UserCode: otpCode,
                FriendlyDeviceName: "AuthenticatorApp"
            });
            await cognitoClient.send(command);
            setIsTotpSetup(true);
            alert("Authenticator app registered successfully!");
        } catch (error) {
            console.error("Error verifying TOTP:", error);
            alert("Verification failed. Please try again.");
        }
    };

    if (isLoading) {
        return <Spinner />
    }

    return (
        <ProviderLayout headerTitle="John Smith" isDashboard={false}>
            <div className="admin-profile rounded-3 border p-3">
                <div className="d-flex justify-content-between mb-4">
                    <h2 className="section-heading-3d3d3d-18px fw-bold">Personal Information</h2>
                    <Link to="/profile/settings/edit">
                        <img src={profileEditIcon} alt="Profile Edit Icon"/>
                    </Link>
                </div>
                <div className='profile-image-name mb-4 d-flex align-items-center gap-3'>
                    <div>
                        <button className='position-relative btn p-0 border-0'>
                            <img src={currentUser && currentUser.ProfilePicture || profilePicture} width={50} height={50} style={{ borderRadius: '50%',objectFit: 'cover'  }} />
                        </button>
                    </div>
                    <div className='mt-2'>
                        <h1 className='text-dark fw-normal fs-6'>{globalUserName}</h1>
                    </div>
                </div>

                <div className="row gy-3 gy-md-4">
                    <div className="col-md-6 col-lg-4">
                        <div>
                            <p className='patient-card-detail-heading mb-1'>First Name</p>
                            <p className='detail-text text-light fw-normal m-0'>{currentUser && currentUser.FirstName}</p>
                        </div>
                    </div>
                    <div className="col-md-6 col-lg-4">
                        <div>
                            <p className='patient-card-detail-heading mb-1'>Last Name</p>
                            <p className='detail-text text-light fw-normal m-0'>{currentUser && currentUser.LastName}</p>
                        </div>
                    </div>
                    {/*<div className="col-md-6 col-lg-4">*/}
                    {/*    <div>*/}
                    {/*        <p className='patient-card-detail-heading mb-1'>Date of Birth</p>*/}
                    {/*        <p className='detail-text text-light fw-normal m-0'>{currentUser && currentUser.DateOfBirth}</p>*/}
                    {/*    </div>*/}
                    {/*</div>*/}
                    <div className="col-md-6 col-lg-4">
                        <div>
                            <p className='patient-card-detail-heading mb-1'>Gender</p>
                            <p className='detail-text text-light fw-normal m-0'>{currentUser && currentUser.Gender}</p>
                        </div>
                    </div>
                    <div className="col-md-6 col-lg-4">
                        <div>
                            <p className='patient-card-detail-heading mb-1'>Email Address (optional)</p>
                            <p className='detail-text text-light fw-normal m-0'>{currentUser && currentUser.EmailAddress}</p>
                        </div>
                    </div>
                    <div className="col-md-6 col-lg-4">
                        <div>
                            <p className='patient-card-detail-heading mb-1'>Phone Number</p>
                            <p className='detail-text text-light fw-normal m-0'>{currentUser && currentUser.PhoneNumber}</p>
                        </div>
                    </div>
                    <div className="col-md-6 col-lg-4">
                        <div>
                            <p className='patient-card-detail-heading mb-1'>Address</p>
                            <p className='detail-text text-light fw-normal m-0'>{currentUser && currentUser.Address}</p>
                        </div>
                    </div>
                    <div className="col-md-6 col-lg-4">
                        <div>
                            <p className='patient-card-detail-heading mb-1'>City</p>
                            <p className='detail-text text-light fw-normal m-0'>{currentUser && currentUser.City}</p>
                        </div>
                    </div>
                    <div className="col-md-6 col-lg-4">
                        <div>
                            <p className='patient-card-detail-heading mb-1'>State</p>
                            <p className='detail-text text-light fw-normal m-0'>{currentUser && currentUser.State}</p>
                        </div>
                    </div>

                    <div className="col-12">
                        <div>
                            <p className='patient-card-detail-heading mb-1'>Zip</p>
                            <p className='detail-text text-light fw-normal m-0'>{currentUser && currentUser.ZipCode}</p>
                        </div>
                    </div>

                    <div className="col-md-6 col-lg-4">
                        <div>
                            <p className='patient-card-detail-heading mb-1'>Policy Number</p>
                            <p className='detail-text text-light fw-normal m-0'>123456</p>
                        </div>
                    </div>

                    <div className="col-md-6 col-lg-4">
                        <div>
                            <p className='patient-card-detail-heading mb-1'>Group Number</p>
                            <p className='detail-text text-light fw-normal m-0'>1234</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="accordion mt-4" id="privacy-and-security">
                <div className="accordion-item rounded-3">
                    <h2 className="accordion-header rounded-3">
                        <button className="accordion-button rounded-3 section-heading-3d3d3d-18px fw-bold"
                                type="button"
                                data-bs-toggle="collapse"
                                data-bs-target="#privacy-and-security-info">
                            Privacy and Security Settings
                        </button>
                    </h2>
                    <div id="privacy-and-security-info" className="accordion-collapse collapse show"
                         data-bs-parent="#privacy-and-security">
                        <div className="accordion-body">
                            <div className='row'>
                                <div className="col-md-6 col-lg-4">
                                    <div>
                                        <p className='patient-card-detail-heading mb-1'>Email Address (optional)</p>
                                        <p className='detail-text text-light fw-normal m-0'>{currentUser && currentUser.EmailAddress}</p>
                                    </div>
                                </div>
                                <div className='col-md-6 col-lg-4'>
                                    <div className='mb-3'>
                                        <p className='patient-card-detail-heading mb-1'>Password</p>
                                        <p className='detail-text text-light fw-normal m-0'>*******************</p>
                                    </div>
                                </div>
                            </div>
                            <div className="d-flex justify-content-end">
                                <button
                                    onClick={() => navigate("/profile/settings/change-password")}
                                    type="button"
                                    // data-bs-toggle="modal"
                                    // data-bs-target="#profile-settings-change-password-modal"
                                    className="d-flex align-items-center gap-2 btn btn-primary border-0 py-2 px-3 rounded-2 text-decoration-none">
                                    <span
                                        className="fs-14 text-dark-blue">Change Password</span>
                                </button>

                                {/*<ProfileSettingsChangePasswordModal />*/}
                            </div>
                        </div>
                    </div>
                </div>

                {/* New TOTP Registration Section */}
               <div className="accordion mt-4" id="authenticator-setup">
                    <div className="accordion-item rounded-3">
                        <h2 className="accordion-header rounded-3">
                            <button className="accordion-button rounded-3 section-heading-3d3d3d-18px fw-bold"
                                    type="button"
                                    data-bs-toggle="collapse"
                                    data-bs-target="#authenticator-setup-info">
                                Register Authenticator App
                            </button>
                        </h2>
                        <div id="authenticator-setup-info" className="accordion-collapse collapse show"
                             data-bs-parent="#authenticator-setup">
                            <div className="accordion-body">
                                {!isTotpSetup && (
                                    <div>
                                        <button className="btn btn-primary mb-3" onClick={setupTotp}>
                                            Add Authenticator App
                                        </button>
                                        {totpSecret && (
                                            <div className="mb-3">
                                                <p>Scan the QR code below to register in your authenticator app.</p>
                                                {/* QR code for scanning */}
                                                <QRCodeSVG value={`otpauth://totp/BlueStar?secret=${totpSecret}`} />
                                                <input
                                                type="text"
                                                className="form-control mt-3"
                                                placeholder="Enter OTP from authenticator"
                                                value={otpCode}
                                                onChange={(e) => setOtpCode(e.target.value)}
                                            />
                                            <button className="btn btn-success mt-2" onClick={verifyTotp}>
                                                Verify OTP
                                            </button>
                                            </div>
                                        )}
                                    </div>
                                )}
                                {isTotpSetup && (
                                    <div>
                                        <p className="text-success">Your authenticator app has been successfully registered!</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </ProviderLayout>
    )
}

export default ProfileSettingsView;
