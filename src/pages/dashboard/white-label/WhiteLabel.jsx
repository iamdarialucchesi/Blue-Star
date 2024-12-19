import React, {useContext, useRef, useState} from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../../layouts/dashboard/AdminLayout.jsx";
import blackUploadIcon from "../../../assets/icons/black-upload-icon.svg";
import {useAdminDataStore} from "../../../stores/AdminDataStore.js";
import {AuthContext} from "../../../context/AuthContext.jsx";
import WhiteLabelService from "./service/WhiteLabelService.js";
import {useWhiteLabelsStore} from "../../../stores/WhiteLabelsStore.js";
import Select from "react-select";
import Spinner from "../../../components/Spinner.jsx";

function WhiteLabel() {
    const { loginUser } = useAdminDataStore();
    const { allOrganizations } = useWhiteLabelsStore();
    const {authToken} = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState(false);
    const fileInputRef = useRef(null);
    const navigate = useNavigate();
    const [formValues, setFormValues] = useState({
        OrganizationID: "",
        OrganizationName: "",
        PrimaryColor: "",
        SecondaryColor: "",
        LinkColor: "",
        ButtonColor: "",
        BackgroundColor: "",
        LogoUrl: null
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const organizationOptions = Array.isArray(allOrganizations) && allOrganizations.length > 0
        ? allOrganizations.map((org) => ({
            value: org.OrganizationID,
            label: org.OfficialName
        }))
        : [];

    const handleInputChange = (e) => {
        const { name, value, type, files } = e.target;

        if (name === "OrganizationName") {
            const selectedOrg = organizationOptions.find(option => option.value === value);
            setFormValues({
                ...formValues,
                OrganizationID: selectedOrg ? selectedOrg.value : "",
                OrganizationName: selectedOrg ? selectedOrg.label : ""
            });
        } else {
            setFormValues({
                ...formValues,
                [name]: type === "file" ? 'abc.png' : value
                // [name]: type === "file" ? files[0] : value
            });
        }
    };


    const validateForm = () => {
        const newErrors = {};
        const currentDate = new Date().toISOString();
        formValues.CreatedAt = currentDate;
        if (!formValues.OrganizationID) newErrors.OrganizationID = "Organization Name is required";
        if (!formValues.OrganizationName) newErrors.OrganizationName = "Organization Name is required";
        // if (!formValues.LogoUrl) newErrors.LogoUrl = "Logo is required";
        if (!formValues.PrimaryColor) newErrors.PrimaryColor = "Primary color is required";
        if (!formValues.SecondaryColor) newErrors.SecondaryColor = "Secondary color is required";
        if (!formValues.LinkColor) newErrors.LinkColor = "Link color is required";
        if (!formValues.ButtonColor) newErrors.ButtonColor = "Button color is required";
        if (!formValues.BackgroundColor) newErrors.BackgroundColor = "Background color is required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSaveClick = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            setLoading(true);
            try {
                setIsLoading(true);
                const result = await WhiteLabelService.saveWhiteLabel(authToken, formValues, loginUser);
                setIsLoading(false);
                if (result.status === 200) {
                    navigate('/white-label-view');
                }
            } catch (error) {
                setIsLoading(false);
                console.error('Update failed:', error);
            }
        }
    };

    function handleFileUploadClick() {
        fileInputRef.current.click();
    }

    if (isLoading) {
        return <Spinner />
    }

    return (
        <AdminLayout headerTitle={"White Label"} isDashboard={false}>
            <div className="white-label-screen rounded-3 border p-3">
                {/*form*/}
                <div>
                    <form>
                        <div className="row">
                            <div className="col-md-6">
                                <label htmlFor="OrganizationName" className="text-dark detail-text fw-normal pb-1">
                                    Organization Name
                                </label>
                                <select
                                    name="OrganizationName"
                                    value={formValues.OrganizationID}
                                    onChange={handleInputChange}
                                    className="form-control rounded-3 placeholder-add-patient bg-field white-label-input-padding"
                                    id='OrganizationName'
                                >
                                    <option value="">Select Organization</option>
                                    {organizationOptions && organizationOptions.map(option => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                                {errors.OrganizationName && <small className="text-danger">{errors.OrganizationName}</small>}
                            </div>
                            {/*<div className="col-md-6">*/}
                            {/*    <label htmlFor="logoUpload" className="text-dark detail-text fw-normal pb-1">*/}
                            {/*        Upload Logo. Aspect Ratio 3:1*/}
                            {/*    </label>*/}
                            {/*    <div className="d-grid">*/}
                            {/*        <button*/}
                            {/*            type="button"*/}
                            {/*            className="d-flex justify-content-between btn black-upload-input-border rounded-3 text-start placeholder-add-patient bg-field white-label-input-padding px-3 content-text-color"*/}
                            {/*            onClick={handleFileUploadClick}*/}
                            {/*        >*/}
                            {/*            Logo*/}
                            {/*            <img src={blackUploadIcon} width={16} alt="Upload" />*/}
                            {/*        </button>*/}
                            {/*    </div>*/}
                            {/*    <input*/}
                            {/*        type="file"*/}
                            {/*        id="LogoUrl"*/}
                            {/*        name="LogoUrl"*/}
                            {/*        className="form-control d-none"*/}
                            {/*        ref={fileInputRef}*/}
                            {/*        onChange={handleInputChange}*/}
                            {/*    />*/}
                            {/*    {errors.LogoUrl && <div className="text-danger">{errors.LogoUrl}</div>}*/}
                            {/*</div>*/}
                            <div className="col-12 mt-3">
                                <h6 className="text-dark fw-normal mt-3">Color Schemes</h6>
                            </div>
                            <div className="col-md-6">
                                <label htmlFor="PrimaryColor" className="text-dark detail-text fw-normal pb-1">
                                    Primary Color:
                                </label>
                                <div className="border rounded-3 bg-field">
                                    <div className="input-group">
                                        <input
                                            type="text"
                                            name="PrimaryColor"
                                            value={formValues.PrimaryColor}
                                            className="form-control bg-transparent border-0 white-label-input-padding detail-text"
                                            placeholder="#0D55G2"
                                            readOnly
                                        />
                                        <span className="color-picker-span m-auto">
                                            <input
                                                type="color"
                                                id="PrimaryColor"
                                                name="PrimaryColor"
                                                value={formValues.PrimaryColor}
                                                onChange={handleInputChange}
                                                className="form-control bg-transparent border-0"
                                            />
                                        </span>
                                    </div>
                                </div>
                                {errors.PrimaryColor && <div className="text-danger">{errors.PrimaryColor}</div>}
                            </div>
                            <div className="col-md-6">
                                <label htmlFor="SecondaryColor" className="text-dark detail-text fw-normal pb-1">
                                    Secondary Color:
                                </label>
                                <div className="border rounded-3 bg-field">
                                    <div className="input-group">
                                        <input
                                            type="text"
                                            name="SecondaryColor"
                                            value={formValues.SecondaryColor}
                                            className="form-control bg-transparent border-0 white-label-input-padding detail-text"
                                            placeholder="#0D55G2"
                                            readOnly
                                        />
                                        <span className="color-picker-span m-auto">
                                            <input
                                                type="color"
                                                id="SecondaryColor"
                                                name="SecondaryColor"
                                                value={formValues.SecondaryColor}
                                                onChange={handleInputChange}
                                                className="form-control bg-transparent border-0"
                                            />
                                        </span>
                                    </div>
                                </div>
                                {errors.SecondaryColor && <div className="text-danger">{errors.SecondaryColor}</div>}
                            </div>
                            <div className="col-md-6 mt-3">
                                <label htmlFor="LinkColor" className="text-dark detail-text fw-normal pb-1">
                                    Link Color:
                                </label>
                                <div className="border rounded-3 bg-field">
                                    <div className="input-group">
                                        <input
                                            type="text"
                                            name="LinkColor"
                                            value={formValues.LinkColor}
                                            className="form-control bg-transparent border-0 white-label-input-padding detail-text"
                                            placeholder="#0D55G2"
                                            readOnly
                                        />
                                        <span className="color-picker-span m-auto">
                                            <input
                                                type="color"
                                                id="LinkColor"
                                                name="LinkColor"
                                                value={formValues.LinkColor}
                                                onChange={handleInputChange}
                                                className="form-control bg-transparent border-0"
                                            />
                                        </span>
                                    </div>
                                </div>
                                {errors.LinkColor && <div className="text-danger">{errors.LinkColor}</div>}
                            </div>
                            <div className="col-md-6 mt-3">
                                <label htmlFor="ButtonColor" className="text-dark detail-text fw-normal pb-1">
                                    Button Color:
                                </label>
                                <div className="border rounded-3 bg-field">
                                    <div className="input-group">
                                        <input
                                            type="text"
                                            name="ButtonColor"
                                            value={formValues.ButtonColor}
                                            className="form-control bg-transparent border-0 white-label-input-padding detail-text"
                                            placeholder="#0D55G2"
                                            readOnly
                                        />
                                        <span className="color-picker-span m-auto">
                                            <input
                                                type="color"
                                                id="ButtonColor"
                                                name="ButtonColor"
                                                value={formValues.ButtonColor}
                                                onChange={handleInputChange}
                                                className="form-control bg-transparent border-0"
                                            />
                                        </span>
                                    </div>
                                </div>
                                {errors.ButtonColor && <div className="text-danger">{errors.ButtonColor}</div>}
                            </div>
                            <div className="col-md-6 mt-3">
                                <label htmlFor="BackgroundColor" className="text-dark detail-text fw-normal pb-1">
                                    Background Color:
                                </label>
                                <div className="border rounded-3 bg-field">
                                    <div className="input-group">
                                        <input
                                            type="text"
                                            name="BackgroundColor"
                                            value={formValues.BackgroundColor}
                                            className="form-control bg-transparent border-0 white-label-input-padding detail-text"
                                            placeholder="#0D55G2"
                                            readOnly
                                        />
                                        <span className="color-picker-span m-auto">
                                            <input
                                                type="color"
                                                id="BackgroundColor"
                                                name="BackgroundColor"
                                                value={formValues.BackgroundColor}
                                                onChange={handleInputChange}
                                                className="form-control bg-transparent border-0"
                                            />
                                        </span>
                                    </div>
                                </div>
                                {errors.BackgroundColor && <div className="text-danger">{errors.BackgroundColor}</div>}
                            </div>
                            <div className="col-12">
                                <div className="text-end">
                                    <button
                                        onClick={(e) => handleSaveClick(e)}
                                        disabled={loading}
                                        className="btn btn-primary detail-text text-color-0a263f"
                                    >
                                        Save
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}

export default WhiteLabel;
