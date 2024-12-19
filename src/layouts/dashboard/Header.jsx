import React, {useRef, useContext, useState, useEffect} from "react"
import {Link, useNavigate} from "react-router-dom";
import { formatDistanceToNowStrict } from 'date-fns'; // Use date-fns to handle date formatting

import HamburgerMenuIcon from "../../assets/images/icons/hamburger-menu.svg";
import LeftArrowIcon from "../../assets/images/icons/left-arrow.svg";
import SearchIcon from "../../assets/images/icons/search.svg";
import HeaderBellIcon from "../../assets/images/icons/header-bell.svg";
import UserProfilePicture from "../../assets/images/admin_dashboard/user-profile-picture.jpg";
import profilePopupIcon from "../../assets/icons/popup-profile-pic.svg";
import profileIcon from "../../assets/icons/profile-header-popup-icon.svg";
import changePasswordIcon from "../../assets/icons/change-password-icon-header-icon.svg";
import supportIcon from "../../assets/icons/support-popup-header-icon.svg";
import faqIcon from "../../assets/icons/faq-header-popup-icon.svg";
import userMunualIcon from "../../assets/icons/user-header-popup-icon.svg";
import logoutIcon from "../../assets/icons/logout-header-popup-icon.svg";
import reminderIcon from "../../assets/icons/reminder-icon.svg";
import alertIcon from "../../assets/icons/alert-icon.svg";
import {AuthContext} from '../../context/AuthContext';
import Cookies from 'js-cookie';
import {useProviderDataStore} from "../../stores/ProviderDataStore.js";
import {useAdminDataStore} from "../../stores/AdminDataStore.js";
import DashboardService from "./service/DashboardService.js";

