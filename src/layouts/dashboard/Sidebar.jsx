import React from "react"
import {NavLink} from "react-router-dom";

import BrandImage from "../../assets/images/admin_dashboard/brand-image.svg";
import HomeIcon from "../../assets/images/icons/sidebar-home.svg";
import HomeActiveIcon from "../../assets/images/icons/sidebar-active-home.svg";
import HeartIcon from "../../assets/images/icons/sidebar-heart.svg";
import HeartActiveIcon from "../../assets/images/icons/sidebar-active-heart.svg";
import BriefecaseIcon from "../../assets/images/icons/sidebar-clinic-briefecase.svg";
import BriefecaseActiveIcon from "../../assets/images/icons/sidebar-active-clinic-briefecase.svg";
import MessageIcon from "../../assets/images/icons/sidebar-message.svg";
import BellIcon from "../../assets/images/icons/sidebar-bell.svg";
import EyeIcon from "../../assets/images/icons/sidebar-eye.svg";
import EyeActiveIcon from "../../assets/images/icons/sidebar-active-eye.svg";
import ManIcon from "../../assets/images/icons/sidebar-man.svg";
import ManActiveIcon from "../../assets/images/icons/sidebar-active-man.svg";
import TagLabelIcon from "../../assets/images/icons/sidebar-tag-label.svg";
import TagLabelActiveIcon from "../../assets/images/icons/sidebar-active-tag-label.svg";
import FeedbackIcon from "../../assets/images/icons/sidebar-feedback.svg";
import FeedbackActiveIcon from "../../assets/images/icons/sidebar-active-feedback.svg";
import CrossBlackIcon from "../../assets/images/icons/cross-black.svg"
import MessageActiveIcon from "../../assets/images/icons/sidebar-active-message.svg";
import BellActiveIcon from "../../assets/images/icons/sidebar-active-bell.svg";

const Sidebar = ({setIsSidebarVisible, isSidebarVisible}) => {
    return (<aside
        className={`admin-dashboard-sidebar ${(isSidebarVisible) ? "admin-dashboard-sidebar-width-230px" : "admin-dashboard-sidebar-width-0"} overflow-x-hidden position-fixed top-0 start-0 bottom-0 d-flex flex-column bg-midnight-blue text-white`}>
        <button
            className="sidebar-cross-btn d-lg-none d-block position-absolute end-0 mt-4 me-2 text-white bg-transparent border-0"
            onClick={() => setIsSidebarVisible(false)}>
            <img src={CrossBlackIcon}/>
        </button>
        <div className="sidebar-brand d-flex align-items-center gap-3 mb-4 ps-3 pt-4 fw-bolder">
            <img src={BrandImage}/>
        </div>
        <ul className="list-unstyled m-0 overflow-auto hide-scrollbar d-flex flex-column gap-3 fw-light">
            <li className="admin-dashboard-sidebar-item">
                <NavLink
                    to='/'
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
                <NavLink to='/patients'
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
                <NavLink to='/programs'
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
                <NavLink to="/interactions" className={({isActive}) =>
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
                <NavLink to="/notifications" className={({isActive}) =>
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
                <NavLink to='/organizations'
                         className={({isActive}) =>
                             `text-decoration-none d-flex align-items-center me-3 rounded-end-2 py-2 ps-3 gap-3 ${isActive ? "active-nav" : ""}`
                         }>
                    {({isActive}) => (
                        <>
                            <img src={isActive ? BriefecaseActiveIcon : BriefecaseIcon}/>
                            <span className="text-nowrap">Organizations</span>
                        </>
                    )}
                </NavLink>
            </li>

            <li className="admin-dashboard-sidebar-item">
                <NavLink to='/audit-logs'
                         className={({isActive}) =>
                             `text-decoration-none d-flex align-items-center me-3 rounded-end-2 py-2 ps-3 gap-3 ${isActive ? "active-nav" : ""}`
                         }>
                    {({isActive}) => (
                        <>
                            <img src={isActive ? EyeActiveIcon : EyeIcon}/>
                            <span className="text-nowrap">Audit Log</span>
                        </>
                    )}
                </NavLink>
            </li>

            <li className="admin-dashboard-sidebar-item">
                <NavLink to="/roles-accessibility"
                         className={({isActive}) =>
                             `text-decoration-none d-flex align-items-center me-3 rounded-end-2 py-2 ps-3 gap-3 ${isActive ? "active-nav" : ""}`
                         }>
                    {({isActive}) => (
                        <>
                            <img src={isActive ? ManActiveIcon : ManIcon}/>
                            <span className="text-nowrap">Roles Accessibility</span>
                        </>
                    )}
                </NavLink>
            </li>

            <li className="admin-dashboard-sidebar-item">
                <NavLink to="/white-label-view"
                         className={({isActive}) =>
                             `text-decoration-none d-flex align-items-center me-3 rounded-end-2 py-2 ps-3 gap-3 ${isActive ? "active-nav" : ""}`
                         }>
                    {({isActive}) => (
                        <>
                            <img src={isActive ? TagLabelActiveIcon : TagLabelIcon}/>
                            <span className="text-nowrap">White Label</span>
                        </>
                    )}
                </NavLink>
            </li>

            <li className="admin-dashboard-sidebar-item">
                <NavLink to="/feedback"
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
            <li className="admin-dashboard-sidebar-item">
                <NavLink to="/roles"
                         className={({isActive}) =>
                             `text-decoration-none d-flex align-items-center me-3 rounded-end-2 py-2 ps-3 gap-3 ${isActive ? "active-nav" : ""}`
                         }>
                    {({isActive}) => (
                        <>
                            <img src={isActive ? FeedbackActiveIcon : FeedbackIcon}/>
                            <span className="text-nowrap">Roles</span>
                        </>
                    )}
                </NavLink>
            </li>
        </ul>

    </aside>)
}

export default Sidebar
