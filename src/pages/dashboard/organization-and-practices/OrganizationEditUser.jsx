import React, {useContext, useEffect, useState} from "react";
import AdminLayout from "../../../layouts/dashboard/AdminLayout.jsx";
import {useLocation, useNavigate} from "react-router-dom";
import OrganizationAndPracticesService from "./service/OrganizationAndPracticesService.js";
import {AuthContext} from "../../../context/AuthContext.jsx";
import {useAdminDataStore} from "../../../stores/AdminDataStore.js";
import {useOrganizationDataStore} from "../../../stores/OrganizationDataStore.js";

const OrganizationEditUser = () => {
    const navigate = useNavigate();
    const { loginUser } = useAdminDataStore();
    const { organizationPracticeNames,organizationRoles, practiceRoles } = useOrganizationDataStore();
    const {authToken} = useContext(AuthContext);
    const location = useLocation();
    const [organizationUser, setOrganizationUser] = useState({});
    // Step 1: Form State
    const [formValues, setFormValues] = useState({
        OrganizationID: "",
        FirstName: "",
        LastName: "",
        DateOfBirth: "",
        Gender: "",
        EmailAddress: "",
        PhoneNumber: "",
        Practice: "",
        OrganizationRole: "",
        PracticeRole: "",
        Address: "",
        City: "",
        State: "",
        ZipCode: "",
        IsDeleted: "",
        CreatedAt: ""
    });

    useEffect(() => {
        if (location.state && location.state.organizationUser) {

            const organizationUser = location.state.organizationUser;
            setOrganizationUser(organizationUser);
            setFormValues({
                OrganizationUserID: organizationUser.OrganizationUserID || '',
                OrganizationID: organizationUser.OrganizationID || '',
                FirstName: organizationUser.FirstName || '',
                LastName: organizationUser.LastName || '',
                DateOfBirth: organizationUser.DateOfBirth || '',
                Gender: organizationUser.Gender || '',
                EmailAddress: organizationUser.EmailAddress || '',
                Password: organizationUser.Password || '',
                PhoneNumber: organizationUser.PhoneNumber || '',
                Practice: organizationUser.Practice || '',
                OrganizationRole: organizationUser.OrganizationRole || '',
                PracticeRole: organizationUser.PracticeRole || '',
                Address: organizationUser.Address || '',
                City: organizationUser.City || '',
                State: organizationUser.State || '',
                ZipCode: organizationUser.ZipCode || '',
                IsDeleted: organizationUser.IsDeleted || 0,
                CreatedAt: organizationUser.CreatedAt || '',
            });
        }
    }, [location.state,authToken]);

    const [errors, setErrors] = useState({});

    // Step 2: Validation Function
    const validateForm = () => {
        const currentDate = new Date().toISOString();
        // formValues.CreatedAt = currentDate;
        let formErrors = {};
        if (!formValues.FirstName) formErrors.FirstName = "First Name is required";
        if (!formValues.LastName) formErrors.LastName = "Last Name is required";
        // if (!formValues.DateOfBirth) formErrors.DateOfBirth = "Date of Birth is required";
        if (!formValues.Gender) formErrors.Gender = "Gender is required";
        if (!formValues.EmailAddress) formErrors.EmailAddress = "Email Address is required";
        if (!formValues.PhoneNumber) formErrors.PhoneNumber = "Phone Number is required";
        // if (!formValues.Practice) formErrors.Practice = "Practice is required";
        // if (!formValues.OrganizationRole) formErrors.OrganizationRole = "Organization Role is required";
        // if (!formValues.PracticeRole) formErrors.PracticeRole = "Practice Role is required";
        if (!formValues.Address) formErrors.Address = "Address is required";
        if (!formValues.City) formErrors.City = "City is required";
        if (!formValues.State) formErrors.State = "State is required";
        if (!formValues.ZipCode) formErrors.ZipCode = "Zip Code is required";

        setErrors(formErrors);

        return Object.keys(formErrors).length === 0;
    };

    // Step 3: Handle Submit
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (validateForm()) {
            try {
                const result = await OrganizationAndPracticesService.addOrganizationUser(authToken,formValues,loginUser);
                if (result.status === 200) {
                    navigate('/organizations/organization-detail');
                }
            } catch (error) {
                console.error('Update failed:', error);
            }
        }
    };

    const genderOptions = [
        { value: 'Male', label: 'Male' },
        { value: 'Female', label: 'Female' },
    ];

    // Step 4: Handle Input Changes
    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormValues({
            ...formValues,
            [id]: value
        });
    };

    return (
        <AdminLayout headerTitle="Edit User" isDashboard={true}>
            <div>
                <section className="border border-light-grey rounded-3 px-3 pt-3 pb-4">
                    <form onSubmit={handleSubmit}>
                        <div className="organization-add-user-form column-gap-3 row-gap-4">
                            <div className="organization-add-user-form-field">
                                <label htmlFor="FirstName" className="form-label text-black fs-14 fw-normal">First Name</label>
                                <input
                                    placeholder="First Name"
                                    id="FirstName"
                                    className="form-control border-light-grey bg-field placeholder-add-patient"
                                    value={formValues.FirstName}
                                    onChange={handleInputChange}
                                />
                                {errors.FirstName && <div className="text-danger fs-12">{errors.FirstName}</div>}
                            </div>

                            <div className="organization-add-user-form-field">
                                <label htmlFor="LastName" className="form-label text-black fs-14 fw-normal">Last Name</label>
                                <input
                                    placeholder="Last Name"
                                    id="LastName"
                                    className="form-control border-light-grey bg-field placeholder-add-patient"
                                    value={formValues.LastName}
                                    onChange={handleInputChange}
                                />
                                {errors.LastName && <div className="text-danger fs-12">{errors.LastName}</div>}
                            </div>

                            {/*<div className="organization-add-user-form-field organization-add-user-form-date position-relative">*/}
                            {/*    <label htmlFor="DateOfBirth" className="form-label text-black fs-14 fw-normal">Date of Birth</label>*/}
                            {/*    <input*/}
                            {/*        placeholder="DOB"*/}
                            {/*        id="DateOfBirth"*/}
                            {/*        type="date"*/}
                            {/*        className="form-control border-light-grey bg-field"*/}
                            {/*        value={formValues.DateOfBirth}*/}
                            {/*        onChange={handleInputChange}*/}
                            {/*    />*/}
                            {/*    {errors.DateOfBirth && <div className="text-danger fs-12">{errors.DateOfBirth}</div>}*/}
                            {/*</div>*/}

                            <div className="organization-add-user-form-field">
                                <label htmlFor="Gender" className="form-label text-black fs-14 fw-normal">Gender</label>
                                <select
                                    id="Gender"
                                    className="form-select bg-field placeholder-add-patient border-light-grey placeholder-add-patient"
                                    value={formValues.Gender}
                                    onChange={handleInputChange}
                                >
                                    <option value="">Select Gender</option>
                                    {genderOptions.map(option => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                                {errors.Gender && <div className="text-danger fs-12">{errors.Gender}</div>}
                            </div>

                            <div className="organization-add-user-form-field">
                                <label htmlFor="EmailAddress" className="form-label text-black fs-14 fw-normal">Email Address</label>
                                <input
                                    placeholder="Email"
                                    id="EmailAddress"
                                    disabled
                                    type="email"
                                    className="form-control border-light-grey bg-field placeholder-add-patient"
                                    value={formValues.EmailAddress}
                                    onChange={handleInputChange}
                                />
                                {errors.EmailAddress && <div className="text-danger fs-12">{errors.EmailAddress}</div>}
                            </div>

                            <div className="organization-add-user-form-field">
                                <label htmlFor="PhoneNumber" className="form-label text-black fs-14 fw-normal">Phone Number</label>
                                <input
                                    placeholder='(123) 456-7890'
                                    id="PhoneNumber"
                                    disabled
                                    className="form-control border-light-grey bg-field placeholder-add-patient"
                                    value={formValues.PhoneNumber}
                                    onChange={handleInputChange}
                                />
                                {errors.PhoneNumber && <div className="text-danger fs-12">{errors.PhoneNumber}</div>}
                            </div>

                            <div className="grid-three-md-one-cols grid-row-col-span-full gap-3">
                                <div className="organization-add-user-form-field">
                                    <label htmlFor="Practice" className="form-label text-black fs-14 fw-normal">Practice</label>
                                    <select
                                        id="Practice"
                                        name="Practice"
                                        className="form-select bg-field border-light-grey placeholder-add-patient"
                                        value={formValues.Practice}
                                        onChange={handleInputChange}
                                    >
                                        <option value="">Select Practice</option>
                                        {organizationPracticeNames.map(option => (
                                            <option key={option} value={option}>
                                                {option}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.Practice && <div className="text-danger fs-12">{errors.Practice}</div>}
                                </div>

                                <div className="organization-add-user-form-field">
                                    <label htmlFor="OrganizationRole" className="form-label text-black fs-14 fw-normal">Organization Role</label>
                                    <select
                                        id="OrganizationRole"
                                        className="form-select bg-field border-light-grey placeholder-add-patient"
                                        value={formValues.OrganizationRole}
                                        onChange={handleInputChange}
                                    >
                                        <option value="">Select Role</option>
                                        {organizationRoles.map(option => (
                                            <option key={option.OrganizationRoleID} value={option.OrganizationRoleName}>
                                                {option.OrganizationRoleName}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.OrganizationRole && <div className="text-danger fs-12">{errors.OrganizationRole}</div>}
                                </div>
                                <div className="organization-add-user-form-field">
                                    <label htmlFor="PracticeRole" className="form-label text-black fs-14 fw-normal">Practice Role</label>
                                    <select
                                        id="PracticeRole"
                                        className="form-select bg-field border-light-grey placeholder-add-patient"
                                        value={formValues.PracticeRole}
                                        onChange={handleInputChange}
                                    >
                                        <option value="">Select Role</option>
                                        {practiceRoles.map(option => (
                                            <option key={option.PracticeRoleID} value={option.PracticeRoleName}>
                                                {option.PracticeRoleName}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.PracticeRole && <div className="text-danger fs-12">{errors.PracticeRole}</div>}
                                </div>
                            </div>

                            <div className="organization-add-user-form-last-row grid-row-col-span-full gap-3">
                                <div className="organization-add-user-form-field">
                                    <label htmlFor="Address" className="form-label text-black fs-14 fw-normal">Address</label>
                                    <input
                                        placeholder="15208 West 119th Street, Olahe, Kansas 666062"
                                        id="Address"
                                        className="form-control border-light-grey bg-field placeholder-add-patient"
                                        value={formValues.Address}
                                        onChange={handleInputChange}
                                    />
                                    {errors.Address && <div className="text-danger fs-12">{errors.Address}</div>}
                                </div>

                                <div className="organization-add-user-form-field">
                                    <label htmlFor="City" className="form-label text-black fs-14 fw-normal">City</label>
                                    <input
                                        placeholder="Olahe"
                                        id="City"
                                        className="form-control border-light-grey bg-field placeholder-add-patient"
                                        value={formValues.City}
                                        onChange={handleInputChange}
                                    />
                                    {errors.City && <div className="text-danger fs-12">{errors.City}</div>}
                                </div>

                                <div className="organization-add-user-form-field">
                                    <label htmlFor="State" className="form-label text-black fs-14 fw-normal">State</label>
                                    <input
                                        placeholder="Kansas"
                                        id="State"
                                        className="form-control border-light-grey bg-field placeholder-add-patient"
                                        value={formValues.State}
                                        onChange={handleInputChange}
                                    />
                                    {errors.State && <div className="text-danger fs-12">{errors.State}</div>}
                                </div>

                                <div className="organization-add-user-form-field">
                                    <label htmlFor="ZipCode" className="form-label text-black fs-14 fw-normal">Zip Code</label>
                                    <input
                                        placeholder="666062"
                                        id="ZipCode"
                                        className="form-control border-light-grey bg-field placeholder-add-patient"
                                        value={formValues.ZipCode}
                                        onChange={handleInputChange}
                                    />
                                    {errors.ZipCode && <div className="text-danger fs-12">{errors.ZipCode}</div>}
                                </div>
                            </div>

                        </div>

                        <div className="d-flex justify-content-end mt-4">
                            <button
                                type="submit"
                                className="d-flex align-items-center gap-2 bg-parrot-green fs-14 text-decoration-none border-0 py-2 px-3 rounded-2 text-dark-blue"
                            >
                                Update User
                            </button>
                        </div>
                    </form>
                </section>
            </div>
        </AdminLayout>
    );
}

export default OrganizationEditUser;
