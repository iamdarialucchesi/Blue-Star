import React, {useContext, useEffect, useState} from "react";

import ProviderLayout from "../../../layouts/provider/ProviderLayout.jsx";
import ProviderAlert from "./provider-dashboard-partials/ProviderAlert.jsx";
import ProviderReminder from "./provider-dashboard-partials/ProviderReminder.jsx";
import ProviderPartientsList from "./provider-dashboard-partials/ProviderPartientsList.jsx";
import ProviderRecent from "./provider-dashboard-partials/ProviderRecent.jsx";
import ProviderSummary from "./provider-dashboard-partials/ProviderSummary.jsx";

import HeartCyanIcon from "../../../assets/images/icons/heart-cyan.png";
import BriefcasePurpleIcon from "../../../assets/images/icons/briefcase-lavender-blue.svg";
import messageGreenIcon from "../../../assets/icons/message-green-icon.svg";
import {AuthContext} from "../../../context/AuthContext.jsx";
import {useNavigate} from "react-router-dom";
import ProviderDashboardService from "./service/ProviderDashboardService.js";
import {useProviderDataStore} from "../../../stores/ProviderDataStore.js";
import useLoaderStore from "../../../stores/LoaderStore.js";
import Spinner from "../../../components/Spinner.jsx";
import NotificationAndReminderService from "../partials/notifications/service/NotificationAndReminderService.js";
import {useAdminDataStore} from "../../../stores/AdminDataStore.js";

function ProviderDashboard() {
    const {authToken} = useContext(AuthContext);
    const { loginUser } = useAdminDataStore();
    const navigate = useNavigate();
    const {providerOrganizationID, setProviderWhiteLabels, providerWhiteLabels} = useProviderDataStore();
    const {isLoading, setLoading} = useLoaderStore();
    const [totalPatients, setTotalPatients] = useState(null);
    const [totalPrograms, setTotalPrograms] = useState(null);
    const [status, setStatus] = useState(0);
    const [order, setOrder] = useState('desc');
    const [allPatients, setAllPatients] = useState([]);
    const [allReminders, setAllReminders] = useState([]);
    const [allAuditLogs, setAllAuditLogs] = useState([]);

    useEffect(() => {
        async function loadData(){
            setLoading(true);
            await fetchAllDashboardItems();
        }

       loadData();
    }, [authToken, providerOrganizationID, navigate, setLoading]);

    const fetchAllDashboardItems = async () => {
        const dashboardItems = await ProviderDashboardService.fetchDashboardItems(authToken, providerOrganizationID, navigate);
        if (dashboardItems && dashboardItems.patientsList) {
            await fetchOrganizationWhiteLabels();
            await fetchOrganizationReminders();
            setAllPatients(dashboardItems.patientsList);
            setTotalPrograms(dashboardItems.totalPrograms);
            setTotalPatients(dashboardItems.totalPatients);
        }
        setLoading(false);
    }

    const fetchOrganizationWhiteLabels = async () => {
        const result = await ProviderDashboardService.fetchOrganizationWhiteLabels(authToken,loginUser.UserId, providerOrganizationID);
        if (result && result.WhiteLabels && result.WhiteLabels.OrganizationID) {
            await setProviderWhiteLabels(result.WhiteLabels);
        } else {
            await setProviderWhiteLabels({});
        }
        if (result && result.AuditLogs){
            setAllAuditLogs(result.AuditLogs);
        }
    }

    const fetchOrganizationReminders = async () => {
        let result = await NotificationAndReminderService.fetchProviderReminders(authToken,order,status,providerOrganizationID);
        if (result && result.reminders) {
            await setAllReminders(result.reminders);
        }
    }

    return (
        <>
            {isLoading ? (
                    <Spinner/>) :
                (
                    <ProviderLayout>
                        <div className="provider-dashboard">
                            {/*3 top cards start here*/}
                            <div
                                className="admin-dashboard-stats gap-4 mb-4">
                                <div
                                    className="admin-dashboard-stat-card admin-dashboard-stat-card-1 border rounded-3 p-3 d-flex align-items-center gap-3">
                                    <img src={HeartCyanIcon} className="custom-width-heartIcon-image"/>
                                    <div>
                                        <h5 className="mb-1 lh-1 text-dark-grey fw-bold">{totalPatients}</h5>
                                        <div className="lh-1 text-dark-grey fw-normal">Total Patients</div>
                                    </div>
                                </div>
                                <div
                                    className="admin-dashboard-stat-card provider-dashboard-stat-card-3 rounded-3 p-3 d-flex align-items-center gap-3">
                                    <img src={messageGreenIcon}/>
                                    <div>
                                        <h5 className="mb-1 lh-1 text-dark-grey fw-bold">47</h5>
                                        <div className="lh-1 text-dark-grey fw-normal">Completed Conversations</div>
                                    </div>
                                </div>
                                <div
                                    className="admin-dashboard-stat-card admin-dashboard-stat-card-2 border rounded-3 p-3 d-flex align-items-center gap-3">
                                    <img src={BriefcasePurpleIcon}/>
                                    <div>
                                        <h5 className="mb-1 lh-1 text-dark-grey fw-bold">{totalPrograms}</h5>
                                        <div className="lh-1 text-dark-grey fw-normal">Total Programs</div>
                                    </div>
                                </div>
                            </div>

                            {/*alert & reminder section*/}
                            <div className="row">
                                <div className="col-md-6">
                                    <ProviderAlert allReminders={allReminders}/>
                                </div>
                                <div className="col-md-6">
                                    <ProviderReminder allReminders={allReminders}/>
                                </div>
                            </div>

                            {/*Patients List Section*/}
                            <ProviderPartientsList allPatients={allPatients}/>

                            {/*Recent Activities & Quick Summary*/}
                            <div className="mt-4">
                                <div className="row">
                                    {/*Recent Activities*/}
                                    <div className="col-md-4">
                                        <ProviderRecent allAuditLogs={allAuditLogs}/>
                                    </div>

                                    {/*Ai summary section*/}
                                    <div className="col-md-8">
                                        <ProviderSummary patients={allPatients}/>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </ProviderLayout>
                )
            }
        </>
    )
}

export default ProviderDashboard;
