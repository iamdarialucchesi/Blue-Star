import React, {useContext, useEffect, useState} from "react"
import AdminLayout from "../../../layouts/dashboard/AdminLayout.jsx";
import PlusBlackIcon from "../../../assets/images/icons/black-plus.svg";
import ArrowRightParrotGreenIcon from "../../../assets/images/icons/arrow-right-parrot-green.svg"
import EditCyanIcon from "../../../assets/images/icons/edit-cyan.svg";
import MessageLavenderBlueIcon from "../../../assets/images/icons/message-lavender-blue.svg"
import UserProfilePicture from "../../../assets/images/admin_dashboard/user-profile-picture.jpg";
import VerticalThreeDotsBlackIcon from "../../../assets/images/icons/three-dots-vertical-black.svg"
import CalenderDarkBlueIcon from "../../../assets/images/icons/calender-dark-blue.svg"
import {Link, useLocation, useNavigate} from "react-router-dom";
import {Bar} from "react-chartjs-2"
import { Chart as ChartJS } from 'chart.js/auto'
import ProgramService from "./service/ProgramService.js";
import {AuthContext} from "../../../context/AuthContext.jsx";
import ProviderProgramEnrollPatientModal from "../provider/programs/partials/ProviderProgramEnrollPatientModal.jsx";
import Spinner from "../../../components/Spinner.jsx";
import {useAdminDataStore} from "../../../stores/AdminDataStore.js";


