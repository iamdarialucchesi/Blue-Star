import ProviderLayout from "../../../../layouts/provider/ProviderLayout.jsx";
import React from "react";

const ProfileSettingsSuggestions = () => {

    return (<ProviderLayout headerTitle="Suggestion" isDashboard={true}>
            <form>
                <section className="p-3 border rounded-3">

                    <div>
                        <h5 className="fs-20 text-near-black mb-3">Please provide a brief summary of your
                            idea:</h5>
                        <textarea rows="5" id="profile-settings-suggestions-summary-textarea"
                                  className="form-control border-black-10 bg-field"></textarea>
                    </div>

                    <div className="mt-4">
                        <h5 className="fs-20 text-near-black mb-3">I believe this suggestion will:</h5>

                        <div className="d-flex align-items-stretch gap-3">
                            <div className="d-flex flex-column gap-3">
                                <div className="d-flex align-items-center gap-3">
                                    <input
                                        id="profile-settings-feedback-productivity-checkbox"
                                        className="organization-detail-filter-item-checkbox"
                                        type="checkbox"
                                        name="typePractice"
                                    />
                                    <label
                                        htmlFor="profile-settings-feedback-productivity-checkbox"
                                        className="text-dark-grey fw-light">Improve Productivity</label>
                                </div>

                                <div className="d-flex align-items-center gap-3">
                                    <input
                                        id="profile-settings-feedback-service-checkbox"
                                        className="organization-detail-filter-item-checkbox"
                                        type="checkbox"
                                        name="typePractice"
                                    />
                                    <label
                                        htmlFor="profile-settings-feedback-service-checkbox"
                                        className="text-dark-grey fw-light">Improve Customer Service</label>
                                </div>

                                <div className="d-flex align-items-center gap-3">
                                    <input
                                        id="profile-settings-feedback-productivity-checkbox"
                                        className="organization-detail-filter-item-checkbox"
                                        type="checkbox"
                                        name="typePractice"
                                    />
                                    <label
                                        htmlFor="profile-settings-feedback-outcome-checkbox"
                                        className="text-dark-grey fw-light">Improve Outcome</label>
                                </div>
                            </div>
                            <div className="d-flex flex-column gap-3">
                                <div className="d-flex align-items-center gap-3">
                                    <input
                                        id="profile-settings-feedback-methods-checkbox"
                                        className="organization-detail-filter-item-checkbox"
                                        type="checkbox"
                                        name="typePractice"
                                    />
                                    <label
                                        htmlFor="profile-settings-feedback-methods-checkbox"
                                        className="text-dark-grey fw-light">Improve Methods</label>
                                </div>

                                <div className="d-flex align-items-center gap-3">
                                    <input
                                        id="profile-settings-feedback-communication-checkbox"
                                        className="organization-detail-filter-item-checkbox"
                                        type="checkbox"
                                        name="typePractice"
                                    />
                                    <label
                                        htmlFor="profile-settings-feedback-communication-checkbox"
                                        className="text-dark-grey fw-light">Improve Communication</label>
                                </div>

                                <div className="d-flex align-items-center gap-3">
                                    <input
                                        id="profile-settings-feedback-other-checkbox"
                                        className="organization-detail-filter-item-checkbox"
                                        type="checkbox"
                                        name="typePractice"
                                    />
                                    <label
                                        htmlFor="profile-settings-feedback-other-checkbox"
                                        className="text-dark-grey fw-light">Other</label>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-4">
                        <h5 className="fs-20 text-near-black mb-3">Explain how your idea will benefit the telehealth
                            system </h5>

                        <textarea rows="4" id="profile-settings-suggestions-benefit-textarea"
                                  className="form-control border-black-10 bg-field"></textarea>
                    </div>
                </section>
                <div className="w-100 d-flex align-items-center justify-content-between mt-3">
                    <button type="button"
                            className="profile-settings-feedback-suggestions-btn btn cancel-dark-blue-btn d-flex align-items-center justify-content-center rounded-4 border border-dark-blue text-dark-blue fw-normal py-2">Cancel
                    </button>
                    <button type="submit"
                            className="profile-settings-feedback-suggestions-btn btn btn-primary py-2 rounded-4">Send
                    </button>
                </div>
            </form>
        </ProviderLayout>
    )
}

export default ProfileSettingsSuggestions
