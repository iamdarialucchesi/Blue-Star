import React, {useState, useRef, useEffect, useContext} from "react";
import AdminLayout from "../../../layouts/dashboard/AdminLayout.jsx";

import LeftArrowGreyIcon from "../../../assets/images/icons/arrow-left-dark-grey.svg";
import RightArrowGreyIcon from "../../../assets/images/icons/arrow-right-dark-grey.svg";
import blockIcon from "../../../assets/icons/block-icon.svg";
import unblockIcon from "../../../assets/icons/unblock-icon.svg";
import lockIcon from "../../../assets/icons/lock-icon.svg";
import unlockIcon from "../../../assets/icons/unlock-icon.svg";
import RolesAccessabilityService from "./service/RolesAccessabilityService.js";
import {AuthContext} from "../../../context/AuthContext.jsx";
import Spinner from "../../../components/Spinner.jsx";
import {useNavigate} from "react-router-dom";
import {useAdminDataStore} from "../../../stores/AdminDataStore.js";
import {BASE_URL} from "../../../config.js";

function RolesAccessibility() {
    const {authToken} = useContext(AuthContext);
    const { loginUser } = useAdminDataStore();
    const navigate = useNavigate();
    const [allRoleAccessAbilities, setAllRoleAccessAbilities] = useState([]);
    const [isShowDeleteBox, setIsShowDeleteBox] = useState(false);
    const [iconStates, setIconStates] = useState([]);
    const [selectedIndex, setSelectedIndex] = useState(null);
    const [actionType, setActionType] = useState(""); // "block" or "unblock"
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const [isLoading, setIsLoading] = useState(false);
    const [formValues, setFormValues] = useState({});

    useEffect(() => {
        handleFetchRoleAccessAbilities();

    }, []);


    const handleFetchRoleAccessAbilities = async () => {
        setIsLoading(true);
        const rolesAccessAbilities = await RolesAccessabilityService.fetchRoleAccessAbilities(authToken,loginUser.UserId,navigate);
        setIsLoading(false);
        if (rolesAccessAbilities && rolesAccessAbilities.length > 0) {
            setAllRoleAccessAbilities(rolesAccessAbilities);
            // setIconStates(rolesAccessAbilities.map(role => role.Status === 1 ? 1 : 0));
            setIconStates(rolesAccessAbilities.map(role => role.Status));

        }
    };

    const userTypes = [
        { value: 'Global Admin', label: 'Global Admin' },
        { value: 'Global User', label: 'Global User' },
        { value: 'Local Admin', label: 'Local Admin' },
        { value: 'Local User', label: 'Local User' }
    ];

    const permissionAccessTypes = [
        { value: 'Full Permission', label: 'Full Permission' },
        { value: 'Restricted', label: 'Restricted' }
    ];

    const handleUserTypeChange = async (index, newType) => {
        setIsDropdownOpen(false);
        setIsLoading(true);
        const updatedFormValues = {
            ...formValues,
            RoleAccessID: allRoleAccessAbilities[index].RoleAccessID,
            UserType: newType
        };
        setFormValues(updatedFormValues);
        const result = await RolesAccessabilityService.updateRoleAccessAbility(authToken,updatedFormValues);
        setIsLoading(false);
        if (result.status === 200){
            const updatedRoles = [...allRoleAccessAbilities];
            updatedRoles[index].UserType = newType;
            setAllRoleAccessAbilities(updatedRoles);
        }
        const dropdownElement = document.querySelector(".dropdown-menu.py-0.px-3.role-accessibility-dropdown-inset.show");
        if (dropdownElement) {
            dropdownElement.classList.remove("show");
        }
    };

    const handleAccessChange = async (index, newAccess) => {
        setIsDropdownOpen(false);
        setIsLoading(true);
        const updatedFormValues = {
            ...formValues,
            RoleAccessID: allRoleAccessAbilities[index].RoleAccessID,
            Access: newAccess
        };
        setFormValues(updatedFormValues);
        const result = await RolesAccessabilityService.updateRoleAccessAbility(authToken,updatedFormValues);
        setIsLoading(false);
        if (result.status === 200){
            const updatedRoles = [...allRoleAccessAbilities];
            updatedRoles[index].Access = newAccess;
            setAllRoleAccessAbilities(updatedRoles);
        }
        const dropdownElement = document.querySelector(".dropdown-menu.py-0.px-3.role-accessibility-dropdown-inset.show");
        if (dropdownElement) {
            dropdownElement.classList.remove("show");
        }
    };

    const toggleIcon = async (index) => {
        setIsLoading(true);
        const newStatus = iconStates[index] === 1 ? 0 : 1;
        const updatedFormValues = {
            RoleAccessID: allRoleAccessAbilities[index].RoleAccessID,
            Status: newStatus
        };
        const result = await RolesAccessabilityService.updateRoleAccessAbility(authToken, updatedFormValues);
        if (result.status === 200) {
            setIconStates(prevStates =>
                prevStates.map((state, i) => (i === index ? newStatus : state))
            );
            const updatedRoles = [...allRoleAccessAbilities];
            updatedRoles[index].Status = newStatus;
            setAllRoleAccessAbilities(updatedRoles);
        }
        setIsLoading(false);
        setIsShowDeleteBox(false);
    };

    const handleIconClick = (index) => {
        setSelectedIndex(index);
        setActionType(iconStates[index] === 1 ? 'unblock' : 'block');
        // setActionType(iconStates[index] === 1 ? 'block' : 'unblock');
        setIsShowDeleteBox(true);
    };

    const handlePopupConfirm = () => {
        if (selectedIndex !== null) {
            toggleIcon(selectedIndex);
        }
    };

    const closeDropdown = () => {
        if (isDropdownOpen) {
            setIsDropdownOpen(false);
            dropdownRef.current.classList.remove("show");
        }
    };

    const handleDropdownToggle = (isOpen) => {
        setIsDropdownOpen(isOpen);
    };

    if (isLoading) {
        return <Spinner />
    }

    return (
        <AdminLayout headerTitle={"Roles Accessibility"} isDashboard={false}>
            <div className="roles-accessibility-screen">
                <div className="border border-light-grey rounded-4 px-3 py-3 pb-0">
                    <div className="table-responsive">
                        <table className="table admin-table text-dark-grey m-0">
                            <thead>
                            <tr className="admin-table-heading-row">
                                <th scope="col" className="col-4 fw-normal fs-17 pe-7 pe-md-3">User</th>
                                <th scope="col" className="col-4 fw-normal fs-17 pe-7 pe-md-3">User Type</th>
                                <th scope="col" className="col-3 fw-normal fs-17 pe-9 pe-md-3">Access</th>
                                <th scope="col" className="col-3 fw-normal fs-17">Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {allRoleAccessAbilities.map((role, index) => (
                                <tr key={role.RoleAccessID} className="admin-table-body-row fw-light fs-14">
                                    <td>{role.UserName}</td>
                                    <td>
                                        <div className="handle-dropdown">
                                            <button
                                                className="btn border-0 text-light fw-light detail-text p-0 d-flex align-items-center gap-2 dropdown-toggle"
                                                data-bs-toggle="dropdown"
                                                data-bs-auto-close="outside"
                                                onClick={() => handleDropdownToggle(true)}
                                            >
                                                {role.UserType}
                                            </button>
                                            <ul className="dropdown-menu py-0 px-3 role-accessibility-dropdown-inset" ref={dropdownRef}>
                                                {userTypes.map(userType => (
                                                    <li key={userType.value} onClick={() => handleUserTypeChange(index, userType.value)}>
                                                        <a className="dropdown-item ps-0 py-2 border-bottom detail-text fw-normal dropdown-text-color">
                                                            {userType.label}
                                                        </a>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="handle-dropdown">
                                            <button
                                                className="btn border-0 text-light fw-light detail-text p-0 d-flex align-items-center gap-2 dropdown-toggle"
                                                data-bs-toggle="dropdown"
                                                data-bs-auto-close="outside"
                                                onClick={() => handleDropdownToggle(true)}
                                            >
                                                {role.Access}
                                            </button>
                                            <ul className="dropdown-menu py-0 px-3 role-accessibility-dropdown-inset" ref={dropdownRef}>
                                                {permissionAccessTypes.map(accessType => (
                                                    <li key={accessType.value} onClick={() => handleAccessChange(index, accessType.value)}>
                                                        <a className="dropdown-item ps-0 py-2 border-bottom detail-text fw-normal dropdown-text-color">
                                                            {accessType.label}
                                                        </a>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </td>
                                    <td>
                                        <button className="btn border-0 p-0" onClick={() => handleIconClick(index)}>
                                            <img
                                                src={iconStates[index] === 1 ? unblockIcon : blockIcon} // Toggle icon based on status
                                                alt={iconStates[index] === 1 ? 'Unblock' : 'Block'}
                                                className="cursor-pointer"
                                            />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="d-flex justify-content-end align-items-center mt-4 gap-4">
                    <div className="text-dark-grey-2">Page 1/9</div>
                    <div className="d-flex align-items-center gap-2">
                        <button
                            className="admin-prev-page-btn border border-black-10 rounded-1 bg-transparent d-flex align-items-center">
                            <img src={LeftArrowGreyIcon} alt="Previous"/>
                        </button>
                        <button
                            className="admin-prev-page-btn bg-grey border-0 rounded-1 bg-transparent d-flex align-items-center justify-content-center">
                            <img src={RightArrowGreyIcon} alt="Next"/>
                        </button>
                    </div>
                </div>

                {/* Overlay */}
                {isDropdownOpen && (
                    <div className="dropdown-overlay" onClick={closeDropdown}></div>
                )}

                {/* Toggle POPUP */}
                {isShowDeleteBox && (
                    <div onClick={() => setIsShowDeleteBox(false)}
                         className="admin-table-delete-confirm bg-black-10 d-flex align-items-center justify-content-center">
                        <div onClick={(e) => e.stopPropagation()}
                             className="admin-table-delete-confirm-box mx-3 py-4 bg-white border border-black-20 rounded-2 d-flex flex-column align-items-center justify-content-center text-center">
                            <img src={actionType === "block" ? lockIcon : unlockIcon} alt="Delete"/>
                            <h5 className="mb-1 mt-2 fw-normal fs-18">
                                {actionType === "block" ? "Block User?" : "Unblock User?"}
                            </h5>
                            <p className="mb-0 text-dark-grey fw-light fs-14">
                                {actionType === "block" ? "Are you sure you want to block this user?" : "Are you sure you want to unblock this user?"}
                            </p>
                            <div className="d-flex align-items-center gap-2 mt-3">
                                <button
                                    onClick={(e) => handlePopupConfirm(e)}
                                    className="btn btn-primary py-2 px-3 rounded-2 fs-14 fw-normal">
                                    {actionType === "block" ? "Yes, Block" : "Yes, Unblock"}
                                </button>
                                <button
                                    onClick={() => setIsShowDeleteBox(false)}
                                    className="btn border border-dark-blue text-dark-blue py-2 px-3 rounded-2 fs-14 fw-normal">
                                    {actionType === "block" ? "No, Keep Unblocked" : "No, Keep Blocked"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}

export default RolesAccessibility;