const ProgramDetail = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const {authToken} = useContext(AuthContext);
    const { loginUser } = useAdminDataStore();
    const [allPatients, setAllPatients] = useState([]);
    const [allProviders, setAllProviders] = useState([]);
    const [patientNames, setPatientNames] = useState([]);
    const [programNames, setProgramNames] = useState([]);
    const [program, setProgram] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (location.state && location.state.program) {
            const program = location.state.program;
            const patients = location.state.allPatients;
            setProgram(program);
            // Add the complete program object to the programNames array
            setProgramNames([program]);
            setPatientNames(patients);
            fetchAllPatients(program);
        }
    }, [location.state]);

    const fetchAllPatients = async (program) => {
        const result = await ProgramService.fetchProgramPatients(authToken,program.ProgramName);
        if (result && result.patients && result.patients.length > 0) {
            setAllPatients(result.patients);

            // Filter patientNames to exclude patients in result.patients based on PatientID
            setPatientNames((currentPatientNames) =>
                currentPatientNames.filter(
                    (patient) => !result.patients.some((resPatient) => resPatient.PatientID === patient.PatientID)
                )
            );
        }
        if (result && result.providers) {
            setAllProviders(result.providers);
        }
    }

    const handlePatientEdit = (e, patient) => {
        e.stopPropagation();
        navigate('/patients/edit-patient', { state: { patient } });
    }

    const handleEnrollPatient = async (formValues) => {
        try {
            setIsLoading(true);
            const result = await ProgramService.enrollPatientInProgram(authToken, formValues,loginUser);
            setIsLoading(false);
            if (result.status === 200) {
                await fetchAllPatients(program);
            }
        } catch (error) {
            setIsLoading(false);
            console.error('Update failed:', error);
        }
    }

    const handleViewAllPatients = (e) => {
        e.stopPropagation();
        navigate('/patients');
    }
    const handleViewAllProviders = (e) => {
        e.stopPropagation();
        navigate('/organizations');
    }


    const barGraphData = {
        labels: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], // x-axis labels
        datasets: [
            {
                label: "Status",
                data: [50, 150, 320, 270, 50, 120, 390], // Example data values
                backgroundColor: 'rgba(205, 235, 172, 1)', // Bar color
                barThickness: 23,
                borderRadius: 4,
                hoverBackgroundColor: 'rgba(205, 235, 172, 1)', // Color when hovering over a bar
            },
        ],
    };

    const barGraphOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false, // Hides the legend
            },
            title: {
                display: false,
            },
            tooltip: {
                displayColors: false, // Removes the color box from the tooltip
                callbacks: {
                    label: function(context) {
                        // Return only the value of the bar
                        return context.raw;
                    },
                    title: function() {
                        // Return nothing to hide the title (which by default shows the label)
                        return '';
                    }
                }
            },
            datalabels: {
                display: false, // Disable datalabels
            },
        },

        scales: {
            y: {
                min: 0,
                max: 500,
                ticks: {
                    stepSize: 250, // Dividing the y-axis into 3 main parts
                    callback: function (value) {
                        if (value === 0) return 'Stable';      // Bottom (0th value)
                        if (value === 250) return 'Unstable';  // Middle (250th value)
                        if (value === 500) return 'Critical';  // Top (500th value)
                    },
                },
            },
        },
    };

    const ProgramDetailProgressBar = ({progressPercentage}) => {
        return <div className="admin-program-table-progress-bar rounded-pill overflow-hidden">
            <div style={{width: progressPercentage+"%"}}
                 className={`${(progressPercentage >= 70) ? "progress-above-70" : (progressPercentage >= 33) ? "progress-below-70" : "progress-below-33"} h-100 rounded-pill`}></div>
        </div>
    }


    if (isLoading) {
        return <Spinner />
    }

    return (<AdminLayout headerTitle={program && program.ProgramName} isDashboard={true}>
            <div>
                <section
                    className="admin-program-detail-top-table custom-scrollbar-section-1 border border-light-grey rounded-3 px-3 pt-4 pb-0">
                    <div
                        className="d-flex flex-sm-row flex-column gap-sm-0 gap-3 align-items-center justify-content-between border-bottom border-black-10 pb-3 mb-4">
                        <h5 className="mb-0 fw-bolder fs-18">Patients List</h5>

                        <div className="d-flex align-items-stretch gap-3">
                            <button
                                type="button" data-bs-toggle="modal"
                                data-bs-target="#provider-program-enroll-patient-modal"
                                className="admin-program-detail-btn d-flex align-items-center justify-content-center bg-parrot-green border-0 rounded-circle aspect-ratio-1x1">

                            <img src={PlusBlackIcon}/>
                            </button>

                            <ProviderProgramEnrollPatientModal programNames={programNames} patientNames={patientNames}
                                                               handleEnrollPatient={handleEnrollPatient}
                            />
                            <button
                                onClick={(e) => handleViewAllPatients(e)}
                                className="bg-transparent border-0 p-0 d-flex align-items-center justify-content-center gap-2">
                                <span className="text-parrot-green fw-bolder">View all</span>
                                <img src={ArrowRightParrotGreenIcon}/>
                            </button>
                        </div>
                    </div>

                    <div className="mt-2">
                        <div className="table-responsive">
                            <table className="table admin-program-detail-table">
                                <thead>
                                <tr className="admin-program-detail-table-heading-row">
                                    <th scope="col" className="fw-normal py-3">Patient Name</th>
                                    <th scope="col" className="fw-normal py-3">Status</th>
                                    <th scope="col" className="fw-normal py-3">Registered Date</th>
                                    <th scope="col" className="fw-normal py-3">Provider</th>
                                    <th scope="col" className="fw-normal py-3">Actions</th>
                                </tr>
                                </thead>
                                <tbody>
                                {allPatients && allPatients.map((patient) => (
                                    <tr key={patient.PatientID} className="admin-program-detail-table-body-row fw-light fs-14">
                                        <td className="py-3">{patient.FirstName + ' ' + patient.LastName}</td>
                                        <td className="py-3">
                                            <ProgramDetailProgressBar progressPercentage={88}/>
                                        </td>
                                        <td className="py-3">
                                            {new Date(patient.CreatedAt).toLocaleDateString('en-GB', {
                                                day: '2-digit',
                                                month: 'short',
                                                year: 'numeric',
                                            })}
                                        </td>
                                        <td className="py-3">Dr. Alex Watson, Dr. Jean Milburn</td>
                                        <td className="py-3">
                                            <div className="d-flex gap-2">
                                                <button
                                                    className="admin-program-detail-table-message-btn border border-lavender-blue-50 bg-lavender-blue-10 rounded-3 d-flex align-items-center justify-content-center">
                                                    <img src={MessageLavenderBlueIcon}/>
                                                </button>
                                                <button onClick={(e) => handlePatientEdit(e, patient)}
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
                </section>

                <div className="admin-program-detail-bottom-table gap-md-3 gap-4 mt-4">
                    <section
                        className="admin-program-detail-patient-stats custom-scrollbar-section-1 border border-light-grey rounded-3 p-3 d-flex flex-column">
                        <div
                            className="d-flex flex-row align-items-center justify-content-between pb-2 mb-4">
                            <h5 className="mb-0 fw-bolder fs-18">Patient Statistics</h5>

                            <div
                                className="d-flex align-items-center gap-2 bg-parrot-green-14 border border-parrot-green-31 rounded-2 px-2 py-1">
                                <img width={14} height={14} src={CalenderDarkBlueIcon}/>
                                <span className="fs-12 text-dark-blue">1 Jan 2021 - 31 Jan 2021</span>
                            </div>
                        </div>

                        <div
                            className="admin-program-detail-patient-stats-img flex-grow-1 d-flex align-items-center justify-content-center">
                            {/*<img src={PatientStatsGraphPicture} />*/}
                            <Bar data={barGraphData} options={barGraphOptions}/>
                        </div>
                    </section>

                    <section
                        className="admin-program-detail-providers custom-scrollbar-section-1 border border-light-grey rounded-3 p-3">
                        <div
                            className="d-flex flex-row align-items-center justify-content-between border-bottom border-black-10 pb-2 mb-4">
                            <h5 className="mb-0 fw-bolder fs-18">Providers List</h5>

                            <div className="d-flex align-items-stretch gap-3">
                                <button
                                    onClick={(e) => handleViewAllProviders(e)}
                                    className="bg-transparent border-0 p-0 d-flex align-items-center justify-content-center gap-2">
                                    <span className="text-parrot-green fw-bolder">View all</span>
                                    <img src={ArrowRightParrotGreenIcon}/>
                                </button>
                            </div>
                        </div>


                        <ul className="mb-0 list-unstyled admin-program-detail-providers">
                            {allProviders && allProviders.map((provider) => (
                                <li key={provider.OrganizationUserID} className="admin-program-detail-provider d-flex align-items-center border-bottom border-black-10 gap-2 pb-3 pt-3">
                                    <img className="admin-program-detail-provider-img rounded-circle object-fit-cover"
                                         src={provider.ProfilePicture ? provider.ProfilePicture : UserProfilePicture}
                                         width={50} height={50} style={{ borderRadius: '50%',objectFit: 'cover'  }}
                                    />
                                    <div className="flex-grow-1">
                                        <h6 className="mb-1 text-dark-grey fw-normal">{provider.FirstName + ' ' + provider.LastName}</h6>
                                        <div className="fs-14 fw-normal text-grey">{provider.PatientCount} patients</div>
                                    </div>
                                    <button className="bg-transparent border-0 p-0">
                                        <img src={VerticalThreeDotsBlackIcon}/>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </section>
                </div>
            </div>
        </AdminLayout>
    )
}

export default ProgramDetail
