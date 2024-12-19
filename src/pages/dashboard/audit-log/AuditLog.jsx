import React, {useContext, useEffect, useState} from "react";
import AdminLayout from "../../../layouts/dashboard/AdminLayout.jsx";

import blockIcon from "../../../assets/icons/block-icon.svg";
import unblockIcon from "../../../assets/icons/unblock-icon.svg";
import lockIcon from "../../../assets/icons/lock-icon.svg";
import unlockIcon from "../../../assets/icons/unlock-icon.svg";
import LeftArrowGreyIcon from "../../../assets/images/icons/arrow-left-dark-grey.svg";
import RightArrowGreyIcon from "../../../assets/images/icons/arrow-right-dark-grey.svg";
import AdminDashboardService from "../admin/service/AdminDashboardService.js";
import AuditLogService from "./service/AuditLogService.js";
import {AuthContext} from "../../../context/AuthContext.jsx";
import Spinner from "../../../components/Spinner.jsx";
import {useNavigate} from "react-router-dom";

function AuditLog() {
    const {authToken} = useContext(AuthContext);
    const navigate = useNavigate();
    const [isShowDeleteBox, setIsShowDeleteBox] = useState("d-none");
    const [iconStates, setIconStates] = useState(Array(9).fill(true));
    const [selectedIndex, setSelectedIndex] = useState(null);
    const [actionType, setActionType] = useState(""); // "block" or "unblock"
    const [isLoading, setIsLoading] = useState(false);
    const [allAuditLogs, setAllAuditLogs] = useState([]);

    useEffect(() => {
        fetchAuditLogs();
    }, []);

    const fetchAuditLogs = async () => {
        setIsLoading(true);
        const auditLogs = await AuditLogService.fetchLogs(authToken,navigate);
        setIsLoading(false);
        if (auditLogs) {
            setAllAuditLogs(auditLogs);
        }
    }

    // Toggle function to update the state
    const toggleIcon = (index) => {
        setIconStates(prevStates =>
            prevStates.map((state, i) => (i === index ? !state : state))
        );
        setIsShowDeleteBox("d-none");
    };

    // Open popup and set the selected index and action type
    const handleIconClick = (index) => {
        setSelectedIndex(index);
        setActionType(iconStates[index] ? "unblock" : "block");
        setIsShowDeleteBox("d-flex");
    };

    // Handle popup confirmation
    const handlePopupConfirm = () => {
        if (selectedIndex !== null) {
            toggleIcon(selectedIndex);
        }
    };

    if (isLoading) {
        return <Spinner />
    }

    return (
        <AdminLayout headerTitle={"Audit Logs"} isDashboard={false}>
            <div className="audit-log-screen">
                <div className="border border-light-grey rounded-4 px-3 pt-4 pb-0">
                    <div className="table-responsive">
                        <table className="table admin-table text-dark-grey m-0">
                            <thead>
                            <tr className="admin-table-heading-row">
                                <th scope="col" className="fw-normal fs-17 pe-8 pe-md-8 pe-lg-4">User</th>
                                <th scope="col" className="fw-normal fs-17 pe-8 pe-md-8 pe-lg-4">Activity</th>
                                <th scope="col" className="fw-normal fs-17 pe-10 pe-md-10 pe-lg-4">IP ID</th>
                                <th scope="col" className="fw-normal fs-17 pe-6 pe-md-8 pe-lg-4">User Type</th>
                                <th scope="col" className="fw-normal fs-17 pe-6 pe-md-8 pe-lg-4">Timestamp</th>
                                <th scope="col" className="fw-normal fs-17">Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {allAuditLogs && allAuditLogs.map((auditLog, index) => (
                                <tr key={auditLog.AuditID} className="admin-table-body-row fw-light fs-14">
                                    <td>{typeof auditLog.UserName === 'object' ? JSON.stringify(auditLog.UserName) : auditLog.UserName}</td>
                                    <td>{typeof auditLog.Activity === 'object' ? JSON.stringify(auditLog.Activity) : auditLog.Activity}</td>
                                    <td>{typeof auditLog.IPID === 'object' ? JSON.stringify(auditLog.IPID) : auditLog.IPID}</td>
                                    <td>{typeof auditLog.UserType === 'object' ? JSON.stringify(auditLog.UserType) : auditLog.UserType}</td>
                                    <td>
                                        {new Date(auditLog.TimeStamp).toLocaleDateString('en-GB', {
                                            day: '2-digit',
                                            month: 'short',
                                            year: 'numeric',
                                        })}
                                    </td>
                                    <td>
                                        <button className="btn border-0 p-0" onClick={() => handleIconClick(index)}>
                                            <img src={iconStates[index] ? blockIcon : unblockIcon} alt="icon" />
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
                            <img src={LeftArrowGreyIcon}/>
                        </button>
                        <button
                            className="admin-prev-page-btn bg-grey border-0 rounded-1 bg-transparent d-flex align-items-center justify-content-center">
                            <img src={RightArrowGreyIcon}/>
                        </button>
                    </div>
                </div>

                {/* Toggle POPUP */}
                <div
                    onClick={() => setIsShowDeleteBox("d-none")}
                    className={`admin-table-delete-confirm bg-black-10 ${isShowDeleteBox} d-flex align-items-center justify-content-center`}>
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="admin-table-delete-confirm-box mx-3 py-4 bg-white border border-black-20 rounded-2 d-flex flex-column align-items-center justify-content-center text-center">
                        <img src={actionType === "block" ? lockIcon : unlockIcon}/>
                        <h5 className="mb-1 mt-2 fw-normal fs-18">
                            {actionType === "block" ? "Block User?" : "Unblock User?"}
                        </h5>
                        <p className="mb-0 text-dark-grey fw-light fs-14">
                            {actionType === "block" ? "Are you sure you want to block this user?" : "Are you sure you want to unblock this user?"}
                        </p>

                        <div className="d-flex align-items-center gap-2 mt-3">
                            <button
                                onClick={handlePopupConfirm}
                                className="btn btn-primary py-2 px-3 rounded-2 fs-14 fw-normal">
                                {actionType === "block" ? "Yes, Block" : "Yes, Unblock"}
                            </button>
                            <button
                                onClick={() => setIsShowDeleteBox("d-none")}
                                className="btn border border-dark-blue text-dark-blue py-2 px-3 rounded-2 fs-14 fw-normal">
                                {actionType === "block" ? "No, Keep Unblocked" : "No, Keep Blocked"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}

export default AuditLog;
