import React, {useState, useEffect, useContext} from "react";
import AdminLayout from "../../../layouts/dashboard/AdminLayout.jsx";
import {useLocation, useNavigate} from "react-router-dom";
import OrganizationAndPracticesService from "./service/OrganizationAndPracticesService.js";
import {AuthContext} from "../../../context/AuthContext.jsx";
import {useAdminDataStore} from "../../../stores/AdminDataStore.js";
import Spinner from "../../../components/Spinner.jsx"; // Adjust the import path as needed

const EditOrganization = ({ match }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const {authToken} = useContext(AuthContext);
    const { loginUser } = useAdminDataStore();
    const [organization, setOrganization] = useState(null);
    const [formValues, setFormValues] = useState({
        OfficialName: '',
        TelePhone: '',
        Address: '',
        City: '',
        State: '',
        ZipCode: '',
        CreatedAt:''
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (location.state && location.state.organization) {

            const organization = location.state.organization;
            setOrganization(organization);
            setFormValues({
                OrganizationID: organization.OrganizationID || '',
                OfficialName: organization.OfficialName || '',
                TelePhone: organization.TelePhone || '',
                Address: organization.Address || '',
                City: organization.City || '',
                State: organization.State || '',
                ZipCode: organization.ZipCode || '',
                CreatedAt: organization.CreatedAt || '',
            });
        }
    }, [location.state]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormValues(prevValues => ({
            ...prevValues,
            [name]: value
        }));
    };
    const validatePhoneNumber = (input) => {
        const cleaned = ('' + input).replace(/\D/g, ''); // Remove non-numeric characters
        if (cleaned.length !== 10) {
            return ''; // Ensure that the phone number has exactly 10 digits
        }
        const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);

        if (match) {
            return `(${match[1]}) ${match[2]}-${match[3]}`; // Format the number as (XXX) XXX-XXXX
        }
        return ''; // Return empty string if it doesn't match
    };
    const validateForm = () => {
        // const currentDate = new Date().toISOString();
        // formValues.CreatedAt = currentDate;
        const newErrors = {};
        // Validate OfficialName
        if (!formValues.OfficialName) {
            newErrors.OfficialName = 'Official Name is required.';
        } else {
            // Check if OfficialName is a string
            if (typeof formValues.OfficialName !== 'string') {
                newErrors.OfficialName = 'Official Name must be a string.';
            } else {
                // Content Validation: Check for special characters and limit the length
                // const specialCharPattern = /^[a-zA-Z0-9\s]+$/;
                const specialCharPattern = /^[a-zA-Z\s]+$/;
                if (!specialCharPattern.test(formValues.OfficialName)) {
                    newErrors.OfficialName = 'Official Name must not contain special characters.';
                } else if (formValues.OfficialName.length > 40) {
                    newErrors.OfficialName = 'Official Name must be less than or equal to 40 characters.';
                }
            }
        }

        // Validate TelePhone
        if (!formValues.TelePhone) {
            newErrors.TelePhone = 'Telephone is required.';
        } else {
            const formattedPhoneNumber = validatePhoneNumber(formValues.TelePhone);
            if (!formattedPhoneNumber) {
                newErrors.TelePhone = 'Enter a valid 10-digit Telephone in the format (XXX) XXX-XXXX.';
            }else {
                formValues.TelePhone = formattedPhoneNumber;
            }
        }


        // Validate Address
        if (!formValues.Address) {
            newErrors.Address = 'Address is required.';
        } else {
            if (typeof formValues.Address !== 'string') {
                newErrors.Address = 'Address must be a string.';
            } else {
                if (formValues.Address.length < 10) {
                    newErrors.Address = 'Address is too short. It must be at least 10 characters long.';
                } else if (formValues.Address.length > 100) {
                    newErrors.Address = 'Address is too long. It must not exceed 100 characters.';
                }
            }
        }

        // Validate City
        if (!formValues.City) {
            newErrors.City = 'City is required.';
        } else {
            if (typeof formValues.City !== 'string') {
                newErrors.City = 'City must be a string.';
            } else {
                const cityPattern = /^[a-zA-Z\s]+$/;
                if (!cityPattern.test(formValues.City)) {
                    newErrors.City = 'City must contain only alphabetical characters.';
                } else {
                    formValues.City = formValues.City.toLowerCase()
                        .split(' ')
                        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                        .join(' ');
                }
            }
        }

        if (!formValues.State) {
            newErrors.State = 'State is required.';
        } else {
            const titleCaseState = formValues.State.charAt(0).toUpperCase() + formValues.State.slice(1).toLowerCase();
            formValues.State = titleCaseState;
        }


        // Validate ZipCode
        if (!formValues.ZipCode) {
            newErrors.ZipCode = 'Zip Code is required.';
        } else if (!/^\d{5}$/.test(formValues.ZipCode)) {
            newErrors.ZipCode = 'Zip Code must be exactly 5 digits.';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };


    const handleSaveOrganization = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            try {
                setIsLoading(true);
                const result = await OrganizationAndPracticesService.addOrganization(authToken,formValues,loginUser);
                if (result.status === 200) {
                    navigate('/organizations');
                }
                setIsLoading(false);
            } catch (error) {
                setIsLoading(false);
                console.error('Error updating organization:', error);
            }
        }
    };

    if (isLoading) {
        return <Spinner />
    }

    return (
        <AdminLayout headerTitle="Edit Organizations" isDashboard={true}>
            <div>
                <section className="admin-create-program border border-light-grey rounded-3 px-3 pt-3 pb-4">
                    <form onSubmit={handleSaveOrganization}>
                        <div className="add-organizations-form column-gap-3 row-gap-4">
                            <div className="admin-create-program-form-field">
                                <label htmlFor="add-organizations-form-official-name"
                                       className="form-label text-dark-grey fs-14 fw-normal">Official Name</label>
                                <input
                                    name="OfficialName"
                                    placeholder="Austin"
                                    id="add-organizations-form-official-name"
                                    value={formValues.OfficialName}
                                    onChange={handleInputChange}
                                    className="form-control border-light-grey bg-field"
                                />
                                {errors.OfficialName && <div className="text-danger">{errors.OfficialName}</div>}
                            </div>

                            <div className="admin-create-program-form-field">
                                <label htmlFor="add-organizations-form-telephone"
                                       className="form-label text-dark-grey fs-14 fw-normal">Telephone</label>
                                <input
                                    type="text"
                                    name="TelePhone"
                                    placeholder='(123) 456-7890'
                                    id="add-organizations-form-telephone"
                                    value={formValues.TelePhone}
                                    onChange={handleInputChange}
                                    className="form-control border-light-grey bg-field"
                                />
                                {errors.TelePhone && <div className="text-danger">{errors.TelePhone}</div>}
                            </div>

                            <div className="admin-create-program-form-field">
                                <label htmlFor="add-organizations-form-address"
                                       className="form-label text-dark-grey fs-14 fw-normal">Address</label>
                                <input
                                    name="Address"
                                    placeholder="15208 West 119th Street, Olahe, Kansas 66606"
                                    id="add-organizations-form-address"
                                    value={formValues.Address}
                                    onChange={handleInputChange}
                                    className="form-control border-light-grey bg-field"
                                />
                                {errors.Address && <div className="text-danger">{errors.Address}</div>}
                            </div>

                            <div className="admin-create-program-form-field">
                                <label htmlFor="add-organizations-form-city"
                                       className="form-label text-dark-grey fs-14 fw-normal">City</label>
                                <input
                                    name="City"
                                    placeholder="Olahe"
                                    id="add-organizations-form-city"
                                    value={formValues.City}
                                    onChange={handleInputChange}
                                    className="form-control border-light-grey bg-field"
                                />
                                {errors.City && <div className="text-danger">{errors.City}</div>}
                            </div>

                            <div className="admin-create-program-form-field">
                                <label htmlFor="add-organizations-form-state"
                                       className="form-label text-dark-grey fs-14 fw-normal">State</label>
                                <input
                                    name="State"
                                    placeholder="Kansas"
                                    id="add-organizations-form-state"
                                    value={formValues.State}
                                    onChange={handleInputChange}
                                    className="form-control border-light-grey bg-field"
                                />
                                {errors.State && <div className="text-danger">{errors.State}</div>}
                            </div>

                            <div className="admin-create-program-form-field">
                                <label htmlFor="add-organizations-form-zipcode"
                                       className="form-label text-dark-grey fs-14 fw-normal">Zip Code</label>
                                <input
                                    name="ZipCode"
                                    placeholder="66606"
                                    id="add-organizations-form-zipcode"
                                    value={formValues.ZipCode}
                                    onChange={handleInputChange}
                                    className="form-control border-light-grey bg-field"
                                />
                                {errors.ZipCode && <div className="text-danger">{errors.ZipCode}</div>}
                            </div>
                        </div>

                        <div className="d-flex justify-content-end mt-4">
                            <button
                                type="submit"
                                className="d-flex align-items-center gap-2 bg-parrot-green border-0 py-2 px-3 rounded-2 text-dark-blue">
                                Save
                            </button>
                        </div>
                    </form>
                </section>
            </div>
        </AdminLayout>
    );
};

export default EditOrganization;
