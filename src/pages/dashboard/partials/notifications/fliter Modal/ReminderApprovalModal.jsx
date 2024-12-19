import React, {useContext, useEffect, useState} from 'react';
import {AuthContext} from "../../../../../context/AuthContext.jsx";

function ReminderApprovalModal({ showReminderModal, setShowReminderModal, reminder, handleApproveReminder }) {
    if (!showReminderModal) return null;
    const {userType} = useContext(AuthContext);


    const [formValues, setFormValues] = useState({
        ReminderID: '',
        Status: '',
    });

    useEffect(() => {
        if (showReminderModal) {
            setFormValues(prevState => ({
                ...prevState,
                ReminderID: reminder.ReminderID,
                Status: reminder.Status,
            }));
        }
    }, [showReminderModal,reminder]);

    const approveReminder = async (e) => {
        e.stopPropagation();
        handleApproveReminder(formValues);
    };

    return (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} aria-labelledby="detailsModalLabel" aria-hidden={!showReminderModal}>
            <div className="modal-dialog modal-lg modal-dialog-centered">
                <div className="modal-content">
                    {/* Modal Header */}
                    <div className="modal-header">
                        <h5 className="modal-title" id="detailsModalLabel">Reminder Details</h5>
                        <button
                            type="button"
                            className="btn-close"
                            onClick={() => setShowReminderModal(false)}
                            aria-label="Close">
                        </button>
                    </div>

                    {/* Modal Body */}
                    <div className="modal-body">
                        {reminder ? (
                            <div className="container">
                                <div className="row mb-3">
                                    <div className="col-6">
                                        <p><strong>Type:</strong> {reminder.Type}</p>
                                    </div>
                                    <div className="col-6">
                                        <p><strong>Priority:</strong> {reminder.Priority}</p>
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <div className="col-6">
                                        <p><strong>Patient Name:</strong> {reminder.PatientName}</p>
                                    </div>
                                    <div className="col-6">
                                        <p><strong>Due Date:</strong> {reminder.DueDate}</p>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col">
                                        <p><strong>Description:</strong></p>
                                        <p>{reminder.Description}</p>
                                    </div>
                                    <div className="col">
                                        <p><strong>Status:</strong></p>
                                        <p>{reminder.Status === 0 ? 'Unresolved' : 'Resolved'}</p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <p>No reminder selected</p>
                        )}
                    </div>

                    {/* Modal Footer */}
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={() => setShowReminderModal(false)}>Cancel</button>
                        {
                            (reminder.Status === 0) ?
                                <button type="button" className="btn btn-primary" onClick={(e) => approveReminder(e)}>Resolve</button>
                                : ""
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ReminderApprovalModal;
