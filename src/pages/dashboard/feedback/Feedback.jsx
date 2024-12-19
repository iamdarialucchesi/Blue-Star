import React, {useContext, useEffect, useState} from "react";

import AdminLayout from "../../../layouts/dashboard/AdminLayout.jsx";

import DustbinRedIcon from "../../../assets/images/icons/dustbin-red.svg";
import LeftArrowGreyIcon from "../../../assets/images/icons/arrow-left-dark-grey.svg";
import RightArrowGreyIcon from "../../../assets/images/icons/arrow-right-dark-grey.svg";
import DustbinRedWhitePicture from "../../../assets/images/dustbin-red-white.png";
import pdfIcon from "../../../assets/icons/pdf-icon.svg";
import {AuthContext} from "../../../context/AuthContext.jsx";
import Spinner from "../../../components/Spinner.jsx";
import FeedbackService from "./service/FeedbackService.js";
import {useAdminDataStore} from "../../../stores/AdminDataStore.js";

function Feedback() {
    const [isLoading, setIsLoading] = useState(false);
    const {authToken} = useContext(AuthContext);
    const {loginUser} = useAdminDataStore();
    const [deletedFeedback, setDeletedFeedback] = useState({});
    const [adminFeedbacks, setAdminFeedbacks] = useState([]);
    const [isShowDeleteBox, setIsShowDeleteBox] = useState("d-none") // d-flex

    const showDeleteBox = async (e, feedback) => {
        e.stopPropagation();
        await setDeletedFeedback(feedback)
        setIsShowDeleteBox("d-flex")
    }

    useEffect(() => {
        fetchFeedbacks();
    }, []);


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

    const fetchFeedbacks = async (userId) => {
        try {
            setIsLoading(true);
            const result = await FeedbackService.fetchAllFeedbacks(authToken);
            setIsLoading(false);
            if (result && result.Feedbacks) {
                setAdminFeedbacks(result.Feedbacks);
            }
        } catch (error) {
            setIsLoading(false);
            console.error("Error:", error);
        }
    };

    const handleFeedbackDelete = async (e) => {
        e.stopPropagation();
        setIsLoading(true);
        const result = await FeedbackService.deleteFeedback(authToken, deletedFeedback.FeedbackID, loginUser);
        setIsLoading(false);
        if (result.status === 200) {
            setIsShowDeleteBox("d-none")
            if (result.status === 200) {
                setAdminFeedbacks(prevFeedbacks =>
                    prevFeedbacks.filter(p => p.FeedbackID !== deletedFeedback.FeedbackID)
                );
            }
        }
    }

    if (isLoading) {
        return <Spinner />
    }

    return (
        <AdminLayout headerTitle={"Feedback"} isDashboard={false}>
            <div className="feedback-screen">
                <div className="border border-light-grey rounded-4 px-3 pt-2 pb-0">
                    <div>
                        <div className="table-responsive">
                            <table className="table admin-table text-dark-grey m-0">
                                <thead>
                                <tr className="admin-table-heading-row">
                                    <th scope="col" className="fw-normal fs-17 pe-9 pe-md-3">User</th>
                                    <th scope="col" className="fw-normal fs-17 pe-7 pe-md-3">Description</th>
                                    <th scope="col" className="col-4 fw-normal fs-17 pe-5 pe-md-3">Submitted Timestamp</th>
                                    <th scope="col" className="fw-normal fs-17">Actions</th>
                                </tr>
                                </thead>
                                <tbody>
                                {adminFeedbacks && adminFeedbacks.map((feedback) => (
                                    <tr key={feedback.FeedbackID} className="admin-table-body-row fw-light fs-14">
                                        <td>{feedback.UserName}</td>
                                        <td>
                                            {feedback.Description}
                                        </td>
                                        <td>{formatDate(feedback.CreatedAt)}</td>
                                        <td>
                                            <div className='d-flex gap-2'>
                                                <button
                                                    onClick={(e) => showDeleteBox(e, feedback)}
                                                    className="admin-table-delete-btn border border-red-50 rounded-3 d-flex align-items-center justify-content-center">
                                                    <img src={DustbinRedIcon}/>
                                                </button>
                                            </div>
                                        </td>
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

                {/*DELETE POPUP*/}
                <div
                    onClick={() => setIsShowDeleteBox("d-none")}
                    className={`admin-table-delete-confirm bg-black-10 ${isShowDeleteBox} d-flex align-items-center justify-content-center`}>
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="admin-table-delete-confirm-box mx-3 py-4 bg-white border border-black-20 rounded-2 d-flex flex-column align-items-center justify-content-center text-center">
                        <img src={DustbinRedWhitePicture}/>
                        <h5 className="mb-1 mt-2 fw-normal fs-18">Delete Feedback?</h5>
                        <p className="mb-0 text-dark-grey fw-light fs-14">Are you sure you want to
                            delete this feedback?</p>

                        <div className="d-flex align-items-center gap-2 mt-3">
                            <button
                                onClick={(e) => handleFeedbackDelete(e)}
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
            </div>
        </AdminLayout>
    )
}

export default Feedback;
