import React, { useContext } from "react";
import AdminLayout from "../../../../layouts/dashboard/AdminLayout.jsx";
import {AuthContext} from "../../../../context/AuthContext.jsx";
import { useLocation, useNavigate } from "react-router-dom";
import CrossRedIcon from "../../../../assets/icons/red-cross-circle-icon.svg";
import PatientsProgramsService from "../../partials/interactions/service/PatientsProgramsService.js";

function AdminNotificationDetail() {
    const navigate = useNavigate();
    const location = useLocation();
    const {authToken} = useContext(AuthContext);
    const { alert } = location.state || {};

    const handleUpdateAlert = async (alertId) => {
        try {
            const formValues = {
                AlertID: alertId
            };
            const result = await PatientsProgramsService.updateAlertResolved(authToken, formValues);

            if (result.status === 200) {
                navigate("/notifications")
            }
        } catch (error) {
            console.error('Error updating alert:', error);
        }
    };

    return (
        <AdminLayout headerTitle={"Notifications"} isDashboard={true}>
            <div>

                <div className="card border rounded-3">
                    <div className="card-body px-3">
                        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-5 g-2 g-lg-3">
                            <div className="col">
                                <div className='mb-0'>
                                    <p className="content-small-text-color fw-light detail-text-small-size m-0">Patient
                                        Name</p>
                                    <p className="m-0 text-light fw-normal detail-text detail-text">{alert.Patient.PatientName}</p>
                                </div>
                            </div>

                            <div className="col">
                                <div className='mb-0'>
                                    <p className="content-small-text-color fw-light detail-text-small-size m-0">ID</p>
                                    <p className="m-0 text-light fw-normal detail-text detail-text">{alert.Patient.PatientID}</p>
                                </div>
                            </div>

                            <div className="col">
                                <div className='mb-0'>
                                    <p className="content-small-text-color fw-light detail-text-small-size m-0">Date of
                                        Birth</p>
                                    <p className="m-0 text-light fw-normal detail-text detail-text">{alert.Patient.DateOfBirth}</p>
                                </div>
                            </div>

                            <div className="col">
                                <div className='mb-0'>
                                    <p className="content-small-text-color fw-light detail-text-small-size m-0">Phone</p>
                                    <p className="m-0 text-light fw-normal detail-text detail-text">{alert.Patient.PhoneNumber}</p>
                                </div>
                            </div>

                            <div className="col pe-0">
                                <div className='mb-0'>
                                    <p className="content-small-text-color fw-light detail-text-small-size m-0">Email</p>
                                    <p className="m-0 text-light fw-normal detail-text detail-text">{alert.Patient.EmailAddress}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-4 border rounded-3 p-3">
                    <h5 className="text-dark fw-normal fs-18 d-flex gap-2 align-items-center">
                        <span><img src={CrossRedIcon}/></span>
                        Alert Message
                    </h5>
                    <p className="text-light detail-text fw-light m-0">{alert.Message}</p>
                </div>

                <div
                    className="mt-4 rounded-3 p-3 border overflow-y-auto overflow-hidden custom-scrollbar-section-1 alert-detail-action-height">
                    <h4 className="text-dark fw-normal fs-18 mb-3">Possible Actions</h4>
                    {alert.RecommendedActions?.length > 0 ? (
                        alert.RecommendedActions.map((item, index) => (
                            <p key={index} className="alert-detail-action-text-background p-3 text-light fw-light detail-text rounded-3">
                                {item}
                            </p>
                        ))
                    ) : (
                        <p className='text-light detail-text'>No actionable items available.</p>
                    )}
                </div>

                <div className="text-end mt-4">
                <button 
                    onClick={() => !alert.Resolved && handleUpdateAlert(alert.AlertID)} 
                    className="btn btn-primary detail-text fw-normal"
                >
                    {alert.Resolved ? 'Resolved' : 'Mark Resolved'}
                </button>
                </div>
            </div>
        </AdminLayout>
    )
}

export default AdminNotificationDetail;
