import AdminLayout from "../../../layouts/dashboard/AdminLayout.jsx";
import React, {useContext, useEffect, useRef, useState} from "react";
import {useNavigate} from "react-router-dom";
import PlusBlackIcon from "../../../assets/images/icons/black-plus.svg";
import {AuthContext} from "../../../context/AuthContext.jsx";
import WhiteLabelService from "./service/WhiteLabelService.js";
import {useWhiteLabelsStore} from "../../../stores/WhiteLabelsStore.js";
import Spinner from "../../../components/Spinner.jsx";
import blackUploadIcon from "../../../assets/icons/black-upload-icon.svg";
import {useAdminDataStore} from "../../../stores/AdminDataStore.js";

function WhiteLabelView() {
    const navigate = useNavigate();
    const { loginUser } = useAdminDataStore();
    const {authToken} = useContext(AuthContext);
    const { setAllOrganizations } = useWhiteLabelsStore();
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef(null);
    const [allWhiteLabels, setAllWhiteLabels] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [selectedLabel, setSelectedLabel] = useState(null);
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

    useEffect(() => {
        fetchAllWhiteLabels();
    }, []);

    const fetchAllWhiteLabels = async () => {
        setIsLoading(true);
        const result = await WhiteLabelService.fetchWhiteLabels(authToken);
        setIsLoading(false);
        if (result && (result.whiteLabels || result.organizations)) {
            await setAllWhiteLabels(result.whiteLabels);
            await setAllOrganizations(result.organizations);
        }
    }

    const handleAddClick = () => {
        navigate("/white-label-view/white-label");
    };

    const handleEditClick = (label) => {
        setFormValues({
            OrganizationID: label.OrganizationID || '',
            OrganizationName: label.OrganizationName || '',
            PrimaryColor: label.PrimaryColor || '',
            SecondaryColor: label.SecondaryColor || '',
            LinkColor: label.LinkColor || '',
            ButtonColor: label.ButtonColor || '',
            BackgroundColor: label.BackgroundColor || '',
            LogoUrl: label.LogoUrl || null,
        });
        setSelectedLabel(label);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedLabel(null);
        setFormValues({
            OrganizationID: "",
            OrganizationName: "",
            PrimaryColor: "",
            SecondaryColor: "",
            LinkColor: "",
            ButtonColor: "",
            BackgroundColor: "",
            LogoUrl: null
        });
        setErrors({});
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

    const handleUpdate = async () => {
        if (validateForm()) {
            try {
                setIsLoading(true);
                const result = await WhiteLabelService.saveWhiteLabel(authToken, formValues, loginUser);
                setIsLoading(false);
                if (result.status === 200) {
                    await fetchAllWhiteLabels();
                    handleCloseModal();
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

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            setIsUploading(true);
            try {
                const bucketName = 'bsai-bucket-2';
                const keyName = `organization-logos/${formValues.OrganizationID}/logo`; // Fixed name 'logo'
                const uploadUrl = `https://${bucketName}.s3.amazonaws.com/${keyName}`;

                // Check if the file already exists in S3 (Optional, as we'll overwrite it anyway)
                const checkFileUrl = `https://${bucketName}.s3.amazonaws.com/${keyName}`;
                const checkFileResponse = await fetch(checkFileUrl, {
                    method: 'HEAD',  // HEAD request to check if the file exists
                });

                // Log whether the file already exists or not
                if (checkFileResponse.ok) {
                    console.log('File already exists, updating...');
                } else {
                    console.log('File does not exist, uploading new...');
                }

                // Upload the file, overwriting the existing one if present
                const response = await fetch(uploadUrl, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': file.type,
                    },
                    body: file,
                });

                if (response.ok) {
                    const newLogoUrl = `${response.url}?${new Date().getTime()}`; // Add timestamp to force update
                    setFormValues({
                        ...formValues,
                        LogoUrl: newLogoUrl,
                    });
                } else {
                    const errorText = await response.text();
                    console.error('Error uploading file:', response.status, errorText);
                }
            } catch (error) {
                console.error('Error uploading file:', error);
            } finally {
                setIsUploading(false);
            }
        }
    };






    if (isLoading) {
        return <Spinner />
    }

    return (
        <AdminLayout headerTitle={"White Label"} isDashboard={false}>
            <div className="white-label-screen rounded-3 border p-3">
                <div className="row">
                    {allWhiteLabels && allWhiteLabels.map((label) => (
                        <div key={label.LabelID} className="col-md-6">
                            <div
                                onClick={() => handleEditClick(label)}
                                style={{ cursor: 'pointer' }}
                                className="d-flex justify-content-between align-items-center border rounded-3 bg-field px-3 py-2 mb-4"
                            >
                                <p className="m-0 text-dark fw-normal detail-text">{label.OrganizationName}</p>
                                <div className="d-flex gap-1 mt-n1">
                                    <div className="white-label-view-color-picker ">
                                        <input type="color" disabled value={label.PrimaryColor}
                                               className="bg-transparent border-0 p-0"/>
                                    </div>
                                    <div className="white-label-view-color-picker">
                                        <input type="color" disabled value={label.SecondaryColor}
                                               className="bg-transparent border-0 p-0"/>
                                    </div>
                                    <div className="white-label-view-color-picker">
                                        <input type="color" disabled value={label.LinkColor}
                                               className="bg-transparent border-0 p-0"/>
                                    </div>
                                    <div className="white-label-view-color-picker">
                                        <input type="color" disabled value={label.ButtonColor}
                                               className="bg-transparent border-0 p-0"/>
                                    </div>
                                    <div className="white-label-view-color-picker">
                                        <input type="color" disabled value={label.BackgroundColor}
                                               className="bg-transparent border-0 p-0"/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="row">
                    <div className="col-12">
                        <div className="text-end">
                            <button
                                onClick={handleAddClick}
                                className="btn btn-primary detail-text text-color-0a263f"
                            >
                                Add <img src={PlusBlackIcon} className="mt-n1" alt="Add Icon"/>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Edit Modal */}
            <div className={`modal ${showModal ? "show" : ""}`} style={{ display: showModal ? "block" : "none" }} aria-labelledby="editModalLabel" aria-hidden={!showModal}>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="editModalLabel">Edit White Label</h5>
                            <button type="button" className="btn-close" onClick={handleCloseModal} aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <form>
                                <div className="mb-3">
                                    <label className="form-label">Organization Name</label>
                                    <input
                                        disabled
                                        type="text"
                                        className={`form-control ${errors.OrganizationName ? 'is-invalid' : ''}`}
                                        value={formValues.OrganizationName}
                                        onChange={(e) => setFormValues({ ...formValues, OrganizationName: e.target.value })}
                                    />
                                    {errors.OrganizationName && <small className="text-danger">{errors.OrganizationName}</small>}

                                </div>

                                <div className="mb-3">
                                    <label htmlFor="logoUpload" className="text-dark detail-text fw-normal pb-1">
                                        Upload Logo. Aspect Ratio 3:1
                                    </label>
                                    <div className="d-grid">
                                        <button
                                            type="button"
                                            className="d-flex justify-content-between btn black-upload-input-border rounded-3 text-start placeholder-add-patient bg-field white-label-input-padding px-3 content-text-color"
                                            onClick={handleFileUploadClick}
                                        >
                                            {isUploading ? (
                                                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                            ) : (
                                                <>
                                                    Logo
                                                    <img src={blackUploadIcon} width={16} alt="Upload" />
                                                </>
                                            )}
                                        </button>
                                    </div>
                                    <input
                                        type="file"
                                        id="LogoUrl"
                                        name="LogoUrl"
                                        className="form-control d-none"
                                        ref={fileInputRef}
                                        onChange={handleFileChange}
                                    />
                                    {errors.LogoUrl && <div className="text-danger">{errors.LogoUrl}</div>}
                                    {formValues.LogoUrl && (
                                        <img src={formValues.LogoUrl} alt="Logo Preview" width={60} height={60} style={{ borderRadius: '50%',objectFit: 'cover',marginTop: '10px'}} />
                                    )}
                                </div>


                                <div className="mb-3">
                                    <label className="form-label">Primary Color</label>
                                    <input
                                        type="color"
                                        className={`form-control ${errors.PrimaryColor ? 'is-invalid' : ''}`}
                                        value={formValues.PrimaryColor}
                                        onChange={(e) => setFormValues({ ...formValues, PrimaryColor: e.target.value })}
                                    />
                                    {errors.PrimaryColor && <small className="text-danger">{errors.PrimaryColor}</small>}
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Secondary Color</label>
                                    <input
                                        type="color"
                                        className={`form-control ${errors.SecondaryColor ? 'is-invalid' : ''}`}
                                        value={formValues.SecondaryColor}
                                        onChange={(e) => setFormValues({ ...formValues, SecondaryColor: e.target.value })}
                                    />
                                    {errors.SecondaryColor && <small className="text-danger">{errors.SecondaryColor}</small>}
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Link Color</label>
                                    <input
                                        type="color"
                                        className={`form-control ${errors.LinkColor ? 'is-invalid' : ''}`}
                                        value={formValues.LinkColor}
                                        onChange={(e) => setFormValues({ ...formValues, LinkColor: e.target.value })}
                                    />
                                    {errors.LinkColor && <small className="text-danger">{errors.LinkColor}</small>}
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Button Color</label>
                                    <input
                                        type="color"
                                        className={`form-control ${errors.ButtonColor ? 'is-invalid' : ''}`}
                                        value={formValues.ButtonColor}
                                        onChange={(e) => setFormValues({ ...formValues, ButtonColor: e.target.value })}
                                    />
                                    {errors.ButtonColor && <small className="text-danger">{errors.ButtonColor}</small>}
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Background Color</label>
                                    <input
                                        type="color"
                                        className={`form-control ${errors.BackgroundColor ? 'is-invalid' : ''}`}
                                        value={formValues.BackgroundColor}
                                        onChange={(e) => setFormValues({ ...formValues, BackgroundColor: e.target.value })}
                                    />
                                    {errors.BackgroundColor && <small className="text-danger">{errors.BackgroundColor}</small>}
                                </div>
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>Close</button>
                            <button type="button" className="btn btn-primary" onClick={handleUpdate}>Update</button>
                        </div>
                    </div>
                </div>
            </div>



        </AdminLayout>
    )
}

export default WhiteLabelView;
