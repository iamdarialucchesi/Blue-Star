import React, {useState} from 'react';
import {useOrganizationDataStore} from "../../../../stores/OrganizationDataStore.js";

const OrganizationDetailCreatePracticeRole =({organizationUser, onAssignRole}) => {
    const { practiceRoles } = useOrganizationDataStore();
    const [selectedUser, setSelectedUser] = useState('');
    const [selectedRole, setSelectedRole] = useState('');
    const [roleType, setRoleType] = useState('Practice');
    const [filteredPracticeRoles, setFilteredPracticeRoles] = useState([]);
    const [error, setError] = useState('');
    // const PracticeRoles = [
    //     { value: 'Cardiology', label: 'Cardiology' },
    //     { value: 'Diabetes', label: 'Diabetes' },
    //     { value: 'ENT', label: 'ENT' },
    // ];

    const handleChange = (e) => {
        const { id, value } = e.target;
        if (id === 'practiceRole') {
            setSelectedUser(value);
            // Get the selected organization user
            const selectedOrganizationUser = organizationUser.find(user => user.OrganizationUserID === value);

            if (selectedOrganizationUser) {
                // Filter out roles that match the selected user's existing role
                const availableRoles = practiceRoles.filter(role =>
                    role.PracticeRoleName !== selectedOrganizationUser.PracticeRole
                );

                setFilteredPracticeRoles(availableRoles);
            } else {
                setFilteredPracticeRoles(practiceRoles); // Reset if no user is selected
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
             id="organization-detail-create-practice-role-modal" tabIndex={-1}>
            <div className="modal-dialog modal-dialog-centered">
                <form className="w-100" onSubmit={handleAssignRole}>
                    <div className="modal-content">
                        <div className="modal-header border-bottom-0">
                            <h5 className="modal-title text-dark-grey-4 fw-bolder">Create Practice Role</h5>
                            <button type="button" className="btn-close d-none" data-bs-dismiss="modal"
                                    aria-label="Close"></button>
                        </div>
                        <div className="modal-body py-0 d-flex flex-column gap-3">
                            <div className="org-detail-select-bg-arrow">
                                <label htmlFor="practiceRole"
                                       className="form-label text-black fs-14 fw-normal">Select User</label>
                                <select
                                    id="practiceRole"
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
                                    {filteredPracticeRoles.map(option => (
                                        <option key={option.PracticeRoleID} value={option.PracticeRoleName}>
                                            {option.PracticeRoleName}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            {error && <div className="text-danger">{error}</div>}

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

export default OrganizationDetailCreatePracticeRole
