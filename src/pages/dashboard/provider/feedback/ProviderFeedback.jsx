import React, {useContext, useEffect, useState} from "react";

import DustbinRedIcon from "../../../../assets/images/icons/dustbin-red.svg";
import LeftArrowGreyIcon from "../../../../assets/images/icons/arrow-left-dark-grey.svg";
import RightArrowGreyIcon from "../../../../assets/images/icons/arrow-right-dark-grey.svg";
import DustbinRedWhitePicture from "../../../../assets/images/dustbin-red-white.png";
import pdfIcon from "../../../../assets/icons/pdf-icon.svg";
import ProviderLayout from "../../../../layouts/provider/ProviderLayout.jsx";
import PlusBlackIcon from "../../../../assets/images/icons/black-plus.svg";
import {useProviderDataStore} from "../../../../stores/ProviderDataStore.js";
import {useAdminDataStore} from "../../../../stores/AdminDataStore.js";
import AdminProviderService from "../../settings/service/AdminProviderService.js";
import Spinner from "../../../../components/Spinner.jsx";
import ProviderFeedbackService from "./service/ProviderFeedbackService";
import {AuthContext} from "../../../../context/AuthContext.jsx";

function ProviderFeedback() {
    const [isLoading, setIsLoading] = useState(false);
    const {authToken} = useContext(AuthContext);
    const [providersFeedback, setProvidersFeedback] = useState([]);
    const [isShowFilterModal, setIsShowFilterModal] = useState(false) // true


    // State for form values
    const { providerOrganizationID } = useProviderDataStore();
    const { loginUser } = useAdminDataStore();

    const [formValues, setFormValues] = useState({
        Description: "",
        OrganizationID: "",
        UserID:"",
    });

    useEffect(() => {
        fetchProvidersFeedback();
    }, []);

    const fetchProvidersFeedback = async (userId) => {
        try {
            setIsLoading(true);
            const result = await ProviderFeedbackService.fetchProvidersFeedback(authToken,providerOrganizationID);
            setIsLoading(false);
            if (result && result.Feedbacks) {
                setProvidersFeedback(result.Feedbacks);
            }
        } catch (error) {
            setIsLoading(false);
            console.error("Error:", error);
        }
    };



    // State for form validation errors
    const [errors, setErrors] = useState({});

    const [isShowDeleteBox, setIsShowDeleteBox] = useState("d-none"); // d-flex
    const [isShowAddFeedback, setIsShowAddFeedback] = useState("d-none"); // d-flex

    // Handle input change
    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setFormValues({...formValues, [name]: value});
    };

    // Validate form inputs
    const validateForm = () => {
        let formErrors = {};
        formValues.OrganizationID = providerOrganizationID;
        formValues.UserID = loginUser.UserId;
        if (!formValues.Description) {
            formErrors.Description = "Description is required.";
        }
        setErrors(formErrors);
        return Object.keys(formErrors).length === 0;
    };

    // Helper function to format date to 'MM/DD/YYYY HH:MM:SS'
    function formatDate(isoDate) {
        if (!isoDate) return ''; // Handle case when CreatedAt is missing or undefined

        const date = new Date(isoDate);

        // Get date components
        const day = date.getUTCDate(); // Get day of the month
        const month = date.getUTCMonth() + 1; // Months are zero-based, so we add 1
        const year = date.getUTCFullYear(); // Get the full year
        const hours = date.getUTCHours(); // Get the hours
        const minutes = date.getUTCMinutes(); // Get the minutes
        const seconds = date.getUTCSeconds(); // Get the seconds

        // Ensure double digits for time (e.g., 01:05:09 instead of 1:5:9)
        const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

        // Format as MM/DD/YYYY HH:MM:SS
        return `${month}/${day}/${year} ${formattedTime}`;
    }


    // Handle form submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            try {
                setIsLoading(true);
                const result = await ProviderFeedbackService.createProviderFeedback(authToken, formValues, loginUser);
                setIsLoading(false);
                if (result.status === 200) {
                    setIsShowFilterModal(false)
                    fetchProvidersFeedback();
                }
            } catch (error) {
                setIsLoading(false);
                console.error('Update failed:', error);
            }
        }
    };

    if (isLoading) {
        return <Spinner />
    }

    return (
        <ProviderLayout headerTitle={"Feedback"} isDashboard={false}>
            <div className="d-flex justify-content-end align-items-end mb-4">
                <button
                    className="btn btn-primary py-2 d-flex gap-2 align-items-center justify-content-center"
                    onClick={() => setIsShowFilterModal(true)}>Add Feedback
                    <img src={PlusBlackIcon} alt="Add Feedback"/>
                </button>
            </div>
            <div className="feedback-screen">
                <div className="">
                    <div className="border border-light-grey rounded-4 px-3 pt-2 pb-0">
                        <div>
                            <div className="table-responsive">
                                <table className="table admin-table text-dark-grey m-0">
                                    <thead>
                                    <tr className="admin-table-heading-row">
                                        <th scope="col" className="fw-normal fs-17 pe-9 pe-md-3">User</th>
                                        <th scope="col" className="fw-normal fs-17 pe-7 pe-md-3">Description</th>
                                        <th scope="col" className="col-4 fw-normal fs-17 pe-5 pe-md-3">Submitted
                                            Timestamp
                                        </th>
                                        {/*<th scope="col" className="fw-normal fs-17">Actions</th>*/}
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {providersFeedback && providersFeedback.map((feedback) => (
                                        <tr key={feedback.FeedbackID} className="admin-table-body-row fw-light fs-14">
                                            <td>{feedback.UserName}</td>
                                            <td>
                                                {feedback.Description}
                                            </td>
                                            <td>{formatDate(feedback.CreatedAt)}</td>
                                            {/*<td>*/}
                                            {/*    <div className='d-flex gap-2'>*/}
                                            {/*        <button*/}
                                            {/*            onClick={() => setIsShowDeleteBox("d-flex")}*/}
                                            {/*            className="admin-table-delete-btn border border-red-50 rounded-3 d-flex align-items-center justify-content-center">*/}
                                            {/*            <img src={DustbinRedIcon}/>*/}
                                            {/*        </button>*/}
                                            {/*    </div>*/}
                                            {/*</td>*/}
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div className="d-flex justify-content-end align-items-center mt-4 gap-4">
                        <div className="text-dark-grey-2">Page 1/9</div>
                        <div className="d-flex align-items-center gap-2">
                            <button
                                className="admin-prev-page-btn border border-black-10 rounded-1 bg-transparent d-flex align-items-center">
                                <img src={LeftArrowGreyIcon}/>
                            </button>
                            <button
                                className="admin-prev-page-btn bg-grey border-0 rounded-1 bg-transparent d-flex align-items-center justify-content-center">
                                <img src={RightArrowGreyIcon}/>
                            </button>
                        </div>
                    </div>
                </div>

                {/* DELETE POPUP */}
                <div
                    onClick={() => setIsShowDeleteBox("d-none")}
                    className={`admin-table-delete-confirm bg-black-10 ${isShowDeleteBox} d-flex align-items-center justify-content-center`}>
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="admin-table-delete-confirm-box mx-3 py-4 bg-white border border-black-20 rounded-2 d-flex flex-column align-items-center justify-content-center text-center">
                        <img src={DustbinRedWhitePicture} alt="Delete"/>
                        <h5 className="mb-1 mt-2 fw-normal fs-18">Delete Feedback?</h5>
                        <p className="mb-0 text-dark-grey fw-light fs-14">Are you sure you want to delete this
                            feedback?</p>
                        <div className="d-flex align-items-center gap-2 mt-3">
                            <button
                                onClick={() => setIsShowDeleteBox("d-none")}
                                className="d-flex align-items-center bg-parrot-green border-0 py-2 px-3 rounded-2 fs-14 fw-normal">
                                Yes, Delete
                            </button>
                            <button
                                onClick={() => setIsShowDeleteBox("d-none")}
                                className="d-flex align-items-center bg-transparent border border-dark-blue text-dark-blue py-2 px-3 rounded-2 fs-14 fw-normal">
                                Keep Feedback
                            </button>
                        </div>
                    </div>
                </div>


                {/* ADD FEEDBACK POPUP */}
                {isShowFilterModal && (
                    <>
                        <div onClick={() => setIsShowFilterModal(false)}
                             className={`light-black-modal-overlay ${isShowFilterModal ? 'show' : ''} bg-black-10`}>
                        </div>
                        <div className="modal fade show d-block" tabIndex="-1" aria-labelledby="feedbackModalLabel"
                             aria-modal="true" role="dialog">
                            <div className="modal-dialog modal-dialog-centered" role="document">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title" id="feedbackModalLabel">Add Feedback</h5>
                                        <button
                                            type="button"
                                            className="btn-close"
                                            onClick={() => setIsShowFilterModal(false)}
                                            aria-label="Close"
                                        />
                                    </div>
                                    <div className="modal-body">
                                        <form onSubmit={handleSubmit}>
                                            <div className="mb-3">
                                                <label htmlFor="description" className="form-label">Description</label>
                                                <textarea
                                                    id="description"
                                                    name="Description"
                                                    className="form-control"
                                                    value={formValues.Description}
                                                    onChange={handleInputChange}
                                                    rows="4"
                                                />
                                                {errors.Description &&
                                                    <small className="text-danger">{errors.Description}</small>}
                                            </div>
                                            <div className="d-flex justify-content-end">
                                                <button type="submit" className="btn btn-primary">Submit</button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}

            </div>
        </ProviderLayout>
    );
}

export default ProviderFeedback;