const Header = ({setIsSidebarVisible, headerTitle, isDashboard = false}) => {
    const {userType, signOut,authToken} = useContext(AuthContext);
    const {providerUserData, providerWhiteLabels} = useProviderDataStore();
    const {adminUserData, globalUserName,globalProfilePicture} = useAdminDataStore();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState({});
    const [allReminders, setAllReminders] = useState([]);
    const [allAlerts, setAllAlerts] = useState([]);
    const {resetUserInfo} = useContext(AuthContext);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    const {LinkColor} = providerWhiteLabels;

    useEffect(() => {
        if (userType) {
            if (userType === 'Admin') {
                setCurrentUser(adminUserData);
            } else if (userType === 'Provider') {
                setCurrentUser(providerUserData);
            }
        }
    }, [userType]);


    const fetchNotifications = async () => {
        const result = await DashboardService.fetchAllNotifications(authToken);
        if (result.status === 200 && result.notifications) {
            // Separate reminders and alerts
            const reminders = result.notifications.filter(notification => notification.Type === 'Reminder');
            const alerts = result.notifications.filter(notification => notification.Type === 'Alert');

            setAllReminders(reminders);
            setAllAlerts(alerts);
        }
    }

    const updateNotifications = async () => {
        const result = await DashboardService.makeNotificationsAsRead(authToken);
        if (result.status === 200) {

        }
    }

    const handleDropdownToggle = async (isOpen) => {
        if (isOpen === true){
            await fetchNotifications();
        }
        else if (isOpen === false){
            await updateNotifications()
        }
        setIsDropdownOpen(isOpen);
    };

    const closeDropdown = async () => {
        if (isDropdownOpen) {
            await updateNotifications()
            setIsDropdownOpen(false);
            if (dropdownRef.current) {
                dropdownRef.current.classList.remove("show");
            }
        }
    };

    const handleUserProfile = async (e) => {
        e.stopPropagation();
        if (userType === 'Admin') {
            navigate('/admin/profile-view');
        } else if (userType === 'Provider') {
            navigate('/profile/settings/view');
        }
    }
    const handleChangePassword = async (e) => {
        e.stopPropagation();
        if (userType === 'Admin') {
            navigate('/admin/settings/change-password');
        } else if (userType === 'Provider') {
            navigate('/profile/settings/change-password');
        }
    }

    const handleChangeSupportAndHelp = async (e) => {
        e.stopPropagation();
        if (userType === 'Admin') {
            navigate('/admin/settings/support-and-help');
        } else if (userType === 'Provider') {
            navigate('/profile/settings/support-and-help');
        }
    }
    const handleChangeFaqs = async (e) => {
        e.stopPropagation();
        if (userType === 'Admin') {
            navigate("/admin/settings/faqs");
        } else if (userType === 'Provider') {
            navigate("/profile/settings/faqs");
        }
    }
    const handleChangeUserManualMain = async (e) => {
        e.stopPropagation();
        if (userType === 'Admin') {
            navigate("/admin/settings/user-manual-main");
        } else if (userType === 'Provider') {
            navigate("/profile/settings/user-manual-main");
        }
    }

    const handleViewDetails = async  (e) => {
        e.stopPropagation();
        closeDropdown();
        if (userType === 'Admin') {
            navigate("/notifications");
        } else if (userType === 'Provider') {
            navigate("/provider/notifications");
        }
    }

    function handleLogout() {
        signOut();
    }

    const formatDueDate = (dueDate) => {
        const due = new Date(dueDate);

        const difference = formatDistanceToNowStrict(due, { addSuffix: false });

        return difference;
    };

    const emailStyle = {
        wordWrap: 'break-word',
        wordBreak: 'break-all',
        maxWidth: '100%',
    };

    return (
        <header className="py-4 px-3">
            <div className="d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center">
                    <button onClick={() => setIsSidebarVisible(true)}
                            className="bg-transparent border-0 p-0 me-2 d-inline-block d-lg-none">
                        <img className="header-hamburger-menu-icon" src={HamburgerMenuIcon}/>
                    </button>

                    <div className="d-lg-flex align-items-center d-none gap-3">
                        <Link to={-1} className={`${isDashboard ? "d-block" : "d-none"}`}>
                            <img className="header-back-arrow-icon" src={LeftArrowIcon}/>
                        </Link>

                        <h4 className="fw-normal mb-0 fs-23">
                            {headerTitle || (globalUserName === null ? "Welcome back" : `Welcome back ${globalUserName}`)}
                        </h4>
                    </div>
                </div>
                <div className="dashboard-header-right-pane d-flex align-items-center gap-2">
                    {/*<div*/}
                    {/*    className="header-searchbar d-flex align-items-center rounded-2 bg-white border border-black-10 px-3 py-1 gap-1">*/}
                    {/*    <label htmlFor="header-searchbar-input" className="d-flex align-items-center">*/}
                    {/*        <img src={SearchIcon}/>*/}
                    {/*    </label>*/}
                    {/*    <input className="border-0 bg-transparent input-focus-none flex-grow-1 flex-shrink-1"*/}
                    {/*           placeholder="Search" id="header-searchbar-input"/>*/}
                    {/*</div>*/}

                    {/*notification button & popup*/}
                    <div className="notification-icon">
                        <button className="dropdown-toggle border-0 bg-transparent p-0 d-flex align-items-center"
                                data-bs-toggle="dropdown" onClick={() => handleDropdownToggle(true)}>
                            <img className="header-bell-icon" src={HeaderBellIcon}/>
                        </button>
                        <ul className="dropdown-menu border-0">
                            <div className="border-bottom">
                                <div className="d-flex justify-content-between align-items-center px-3 pt-2 pb-3">
                                    <h4 className="card-heading fw-bold m-0">Notifications</h4>
                                    <button
                                        onClick={(e) => handleViewDetails(e)}
                                          className={`text-decoration-none fw-bold btn p-0 rounded-0 border-0 ${!LinkColor && "text-primary border-bottom border-primary"}`}
                                          style={{
                                              color: LinkColor && LinkColor ,
                                              borderBottom: LinkColor && `1px solid ${LinkColor}`,
                                          }}>
                                        View Details
                                    </button>
                                </div>
                            </div>

                            {/*notification content list*/}
                            <div className="notification-list px-3" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                                {/* Reminders Section */}
                                <div className="pt-3 cursor-pointer" onClick={closeDropdown}>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <p className="text-dark fw-normal d-flex gap-2 mb-1">
                                            <img src={reminderIcon} alt="Reminder" /> Reminders
                                        </p>
                                    </div>
                                    {allReminders && allReminders.length > 0 ? (
                                        allReminders.map((reminder, index) => (
                                            <p key={index} className="fw-light content-small-text-color">
                                                {reminder.Content}
                                                <span style={{ float: 'right' }}>
                                                    {formatDueDate(reminder.DueDate)}
                                                </span>
                                            </p>
                                        ))
                                    ) : (
                                        <p className="fw-light content-small-text-color">No reminder exists</p>
                                    )}
                                </div>

                                {/* Alerts Section */}
                                <div className="pt-3 cursor-pointer" onClick={closeDropdown}>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <p className="text-dark fw-normal d-flex gap-2 mb-1">
                                            <img src={alertIcon} alt="Alert" /> Alerts
                                        </p>
                                    </div>
                                    {allAlerts && allAlerts.length > 0 ? (
                                        allAlerts.map((alert, index) => (
                                            <p key={index} className="fw-light content-small-text-color">
                                                {alert.Content}
                                                <span style={{ float: 'right' }}>
                                                     {formatDueDate(alert.DueDate)}
                                                </span>
                                            </p>
                                        ))
                                    ) : (
                                        <p className="fw-light content-small-text-color">No alert exists</p>
                                    )}
                                </div>
                            </div>


                        </ul>
                    </div>

                    <div className="d-flex align-items-center gap-1">
                        <img className="header-user-profile-picture rounded-circle object-fit-cover"
                             src={globalProfilePicture ? globalProfilePicture : UserProfilePicture} width={40} height={40} style={{ borderRadius: '50%',objectFit: 'cover'  }}/>
                        <div className="handle-dropdown">
                        <button
                            className="btn border-0 text-light fw-light detail-text p-0 d-flex align-items-center gap-1 dropdown-toggle"
                            data-bs-toggle="dropdown"
                            onClick={() => handleDropdownToggle(true)}
                        >
                            {globalUserName === null ? '' : globalUserName}
                        </button>

                            {/*popup*/}
                            <ul onClick={() => closeDropdown()}
                                className="dropdown-menu popup-header-user-width p-4 border-0 rounded-3"
                                ref={dropdownRef}>
                                <div
                                    className="popup-header-user-details d-flex align-items-center gap-2 border-bottom pb-3">
                                    <img
                                        src={globalProfilePicture ? globalProfilePicture : UserProfilePicture} width={50} height={50} style={{ borderRadius: '50%',objectFit: 'cover'  }}
                                    />
                                    <div className="popup-header-user-info">
                                        <p className="m-0 text-dark fw-normal fs-18">
                                            {globalUserName === null ? '' : globalUserName}
                                        </p>
                                        <p className="m-0 content-small-text-color fw-light fs-14" style={emailStyle}>{currentUser && currentUser.EmailAddress}</p>
                                    </div>
                                </div>
                                <div className="popup-header-list py-3 border-bottom">
                                    <li type="button"
                                        onClick={(e) => handleUserProfile(e)}
                                        className="pb-3 d-flex align-items-center gap-2 text-light fw-light cursor-pointer">
                                        <img src={profileIcon}/> Profile
                                    </li>
                                    <li type="button"
                                        onClick={(e) => handleChangePassword(e)}
                                        className="pb-3 d-flex align-items-center gap-2 text-light fw-light cursor-pointer">
                                        <img src={changePasswordIcon}/>Change Password
                                    </li>
                                    <li type="button"
                                        onClick={(e) => handleChangeSupportAndHelp(e)}
                                        className="pb-3 d-flex align-items-center gap-2 text-light fw-light cursor-pointer">
                                        <img src={supportIcon}/>Support & Help
                                    </li>
                                    <li type="button"
                                        onClick={(e) => handleChangeFaqs(e)}
                                        className="pb-3 d-flex align-items-center gap-2 text-light fw-light cursor-pointer">
                                        <img src={faqIcon}/> FAQs
                                    </li>
                                    <li type="button"
                                        onClick={(e) => handleChangeUserManualMain(e)}
                                        className="d-flex align-items-center gap-2 text-light fw-light cursor-pointer">
                                        <img src={userMunualIcon}/> User Manual
                                    </li>
                                </div>
                                <div className="popup-header-footer pt-3">
                                    <button
                                        className="btn p-0 border-0 d-flex align-items-center gap-2 text-light fw-light cursor-pointer"
                                        onClick={handleLogout}>
                                        <img src={logoutIcon}/> Log Out
                                    </button>
                                </div>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Overlay */}
                {isDropdownOpen && (
                    <div className="dropdown-overlay z-3" onClick={closeDropdown}></div>
                )}
            </div>
        </header>
    )
}

export default Header
