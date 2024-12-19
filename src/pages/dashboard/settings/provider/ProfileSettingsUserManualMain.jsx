import React from "react";
import ProviderLayout from "../../../../layouts/provider/ProviderLayout.jsx";

import UserManualImg1 from "../../../../assets/images/profile-settings-user-manual-img-1.jfif"
import UserManualImg2 from "../../../../assets/images/profile-settings-user-manual-img-2.jfif"
import UserManualImg3 from "../../../../assets/images/profile-settings-user-manual-img-3.jfif"
import PlayButtonWhiteIcon from "../../../../assets/images/icons/play-button-white.svg"
import {useNavigate} from "react-router-dom";

const ProfileSettingsUserManualMain = () => {
    const navigate = useNavigate()

    return (<ProviderLayout headerTitle="User Manual" isDashboard={false}>
            <div className="settings-user-manual-content border pt-3 px-3 pb-5 gap-4 rounded-4">
                <div className="profile-setting-user-manual-item">
                    <button onClick={() => navigate("/profile/settings/user-manual-doc")}
                        className="aspect-ratio-14x9 position-relative border-0 bg-transparent p-0 rounded-4 overflow-hidden">
                        <img width="100%" height="100%" className="user-manual-img object-fit-cover rounded-3" src={UserManualImg1}/>
                        <img width={30} height={30} className="position-absolute top-50 start-50 translate-middle" src={PlayButtonWhiteIcon}/>
                    </button>
                    <h6 className="mb-0 text-near-black fw-normal mt-3">Lorem Ipsum</h6>
                </div>

                <div className="profile-setting-user-manual-item">
                    <button onClick={() => navigate("/profile/settings/user-manual-doc")}
                        className="aspect-ratio-14x9 position-relative border-0 bg-transparent p-0 rounded-4 overflow-hidden">
                        <img width="100%" height="100%" className="user-manual-img object-fit-cover rounded-3" src={UserManualImg2}/>
                        <img width={30} height={30} className="position-absolute top-50 start-50 translate-middle" src={PlayButtonWhiteIcon}/>
                    </button>
                    <h6 className="mb-0 text-near-black fw-normal mt-3">Lorem Ipsum</h6>
                </div>

                <div className="profile-setting-user-manual-item">
                    <button onClick={() => navigate("/profile/settings/user-manual-video")}
                        className="aspect-ratio-14x9 position-relative border-0 bg-transparent p-0 rounded-4 overflow-hidden">
                        <img width="100%" height="100%" className="user-manual-img object-fit-cover rounded-3" src={UserManualImg3}/>
                        <img width={30} height={30} className="position-absolute top-50 start-50 translate-middle" src={PlayButtonWhiteIcon}/>
                    </button>
                    <h6 className="mb-0 text-near-black fw-normal mt-3">Lorem Ipsum</h6>
                </div>

                <div className="profile-setting-user-manual-item">
                    <button onClick={() => navigate("/profile/settings/user-manual-video")}
                        className="aspect-ratio-14x9 position-relative border-0 bg-transparent p-0 rounded-4 overflow-hidden">
                        <img width="100%" height="100%" className="user-manual-img object-fit-cover rounded-3" src={UserManualImg1}/>
                        <img width={30} height={30} className="position-absolute top-50 start-50 translate-middle" src={PlayButtonWhiteIcon}/>
                    </button>
                    <h6 className="mb-0 text-near-black fw-normal mt-3">Lorem Ipsum</h6>
                </div>
            </div>
        </ProviderLayout>
    )
}

export default ProfileSettingsUserManualMain