import React, {useContext, useEffect, useState} from "react"

import AdminLayout from "../../../layouts/dashboard/AdminLayout.jsx";

import HeartCyanIcon from "../../../assets/images/icons/heart-cyan.svg"
import BriefcasePurpleIcon from "../../../assets/images/icons/briefcase-lavender-blue.svg"
import PersonPlusGreenIcon from "../../../assets/images/icons/person-plus-green.svg"
import DoctorPersonGreenIcon from "../../../assets/images/icons/doctor-person-green.svg"
import FeedbackCyanIcon from "../../../assets/images/icons/feedback-cyan.svg"
import HierarchyLavenderBlueIcon from "../../../assets/images/icons/hierarchy-lavender-blue.svg"
import CalenderDarkBlueIcon from "../../../assets/images/icons/calender-dark-blue.svg";
import {Bar, Line} from "react-chartjs-2";

import { DateRangePicker } from 'react-date-range';
import { addDays } from 'date-fns';
import 'react-date-range/dist/styles.css'; // Main style file
import 'react-date-range/dist/theme/default.css';
import PatientsService from "../patients/service/PatientsService.js";
import AdminDashboardService from "./service/AdminDashboardService.js";
import {AuthContext} from "../../../context/AuthContext.jsx";
import {useNavigate} from "react-router-dom";
import {useAdminDataStore} from "../../../stores/AdminDataStore.js";
import Spinner from "../../../components/Spinner.jsx";
import Cookies from "js-cookie";


