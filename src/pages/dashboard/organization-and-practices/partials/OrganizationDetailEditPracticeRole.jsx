import React from 'react';

const OrganizationDetailCreateOrganizationRole =() => {
    return (
        <div className="organization-detail-modal organization-detail-create-org-role-modal modal fade"
             id="organization-detail-create-org-role-modal" tabIndex={-1}>
            <div className="modal-dialog modal-dialog-centered">
                <form className="w-100">
                    <div className="modal-content">
                        <div className="modal-header border-bottom-0">
                            <h5 className="modal-title text-dark-grey-4 fw-bolder">Edit practice role</h5>
                            <button type="button" className="btn-close d-none" data-bs-dismiss="modal"
                                    aria-label="Close"></button>
                        </div>
                        <div className="modal-body py-0 d-flex flex-column gap-3">
                            <div className="org-detail-select-bg-arrow">
                                <label htmlFor="organization-detail-edit-role-field"
                                       className="form-label text-black fs-14 fw-normal">Select Role</label>
                                <select id="organization-detail-edit-role-field"
                                        className="form-select placeholder-add-patient border-black-10 fw-light"
                                        aria-label="Default select example">
                                    <option value="1">Director of Operations</option>
                                    <option value="2">Director of Team</option>
                                </select>
                            </div>
                        </div>
                        <div
                            className="modal-footer border-top-0 justify-content-between align-items-center py-3">
                            <button type="submit" className="btn btn-primary rounded-2 fs-14 fw-normal">Assign</button>
                            <button type="button"
                                    className="btn btn-outline-dark rounded-2 fs-14 fw-normal"
                                    data-bs-dismiss="modal">Cancel
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default OrganizationDetailCreateOrganizationRole
