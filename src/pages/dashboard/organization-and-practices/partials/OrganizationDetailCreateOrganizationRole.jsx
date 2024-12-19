import React, {useState} from 'react';
import {useOrganizationDataStore} from "../../../../stores/OrganizationDataStore.js";
import OrganizationDetaulCreatePracticeRole from "./OrganizationDetailCreatePracticeRole.jsx";

const OrganizationDetailCreateOrganizationRole =({organizationUser,onAssignRole}) => {

    const { organizationRoles } = useOrganizationDataStore();
    const [selectedUser, setSelectedUser] = useState('');
    const [selectedRole, setSelectedRole] = useState('');
    const [roleType, setRoleType] = useState('Organization');
    const [filteredOrganizationRoles, setFilteredOrganizationRoles] = useState([]);
    const [error, setError] = useState('');

    // const PracticeRoles = [
    //     { value: 'Cardiology', label: 'Cardiology' },
    //     { value: 'Diabetes', label: 'Diabetes' },
    //     { value: 'ENT', label: 'ENT' },
    // ];

    const handleChange = (e) => {
        const { id, value } = e.target;
        if (id === 'organizationRole') {
            setSelectedUser(value);
            // Get the selected organization user
            const selectedOrganizationUser = organizationUser.find(user => user.OrganizationUserID === value);

            if (selectedOrganizationUser) {
                // Filter out roles that match the selected user's existing role
                const availableRoles = organizationRoles.filter(role =>
                    role.OrganizationRoleName !== selectedOrganizationUser.OrganizationRole
                );

                setFilteredOrganizationRoles(availableRoles);
            } else {
                setFilteredOrganizationRoles(organizationRoles); // Reset if no user is selected
            }
        }
    };



    const handleAssignRole = (e) => {
        e.preventDefault();

        // Simple validation
        if (!selectedUser || !selectedRole) {
            setError('Please select both a user and a role.');
            return;
        }
        setError('');

        if (onAssignRole) {
            onAssignRole(selectedUser, selectedRole,roleType);
        }
    };

    return (
        <div className="organization-detail-modal organization-detail-create-org-role-modal modal fade"
             id="organization-detail-create-org-role-modal" tabIndex={-1}>
            <div className="modal-dialog modal-dialog-centered">
                <form className="w-100" onSubmit={handleAssignRole}>
                    <div className="modal-content">
                        <div className="modal-header border-bottom-0">
                            <h5 className="modal-title text-dark-grey-4 fw-bolder">Create Organization Role</h5>
                        </div>
                        <div className="modal-body py-0 d-flex flex-column gap-3">
                            <div className="org-detail-select-bg-arrow">
                                <label htmlFor="organizationRole"
                                       className="form-label text-black fs-14 fw-normal">Select User</label>
                                <select
                                    id="organizationRole"
                                    className="form-select placeholder-add-patient border-black-10 fw-light"
                                    aria-label="Default select example"
                                    value={selectedUser}
                                    onChange={handleChange}
                                >
                                    <option value="">Select User</option>
                                    {organizationUser && organizationUser.map(user => (
                                        <option key={user.OrganizationID + '-' + user.FirstName} value={user.OrganizationUserID}>
                                            {user.FirstName + ' ' + user.LastName}
                                        </option>
                                    ))}
                                    {/*<option value="1">Daria</option>*/}
                                    {/*<option value="2">Thomas</option>*/}
                                </select>
                            </div>

                            <div className="org-detail-select-bg-arrow">
                                <label htmlFor="organization-detail-create-org-role-user-field"
                                       className="form-label text-black fs-14 fw-normal">Select Role</label>
                                <select
                                    id="organization-detail-create-org-role-user-field"
                                    className="form-select placeholder-add-patient border-black-10 fw-light"
                                    aria-label="Default select example"
                                    value={selectedRole}
                                    onChange={(e) => setSelectedRole(e.target.value)}
                                >
                                    <option value="">Select Role</option>
                                    {filteredOrganizationRoles.map(option => (
                                        <option key={option.OrganizationRoleID} value={option.OrganizationRoleName}>
                                            {option.OrganizationRoleName}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {error && <div className="text-danger">{error}</div>}

                        </div>
                        <div
                            className="modal-footer border-top-0 justify-content-between align-items-center py-3">
                            <button type="submit" className="btn btn-primary fs-14 fw-normal">Assign</button>
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
