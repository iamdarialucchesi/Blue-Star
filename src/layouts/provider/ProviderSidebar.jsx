import React from "react";
import {NavLink} from "react-router-dom";

import CrossBlackIcon from "../../assets/images/icons/cross-black.svg";
import BrandImage from "../../assets/images/admin_dashboard/brand-image.svg";
import userProfile from "../../assets/images/admin_dashboard/user-profile-picture.jpg";
import HomeActiveIcon from "../../assets/images/icons/sidebar-active-home.svg";
import HomeIcon from "../../assets/images/icons/sidebar-home.svg";
import HeartActiveIcon from "../../assets/images/icons/sidebar-active-heart.svg";
import HeartIcon from "../../assets/images/icons/sidebar-heart.svg";
import BriefecaseActiveIcon from "../../assets/images/icons/sidebar-active-clinic-briefecase.svg";
import BriefecaseIcon from "../../assets/images/icons/sidebar-clinic-briefecase.svg";
import MessageIcon from "../../assets/images/icons/sidebar-message.svg";
import MessageActiveIcon from "../../assets/images/icons/sidebar-active-message.svg";
import BellIcon from "../../assets/images/icons/sidebar-bell.svg";
import BellActiveIcon from "../../assets/images/icons/sidebar-active-bell.svg";
import {useProviderDataStore} from "../../stores/ProviderDataStore.js";
import FeedbackActiveIcon from "../../assets/images/icons/sidebar-active-feedback.svg";
import FeedbackIcon from "../../assets/images/icons/sidebar-feedback.svg";

function ProviderSidebar({setIsSidebarVisible, isSidebarVisible}) {
    const {providerWhiteLabels} = useProviderDataStore();
    const {PrimaryColor} = providerWhiteLabels;

    return (
        <aside
            className={`admin-dashboard-sidebar ${(isSidebarVisible) ? "admin-dashboard-sidebar-width-230px" : "admin-dashboard-sidebar-width-0"} overflow-x-hidden position-fixed top-0 start-0 bottom-0 d-flex flex-column text-white`}
            style={{backgroundColor: PrimaryColor ? PrimaryColor : "bg-midnight-blue"}}>
            <button
                className="sidebar-cross-btn d-lg-none d-block position-absolute end-0 mt-4 me-2 text-white bg-transparent border-0"
                onClick={() => setIsSidebarVisible(false)}>
                <img src={CrossBlackIcon}/>
            </button>
            <div className="sidebar-brand d-flex align-items-center gap-2 mb-4 ps-3 pt-4 fw-medium">
                <img src={providerWhiteLabels.LogoUrl ? providerWhiteLabels.LogoUrl : userProfile} width={40} height={40} style={{borderRadius: '50%', objectFit: 'cover'}}/>
                <span className="text-nowrap">
                    {providerWhiteLabels && providerWhiteLabels.OrganizationName && providerWhiteLabels.OrganizationName.length > 20
                        ? providerWhiteLabels.OrganizationName.substring(0, 20) + '...'
                        : providerWhiteLabels.OrganizationName
                    }
                </span>
            </div>
            <ul className="list-unstyled m-0 overflow-auto hide-scrollbar d-flex flex-column gap-3 fw-light">
                <li className="admin-dashboard-sidebar-item">
                    <NavLink
                        to='/provider-dashboard'
                        className={({isActive}) =>
                            `text-decoration-none d-flex align-items-center me-3 rounded-end-2 py-2 ps-3 gap-3 ${isActive ? "active-nav" : ""}`
                        }
                    >
                        {({isActive}) => (
                            <>
                                <img src={isActive ? HomeActiveIcon : HomeIcon} alt="Home Icon"/>
                                <span className="text-nowrap">Home</span>
                            </>
                        )}
                    </NavLink>
                </li>

                <li className="admin-dashboard-sidebar-item">
                    <NavLink to='/provider/patients'
                             className={({isActive}) =>
                                 `text-decoration-none d-flex align-items-center me-3 rounded-end-2 py-2 ps-3 gap-3 ${isActive ? "active-nav" : ""}`
                             }>
                        {({isActive}) => (
                            <>
                                <img src={isActive ? HeartActiveIcon : HeartIcon}/>
                                <span className="text-nowrap">Patients</span>
                            </>
                        )}
                    </NavLink>
                </li>

                <li className="admin-dashboard-sidebar-item">
                    <NavLink to='/provider/programs'
                             className={({isActive}) =>
                                 `text-decoration-none d-flex align-items-center me-3 rounded-end-2 py-2 ps-3 gap-3 ${isActive ? "active-nav" : ""}`
                             }>
                        {({isActive}) => (
                            <>
                                <img src={isActive ? BriefecaseActiveIcon : BriefecaseIcon}/>
                                <span className="text-nowrap">Programs</span>
                            </>
                        )}
                    </NavLink>
                </li>

                <li className="admin-dashboard-sidebar-item">
                    <NavLink to="/provider/interactions" className={({isActive}) =>
                        `text-decoration-none d-flex align-items-center me-3 rounded-end-2 py-2 ps-3 gap-3 ${isActive ? "active-nav" : ""}`
                    }>
                        {({isActive}) => (
                            <>
                                <img src={isActive ? MessageActiveIcon : MessageIcon}/>
                                <span className="text-nowrap">Interactions</span>
                            </>
                        )}
                    </NavLink>
                </li>

                <li className="admin-dashboard-sidebar-item">
                    <NavLink to="/provider/notifications" className={({isActive}) =>
                        `text-decoration-none d-flex align-items-center me-3 rounded-end-2 py-2 ps-3 gap-3 ${isActive ? "active-nav" : ""}`
                    }>
                        {({isActive}) => (
                            <>
                                <img src={isActive ? BellActiveIcon : BellIcon}/>
                                <span className="text-nowrap">Notifications</span>
                            </>
                        )}
                    </NavLink>
                </li>

                <li className="admin-dashboard-sidebar-item">
                    <NavLink to="/provider-feedback"
                             className={({isActive}) =>
                                 `text-decoration-none d-flex align-items-center me-3 rounded-end-2 py-2 ps-3 gap-3 ${isActive ? "active-nav" : ""}`
                             }>
                        {({isActive}) => (
                            <>
                                <img src={isActive ? FeedbackActiveIcon : FeedbackIcon}/>
                                <span className="text-nowrap">Feedback</span>
                            </>
                        )}
                    </NavLink>
                </li>

            </ul>
        </aside>
    )
}

export default ProviderSidebar;
