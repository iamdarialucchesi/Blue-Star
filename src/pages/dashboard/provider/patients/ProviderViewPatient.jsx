import React from "react";

import ProviderLayout from "../../../../layouts/provider/ProviderLayout.jsx";

function ProviderViewPatient() {
    return (
        <ProviderLayout headerTitle={"Maria Watson"} isDashboard={true}>
            <div className='view-patient pt-1'>
                <div className="accordion" id="personal-information">
                    <div className="accordion-item rounded-3">
                        <h2 className="accordion-header rounded-3">
                            <button className="accordion-button rounded-3 section-heading-3d3d3d-18px fw-bold"
                                    type="button"
                                    data-bs-toggle="collapse"
                                    data-bs-target="#personal-details">
                                Personal Information
                            </button>
                        </h2>
                        <div id="personal-details" className="accordion-collapse collapse show"
                             data-bs-parent="#personal-information">
                            <div className="accordion-body">
                                <div className='row'>
                                    <div className='col-md-6 col-lg-4'>
                                        <div className='mb-3'>
                                            <p className='patient-card-detail-heading mb-1'>First Name</p>
                                            <p className='detail-text text-light fw-normal m-0'>Maria</p>
                                        </div>
                                    </div>
                                    <div className='col-md-6 col-lg-4'>
                                        <div className='mb-3'>
                                            <p className='patient-card-detail-heading mb-1'>Last Name</p>
                                            <p className='detail-text text-light fw-normal m-0'>Watson</p>
                                        </div>
                                    </div>
                                    <div className='col-md-6 col-lg-4'>
                                        <div className='mb-3'>
                                            <p className='patient-card-detail-heading mb-1'>Gender</p>
                                            <p className='detail-text text-light fw-normal m-0'>Female</p>
                                        </div>
                                    </div>
                                    <div className='col-md-6 col-lg-4'>
                                        <div className='mb-3'>
                                            <p className='patient-card-detail-heading mb-1'>Blood Group</p>
                                            <p className='detail-text text-light fw-normal m-0'>A+</p>
                                        </div>
                                    </div>
                                    <div className='col-md-6 col-lg-4'>
                                        <div className='mb-3'>
                                            <p className='patient-card-detail-heading mb-1'>Date of Birth</p>
                                            <p className='detail-text text-light fw-normal m-0'>04/15/1962</p>
                                        </div>
                                    </div>
                                    <div className='col-md-6 col-lg-4'>
                                        <div className='mb-3'>
                                            <p className='patient-card-detail-heading mb-1'>Phone Number</p>
                                            <p className='detail-text text-light fw-normal m-0'>0232 4687456</p>
                                        </div>
                                    </div>
                                    <div className='col-md-6 col-lg-4'>
                                        <div className='mb-3'>
                                            <p className='patient-card-detail-heading mb-1'>Email Address (optional)</p>
                                            <p className='detail-text text-light fw-normal m-0'>austinmathews12345@gmail.com</p>
                                        </div>
                                    </div>
                                    <div className='col-md-6 col-lg-4'>
                                        <div className='mb-3'>
                                            <p className='patient-card-detail-heading mb-1'>Address</p>
                                            <p className='detail-text text-light fw-normal m-0'>15208 West 119th
                                                Street</p>
                                        </div>
                                    </div>
                                    <div className='col-md-6 col-lg-4'>
                                        <div className='mb-3'>
                                            <p className='patient-card-detail-heading mb-1'>Zip Code</p>
                                            <p className='detail-text text-light fw-normal m-0'>666062</p>
                                        </div>
                                    </div>
                                    <div className='col-md-6 col-lg-4'>
                                        <div className='mb-3'>
                                            <p className='patient-card-detail-heading mb-1'>City</p>
                                            <p className='detail-text text-light fw-normal m-0'>Olahe</p>
                                        </div>
                                    </div>
                                    <div className='col-md-6 col-lg-4'>
                                        <div className='mb-3'>
                                            <p className='patient-card-detail-heading mb-1'>State</p>
                                            <p className='detail-text text-light fw-normal m-0'>Kansas</p>
                                        </div>
                                    </div>
                                    <div className='col-md-6 col-lg-4'>
                                        <div className='mb-3'>
                                            <p className='patient-card-detail-heading mb-1'>Insurance Provider</p>
                                            <p className='detail-text text-light fw-normal m-0'>Zee Insurance
                                                Company</p>
                                        </div>
                                    </div>
                                    <div className='col-md-6 col-lg-4'>
                                        <div className='mb-3'>
                                            <p className='patient-card-detail-heading mb-1'>Policy Number</p>
                                            <p className='detail-text text-light fw-normal m-0'>123456</p>
                                        </div>
                                    </div>
                                    <div className='col-md-6 col-lg-4'>
                                        <div className=''>
                                            <p className='patient-card-detail-heading mb-1'>Group Number</p>
                                            <p className='detail-text text-light fw-normal m-0'>1234</p>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>

                <div className="accordion mt-4" id="emergency-contact">
                    <div className="accordion-item rounded-3">
                        <h2 className="accordion-header rounded-3">
                            <button className="accordion-button rounded-3 section-heading-3d3d3d-18px fw-bold"
                                    type="button"
                                    data-bs-toggle="collapse"
                                    data-bs-target="#emergency-info">
                                Emergency Contact
                            </button>
                        </h2>
                        <div id="emergency-info" className="accordion-collapse collapse show"
                             data-bs-parent="#emergency-contact">
                            <div className="accordion-body pb-0">
                                <div className='row'>
                                    <div className='col-md-6 col-lg-4'>
                                        <div className='mb-3'>
                                            <p className='patient-card-detail-heading mb-1'>Full Name</p>
                                            <p className='detail-text text-light fw-normal m-0'>Zella Isabella</p>
                                        </div>
                                    </div>
                                    <div className='col-md-6 col-lg-4'>
                                        <div className='mb-3'>
                                            <p className='patient-card-detail-heading mb-1'>Relationship</p>
                                            <p className='detail-text text-light fw-normal m-0'>Daughter</p>
                                        </div>
                                    </div>
                                    <div className='col-md-6 col-lg-4'>
                                        <div className='mb-3'>
                                            <p className='patient-card-detail-heading mb-1'>Phone Number</p>
                                            <p className='detail-text text-light fw-normal m-0'>1234 5678901</p>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>

                <div className="accordion mt-4" id="primary-care-physician">
                    <div className="accordion-item rounded-3">
                        <h2 className="accordion-header rounded-3">
                            <button className="accordion-button rounded-3 section-heading-3d3d3d-18px fw-bold"
                                    type="button"
                                    data-bs-toggle="collapse"
                                    data-bs-target="#primary-care-physician-info">
                                Primary Care Physician
                            </button>
                        </h2>
                        <div id="primary-care-physician-info" className="accordion-collapse collapse show"
                             data-bs-parent="#primary-care-physician">
                            <div className="accordion-body pb-0">
                                <div className='row'>
                                    <div className='col-md-6 col-lg-4'>
                                        <div className='mb-3'>
                                            <p className='patient-card-detail-heading mb-1'>Full Name</p>
                                            <p className='detail-text text-light fw-normal m-0'>Linda Laurence</p>
                                        </div>
                                    </div>
                                    <div className='col-md-6 col-lg-4'>
                                        <div className='mb-3'>
                                            <p className='patient-card-detail-heading mb-1'>Phone Number</p>
                                            <p className='detail-text text-light fw-normal m-0'>1234 5678901</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="accordion mt-4" id="health-history-one">
                    <div className="accordion-item rounded-3">
                        <h2 className="accordion-header rounded-3">
                            <button className="accordion-button rounded-3 section-heading-3d3d3d-18px fw-bold"
                                    type="button"
                                    data-bs-toggle="collapse"
                                    data-bs-target="#health-history-info-one">
                                Health History
                            </button>
                        </h2>
                        <div id="health-history-info-one" className="accordion-collapse collapse show"
                             data-bs-parent="#health-history-one">
                            <div className="accordion-body pb-0">
                                <div className='row'>
                                    <div className='col-md-6 col-lg-4'>
                                        <div className='mb-3'>
                                            <p className='patient-card-detail-heading mb-1'>Pre-existing conditions</p>
                                            <p className='detail-text text-light fw-normal m-0'>Hypertension (I10)</p>
                                        </div>
                                    </div>
                                    <div className='col-md-6 col-lg-4'>
                                        <div className='mb-3'>
                                            <p className='patient-card-detail-heading mb-1'>Family Medical History</p>
                                            <p className='detail-text text-light fw-normal m-0'>Depression,
                                                Schizophrenia</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="accordion mt-4" id="health-history-two">
                    <div className="accordion-item rounded-3">
                        <h2 className="accordion-header rounded-3">
                            <button className="accordion-button rounded-3 section-heading-3d3d3d-18px fw-bold"
                                    type="button"
                                    data-bs-toggle="collapse"
                                    data-bs-target="#health-history-info-two">
                                Health History
                            </button>
                        </h2>
                        <div id="health-history-info-two" className="accordion-collapse collapse show"
                             data-bs-parent="#health-history-two">
                            <div className="accordion-body pb-0">
                                <div className='row'>
                                    <div className='col-md-6 col-lg-4'>
                                        <div className='mb-3'>
                                            <p className='patient-card-detail-heading mb-1'>Procedure 1</p>
                                            <p className='detail-text text-light fw-normal m-0'>Heart Transplant</p>
                                        </div>
                                    </div>
                                    <div className='col-md-6 col-lg-4'>
                                        <div className='mb-3'>
                                            <p className='patient-card-detail-heading mb-1'>Date</p>
                                            <p className='detail-text text-light fw-normal m-0'>04/15/1962</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="accordion mt-4" id="current-medications">
                    <div className="accordion-item rounded-3">
                        <h2 className="accordion-header rounded-3">
                            <button className="accordion-button rounded-3 section-heading-3d3d3d-18px fw-bold"
                                    type="button"
                                    data-bs-toggle="collapse"
                                    data-bs-target="#current-medications-info">
                                Current Medications
                            </button>
                        </h2>
                        <div id="current-medications-info" className="accordion-collapse collapse show"
                             data-bs-parent="#current-medications">
                            <div className="accordion-body pb-0">
                                <div className='row'>
                                    <div className='col-md-6 col-lg-4'>
                                        <div className='mb-3'>
                                            <p className='patient-card-detail-heading mb-1'>Name</p>
                                            <p className='detail-text text-light fw-normal m-0'>Heart Transplant</p>
                                        </div>
                                    </div>
                                    <div className='col-md-6 col-lg-4'>
                                        <div className='mb-3'>
                                            <p className='patient-card-detail-heading mb-1'>Dosage</p>
                                            <p className='detail-text text-light fw-normal m-0'>50mg</p>
                                        </div>
                                    </div>
                                    <div className='col-md-6 col-lg-4'>
                                        <div className='mb-3'>
                                            <p className='patient-card-detail-heading mb-1'>Start date</p>
                                            <p className='detail-text text-light fw-normal m-0 d-flex gap-2'>
                                                <span className="border px-2 py-1 rounded">04</span>
                                                <span className="border px-2 py-1 rounded">15</span>
                                                <span className="border px-2 py-1 rounded">1962</span>
                                            </p>
                                        </div>
                                    </div>
                                    <div className='col-md-6 col-lg-4'>
                                        <div className='mb-3'>
                                            <p className='patient-card-detail-heading mb-1'>End date</p>
                                            <p className='detail-text text-light fw-normal m-0 d-flex gap-2'>
                                                <span className="border px-2 py-1 rounded">04</span>
                                                <span className="border px-2 py-1 rounded">15</span>
                                                <span className="border px-2 py-1 rounded">1962</span>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="accordion mt-4" id="allergies">
                    <div className="accordion-item rounded-3">
                        <h2 className="accordion-header rounded-3">
                            <button className="accordion-button rounded-3 section-heading-3d3d3d-18px fw-bold"
                                    type="button"
                                    data-bs-toggle="collapse"
                                    data-bs-target="#allergies-info">
                                Allergies
                            </button>
                        </h2>
                        <div id="allergies-info" className="accordion-collapse collapse show"
                             data-bs-parent="#allergies">
                            <div className="accordion-body pb-0">
                                <div className='row'>
                                    <div className='col-md-6 col-lg-4'>
                                        <div className='mb-3'>
                                            <p className='patient-card-detail-heading mb-1'>Name</p>
                                            <p className='detail-text text-light fw-normal m-0'>Peanuts</p>
                                        </div>
                                    </div>
                                    <div className='col-md-6 col-lg-4'>
                                        <div className='mb-3'>
                                            <p className='patient-card-detail-heading mb-1'>Effect</p>
                                            <p className='detail-text text-light fw-normal m-0'>Anaphylaxis</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </ProviderLayout>
    )
}

export default ProviderViewPatient;