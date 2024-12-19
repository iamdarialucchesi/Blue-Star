import ProviderLayout from "../../../../layouts/provider/ProviderLayout.jsx";
import React, {useState} from "react";

const ProfileSettingsFeedback = () => {
    // star rating
    const [rating, setRating] = useState(null);
    const [hover, setHover] = useState(null);
    const [totalStars, setTotalStars] = useState(5);

    return (<ProviderLayout headerTitle="Feedback" isDashboard={true}>
            <form>
                <section className="p-3 border rounded-3">
                    <div>
                        <h5 className="fw-bolder fs-20 text-dark-grey mt-2 mb-2">Rate your experience</h5>

                        {[...Array(totalStars)].map((star, index) => {
                            const currentRating = index + 1;

                            return (
                                <label key={index}>
                                    <input
                                        style={{display: "none"}}
                                        type="radio"
                                        name="rating"
                                        value={currentRating}
                                        onChange={() => setRating(currentRating)}
                                    />
                                    <span
                                        className="star"
                                        style={{
                                            color:
                                                currentRating <= (hover || rating) ? "#FFEB38" : "#0A263F24",
                                            cursor: "pointer",
                                            fontSize: "35px",
                                            marginRight: 5
                                        }}
                                        onMouseEnter={() => setHover(currentRating)}
                                        onMouseLeave={() => setHover(null)}
                                    >&#9733;</span>
                                </label>
                            );
                        })}
                    </div>

                    <div>
                        <h5 className="fw-bolder fs-20 text-dark-grey mt-2 mb-2">Service Evaluation</h5>

                        <div className="mt-3">
                            <div className="table-responsive">
                                <table className="table profile-feedback-table text-dark-grey table-striped">
                                    <thead>
                                    <tr className="profile-feedback-table-heading-row">
                                        <th scope="col" className="fw-normal fs-18"
                                            style={{width: 550, maxWidth: 550}}>Criteria
                                        </th>
                                        <th scope="col" className="fw-normal fs-18 text-center" style={{width: 30}}>1
                                        </th>
                                        <th scope="col" className="fw-normal fs-18 text-center" style={{width: 30}}>2
                                        </th>
                                        <th scope="col" className="fw-normal fs-18 text-center" style={{width: 30}}>3
                                        </th>
                                        <th scope="col" className="fw-normal fs-18 text-center" style={{width: 30}}>4
                                        </th>
                                        <th scope="col" className="fw-normal fs-18 text-center" style={{width: 30}}>5
                                        </th>
                                    </tr>
                                    </thead>
                                    <tbody>

                                    <tr
                                        className="profile-feedback-table-body-row fw-light">
                                        <td>It is simple to learn and use this telehealth system</td>

                                        <td>
                                            <div className="d-flex align-items-center justify-content-center">
                                                <input
                                                    type="radio"
                                                    name="question-1"
                                                    id="question-1-option-1"
                                                    value="1"
                                                    className="form-check-input profile-setting-feedback-radio-input"
                                                />
                                            </div>
                                        </td>

                                        <td>
                                            <div className="d-flex align-items-center justify-content-center">
                                                <input
                                                    type="radio"
                                                    name="question-1"
                                                    id="question-1-option-2"
                                                    value="2"
                                                    className="form-check-input profile-setting-feedback-radio-input"
                                                />
                                            </div>
                                        </td>


                                        <td>
                                            <div className="d-flex align-items-center justify-content-center">
                                                <input
                                                    type="radio"
                                                    name="question-1"
                                                    id="question-1-option-3"
                                                    value="3"
                                                    className="form-check-input profile-setting-feedback-radio-input"
                                                />
                                            </div>
                                        </td>

                                        <td>
                                            <div className="d-flex align-items-center justify-content-center">
                                                <input
                                                    type="radio"
                                                    name="question-1"
                                                    id="question-1-option-4"
                                                    value="4"
                                                    className="form-check-input profile-setting-feedback-radio-input"
                                                />
                                            </div>
                                        </td>

                                        <td>
                                            <div className="d-flex align-items-center justify-content-center">
                                                <input
                                                    type="radio"
                                                    name="question-1"
                                                    id="question-1-option-5"
                                                    value="5"
                                                    className="form-check-input profile-setting-feedback-radio-input"
                                                />
                                            </div>
                                        </td>
                                    </tr>

                                    <tr
                                        className="profile-feedback-table-body-row fw-light">
                                        <td>It is simple to learn and use this telehealth system</td>

                                        <td>
                                            <div className="d-flex align-items-center justify-content-center">
                                                <input
                                                    type="radio"
                                                    name="question-2"
                                                    id="question-2-option-1"
                                                    value="1"
                                                    className="form-check-input profile-setting-feedback-radio-input"
                                                />
                                            </div>
                                        </td>

                                        <td>
                                            <div className="d-flex align-items-center justify-content-center">
                                                <input
                                                    type="radio"
                                                    name="question-2"
                                                    id="question-2-option-2"
                                                    value="2"
                                                    className="form-check-input profile-setting-feedback-radio-input"
                                                />
                                            </div>
                                        </td>


                                        <td>
                                            <div className="d-flex align-items-center justify-content-center">
                                                <input
                                                    type="radio"
                                                    name="question-2"
                                                    id="question-2-option-3"
                                                    value="3"
                                                    className="form-check-input profile-setting-feedback-radio-input"
                                                />
                                            </div>
                                        </td>

                                        <td>
                                            <div className="d-flex align-items-center justify-content-center">
                                                <input
                                                    type="radio"
                                                    name="question-2"
                                                    id="question-2-option-4"
                                                    value="4"
                                                    className="form-check-input profile-setting-feedback-radio-input"
                                                />
                                            </div>
                                        </td>

                                        <td>
                                            <div className="d-flex align-items-center justify-content-center">
                                                <input
                                                    type="radio"
                                                    name="question-2"
                                                    id="question-2-option-5"
                                                    value="5"
                                                    className="form-check-input profile-setting-feedback-radio-input"
                                                />
                                            </div>
                                        </td>
                                    </tr>

                                    <tr
                                        className="profile-feedback-table-body-row fw-light">
                                        <td>It is simple to learn and use this telehealth system</td>

                                        <td>
                                            <div className="d-flex align-items-center justify-content-center">
                                                <input
                                                    type="radio"
                                                    name="question-3"
                                                    id="question-3-option-1"
                                                    value="1"
                                                    className="form-check-input profile-setting-feedback-radio-input"
                                                />
                                            </div>
                                        </td>

                                        <td>
                                            <div className="d-flex align-items-center justify-content-center">
                                                <input
                                                    type="radio"
                                                    name="question-3"
                                                    id="question-3-option-2"
                                                    value="2"
                                                    className="form-check-input profile-setting-feedback-radio-input"
                                                />
                                            </div>
                                        </td>


                                        <td>
                                            <div className="d-flex align-items-center justify-content-center">
                                                <input
                                                    type="radio"
                                                    name="question-3"
                                                    id="question-3-option-3"
                                                    value="3"
                                                    className="form-check-input profile-setting-feedback-radio-input"
                                                />
                                            </div>
                                        </td>

                                        <td>
                                            <div className="d-flex align-items-center justify-content-center">
                                                <input
                                                    type="radio"
                                                    name="question-3"
                                                    id="question-3-option-4"
                                                    value="4"
                                                    className="form-check-input profile-setting-feedback-radio-input"
                                                />
                                            </div>
                                        </td>

                                        <td>
                                            <div className="d-flex align-items-center justify-content-center">
                                                <input
                                                    type="radio"
                                                    name="question-3"
                                                    id="question-3-option-5"
                                                    value="5"
                                                    className="form-check-input profile-setting-feedback-radio-input"
                                                />
                                            </div>
                                        </td>
                                    </tr>

                                    <tr
                                        className="profile-feedback-table-body-row fw-light">
                                        <td>It is simple to learn and use this telehealth system</td>

                                        <td>
                                            <div className="d-flex align-items-center justify-content-center">
                                                <input
                                                    type="radio"
                                                    name="question-4"
                                                    id="question-4-option-1"
                                                    value="1"
                                                    className="form-check-input profile-setting-feedback-radio-input"
                                                />
                                            </div>
                                        </td>

                                        <td>
                                            <div className="d-flex align-items-center justify-content-center">
                                                <input
                                                    type="radio"
                                                    name="question-4"
                                                    id="question-4-option-2"
                                                    value="2"
                                                    className="form-check-input profile-setting-feedback-radio-input"
                                                />
                                            </div>
                                        </td>


                                        <td>
                                            <div className="d-flex align-items-center justify-content-center">
                                                <input
                                                    type="radio"
                                                    name="question-4"
                                                    id="question-4-option-3"
                                                    value="3"
                                                    className="form-check-input profile-setting-feedback-radio-input"
                                                />
                                            </div>
                                        </td>

                                        <td>
                                            <div className="d-flex align-items-center justify-content-center">
                                                <input
                                                    type="radio"
                                                    name="question-4"
                                                    id="question-4-option-4"
                                                    value="4"
                                                    className="form-check-input profile-setting-feedback-radio-input"
                                                />
                                            </div>
                                        </td>

                                        <td>
                                            <div className="d-flex align-items-center justify-content-center">
                                                <input
                                                    type="radio"
                                                    name="question-4"
                                                    id="question-4-option-5"
                                                    value="5"
                                                    className="form-check-input profile-setting-feedback-radio-input"
                                                />
                                            </div>
                                        </td>
                                    </tr>

                                    <tr
                                        className="profile-feedback-table-body-row fw-light">
                                        <td>It is simple to learn and use this telehealth system</td>

                                        <td>
                                            <div className="d-flex align-items-center justify-content-center">
                                                <input
                                                    type="radio"
                                                    name="question-5"
                                                    id="question-5-option-1"
                                                    value="1"
                                                    className="form-check-input profile-setting-feedback-radio-input"
                                                />
                                            </div>
                                        </td>

                                        <td>
                                            <div className="d-flex align-items-center justify-content-center">
                                                <input
                                                    type="radio"
                                                    name="question-5"
                                                    id="question-5-option-2"
                                                    value="2"
                                                    className="form-check-input profile-setting-feedback-radio-input"
                                                />
                                            </div>
                                        </td>


                                        <td>
                                            <div className="d-flex align-items-center justify-content-center">
                                                <input
                                                    type="radio"
                                                    name="question-5"
                                                    id="question-5-option-3"
                                                    value="3"
                                                    className="form-check-input profile-setting-feedback-radio-input"
                                                />
                                            </div>
                                        </td>

                                        <td>
                                            <div className="d-flex align-items-center justify-content-center">
                                                <input
                                                    type="radio"
                                                    name="question-5"
                                                    id="question-5-option-4"
                                                    value="4"
                                                    className="form-check-input profile-setting-feedback-radio-input"
                                                />
                                            </div>
                                        </td>

                                        <td>
                                            <div className="d-flex align-items-center justify-content-center">
                                                <input
                                                    type="radio"
                                                    name="question-5"
                                                    id="question-5-option-5"
                                                    value="5"
                                                    className="form-check-input profile-setting-feedback-radio-input"
                                                />
                                            </div>
                                        </td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    <div className="mt-3">
                        <h5 className="fw-bolder fs-20 text-dark-grey mb-3">What do you like most about our telehealth
                            system?</h5>
                        <textarea rows="4" id="profile-settings-feedback-likability-textarea"
                                  className="form-control border-black-10 bg-field"></textarea>
                    </div>

                    <div className="mt-3">
                        <h5 className="fw-bolder fs-20 text-dark-grey mb-3">What aspects of telehealth can be
                            improved?</h5>
                        <textarea rows="4" id="profile-settings-feedback-improvement-textarea"
                                  className="form-control border-black-10 bg-field"></textarea>
                    </div>

                    <div className="mt-3">
                        <h5 className="fw-bolder fs-20 text-dark-grey mb-3">Consent to use feedback</h5>

                        <div className="d-flex align-items-center gap-3">
                            <input
                                id="profile-settings-feedback-consent-checkbox"
                                className="organization-detail-filter-item-checkbox"
                                type="checkbox"
                                name="typePractice"
                            />
                            <label
                                htmlFor="profile-settings-feedback-consent-checkbox"
                                className="text-dark-grey fw-light">I agree that my feedback can be used to improve
                                telehealth services.</label>
                        </div>
                    </div>
                </section>
                <div className="w-100 d-flex align-items-center justify-content-between mt-3">
                    <button type="button"
                            className="profile-settings-feedback-suggestions-btn btn cancel-dark-blue-btn d-flex align-items-center justify-content-center border border-dark-blue text-dark-blue fw-normal py-2">Cancel
                    </button>
                    <button type="submit" className="profile-settings-feedback-suggestions-btn btn btn-primary py-2">Send</button>
                </div>
            </form>
        </ProviderLayout>
    )
}

export default ProfileSettingsFeedback
