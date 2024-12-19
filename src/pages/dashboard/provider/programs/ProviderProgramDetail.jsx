import ProviderLayout from "../../../../layouts/provider/ProviderLayout.jsx";
import React, {useContext, useEffect, useState} from "react";

import AvaiblableProviderProfilePicture1 from "../../../../assets/images/available-provider-profile-1.jfif"
import {Link, useLocation, useNavigate} from "react-router-dom";
import PlusBlackIcon from "../../../../assets/images/icons/black-plus.svg";
import ArrowRightParrotGreenIcon from "../../../../assets/images/icons/arrow-right-parrot-green.svg";
import MessageLavenderBlueIcon from "../../../../assets/images/icons/message-lavender-blue.svg";
import EditCyanIcon from "../../../../assets/images/icons/edit-cyan.svg";
import FlagRedIcon from "../../../../assets/images/icons/flag-red.svg"
import FlagOrangeIcon from "../../../../assets/images/icons/flag-orange.svg"
import FlagGreenIcon from "../../../../assets/images/icons/flag-green.svg"
import {AuthContext} from "../../../../context/AuthContext.jsx";
import ProviderProgramService from "./service/ProviderProgramService.js";
import {useProviderDataStore} from "../../../../stores/ProviderDataStore.js";

const ProviderProgramDetail = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const {authToken} = useContext(AuthContext);
    const {providerWhiteLabels} = useProviderDataStore();
    const [program, setProgram] = useState({});
    const [allPatients, setAllPatients] = useState([]);
    const [allProviders, setAllProviders] = useState([]);

    const {LinkColor} = providerWhiteLabels;

    useEffect(() => {
        if (location.state && location.state.program && location.state.providerOrganizationID) {
            const program = location.state.program;
            setProgram(program);
            const organizationId = location.state.providerOrganizationID;
            fetchProgramDetail(program, organizationId);
        }
    }, [location.state]);

    const fetchProgramDetail = async (program, organizationId) => {
        const result = await ProviderProgramService.fetchProgramDetail(authToken, program.ProgramName, organizationId);
        if (result.patients || result.providers) {
            setAllPatients(result.patients);
            setAllProviders(result.providers);
        }
    }

    const handleProvidersView = (e) => {
        e.stopPropagation();
        navigate('/provider/programs/providers-in-program', {state: {program}});
    }
    const handlePatientsView = (e) => {
        e.stopPropagation();
        navigate('/provider/programs/patients-list', {state: {program}});
    }


    const ProgramDetailProgressBar = ({progressPercentage}) => {
        return <div className="admin-program-table-progress-bar rounded-pill overflow-hidden">
            <div style={{width: progressPercentage + "%"}}
                 className={`${(progressPercentage >= 70) ? "progress-above-70" : (progressPercentage >= 33) ? "progress-below-70" : "progress-below-33"} h-100 rounded-pill`}></div>
        </div>
    }

    return (<ProviderLayout headerTitle={program && program.ProgramName} isDashboard={true}>
            <section>
                <div
                    className="d-flex flex-sm-row flex-column gap-sm-0 gap-3 align-items-center justify-content-between mb-3">
                    <h5 className="mb-0 fw-bolder fs-18">Providers Available</h5>
                    {/*<button type="button" data-bs-toggle="modal"*/}
                    {/*        data-bs-target="#organization-detail-create-org-role-modal"*/}
                    <button onClick={(e) => handleProvidersView(e)}
                            className={`btn bg-transparent p-0 rounded-0 d-flex align-items-center fw-bolder justify-content-center gap-2 ${!LinkColor ? "text-parrot-green border-0 border-bottom border-primary" : ""}`}
                            style={{
                                color: LinkColor ? LinkColor : "",
                                borderBottom: LinkColor ? `1px solid ${LinkColor}` : ""
                            }}>
                        View All
                    </button>
                </div>

                <div className="program-detail-providers-available gap-3">
                    {allProviders && allProviders.slice(0, 4).map((provider) => (
                        <div key={provider.OrganizationUserID}
                             className="border border-dark-blue-14 rounded-2 py-2 px-3 d-flex align-items-center gap-3">
                            <img
                                src={AvaiblableProviderProfilePicture1}
                                width={60}
                                height={60}
                                className="rounded-circle object-fit-cover"
                            />
                            <div>{provider.FirstName + ' ' + provider.LastName}</div>
                        </div>
                    ))}
                </div>


                <div className="program-detail-main mt-4 d-flex gap-3 align-items-stretch">
                    <div
                        className="program-detail-patient-list custom-scrollbar-section-1 bg-white border border-light-grey rounded-3 px-3 pt-4 pb-0">
                        <div
                            className="d-flex flex-sm-row flex-column gap-sm-0 gap-3 align-items-center justify-content-between border-bottom border-black-10 pb-3 mb-4">
                            <h5 className="mb-0 fw-bolder fs-18">Patient List</h5>

                            <div className="d-flex align-items-center gap-3">
                                <Link to={"/organizations/organization-add-user"}
                                      className="admin-program-detail-btn d-flex align-items-center justify-content-center border-0 rounded-circle aspect-ratio-1x1"
                                      style={{color: LinkColor ? LinkColor : "text-primary"}}>
                                    <svg width="28" height="28" viewBox="0 0 33 32" fill="currentColor"
                                         xmlns="http://www.w3.org/2000/svg">
                                        <rect x="0.277344" width="32" height="32" rx="16" fill="currentColor"/>
                                        <path
                                            d="M16.2772 9.41174C16.458 9.41174 16.6313 9.48355 16.7591 9.61136C16.8869 9.73918 16.9587 9.91253 16.9587 10.0933V15.3184H22.1839C22.3646 15.3184 22.538 15.3902 22.6658 15.5181C22.7936 15.6459 22.8654 15.8192 22.8654 16C22.8654 16.1807 22.7936 16.3541 22.6658 16.4819C22.538 16.6097 22.3646 16.6815 22.1839 16.6815H16.9587V21.9067C16.9587 22.0874 16.8869 22.2608 16.7591 22.3886C16.6313 22.5164 16.458 22.5882 16.2772 22.5882C16.0964 22.5882 15.9231 22.5164 15.7953 22.3886C15.6675 22.2608 15.5957 22.0874 15.5957 21.9067V16.6815H10.3705C10.1898 16.6815 10.0164 16.6097 9.88858 16.4819C9.76077 16.3541 9.68896 16.1807 9.68896 16C9.68896 15.8192 9.76077 15.6459 9.88858 15.5181C10.0164 15.3902 10.1898 15.3184 10.3705 15.3184H15.5957V10.0933C15.5957 9.91253 15.6675 9.73918 15.7953 9.61136C15.9231 9.48355 16.0964 9.41174 16.2772 9.41174Z"
                                            fill="#0A263F"/>
                                    </svg>
                                </Link>
                                <div className="heading-line-seperator my-1 d-sm-block d-none">
                                </div>
                                {/*<button type="button" data-bs-toggle="modal"*/}
                                {/*        data-bs-target="#organization-detail-create-org-role-modal"*/}
                                <button onClick={(e) => handlePatientsView(e)}
                                        className="bg-transparent border-0 p-0 d-flex align-items-center justify-content-center gap-2 fw-bolder"
                                        style={{color: LinkColor ? LinkColor : "btn-primary"}}>
                                    View All
                                    <svg width="14" height="11" viewBox="0 0 14 11" fill="currentColor"
                                         xmlns="http://www.w3.org/2000/svg" className="mt-n1 ms-1">
                                        <path
                                            d="M7.87217 0.75092C7.80211 0.82107 7.76276 0.916164 7.76276 1.01531C7.76276 1.11446 7.80211 1.20955 7.87217 1.2797L11.7227 5.1308L1.65154 5.1308C1.55231 5.1308 1.45715 5.17022 1.38699 5.24039C1.31682 5.31055 1.27741 5.40571 1.27741 5.50494C1.27741 5.60417 1.31682 5.69933 1.38699 5.76949C1.45715 5.83966 1.55231 5.87908 1.65154 5.87908L11.7227 5.87908L7.87217 9.73018C7.80609 9.80111 7.77011 9.89491 7.77182 9.99184C7.77353 10.0888 7.81279 10.1812 7.88134 10.2498C7.94989 10.3183 8.04237 10.3576 8.1393 10.3593C8.23622 10.361 8.33003 10.325 8.40095 10.259L12.8906 5.76933C12.9606 5.69918 13 5.60409 13 5.50494C13 5.40579 12.9606 5.3107 12.8906 5.24055L8.40095 0.75092C8.3308 0.680857 8.23571 0.641503 8.13656 0.641503C8.03742 0.641503 7.94233 0.680856 7.87217 0.75092Z"
                                            fill="currentColor" stroke="currentColor" strokeWidth="0.8"
                                        />
                                    </svg>
                                </button>
                            </div>
                        </div>


                        <div className="mt-2">
                            <div className="table-responsive">
                                <table className="table admin-program-detail-table">
                                    <thead>
                                    <tr className="admin-program-detail-table-heading-row">
                                        <th scope="col" className="fw-normal py-3">Patient Name</th>
                                        <th scope="col" className="fw-normal py-3">Patient Status</th>
                                        <th scope="col" className="fw-normal py-3">Actions</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {allPatients && allPatients.slice(0, 10).map((patient) => (
                                        <tr key={patient.PatientID}
                                            className="admin-program-detail-table-body-row fw-light fs-14">
                                            <td className="py-3">{patient.FirstName + ' ' + patient.LastName}</td>
                                            <td className="py-3">
                                                <ProgramDetailProgressBar progressPercentage={88}/>
                                            </td>
                                            <td className="py-3">
                                                <div className="d-flex gap-2">
                                                    <button
                                                        className="admin-program-detail-table-message-btn border border-lavender-blue-50 bg-lavender-blue-10 rounded-3 d-flex align-items-center justify-content-center">
                                                        <img src={MessageLavenderBlueIcon}/>
                                                    </button>
                                                    <button
                                                        className="admin-program-detail-table-edit-btn border border-cyan-50 bg-cyan-10 rounded-3 d-flex align-items-center justify-content-center">
                                                        <img src={EditCyanIcon}/>
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

                    <div className="program-detail-right-panel d-flex flex-column align-items-stretch gap-3">
                        <div
                            className="program-detail-recent-activity custom-scrollbar-section-1 bg-white border border-light-grey rounded-3 px-3 pt-4 pb-0">
                            <div
                                className="d-flex flex-sm-row flex-column gap-sm-0 gap-3 align-items-center justify-content-between border-bottom border-black-10 pb-3 mb-4">
                                <h5 className="mb-0 fw-bolder fs-18">Recent Activity</h5>
                            </div>

                            <ul className="list-unstyled mb-0 d-flex flex-column gap-3">
                                <li className="p-3 rounded-3 bg-dark-blue-4">Lorem ipsum dolor sit amet consectetur.
                                    Adipiscing consectetur nisi rutrum at. Odio hendrerit.
                                </li>
                                <li className="p-3 rounded-3 bg-dark-blue-4">Lorem ipsum dolor sit amet consectetur.
                                    Odio
                                    hendrerit.
                                </li>
                                <li className="p-3 rounded-3 bg-dark-blue-4">Lorem ipsum dolor sit amet consectetur.
                                    Adipiscing consectetur nisi rutrum at. Odio hendrerit.
                                </li>
                                <li className="p-3 rounded-3 bg-dark-blue-4">Lorem ipsum dolor sit amet consectetur.
                                    Odio
                                    hendrerit.
                                </li>
                                <li className="p-3 rounded-3 bg-dark-blue-4">Lorem ipsum dolor sit amet consectetur.
                                    Adipiscing consectetur nisi rutrum at. Odio hendrerit.
                                </li>
                                <li className="p-3 rounded-3 bg-dark-blue-4">Lorem ipsum dolor sit amet consectetur.
                                    Odio
                                    hendrerit.
                                </li>
                            </ul>
                        </div>

                        <div
                            className="program-detail-alerts custom-scrollbar-section-1 bg-white border border-light-grey rounded-3 px-3 pt-4 pb-0">
                            <div
                                className="d-flex flex-sm-row flex-column gap-sm-0 gap-3 align-items-center justify-content-between border-bottom border-black-10 pb-3 mb-2">
                                <h5 className="mb-0 fw-bolder fs-18">Alerts</h5>
                            </div>
                            <ul className="list-unstyled mb-0">
                                <li className="d-flex align-items-start gap-2 border-bottom py-3">
                                    <img width={18} src={FlagRedIcon}/>
                                    <div className="flex-grow-1 mt-1">
                                        <h6 className="text-near-black fw-normal">Patient A took medicines</h6>
                                        <p className="mb-0 content-small-text-color fw-light fs-14">Lorem ipsum dolor
                                            sit amet.</p>
                                    </div>
                                    <div className="fs-12 content-small-text-color">12:03</div>
                                </li>

                                <li className="d-flex align-items-start gap-2 border-bottom py-3">
                                    <img width={18} src={FlagOrangeIcon}/>
                                    <div className="flex-grow-1 mt-1">
                                        <h6 className="text-near-black fw-normal">Patient A took medicines</h6>
                                        <p className="mb-0 content-small-text-color fw-light fs-14">Lorem ipsum dolor
                                            sit amet.</p>
                                    </div>
                                    <div className="fs-12 content-small-text-color">12:03</div>
                                </li>
                                <li className="d-flex align-items-start gap-2 border-bottom py-3">
                                    <img width={18} src={FlagGreenIcon}/>
                                    <div className="flex-grow-1 mt-1">
                                        <h6 className="text-near-black fw-normal">Patient A took medicines</h6>
                                        <p className="mb-0 content-small-text-color fw-light fs-14">Lorem ipsum dolor
                                            sit amet.</p>
                                    </div>
                                    <div className="fs-12 content-small-text-color">12:03</div>
                                </li>
                                <li className="d-flex align-items-start gap-2 border-bottom py-3">
                                    <img width={18} src={FlagRedIcon}/>
                                    <div className="flex-grow-1 mt-1">
                                        <h6 className="text-near-black fw-normal">Patient A took medicines</h6>
                                        <p className="mb-0 content-small-text-color fw-light fs-14">Lorem ipsum dolor
                                            sit amet.</p>
                                    </div>
                                    <div className="fs-12 content-small-text-color">12:03</div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>
        </ProviderLayout>
    )
}

export default ProviderProgramDetail
