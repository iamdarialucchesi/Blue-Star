import React, {useState} from 'react';
import AdminLayout from "../../../layouts/dashboard/AdminLayout.jsx";
import PlusBlackIcon from "../../../assets/images/icons/black-plus.svg";
import ArrowRightParrotGreenIcon from "../../../assets/images/icons/arrow-right-parrot-green.svg";
import OrganizationDetailCreateOrganizationRole from "./partials/OrganizationDetailCreateOrganizationRole.jsx";
import EditCyanIcon from "../../../assets/images/icons/edit-cyan.svg";
import DustbinRedIcon from "../../../assets/images/icons/dustbin-red.svg";
import DustbinRedWhitePicture from "../../../assets/images/dustbin-red-white.png";

const OrganizationPractices =() => {
    const [isShowDeleteBox, setIsShowDeleteBox] = useState("d-none") // d-flex


    return(
        <AdminLayout isDashboard={true} headerTitle={"Healthstream Practice"}>
            <div>
                <div
                    className="organization-practices-main custom-scrollbar-section-1 bg-white border border-light-grey rounded-3 px-3 pt-4 pb-0 mt-4">
                    <div
                        className="d-flex flex-sm-row flex-column gap-sm-0 gap-3 align-items-center justify-content-between border-bottom border-black-10 pb-3 mb-4">
                        <h5 className="mb-0 fw-bolder fs-18">Users</h5>

                        <div className="d-flex align-items-center gap-3">
                            <button type="button" data-bs-toggle="modal"
                                    data-bs-target="#organization-detail-create-org-role-modal"
                                    className="bg-transparent border-0 p-0 d-flex align-items-center justify-content-center gap-2">
                                            <span
                                                className="text-parrot-green fw-bolder">Create Practice Role</span>
                                <img src={ArrowRightParrotGreenIcon}/>
                            </button>
                        </div>
                    </div>

                    <div className="mt-2">
                        <div className="table-responsive">
                            <table className="table admin-program-detail-table">
                                <thead>
                                <tr className="admin-program-detail-table-heading-row">
                                    <th scope="col" className="fw-normal py-3">User Name</th>
                                    <th scope="col" className="fw-normal py-3">Registered Date</th>
                                    <th scope="col" className="fw-normal py-3">Practice Role</th>
                                    <th scope="col" className="fw-normal py-3">Actions</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr className="admin-program-detail-table-body-row fw-light fs-14">
                                    <td>Judy Foster</td>
                                    <td>05/22/24</td>
                                    <td>Director of Operations</td>
                                    <td>
                                        <div className="d-flex gap-2">
                                            <button
                                                className="admin-program-table-edit-btn border border-cyan-50 rounded-3 d-flex align-items-center justify-content-center">
                                                <img src={EditCyanIcon}/>
                                            </button>
                                            <button
                                                onClick={() => setIsShowDeleteBox("d-flex")}
                                                className="admin-program-table-delete-btn border border-red-50 rounded-3 d-flex align-items-center justify-content-center">
                                                <img src={DustbinRedIcon}/>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                                <tr className="admin-program-detail-table-body-row fw-light fs-14">
                                    <td>Judy Foster</td>
                                    <td>05/22/24</td>
                                    <td>Director of Operations</td>
                                    <td>
                                        <div className="d-flex gap-2">
                                            <button
                                                className="admin-program-table-edit-btn border border-cyan-50 rounded-3 d-flex align-items-center justify-content-center">
                                                <img src={EditCyanIcon}/>
                                            </button>
                                            <button
                                                onClick={() => setIsShowDeleteBox("d-flex")}
                                                className="admin-program-table-delete-btn border border-red-50 rounded-3 d-flex align-items-center justify-content-center">
                                                <img src={DustbinRedIcon}/>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                                <tr className="admin-program-detail-table-body-row fw-light fs-14">
                                    <td>Judy Foster</td>
                                    <td>05/22/24</td>
                                    <td>Director of Operations</td>
                                    <td>
                                        <div className="d-flex gap-2">
                                            <button
                                                className="admin-program-table-edit-btn border border-cyan-50 rounded-3 d-flex align-items-center justify-content-center">
                                                <img src={EditCyanIcon}/>
                                            </button>
                                            <button
                                                onClick={() => setIsShowDeleteBox("d-flex")}
                                                className="admin-program-table-delete-btn border border-red-50 rounded-3 d-flex align-items-center justify-content-center">
                                                <img src={DustbinRedIcon}/>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                                <tr className="admin-program-detail-table-body-row fw-light fs-14">
                                    <td>Judy Foster</td>
                                    <td>05/22/24</td>
                                    <td>Director of Operations</td>
                                    <td>
                                        <div className="d-flex gap-2">
                                            <button
                                                className="admin-program-table-edit-btn border border-cyan-50 rounded-3 d-flex align-items-center justify-content-center">
                                                <img src={EditCyanIcon}/>
                                            </button>
                                            <button
                                                onClick={() => setIsShowDeleteBox("d-flex")}
                                                className="admin-program-table-delete-btn border border-red-50 rounded-3 d-flex align-items-center justify-content-center">
                                                <img src={DustbinRedIcon}/>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                                <tr className="admin-program-detail-table-body-row fw-light fs-14">
                                    <td>Judy Foster</td>
                                    <td>05/22/24</td>
                                    <td>Director of Operations</td>
                                    <td>
                                        <div className="d-flex gap-2">
                                            <button
                                                className="admin-program-table-edit-btn border border-cyan-50 rounded-3 d-flex align-items-center justify-content-center">
                                                <img src={EditCyanIcon}/>
                                            </button>
                                            <button
                                                onClick={() => setIsShowDeleteBox("d-flex")}
                                                className="admin-program-table-delete-btn border border-red-50 rounded-3 d-flex align-items-center justify-content-center">
                                                <img src={DustbinRedIcon}/>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                                <tr className="admin-program-detail-table-body-row fw-light fs-14">
                                    <td>Judy Foster</td>
                                    <td>05/22/24</td>
                                    <td>Director of Operations</td>
                                    <td>
                                        <div className="d-flex gap-2">
                                            <button
                                                className="admin-program-table-edit-btn border border-cyan-50 rounded-3 d-flex align-items-center justify-content-center">
                                                <img src={EditCyanIcon}/>
                                            </button>
                                            <button
                                                onClick={() => setIsShowDeleteBox("d-flex")}
                                                className="admin-program-table-delete-btn border border-red-50 rounded-3 d-flex align-items-center justify-content-center">
                                                <img src={DustbinRedIcon}/>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                                <tr className="admin-program-detail-table-body-row fw-light fs-14">
                                    <td>Judy Foster</td>
                                    <td>05/22/24</td>
                                    <td>Director of Operations</td>
                                    <td>
                                        <div className="d-flex gap-2">
                                            <button
                                                className="admin-program-table-edit-btn border border-cyan-50 rounded-3 d-flex align-items-center justify-content-center">
                                                <img src={EditCyanIcon}/>
                                            </button>
                                            <button
                                                onClick={() => setIsShowDeleteBox("d-flex")}
                                                className="admin-program-table-delete-btn border border-red-50 rounded-3 d-flex align-items-center justify-content-center">
                                                <img src={DustbinRedIcon}/>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                                <tr className="admin-program-detail-table-body-row fw-light fs-14">
                                    <td>Judy Foster</td>
                                    <td>05/22/24</td>
                                    <td>Director of Operations</td>
                                    <td>
                                        <div className="d-flex gap-2">
                                            <button
                                                className="admin-program-table-edit-btn border border-cyan-50 rounded-3 d-flex align-items-center justify-content-center">
                                                <img src={EditCyanIcon}/>
                                            </button>
                                            <button
                                                onClick={() => setIsShowDeleteBox("d-flex")}
                                                className="admin-program-table-delete-btn border border-red-50 rounded-3 d-flex align-items-center justify-content-center">
                                                <img src={DustbinRedIcon}/>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                                <tr className="admin-program-detail-table-body-row fw-light fs-14">
                                    <td>Judy Foster</td>
                                    <td>05/22/24</td>
                                    <td>Director of Operations</td>
                                    <td>
                                        <div className="d-flex gap-2">
                                            <button
                                                className="admin-program-table-edit-btn border border-cyan-50 rounded-3 d-flex align-items-center justify-content-center">
                                                <img src={EditCyanIcon}/>
                                            </button>
                                            <button
                                                onClick={() => setIsShowDeleteBox("d-flex")}
                                                className="admin-program-table-delete-btn border border-red-50 rounded-3 d-flex align-items-center justify-content-center">
                                                <img src={DustbinRedIcon}/>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                                <tr className="admin-program-detail-table-body-row fw-light fs-14">
                                    <td>Judy Foster</td>
                                    <td>05/22/24</td>
                                    <td>Director of Operations</td>
                                    <td>
                                        <div className="d-flex gap-2">
                                            <button
                                                className="admin-program-table-edit-btn border border-cyan-50 rounded-3 d-flex align-items-center justify-content-center">
                                                <img src={EditCyanIcon}/>
                                            </button>
                                            <button
                                                onClick={() => setIsShowDeleteBox("d-flex")}
                                                className="admin-program-table-delete-btn border border-red-50 rounded-3 d-flex align-items-center justify-content-center">
                                                <img src={DustbinRedIcon}/>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                                <tr className="admin-program-detail-table-body-row fw-light fs-14">
                                    <td>Judy Foster</td>
                                    <td>05/22/24</td>
                                    <td>Director of Operations</td>
                                    <td>
                                        <div className="d-flex gap-2">
                                            <button
                                                className="admin-program-table-edit-btn border border-cyan-50 rounded-3 d-flex align-items-center justify-content-center">
                                                <img src={EditCyanIcon}/>
                                            </button>
                                            <button
                                                onClick={() => setIsShowDeleteBox("d-flex")}
                                                className="admin-program-table-delete-btn border border-red-50 rounded-3 d-flex align-items-center justify-content-center">
                                                <img src={DustbinRedIcon}/>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                                <tr className="admin-program-detail-table-body-row fw-light fs-14">
                                    <td>Judy Foster</td>
                                    <td>05/22/24</td>
                                    <td>Director of Operations</td>
                                    <td>
                                        <div className="d-flex gap-2">
                                            <button
                                                className="admin-program-table-edit-btn border border-cyan-50 rounded-3 d-flex align-items-center justify-content-center">
                                                <img src={EditCyanIcon}/>
                                            </button>
                                            <button
                                                onClick={() => setIsShowDeleteBox("d-flex")}
                                                className="admin-program-table-delete-btn border border-red-50 rounded-3 d-flex align-items-center justify-content-center">
                                                <img src={DustbinRedIcon}/>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                                </tbody>
                            </table>

                        </div>
                        {/*DELETE POPUP*/}
                        <div
                            onClick={() => setIsShowDeleteBox("d-none")}
                            className={`admin-program-table-delete-confirm bg-black-10 ${isShowDeleteBox} d-flex align-items-center justify-content-center`}>
                            <div
                                onClick={(e) => e.stopPropagation()}
                                className="admin-program-table-delete-confirm-box organization-detail-delete-modal mx-3 py-4 bg-white border border-black-20 rounded-2 d-flex flex-column align-items-center justify-content-center text-center">
                                <img src={DustbinRedWhitePicture}/>
                                <h5 className="mb-1 mt-2 fw-normal fs-18">Delete User?</h5>
                                <p className="mb-0 text-dark-grey fw-light fs-14">Are you sure you want to delete
                                    this user?</p>

                                <div className="d-flex align-items-center gap-2 mt-3">
                                    <button
                                        onClick={() => setIsShowDeleteBox("d-none")}
                                        className="d-flex align-items-center bg-parrot-green border-0 py-2 px-3 rounded-2 fs-14 fw-normal">
                                        Yes, Delete
                                    </button>
                                    <button
                                        onClick={() => setIsShowDeleteBox("d-none")}
                                        className="d-flex align-items-center bg-transparent border border-dark-blue text-dark-blue py-2 px-3 rounded-2 fs-14 fw-normal">
                                        Keep User
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    )
}

export default OrganizationPractices;