import React from "react";
import ProviderLayout from "../../../../layouts/provider/ProviderLayout.jsx";

const ProfileSettingsFaqs = () => {
    return (
        <ProviderLayout headerTitle="FAQ's" isDashboard={false}>
            <div>
                <div className="accordion profile-settings-faqs-accordian px-3 border rounded-3" id="accordionExample">
                    <h5 className="fw-bolder fs-20 text-dark-grey mt-4">Frequently Asked Questions</h5>
                    <div className="accordion-item border-start-0 border-end-0 border-top-0">
                        <h2 className="accordion-header">
                            <button className="accordion-button px-1 text-near-black" type="button"
                                    data-bs-toggle="collapse"
                                    data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit?
                            </button>
                        </h2>
                        <div id="collapseOne" className="accordion-collapse collapse show"
                             data-bs-parent="#accordionExample">
                            <div className="accordion-body px-1 pt-0 text-dark-grey fs-14">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
                                incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                                exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure
                                dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                            </div>
                        </div>
                    </div>
                    <div className="accordion-item border-start-0 border-end-0 border-top-0">
                        <h2 className="accordion-header">
                            <button className="accordion-button px-1 text-near-black collapsed" type="button"
                                    data-bs-toggle="collapse"
                                    data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit?
                            </button>
                        </h2>
                        <div id="collapseTwo" className="accordion-collapse collapse"
                             data-bs-parent="#accordionExample">
                            <div className="accordion-body px-1 pt-0 text-dark-grey fs-14">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
                                incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                                exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure
                                dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                            </div>
                        </div>
                    </div>
                    <div className="accordion-item border-start-0 border-end-0 border-top-0">
                        <h2 className="accordion-header">
                            <button className="accordion-button px-1 text-near-black collapsed" type="button"
                                    data-bs-toggle="collapse"
                                    data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit?
                            </button>
                        </h2>
                        <div id="collapseThree" className="accordion-collapse collapse"
                             data-bs-parent="#accordionExample">
                            <div className="accordion-body px-1 pt-0 text-dark-grey fs-14">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
                                incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                                exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure
                                dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                            </div>
                        </div>
                    </div>
                    <div className="accordion-item border-start-0 border-end-0 border-top-0">
                        <h2 className="accordion-header">
                            <button className="accordion-button px-1 text-near-black collapsed" type="button"
                                    data-bs-toggle="collapse"
                                    data-bs-target="#collapseFour" aria-expanded="false" aria-controls="collapseFour">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit?
                            </button>
                        </h2>
                        <div id="collapseFour" className="accordion-collapse collapse"
                             data-bs-parent="#accordionExample">
                            <div className="accordion-body px-1 pt-0 text-dark-grey fs-14">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
                                incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                                exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure
                                dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                            </div>
                        </div>
                    </div>
                    <div className="accordion-item border-0">
                        <h2 className="accordion-header">
                            <button className="accordion-button px-1 text-near-black collapsed" type="button"
                                    data-bs-toggle="collapse"
                                    data-bs-target="#collapseFive" aria-expanded="false" aria-controls="collapseFive">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit?
                            </button>
                        </h2>
                        <div id="collapseFive" className="accordion-collapse collapse"
                             data-bs-parent="#accordionExample">
                            <div className="accordion-body px-1 pt-0 text-dark-grey fs-14">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
                                incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                                exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure
                                dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </ProviderLayout>
    )
}

export default ProfileSettingsFaqs