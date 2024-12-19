import ProviderLayout from "../../../../layouts/provider/ProviderLayout.jsx";
import React, {useContext, useState} from "react";
import {useAdminDataStore} from "../../../../stores/AdminDataStore.js";
import {AuthContext} from "../../../../context/AuthContext.jsx";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEye, faEyeSlash} from "@fortawesome/free-solid-svg-icons";

const ProfileSettingsChangePassword = () => {
    const { loginUser } = useAdminDataStore();
    const { changePassword } = useContext(AuthContext);
    const [formValues, setFormValues] = useState({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: ''
    });
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState({
        currentPassword: false,
        newPassword: false,
        confirmNewPassword: false
    });

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormValues({ ...formValues, [id]: value });
    };

    const togglePasswordVisibility = (field) => {
        setShowPassword({ ...showPassword, [field]: !showPassword[field] });
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formValues.currentPassword) {
            newErrors.currentPassword = "Current password is required.";
        }
        if (!formValues.newPassword) {
            newErrors.newPassword = "New password is required.";
        }
        if (!formValues.confirmNewPassword) {
            newErrors.confirmNewPassword = "Please confirm your new password.";
        } else if (formValues.newPassword !== formValues.confirmNewPassword) {
            newErrors.confirmNewPassword = "Passwords do not match.";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            try {
                await changePassword(formValues.currentPassword, formValues.confirmNewPassword)
            } catch (error) {
                console.error("Failed to change password:", error);
                alert("Failed to change password. Please try again.");
            }
        }
    };


    return (
        <ProviderLayout headerTitle="Change Password" isDashboard={false}>
            <div>
                <section className="admin-create-program border border-light-grey rounded-3 px-3 pt-3 pb-4">
                    <form onSubmit={handleSubmit}>
                        <div className="profile-settings-change-password column-gap-3 row-gap-4">
                            <div>
                                <label htmlFor="currentPassword"
                                       className="form-label text-dark-grey fs-14 fw-normal">Enter Current
                                    Password</label>
                                <div className="input-group">
                                    <input
                                        id="currentPassword"
                                        type={showPassword.currentPassword ? "text" : "password"}
                                        className={`form-control border-light-grey bg-field ${errors.currentPassword ? 'is-invalid' : ''}`}
                                        value={formValues.currentPassword}
                                        onChange={handleInputChange}
                                    />
                                    <span className="input-group-text" onClick={() => togglePasswordVisibility('currentPassword')}>
                                        <FontAwesomeIcon icon={showPassword.currentPassword ? faEyeSlash : faEye} />
                                    </span>
                                    {errors.currentPassword && <div className="invalid-feedback">{errors.currentPassword}</div>}
                                </div>
                            </div>

                            <div>
                                <label htmlFor="newPassword"
                                       className="form-label text-dark-grey fs-14 fw-normal">Enter New
                                    Password</label>
                                <div className="input-group">
                                    <input
                                        id="newPassword"
                                        type={showPassword.newPassword ? "text" : "password"}
                                        className={`form-control border-light-grey bg-field ${errors.newPassword ? 'is-invalid' : ''}`}
                                        value={formValues.newPassword}
                                        onChange={handleInputChange}
                                    />
                                    <span className="input-group-text" onClick={() => togglePasswordVisibility('newPassword')}>
                                        <FontAwesomeIcon icon={showPassword.newPassword ? faEyeSlash : faEye} />
                                    </span>
                                    {errors.newPassword && <div className="invalid-feedback">{errors.newPassword}</div>}
                                </div>
                            </div>

                            <div>
                                <label htmlFor="confirmNewPassword"
                                       className="form-label text-dark-grey fs-14 fw-normal">Confirm New
                                    Password</label>
                                <div className="input-group">
                                    <input
                                        id="confirmNewPassword"
                                        type={showPassword.confirmNewPassword ? "text" : "password"}
                                        className={`form-control border-light-grey bg-field ${errors.confirmNewPassword ? 'is-invalid' : ''}`}
                                        value={formValues.confirmNewPassword}
                                        onChange={handleInputChange}
                                    />
                                    <span className="input-group-text" onClick={() => togglePasswordVisibility('confirmNewPassword')}>
                                        <FontAwesomeIcon icon={showPassword.confirmNewPassword ? faEyeSlash : faEye} />
                                    </span>
                                    {errors.confirmNewPassword && <div className="invalid-feedback">{errors.confirmNewPassword}</div>}
                                </div>
                            </div>
                        </div>
                        <div className="mt-4">
                            <button type="submit" className="btn btn-primary py-2">Submit</button>
                        </div>
                    </form>
                </section>
            </div>
        </ProviderLayout>
    )
}

export default ProfileSettingsChangePassword
