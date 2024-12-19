import React, {useContext, useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {Pie} from "react-chartjs-2";
import {ArcElement, Chart as ChartJS, Legend} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import {useProviderDataStore} from "../../../../stores/ProviderDataStore.js";
import PatientProgramService from "../../partials/interactions/service/PatientsProgramsService.js";
import {AuthContext} from "../../../../context/AuthContext.jsx";
import FlagRedIcon from "../../../../assets/images/icons/flag-red.svg";
import FlagOrangeIcon from "../../../../assets/images/icons/flag-orange.svg";
import FlagGreenIcon from "../../../../assets/images/icons/flag-green.svg";

ChartJS.register(ArcElement, Legend, ChartDataLabels);

function ProviderAlert({allReminders}) {
    const {providerOrganizationID, setProviderWhiteLabels, providerWhiteLabels} = useProviderDataStore();
    const {authToken} = useContext(AuthContext);
    const [evaluations, setEvaluations] = useState([]);
    const {LinkColor} = providerWhiteLabels;
    const [sortOrder, setSortOrder] = useState("newest");
    const [filterSeverity, setFilterSeverity] = useState([]);
    const [filterResolvedStatus, setFilterResolvedStatus] = useState([false]);

    useEffect(() => {
        fetchAllPatients();
    }, []);

    const fetchEvaluation = async (patientId, programId) => {
        try {
            const result = await PatientProgramService.fetchConversationEvaluation(authToken, patientId, programId);
            if (result && result.Evaluation) {
                return result;
            } else{
                return null;
            }

        } catch (error) {
            console.error('Error fetching evaluation:', error);
            return null;
        }
    };

    const fetchAllPatients = async () => {
        try {
            const organizationId = providerOrganizationID || "";
            const result = await PatientProgramService.fetchPatientPrograms(authToken, organizationId);

            if (result && result.patients) {
                const evaluationData = [];

                // Loop through all patients
                for (const patient of result.patients) {
                    const patientId = patient.PatientID;

                    // Loop through all programs for each patient
                    if (patient.Programs && patient.Programs.length > 0) {
                        for (const program of patient.Programs) {
                            const programId = program.ProgramID;

                            // Fetch evaluation for each patient-program combination
                            const evaluation = await fetchEvaluation(patientId, programId);
                            if (evaluation) {
                                evaluationData.push({
                                    Patient: patient,
                                    Program: program,
                                    Alerts: evaluation.Alerts,
                                });
                            }
                        }
                    }
                }

                // Update state with all fetched evaluations
                setEvaluations(evaluationData);
            }
        } catch (error) {
            console.error('Error fetching patients or evaluations:', error);
        }
    };

    const sortedAndFilteredAlerts = evaluations.flatMap((evaluation) => {
        const { Patient, Program, Alerts } = evaluation;

        // Filter based on severity and resolved status
        const filteredAlerts = Alerts.filter(
            (alert) =>
                (filterSeverity.length === 0 || filterSeverity.includes(parseInt(alert.Severity))) &&
                (filterResolvedStatus.length === 0 || filterResolvedStatus.includes(alert.Resolved))
        );

        // Sort alerts by DueDate (ascending or descending based on sortOrder)
        return filteredAlerts
            .map((alert) => ({
                ...alert,
                Patient: Patient,
                Program: Program,
                DueDate: new Date(alert.DueDate),
            }))
            .sort((a, b) => {
                return sortOrder === "newest" ? b.DueDate - a.DueDate : a.DueDate - b.DueDate;
            });
    });

    const getFlagIcon = (severity) => {
        switch (severity) {
            case "1":
                return <img src={FlagRedIcon} alt="Red Flag" />;
            case "2":
                return <img src={FlagOrangeIcon} alt="Orange Flag" />;
            case "3":
                return <img src={FlagGreenIcon} alt="Green Flag" />;
            default:
                return null;
        }
    };

    const data = {
        labels: [
            "Medical Refill Requests",
            "Type 2 Test Errors",
            "Allergic Reactions",
            "Cardiac Arrests",
        ],
        datasets: [
            {
                data: [30, 15, 20, 35],
                backgroundColor: ["#32DACB", "#01A6C0", "#A4E759", "#0F2A43"],
                hoverOffset: 4,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                enabled: true,
                callbacks: {
                    title: function () {
                        return ''; // Remove the title
                    },
                    label: function (tooltipItem) {
                        const label = tooltipItem.label || '';
                        const value = tooltipItem.raw || 0;
                        return `${label}: ${value}%`;
                    },
                },
                displayColors: false, // Remove the color box
            },
            datalabels: {
                display: false, // Disable datalabels
            },
        },
    };

    return (
        <>
            <div className="alert-section pt-3 px-3 rounded-3 border custom-scrollbar-section">
                <div className="d-flex justify-content-between border-bottom pb-2">
                    <h4 className="card-heading fw-bold m-0">Alerts</h4>
                    <Link to='/provider/notifications' className={`text-decoration-none fw-bold fs-6 ${!LinkColor ? "text-primary" : ""}`}
                          style={{color: LinkColor ? LinkColor : ""}}>
                        View All
                        <svg width="14" height="11" viewBox="0 0 14 11" fill="currentColor"
                             xmlns="http://www.w3.org/2000/svg" className="mt-n1 ms-1">
                            <path
                                d="M7.87217 0.75092C7.80211 0.82107 7.76276 0.916164 7.76276 1.01531C7.76276 1.11446 7.80211 1.20955 7.87217 1.2797L11.7227 5.1308L1.65154 5.1308C1.55231 5.1308 1.45715 5.17022 1.38699 5.24039C1.31682 5.31055 1.27741 5.40571 1.27741 5.50494C1.27741 5.60417 1.31682 5.69933 1.38699 5.76949C1.45715 5.83966 1.55231 5.87908 1.65154 5.87908L11.7227 5.87908L7.87217 9.73018C7.80609 9.80111 7.77011 9.89491 7.77182 9.99184C7.77353 10.0888 7.81279 10.1812 7.88134 10.2498C7.94989 10.3183 8.04237 10.3576 8.1393 10.3593C8.23622 10.361 8.33003 10.325 8.40095 10.259L12.8906 5.76933C12.9606 5.69918 13 5.60409 13 5.50494C13 5.40579 12.9606 5.3107 12.8906 5.24055L8.40095 0.75092C8.3308 0.680857 8.23571 0.641503 8.13656 0.641503C8.03742 0.641503 7.94233 0.680856 7.87217 0.75092Z"
                                fill="currentColor" stroke="currentColor" strokeWidth="0.8"
                            />
                        </svg>
                    </Link>
                </div>
                <div className="provider-chart-detail-section pt-4">
                    <div className="row">
                        {/*chart side text list*/}
                        <div className="col-sm-12 my-auto pt-3 pt-sm-0">
                            <div className="provider-chart-info p-0">

                                {sortedAndFilteredAlerts && sortedAndFilteredAlerts.map((alert, index) => (
                                    <div key={index} className="provider-dark-border-text-1 ps-2 mb-4">
                                        <p className="text-light fw-normal detail-text m-0">{alert.Patient.PatientName}</p>
                                        <p className="content-small-text-color fw-light detail-text-small-size m-0">{alert.Message} {getFlagIcon(alert.Severity)}</p>
                                    </div>
                                ))}

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ProviderAlert;
