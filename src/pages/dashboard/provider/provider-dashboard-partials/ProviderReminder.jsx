import React from "react";
import greenPlusIcon from "../../../../assets/icons/green-plus-icon.svg";
import {useProviderDataStore} from "../../../../stores/ProviderDataStore.js";
import {Link, useNavigate} from "react-router-dom";

function ProviderReminder({allReminders}) {
    const {providerWhiteLabels} = useProviderDataStore();
    const {LinkColor, ButtonColor} = providerWhiteLabels;

    return (
        <>
            <div className="reminder-section border rounded-3 p-3 custom-scrollbar-section">
                <div className="d-flex justify-content-between border-bottom pb-2">
                    <h4 className="card-heading fw-bold m-0">Reminders</h4>
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

                {/*checkboxes section here*/}
                <div className="provider-chart-detail-section pt-4">
                    <div className="row">
                        {/*<div className="col-sm-5">*/}
                        {/*    <div className="provider-chart-section">*/}
                        {/*        /!*chart here*!/*/}
                        {/*        <Pie data={data} options={options} className="cursor-pointer"/>*/}
                        {/*    </div>*/}
                        {/*</div>*/}

                        {/*chart side text list*/}
                        <div className="col-sm-12 my-auto pt-3 pt-sm-0">
                            <div className="provider-chart-info p-0">
                                {allReminders && allReminders.map((reminder) => (
                                    <div key={reminder.ReminderID} className="provider-dark-border-text-1 ps-2 mb-4">
                                        <p className="text-light fw-normal detail-text m-0">{reminder.PatientName}</p>
                                        <p className="content-small-text-color fw-light detail-text-small-size m-0">{reminder.Description}</p>
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

export default ProviderReminder;
