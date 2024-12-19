import React, {useContext, useState,useRef} from 'react';
import OrganizationAndPracticesService from "../service/OrganizationAndPracticesService.js";
import {AuthContext} from "../../../../context/AuthContext.jsx";
import {useOrganizationDataStore} from "../../../../stores/OrganizationDataStore.js";
import {useNavigate} from "react-router-dom";
import {useAdminDataStore} from "../../../../stores/AdminDataStore.js";


const OrganizationDetailAddPracticeModal = () => {
    const {authToken} = useContext(AuthContext);
    const { loginUser } = useAdminDataStore();
    const navigate = useNavigate();
    const { organizationData,setOrganizationReload } = useOrganizationDataStore();
    const [formValues, setFormValues] = useState({
        PracticeName: '',
        Street: '',
        City: '',
        State: '',
        ZipCode: '',
        CreatedAt: ''
    });

    const cancelButtonRef = useRef(null);
    const [errors, setErrors] = useState({});

    const validate = () => {
        const currentDate = new Date().toISOString();
        formValues.CreatedAt = currentDate;
        const newErrors = {};
        if (!formValues.PracticeName) newErrors.PracticeName = 'Practice Name is required';
        if (!formValues.Street) newErrors.Street = 'Street is required';
        if (!formValues.City) newErrors.City = 'City is required';
        if (!formValues.State) newErrors.State = 'State is required';
        if (!formValues.ZipCode) newErrors.ZipCode = 'ZIP Code is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormValues({
            ...formValues,
            [id]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validate()) {
            try {
                formValues.OrganizationID = organizationData.OrganizationID;
                const result = await OrganizationAndPracticesService.addOrganizationPractice(authToken, formValues,loginUser);
                if (result.status === 200) {
                    if (cancelButtonRef.current) {
                        cancelButtonRef.current.click();  // Programmatically click the cancel button to close the modal
                    }
                    await setOrganizationReload(true);
                }
            } catch (error) {
                console.error('Update failed:', error);
            }
        }
    };

    return (
        <div className="organization-detail-modal modal fade"
             id="organization-detail-add-practice-modal" tabIndex={-1}>
            <div className="modal-dialog modal-dialog-centered">
                <form className="w-100" onSubmit={handleSubmit}>
                    <div className="modal-content">
                        <div className="modal-header border-bottom-0">
                            <h5 className="modal-title text-dark-grey-4 fw-bolder">Add Practice</h5>
                            <button type="button" className="btn-close d-none" data-bs-dismiss="modal"
                                    aria-label="Close"></button>
                        </div>
                        <div className="modal-body py-0 d-flex flex-column gap-3">
                            <div className="org-detail-select-bg-arrow">
                                <label htmlFor="PracticeName"
                                       className="form-label text-black fs-14 fw-normal">Practice Name</label>
                                <input
                                    placeholder="Daria"
                                    id="PracticeName"
                                    className="form-control placeholder-add-patient border-black-10 fw-light fs-14"
                                    value={formValues.PracticeName}
                                    onChange={handleChange}
                                />
                                {errors.PracticeName && <small className="text-danger">{errors.PracticeName}</small>}
                            </div>

                            <div className="org-detail-select-bg-arrow">
                                <label htmlFor="Street"
                                       className="form-label text-black fs-14 fw-normal">Street</label>
                                <input
                                    placeholder="3553 Cullen road"
                                    id="Street"
                                    className="form-control placeholder-add-patient border-black-10 fw-light fs-14"
                                    value={formValues.Street}
                                    onChange={handleChange}
                                />
                                {errors.Street && <small className="text-danger">{errors.Street}</small>}
                            </div>

                            <div className="org-detail-select-bg-arrow">
                                <label htmlFor="City"
                                       className="form-label text-black fs-14 fw-normal">City</label>
                                <input
                                    placeholder="New York"
                                    id="City"
                                    className="form-control placeholder-add-patient border-black-10 fw-light fs-14"
                                    value={formValues.City}
                                    onChange={handleChange}
                                />
                                {errors.City && <small className="text-danger">{errors.City}</small>}
                            </div>

                            <div className="grid-two-sm-one-col gap-3">
                                <div className="org-detail-select-bg-arrow">
                                    <label htmlFor="State"
                                           className="form-label text-black fs-14 fw-normal">State</label>
                                    <input
                                        placeholder="New York"
                                        id="State"
                                        className="form-control placeholder-add-patient border-black-10 fw-light fs-14"
                                        value={formValues.State}
                                        onChange={handleChange}
                                    />
                                    {errors.State && <small className="text-danger">{errors.State}</small>}
                                </div>

                                <div className="org-detail-select-bg-arrow">
                                    <label htmlFor="ZipCode"
                                           className="form-label text-black fs-14 fw-normal">ZIP</label>
                                    <input
                                        placeholder="10034"
                                        id="ZipCode"
                                        className="form-control placeholder-add-patient border-black-10 fw-light fs-14"
                                        value={formValues.ZipCode}
                                        onChange={handleChange}
                                    />
                                    {errors.ZipCode && <small className="text-danger">{errors.ZipCode}</small>}
                                </div>
                            </div>
                        </div>
                        <div
                            className="modal-footer border-top-0 justify-content-between align-items-center py-3">
                            <button type="submit" className="btn btn-primary">Create</button>
                            <button type="button"
                                    ref={cancelButtonRef}
                                    className="btn btn-outline-dark rounded-2 fs-14 fw-normal"
                                    data-bs-dismiss="modal">Cancel
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default OrganizationDetailAddPracticeModal;
