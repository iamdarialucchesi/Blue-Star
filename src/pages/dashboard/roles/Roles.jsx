import React, {useContext, useEffect, useRef, useState} from "react";
import AdminLayout from "../../../layouts/dashboard/AdminLayout.jsx";
import Spinner from "../../../components/Spinner.jsx";
import {AuthContext} from "../../../context/AuthContext.jsx";
import {useAdminDataStore} from "../../../stores/AdminDataStore.js";
import RolesService from "./service/RolesService.js";
import PlusBlackIcon from "../../../assets/images/icons/black-plus.svg";
import EditCyanIcon from "../../../assets/images/icons/edit-cyan.svg";
import DustbinRedIcon from "../../../assets/images/icons/dustbin-red.svg";

import DustbinRedWhitePicture from "../../../assets/images/dustbin-red-white.png";

function Roles() {
    const [isLoading, setIsLoading] = useState(false);
    const {authToken} = useContext(AuthContext);
    const {loginUser} = useAdminDataStore();
    const [organizationRoles, setOrganizationRoles] = useState([]);
    const [practiceRoles, setPracticeRoles] = useState([]);
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const [isCreateEditModalVisible, setIsCreateEditModalVisible] = useState(false);
    const [formValues, setFormValues] = useState({
        roleID: "",
        roleName: "",
        roleType: ""
    });
    const [roleToEdit, setRoleToEdit] = useState(null);
    const [roleToDelete, setRoleToDelete] = useState(null);
    const [validationError, setValidationError] = useState("");
    const cancelButtonRef = useRef(null);
    const cancelModalButtonRef = useRef(null);

    useEffect(() => {
        fetchRoles();
    }, []);

    const fetchRoles = async () => {
        try {
            setIsLoading(true);
            const result = await RolesService.fetchAllRoles(authToken);
            setIsLoading(false);
            if (result) {
                setOrganizationRoles(result.organization_roles || []);
                setPracticeRoles(result.practice_roles || []);
            }
        } catch (error) {
            setIsLoading(false);
            console.error("Error:", error);
        }
    };

    const handleCreateOrEditRole = async () => {
        if (!formValues.roleName.trim()) {
            setValidationError("Role name is required");
            return;
        }
        setValidationError("");
        try {
            const result = await RolesService.saveRole(authToken, formValues, loginUser);
            setIsLoading(false);
            if (result && result.status ===200 && cancelModalButtonRef.current) {
                cancelModalButtonRef.current.click();
                closeModal();
                await fetchRoles();
            }
            else if (result && result.response && result.response.status === 409) {
                setValidationError("This Role name already exists");
            }
        } catch (error) {
            setIsLoading(false);
            if (error.response && error.response.status === 409) {
                setValidationError("This Role name already exists");
            }
        }
    };

    const handleEditRole = (role, roleType) => {
        setRoleToEdit(role);
        setFormValues({
            roleID: roleType === "Organization" ? role.OrganizationRoleID : role.PracticeRoleID,
            roleName: roleType === "Organization" ? role.OrganizationRoleName : role.PracticeRoleName,
            roleType
        });
        setValidationError("");
        setIsCreateEditModalVisible(true);

    };

    const handleDeleteRole = async () => {
        if (!roleToDelete) return;
        try {
            setIsLoading(true);
            await RolesService.deleteRole(authToken, formValues, loginUser);
            setIsLoading(false);
            setIsDeleteModalVisible(false);
            if (cancelButtonRef.current) {
                cancelButtonRef.current.click();  // Programmatically click the cancel button to close the modal
            }
            await fetchRoles();
        } catch (error) {
            setIsLoading(false);
            console.error("Error deleting role:", error);
        }
    };

    const openDeleteModal = (role, roleType) => {
        // Set the formValues with the data of the role to be deleted
        setFormValues({
            roleID: roleType === "Organization" ? role.OrganizationRoleID : role.PracticeRoleID,
            roleName: roleType === "Organization" ? role.OrganizationRoleName : role.PracticeRoleName,
            roleType:roleType
        });
        setRoleToDelete({ id: role.id, type: roleType });
        setIsDeleteModalVisible(true);
    };

    const closeModal = () => {
        setFormValues({ roleID: "", roleName: "", roleType: "" });
        setRoleToEdit(null);
        setValidationError("");
    };

    if (isLoading) {
        return <Spinner/>;
    }

    return (
        <AdminLayout headerTitle={"Roles"} isDashboard={false}>
            <div className="roles-screen">
                {/* Organization Roles Table */}
                <RoleTable
                    roles={organizationRoles}
                    title="Organization Roles"
                    roleType="Organization"
                    onEdit={handleEditRole}
                    onDelete={openDeleteModal}
                    onCreate={() => setFormValues({roleID: "", roleName: "", roleType: "Organization" })}
                />

                {/* Practice Roles Table */}
                <RoleTable
                    roles={practiceRoles}
                    title="Practice Roles"
                    roleType="Practice"
                    onEdit={handleEditRole}
                    onDelete={openDeleteModal}
                    onCreate={() => setFormValues({ roleName: "", roleType: "Practice" })}
                />

                {/* Create/Edit Role Modal */}
                <Modal
                    id="createEditRoleModal"
                    title={roleToEdit ? "Edit Role" : "Create New Role"}
                    formValues={formValues}
                    validationError={validationError}
                    onClose={closeModal}
                    onSave={handleCreateOrEditRole}
                    cancelModalButtonRef={cancelModalButtonRef}
                    onInputChange={(e) => setFormValues({ ...formValues, [e.target.name]: e.target.value })}
                />

                {/* Common Delete Modal */}
                {isDeleteModalVisible && (
                    <DeleteModal
                        onConfirm={handleDeleteRole}
                        onCancel={() => setIsDeleteModalVisible(false)}
                        cancelButtonRef={cancelButtonRef}  // Pass the ref here
                    />
                )}
            </div>
        </AdminLayout>
    );
}

