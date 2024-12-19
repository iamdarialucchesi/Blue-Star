import React from "react";
import {Link, useNavigate} from "react-router-dom";

import greenCirclePlusIcon from "../../../../assets/icons/green-circle-plus-icon.svg";
import RightArrow from "../../../../assets/icons/patient-arrow-right.svg";
import purpleMessageIcon from "../../../../assets/icons/purple-message-icon.svg";
import lightestBlueEditIcon from "../../../../assets/icons/lightest-blue-edit-icon.svg";
import {useProviderDataStore} from "../../../../stores/ProviderDataStore.js";

function ProviderPartientsList({allPatients}) {
    const navigate = useNavigate();
    const {providerWhiteLabels} = useProviderDataStore();


    const {LinkColor} = providerWhiteLabels;

    const formatTimeRange = (updatedAtString) => {
        const startTime = new Date(updatedAtString);
        // Assume the end time is 1 hour after the start time
        const endTime = new Date(startTime);
        endTime.setHours(startTime.getHours() + 1);

        const formatTime = (date) => {
            return date.toLocaleTimeString('en-GB', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false, // Use 24-hour format
            });
        };

        return `${formatTime(startTime)} - ${formatTime(endTime)}`;
    };

    // const handlePatientDetail = (e,patient) => {
    //     e.stopPropagation();
    //     navigate('/provider/patients/patient-detail', { state: { patient } });
    // };


    return (
        <>
            <div
                className="provider-patients-list-section border mt-4 mt-md-0 rounded-3 p-3 custom-scrollbar-section">
                {/*table top heading start here*/}
                <div className="d-flex justify-content-between border-bottom pb-2">
                    <h4 className="card-heading fw-bold m-0">Patients List</h4>
                    <div className="d-flex">
                        <Link to='/provider/patients/add-patient' className={`px-2 px-md-3 border-end border-2 ${!LinkColor ? "text-primary" : ""}`}
                              style={{color: LinkColor ? LinkColor : ""}}>
                            <svg width="28" height="28" viewBox="0 0 33 32" fill="currentColor"
                                 xmlns="http://www.w3.org/2000/svg">
                                <rect x="0.277344" width="32" height="32" rx="16" fill="currentColor"/>
                                <path
                                    d="M16.2772 9.41174C16.458 9.41174 16.6313 9.48355 16.7591 9.61136C16.8869 9.73918 16.9587 9.91253 16.9587 10.0933V15.3184H22.1839C22.3646 15.3184 22.538 15.3902 22.6658 15.5181C22.7936 15.6459 22.8654 15.8192 22.8654 16C22.8654 16.1807 22.7936 16.3541 22.6658 16.4819C22.538 16.6097 22.3646 16.6815 22.1839 16.6815H16.9587V21.9067C16.9587 22.0874 16.8869 22.2608 16.7591 22.3886C16.6313 22.5164 16.458 22.5882 16.2772 22.5882C16.0964 22.5882 15.9231 22.5164 15.7953 22.3886C15.6675 22.2608 15.5957 22.0874 15.5957 21.9067V16.6815H10.3705C10.1898 16.6815 10.0164 16.6097 9.88858 16.4819C9.76077 16.3541 9.68896 16.1807 9.68896 16C9.68896 15.8192 9.76077 15.6459 9.88858 15.5181C10.0164 15.3902 10.1898 15.3184 10.3705 15.3184H15.5957V10.0933C15.5957 9.91253 15.6675 9.73918 15.7953 9.61136C15.9231 9.48355 16.0964 9.41174 16.2772 9.41174Z"
                                    fill="#0A263F"/>
                            </svg>
                        </Link>
                        <Link to='/provider/patients' className={`text-decoration-none fw-bold fs-6 ps-2 ps-md-3 d-flex align-items-center ${!LinkColor ? "text-primary" : ""}`}
                              style={{color: LinkColor ? LinkColor : ""}}>
                            View All
                            <svg width="16" height="16" viewBox="0 0 14 11" fill="currentColor"
                                 xmlns="http://www.w3.org/2000/svg" className="ms-1 d-none d-md-block">
                                <path
                                    d="M7.87217 0.75092C7.80211 0.82107 7.76276 0.916164 7.76276 1.01531C7.76276 1.11446 7.80211 1.20955 7.87217 1.2797L11.7227 5.1308L1.65154 5.1308C1.55231 5.1308 1.45715 5.17022 1.38699 5.24039C1.31682 5.31055 1.27741 5.40571 1.27741 5.50494C1.27741 5.60417 1.31682 5.69933 1.38699 5.76949C1.45715 5.83966 1.55231 5.87908 1.65154 5.87908L11.7227 5.87908L7.87217 9.73018C7.80609 9.80111 7.77011 9.89491 7.77182 9.99184C7.77353 10.0888 7.81279 10.1812 7.88134 10.2498C7.94989 10.3183 8.04237 10.3576 8.1393 10.3593C8.23622 10.361 8.33003 10.325 8.40095 10.259L12.8906 5.76933C12.9606 5.69918 13 5.60409 13 5.50494C13 5.40579 12.9606 5.3107 12.8906 5.24055L8.40095 0.75092C8.3308 0.680857 8.23571 0.641503 8.13656 0.641503C8.03742 0.641503 7.94233 0.680856 7.87217 0.75092Z"
                                    fill="currentColor" stroke="currentColor" strokeWidth="0.8"
                                />
                            </svg>
                        </Link>
                    </div>
                </div>
                {/*table top heading end here*/}

                {/*table start here*/}
                <div className="mt-3 position-relative">
                    <div className="table-responsive">
                        <table className="table admin-table text-dark-grey m-0">
                            <thead>
                            {/*table head start here*/}
                            <tr className="admin-table-heading-row">
                                <th scope="col" className="col-3 fw-normal fs-17 pe-7 pe-md-3">Patient Name</th>
                                <th scope="col" className="fw-normal fs-17 pe-7 pe-md-3">Program</th>
                                <th scope="col" className="fw-normal fs-17 pe-7 pe-md-3">Schedule</th>
                                <th scope="col" className="fw-normal fs-17 pe-7 pe-md-3">Action</th>
                                <th scope="col" className="col-2 col-sm-1 fw-normal fs-17 pe-7 pe-md-0"></th>
                            </tr>
                            {/*table head end here*/}
                            </thead>

                            <tbody>
                            {/*table rows start here*/}
                            {allPatients && allPatients.map((patient) => (
                                <tr key={patient.PatientID} className="admin-table-body-row fw-light fs-14">
                                    <td>{patient.FirstName + ' ' + patient.LastName}</td>
                                    <td>{patient.Program.map(p => p.label).join(', ')}</td>
                                    <td>{formatTimeRange(patient.UpdatedAt)}</td>
                                    <td>
                                        <div className='d-flex gap-2'>
                                            <Link>
                                                <img src={purpleMessageIcon}/>
                                            </Link>
                                            <Link>
                                                <img src={lightestBlueEditIcon}/>
                                            </Link>
                                        </div>
                                    </td>
                                    {/*<td>*/}
                                    {/*    <Link*/}
                                    {/*        onClick={(e) => handlePatientDetail(e, patient)}*/}
                                    {/*        className={`text-decoration-none provider-table-font-weight detail-text ${!LinkColor ? 'text-primary border-primary border-bottom border-1' : ''}`}*/}
                                    {/*        style={{*/}
                                    {/*            color: LinkColor || '',*/}
                                    {/*            borderBottom: LinkColor ? `1px solid ${LinkColor}` : '',*/}
                                    {/*        }}>*/}
                                    {/*        View Details*/}
                                    {/*    </Link>*/}
                                    {/*</td>*/}
                                </tr>
                            ))}
                            {/*table rows end here*/}
                            </tbody>


                        </table>
                    </div>
                </div>
                {/*table end here*/}
            </div>
        </>
    )
}

export default ProviderPartientsList;