const AdminDashboard = () => {
    const {authToken,setUserType} = useContext(AuthContext);
    const { globalUserName } = useAdminDataStore();
    const navigate = useNavigate();
    const [totalPatients, setTotalPatients] = useState(null);
    const [totalPrograms, setTotalPrograms] = useState(null);
    const [totalOrganizations, setTotalOrganizations] = useState(null);
    const [totalProviders, setTotalProviders] = useState(null);
    const [totalFeedbacks, setTotalFeedbacks] = useState(null);
    const [programPatientCounts, setProgramPatientCounts] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [programCounts, setProgramCounts] = useState([]);
    const [patientCounts, setPatientCounts] = useState([]);
    const [weekDays, setWeekDays] = useState([]);



    useEffect(() => {
        fetchAllDashboardItems();
    }, []);

    const fetchAllDashboardItems = async () => {
        setIsLoading(true);
        const dashboardItems = await AdminDashboardService.fetchDashboardItems(authToken,navigate);
        if (dashboardItems) {
            setTotalOrganizations(dashboardItems.totalOrganizations);
            setTotalPatients(dashboardItems.totalPatients);
            setTotalPrograms(dashboardItems.totalPrograms);
            setTotalProviders(dashboardItems.totalProviders);
            setTotalFeedbacks(dashboardItems.totalFeedbacks);
            setProgramPatientCounts(dashboardItems.programPatientCounts);
        }
        setIsLoading(false);
    }

    const [state, setState] = useState([
        {
            startDate: new Date(),
            endDate: addDays(new Date(), 7),
            key: 'selection'
        }
    ]);
    const [isOpen, setIsOpen] = useState(false);

    const toggleDatePicker = () => {
        setIsOpen(!isOpen);
    };

    // Dynamically mapping the data received in the programPatientCounts object
    const barGraphData = programPatientCounts
        ? {
            labels: Object.keys(programPatientCounts),
            datasets: [
                {
                    label: "Patients",
                    data: Object.values(programPatientCounts),
                    backgroundColor: 'rgba(205, 235, 172, 1)',
                    barThickness: 23,
                    borderRadius: 4,
                    hoverBackgroundColor: 'rgba(164, 231, 89, 1)',
                },
            ],
        }
        : {
            labels: [],
            datasets: [
                {
                    label: "Patients",
                    data: [],
                },
            ],
        };

    const barGraphOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            title: {
                display: false,
            },
            tooltip: {
                displayColors: false,
                callbacks: {
                    label: function (context) {
                        return context.raw;
                    },
                    title: function () {
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
                max: programPatientCounts ? Math.max(...Object.values(programPatientCounts)) + 5 : 10,
                // max: Math.max(...Object.values(programPatientCounts)) + 5,
                ticks: {
                    stepSize: 1,
                    callback: function (value) {
                        return value;
                    },
                },
            },
        },
    };


    const fetchCounts = async (startDate, endDate) => {
        try {

            const response = await AdminDashboardService.fetchPatientAndProgramCounts(authToken,startDate,endDate);
            setIsOpen(false);
            if (response.patientCounts || response.programCounts){
                setPatientCounts(response.patientCounts)
                setProgramCounts(response.programCounts)
                setWeekDays(response.dates)
            }
            // Assuming response contains data for the graph
        } catch (error) {
            console.error('Error fetching counts:', error);
        }
    };

    useEffect(() => {
        const today = new Date();
        const lastWeekStart = new Date();
        lastWeekStart.setDate(today.getDate() - 6);

        // Format dates as YYYY-MM-DD
        const formatDate = (date) => {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        };

        const formattedStartDate = formatDate(lastWeekStart);
        const formattedEndDate = formatDate(today);

        setState([{ startDate: lastWeekStart, endDate: today, key: 'selection' }]);
        fetchCounts(formattedStartDate, formattedEndDate); // Fetch initial data
    }, []);


    const handleDateChange = async (item) => {
        const { selection } = item;
        const diffInTime = selection.endDate.getTime() - selection.startDate.getTime();
        const diffInDays = diffInTime / (1000 * 3600 * 24); // Calculate difference in days

        if (diffInDays <= 7) {
            const formatDate = (date) => {
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
                const day = String(date.getDate()).padStart(2, '0');
                return `${year}-${month}-${day}`;
            };

            const formattedStartDate = formatDate(selection.startDate);
            const formattedEndDate = formatDate(selection.endDate);
            setState([selection]);
            fetchCounts(formattedStartDate, formattedEndDate); // Fetch data with new dates
        } else {
            // If selection exceeds one week, adjust end date
            const newEndDate = addDays(selection.startDate, 6); // Set to one week from the start date
            const adjustedSelection = {
                startDate: selection.startDate,
                endDate: newEndDate,
                key: 'selection',
            };

            const formatDate = (date) => {
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const day = String(date.getDate()).padStart(2, '0');
                return `${year}-${month}-${day}`;
            };

            const formattedStartDate = formatDate(adjustedSelection.startDate);
            const formattedEndDate = formatDate(adjustedSelection.endDate);

            setState([adjustedSelection]);
            fetchCounts(formattedStartDate, formattedEndDate); // Fetch data with new dates
            alert('You can only select a maximum of one week. The date range has been adjusted.');
        }
    };


    // const handleDateChange = async (item) => {
    //     const {selection} = item;
    //     const diffInTime = selection.endDate.getTime() - selection.startDate.getTime();
    //     const diffInDays = diffInTime / (1000 * 3600 * 24); // Calculate difference in days
    //
    //     if (diffInDays <= 7) {
    //         const formatDate = (date) => {
    //             const year = date.getFullYear();
    //             const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    //             const day = String(date.getDate()).padStart(2, '0');
    //             return `${year}-${month}-${day}`;
    //         };
    //
    //         const formattedStartDate = await formatDate(selection.startDate);
    //         const formattedEndDate = await formatDate(selection.endDate);
    //         setState([selection]);
    //         fetchCounts(formattedStartDate, formattedEndDate); // Fetch data with new dates
    //     } else {
    //         alert('You can only select a maximum of one week.');
    //     }
    // };

    const lineGraphData = {
        labels: weekDays, // x-axis labels
        datasets: [
            {
                label: "New Patients",
                data: patientCounts, // Example data values for the first line
                borderColor: '#95A6FF',
                backgroundColor: 'rgba(149, 166, 255, 0.2)', // Shaded area under the line
                fill: true, // Enable filling the area below the line
                tension: 0.1, // To give a smooth curve
                pointBackgroundColor: '#95A6FF', // Color of the points on the line
                pointRadius: 0, // Radius of the points
            },
            {
                label: "New Programs",
                data: programCounts, // Example data values for the second line
                borderColor: '#32DACB',
                backgroundColor: 'rgba(50, 218, 203, 0.2)', // Shaded area under the line
                fill: true, // Enable filling the area below the line
                tension: 0.1, // To give a smooth curve
                pointBackgroundColor: '#32DACB', // Color of the points on the line
                pointRadius: 0, // Radius of the points
            },
        ],
    };

    const lineGraphOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
                position: 'top',
                align: 'start',
                labels: {
                    usePointStyle: true, // Use a circular point style in the legend
                    boxWidth: 7, // Smaller color palette circles
                    boxHeight: 7, // Smaller color palette circles
                    font: {
                        size: 16, // Larger font size
                        family: "'Arial', sans-serif",
                        weight: '400',
                        color: '#111111', // Darker font color
                    },
                    color: '#111111'
                }
            },
            title: {
                display: false,
            },
            datalabels: {
                display: false, // Disable datalabels
            },
        },
        scales: {
            x: {},
            y: {
                min: 0,
                max: patientCounts && programCounts ?  Math.max(...patientCounts, ...programCounts) + 1 : 10,
                ticks: {
                    stepSize: 50,
                }
            },
        }
    };

    if (isLoading) {
        return <Spinner />
    }

    return (
        <AdminLayout>
            <div>
                <div
                    className="admin-dashboard-stats gap-3">
                    <div
                        className="admin-dashboard-stat-card admin-dashboard-stat-card-1 border rounded-3 p-4 d-flex align-items-center gap-3">
                        <img src={HeartCyanIcon}/>
                        <div>
                            <h5 className="mb-1 lh-1 text-dark-grey fw-bolder">{totalPatients}</h5>
                            <div className="lh-1 text-dark-grey fw-normal">Patients</div>
                        </div>
                    </div>

                    <div
                        className="admin-dashboard-stat-card admin-dashboard-stat-card-2 border rounded-3 p-4 d-flex align-items-center gap-3">
                        <img src={BriefcasePurpleIcon}/>
                        <div>
                            <h5 className="mb-1 lh-1 text-dark-grey fw-bolder">{totalPrograms}</h5>
                            <div className="lh-1 text-dark-grey fw-normal">Total Programs</div>
                        </div>
                    </div>

                    <div
                        className="admin-dashboard-stat-card admin-dashboard-stat-card-3 border rounded-3 p-4 d-flex align-items-center gap-3">
                        <img src={PersonPlusGreenIcon}/>
                        <div>
                            <h5 className="mb-1 lh-1 text-dark-grey fw-bolder">{totalProviders}</h5>
                            <div className="lh-1 text-dark-grey fw-normal">Total Providers</div>
                        </div>
                    </div>

                    <div
                        className="admin-dashboard-stat-card admin-dashboard-stat-card-4 border rounded-3 p-4 d-flex align-items-center gap-3">
                        <img src={DoctorPersonGreenIcon}/>
                        <div>
                            <h5 className="mb-1 lh-1 text-dark-grey fw-bolder">{totalPrograms * 3}</h5>
                            <div className="lh-1 text-dark-grey fw-normal">Assistants</div>
                        </div>
                    </div>

                    <div
                        className="admin-dashboard-stat-card admin-dashboard-stat-card-5 rounded-3 p-4 d-flex align-items-center gap-3">
                        <img src={FeedbackCyanIcon}/>
                        <div>
                            <h5 className="mb-1 lh-1 text-dark-grey fw-bolder">{totalFeedbacks}</h5>
                            <div className="lh-1 text-dark-grey fw-normal">Feedbacks</div>
                        </div>
                    </div>

                    <div
                        className="admin-dashboard-stat-card admin-dashboard-stat-card-6 border rounded-3 p-4 d-flex align-items-center gap-3">
                        <img src={HierarchyLavenderBlueIcon}/>
                        <div>
                            <h5 className="mb-1 lh-1 text-dark-grey fw-bolder">{totalOrganizations}</h5>
                            <div className="lh-1 text-dark-grey fw-normal">Total Organizations</div>
                        </div>
                    </div>
                </div>

                <section
                    className="admin-dashboard-top-programs custom-scrollbar-section border border-light-grey rounded-3 mt-4 p-3 d-flex flex-column">
                    <div
                        className="d-flex flex-row align-items-center justify-content-between pb-2 mb-4">
                        <h5 className="mb-0 fs-20 text-black">Top Programs</h5>

                        {/*<div*/}
                        {/*    className="d-flex align-items-center gap-2 bg-parrot-green-14 border border-parrot-green-31 rounded-2 px-2 py-1">*/}
                        {/*    <img width={14} height={14} src={CalenderDarkBlueIcon}/>*/}
                        {/*    <span className="fs-12 text-dark-blue">1 Jan 2021 - 31 Jan 2021</span>*/}
                        {/*</div>*/}
                    </div>

                    <div
                        className="flex-grow-1 d-flex align-items-center justify-content-center">
                        <Bar data={barGraphData} options={barGraphOptions}/>
                    </div>
                </section>

                <section
                    className="admin-dashboard-top-programs custom-scrollbar-section border border-light-grey rounded-3 mt-4 p-3 d-flex flex-column">
                    <div
                        className="flex-grow-1 d-flex align-items-center justify-content-center position-relative">
                        <div
                            onClick={toggleDatePicker}
                            role="button"
                            className="position-absolute end-0 top-0 d-flex align-items-center gap-2 bg-parrot-green-14 border border-parrot-green-31 rounded-2 px-2 py-1">
                            <img width={14} height={14} src={CalenderDarkBlueIcon}/>
                            <span className="fs-12 text-dark-blue">{`${state[0].startDate.toLocaleDateString()} - ${state[0].endDate.toLocaleDateString()}`}</span>
                        </div>
                        {isOpen && (
                            <div className="position-absolute mt-2 shadow bg-white rounded top-0">
                                <DateRangePicker
                                    onChange={handleDateChange}
                                    showSelectionPreview={true}
                                    moveRangeOnFirstSelection={false}
                                    months={2}
                                    editableDateInputs={true}
                                    ranges={state}
                                    direction="horizontal"
                                    rangeColors={['#3d91ff']}
                                    staticRanges={[]} // Hide default predefined ranges
                                    inputRanges={[]}
                                />
                            </div>
                        )}

                        <Line data={lineGraphData} options={lineGraphOptions}/>
                    </div>
                </section>
            </div>
        </AdminLayout>
    )
}

export default AdminDashboard