export default Roles;

// Reusable Role Table Component
function RoleTable({ roles, title, roleType, onEdit, onDelete, onCreate }) {
    return (
        <div className="border border-light-grey rounded-4 px-3 pt-2 pb-0 mb-4">
            <div className="d-flex justify-content-between align-items-center mb-2">
                <h5>{title}</h5>
                <button
                    onClick={onCreate}
                    className="admin-program-detail-btn d-flex align-items-center justify-content-center bg-parrot-green border-0 rounded-circle aspect-ratio-1x1"
                    data-bs-toggle="modal"
                    data-bs-target="#createEditRoleModal"
                >
                    <img src={PlusBlackIcon} alt="Add"/>
                </button>
            </div>
            <div className="table-responsive">
                <table className="table admin-table text-dark-grey m-0">
                    <thead>
                    <tr>
                        <th>Role Name</th>
                        <th>Timestamp</th>
                        <th>Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    {roles.map((role,index) => (
                        <tr key={role.OrganizationRoleID || role.PracticeRoleID || index}>
                            <td>{roleType === "Organization" ? role.OrganizationRoleName : role.PracticeRoleName}</td>
                            <td>{new Date(role.CreatedAt).toLocaleString()}</td>
                            <td>
                                <div className="d-flex gap-2">
                                    <button
                                        onClick={() => onEdit(role, roleType)}
                                        className="admin-program-table-edit-btn border border-cyan-50 rounded-3 d-flex align-items-center justify-content-center"
                                        data-bs-toggle="modal"
                                        data-bs-target="#createEditRoleModal"
                                    >
                                        <img src={EditCyanIcon} alt="Edit"/>
                                    </button>
                                    <button onClick={() => onDelete(role, roleType)}
                                            className="admin-program-table-delete-btn border border-red-50 rounded-3 d-flex align-items-center justify-content-center"
                                    >
                                        <img src={DustbinRedIcon} alt="Delete"/>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

// Reusable Modal Component
function Modal({ id, title, formValues, validationError, onClose, onSave, cancelModalButtonRef,onInputChange }) {
    return (
        <div className="modal fade" id={id} data-bs-backdrop="static" data-bs-keyboard="false">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content p-4 bg-white border rounded-3">
                    <h5 className="text-center mb-3">{title}</h5>
                    <input
                        type="text"
                        name="roleName"
                        className="form-control mb-1"
                        placeholder="Enter Role Name"
                        value={formValues.roleName}
                        onChange={onInputChange}
                    />
                    {validationError && <small className="text-danger">{validationError}</small>}
                    <div className="d-flex justify-content-end gap-2 mt-3">
                        <button onClick={onSave} className="btn btn-success">Save</button>
                        <button onClick={onClose} ref={cancelModalButtonRef} className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Common Delete Modal
function DeleteModal({ onConfirm, onCancel,cancelButtonRef  }) {
    return (
        <div
            onClick={onCancel}
            className="admin-program-table-delete-confirm bg-black-10 d-flex align-items-center justify-content-center">
            <div
                onClick={(e) => e.stopPropagation()}
                className="admin-program-table-delete-confirm-box mx-3 py-4 bg-white border border-black-20 rounded-2 d-flex flex-column align-items-center justify-content-center text-center">
                <img src={DustbinRedWhitePicture} alt="Delete icon" />
                <h5 className="mb-1 mt-2 fw-normal fs-18">Delete Role?</h5>
                <p className="mb-0 text-dark-grey fw-light fs-14">Are you sure you want to delete this role?</p>
                <div className="mt-3 d-flex gap-2">
                    <button onClick={onConfirm}
                            className="d-flex align-items-center bg-parrot-green border-0 py-2 px-3 rounded-2 fs-14 fw-normal"
                    >
                        Yes, Delete
                    </button>
                    <button onClick={onCancel} ref={cancelButtonRef} className="btn btn-secondary">Cancel</button>
                </div>
            </div>
        </div>
    );
}
