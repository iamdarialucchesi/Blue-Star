import React from "react";

const ProfileSettingsChangePasswordModal = () => {
    return (
        <div className="organization-detail-modal modal fade"
             id="profile-settings-change-password-modal" tabIndex={-1}>
            <div className="modal-dialog modal-dialog-centered">
                <form className="w-100">
                    <div className="modal-content">
                        <div className="modal-header border-bottom-0">
                            <h5 className="modal-title text-dark-grey-4 fw-bolder">Change Password</h5>
                            <button type="button" className="btn-close d-none" data-bs-dismiss="modal"
                                    aria-label="Close"></button>
                        </div>
                        <div className="modal-body py-0 d-flex flex-column gap-3">
                            <div className="org-detail-select-bg-arrow">
                                <label htmlFor="profile-settings-current-password-field"
                                       className="form-label text-black fs-14 fw-normal">Enter Current Password</label>
                                <input placeholder=""
                                       id="profile-settings-current-password-field"
                                       className="form-control text-light-grey border-black-10 fw-light fs-14 py-2"/>
                            </div>

                            <div className="org-detail-select-bg-arrow">
                                <label htmlFor="profile-settings-new-password-field"
                                       className="form-label text-black fs-14 fw-normal">Enter New Password</label>
                                <input placeholder=""
                                       id="profile-settings-new-password-field"
                                       className="form-control text-light-grey border-black-10 fw-light fs-14 py-2"/>
                            </div>

                            <div className="org-detail-select-bg-arrow">
                                <label htmlFor="profile-settings-confirm-new-password-field"
                                       className="form-label text-black fs-14 fw-normal">Confirm New Password</label>
                                <input placeholder=""
                                       id="profile-settings-confirm-new-password-field"
                                       className="form-control text-light-grey border-black-10 fw-light fs-14 py-2"/>
                            </div>
                        </div>
                        <div
                            className="modal-footer border-top-0 justify-content-between align-items-center py-3">
                            <button type="submit" className="btn btn-primary py-2">Submit</button>
                            <button type="button"
                                    className="btn cancel-dark-blue-btn d-flex align-items-center bg-transparent border border-dark-blue text-dark-blue rounded-2 fw-normal py-2"
                                    data-bs-dismiss="modal">Cancel
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default ProfileSettingsChangePasswordModal