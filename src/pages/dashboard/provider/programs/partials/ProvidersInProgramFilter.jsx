import React, {useState} from 'react';

const ProvidersInProgramFilter = ({isShowFilterModal, setIsShowFilterModal}) => {
    const [isShow, setIsShow] = useState("false");

    function handleShowCheckBoxes() {
        setIsShow(show => !show);
    }

    function handleFilter(){
        setIsShowFilterModal(false);
    }

    return (<>
        <div onClick={() => setIsShowFilterModal(false)}
             className={`light-black-modal-overlay ${isShowFilterModal} bg-black-10`}>
        </div>
        <div
            className={`patients-filter-modal position-absolute end-0 bg-white border border-light-grey rounded-3 overflow-hidden px-3 pb-3`}>

            <div>
                <div className="accordion" id="accordionPanelsStayOpenExample">
                    {/*<div*/}
                    {/*    className="accordion-item rounded-0 border-start-0 border-end-0 border-top-0 border-bottom border-black-20">*/}
                    {/*    <h2 className="accordion-header patients-filter-modal-header">*/}
                    {/*        <button*/}
                    {/*            className="accordion-button px-0 py-3 text-dark fw-normal"*/}
                    {/*            type="button"*/}
                    {/*            data-bs-toggle="collapse"*/}
                    {/*            data-bs-target="#panelsStayOpen-collapseOne">*/}
                    {/*            Programs*/}
                    {/*        </button>*/}
                    {/*    </h2>*/}
                    {/*    <div id="panelsStayOpen-collapseOne"*/}
                    {/*         className="accordion-collapse collapse show">*/}
                    {/*        <div className="accordion-body px-0 pt-0 pb-3">*/}
                    {/*            <div className="form-check d-flex gap-2 align-items-center mb-2">*/}
                    {/*                <input*/}
                    {/*                    className="form-check-input shadow-none cursor-pointer border-secondary patients-filter-modal-checkbox"*/}
                    {/*                    type="checkbox" value="" id="cardiologyCheckBox"/>*/}
                    {/*                <label*/}
                    {/*                    className="form-check-label cursor-pointer mb-n1 fw-light detail-text text-light"*/}
                    {/*                    htmlFor="cardiologyCheckBox">*/}
                    {/*                    Cardiology*/}
                    {/*                </label>*/}
                    {/*            </div>*/}
                    {/*            <div className="form-check d-flex gap-2 align-items-center mb-2">*/}
                    {/*                <input*/}
                    {/*                    className="form-check-input shadow-none cursor-pointer border-secondary patients-filter-modal-checkbox"*/}
                    {/*                    type="checkbox" value="" id="ENTCheckBox"/>*/}
                    {/*                <label*/}
                    {/*                    className="form-check-label cursor-pointer mb-n1 fw-light detail-text text-light"*/}
                    {/*                    htmlFor="ENTCheckBox">*/}
                    {/*                    ENT*/}
                    {/*                </label>*/}
                    {/*            </div>*/}
                    {/*            <div className="form-check d-flex gap-2 align-items-center mb-2">*/}
                    {/*                <input*/}
                    {/*                    className="form-check-input shadow-none cursor-pointer border-secondary patients-filter-modal-checkbox"*/}
                    {/*                    type="checkbox" value="" id="NephrologistCheckBox"/>*/}
                    {/*                <label*/}
                    {/*                    className="form-check-label cursor-pointer mb-n1 fw-light detail-text text-light"*/}
                    {/*                    htmlFor="NephrologistCheckBox">*/}
                    {/*                    Nephrologist*/}
                    {/*                </label>*/}
                    {/*            </div>*/}
                    {/*            <div className="form-check d-flex gap-2 align-items-center mb-2">*/}
                    {/*                <input*/}
                    {/*                    className="form-check-input shadow-none cursor-pointer border-secondary patients-filter-modal-checkbox"*/}
                    {/*                    type="checkbox" value="" id="DentistCheckBox"/>*/}
                    {/*                <label*/}
                    {/*                    className="form-check-label cursor-pointer mb-n1 fw-light detail-text text-light"*/}
                    {/*                    htmlFor="DentistCheckBox">*/}
                    {/*                    Dentist*/}
                    {/*                </label>*/}
                    {/*            </div>*/}

                    {/*            <div*/}
                    {/*                className={`form-check d-flex gap-2 align-items-center mb-2 ${isShow ? "d-none" : "d-block"}`}>*/}
                    {/*                <input*/}
                    {/*                    className="form-check-input shadow-none cursor-pointer border-secondary patients-filter-modal-checkbox"*/}
                    {/*                    type="checkbox" value="" id="DermatologistCheckBox"/>*/}
                    {/*                <label*/}
                    {/*                    className="form-check-label cursor-pointer mb-n1 fw-light detail-text text-light"*/}
                    {/*                    htmlFor="DermatologistCheckBox">*/}
                    {/*                    Dermatologist*/}
                    {/*                </label>*/}
                    {/*            </div>*/}
                    {/*            <div*/}
                    {/*                className={`form-check d-flex gap-2 align-items-center mb-2 ${isShow ? "d-none" : "d-block"}`}>*/}
                    {/*                <input*/}
                    {/*                    className="form-check-input shadow-none cursor-pointer border-secondary patients-filter-modal-checkbox"*/}
                    {/*                    type="checkbox" value="" id="NeurologistCheckBox"/>*/}
                    {/*                <label*/}
                    {/*                    className="form-check-label cursor-pointer mb-n1 fw-light detail-text text-light"*/}
                    {/*                    htmlFor="NeurologistCheckBox">*/}
                    {/*                    Neurologist*/}
                    {/*                </label>*/}
                    {/*            </div>*/}
                    {/*            <div*/}
                    {/*                className={`form-check d-flex gap-2 align-items-center mb-2 ${isShow ? "d-none" : "d-block"}`}>*/}
                    {/*                <input*/}
                    {/*                    className="form-check-input shadow-none cursor-pointer border-secondary patients-filter-modal-checkbox"*/}
                    {/*                    type="checkbox" value="" id="OncologistCheckBox"/>*/}
                    {/*                <label*/}
                    {/*                    className="form-check-label cursor-pointer mb-n1 fw-light detail-text text-light"*/}
                    {/*                    htmlFor="OncologistCheckBox">*/}
                    {/*                    Oncologist*/}
                    {/*                </label>*/}
                    {/*            </div>*/}
                    {/*            <div*/}
                    {/*                className={`form-check d-flex gap-2 align-items-center mb-2 ${isShow ? "d-none" : "d-block"}`}>*/}
                    {/*                <input*/}
                    {/*                    className="form-check-input shadow-none cursor-pointer border-secondary patients-filter-modal-checkbox"*/}
                    {/*                    type="checkbox" value="" id="PathologistCheckBox"/>*/}
                    {/*                <label*/}
                    {/*                    className="form-check-label cursor-pointer mb-n1 fw-light detail-text text-light"*/}
                    {/*                    htmlFor="PathologistCheckBox">*/}
                    {/*                    Pathologist*/}
                    {/*                </label>*/}
                    {/*            </div>*/}
                    {/*            <div*/}
                    {/*                className={`form-check d-flex gap-2 align-items-center mb-2 ${isShow ? "d-none" : "d-block"}`}>*/}
                    {/*                <input*/}
                    {/*                    className="form-check-input shadow-none cursor-pointer border-secondary patients-filter-modal-checkbox"*/}
                    {/*                    type="checkbox" value="" id="GeneralSurgeryCheckBox"/>*/}
                    {/*                <label*/}
                    {/*                    className="form-check-label cursor-pointer mb-n1 fw-light detail-text text-light"*/}
                    {/*                    htmlFor="GeneralSurgeryCheckBox">*/}
                    {/*                    General Surgery*/}
                    {/*                </label>*/}
                    {/*            </div>*/}
                    {/*            <div*/}
                    {/*                className={`form-check d-flex gap-2 align-items-center mb-2 ${isShow ? "d-none" : "d-block"}`}>*/}
                    {/*                <input*/}
                    {/*                    className="form-check-input shadow-none cursor-pointer border-secondary patients-filter-modal-checkbox"*/}
                    {/*                    type="checkbox" value="" id="AnaesthesiaCheckBox"/>*/}
                    {/*                <label*/}
                    {/*                    className="form-check-label cursor-pointer mb-n1 fw-light detail-text text-light"*/}
                    {/*                    htmlFor="AnaesthesiaCheckBox">*/}
                    {/*                    Anaesthesia*/}
                    {/*                </label>*/}
                    {/*            </div>*/}

                    {/*            <button onClick={handleShowCheckBoxes}*/}
                    {/*                    className="btn btn-sm text-primary border border-primary border-top-0 border-start-0 border-end-0 p-0 rounded-0">*/}
                    {/*                {isShow ? "Show More" : "Show Less"}*/}
                    {/*            </button>*/}
                    {/*        </div>*/}
                    {/*    </div>*/}
                    {/*</div>*/}

                    <div
                        className="accordion-item rounded-0 border-start-0 border-end-0 border-top-0 border-bottom border-black-20">
                        <h2 className="accordion-header patients-filter-modal-header">
                            <button
                                className="accordion-button px-0 py-3 text-dark fw-normal"
                                type="button"
                                data-bs-toggle="collapse"
                                data-bs-target="#panelsStayOpen-collapsetwo">
                                Types of User
                            </button>
                        </h2>
                        <div id="panelsStayOpen-collapsetwo"
                             className="accordion-collapse collapse show">
                            <div className="accordion-body px-0 pt-0 pb-3">
                                <div className="form-check d-flex gap-2 align-items-center mb-2">
                                    <input
                                        className="form-check-input shadow-none cursor-pointer border-secondary patients-filter-modal-checkbox"
                                        type="checkbox" value="" id="ActiveCheckBox"/>
                                    <label
                                        className="form-check-label cursor-pointer mb-n1 fw-light detail-text text-light"
                                        htmlFor="ActiveCheckBox">
                                        Provider
                                    </label>
                                </div>
                                <div className="form-check d-flex gap-2 align-items-center mb-2">
                                    <input
                                        className="form-check-input shadow-none cursor-pointer border-secondary patients-filter-modal-checkbox"
                                        type="checkbox" value="" id="RemissionCheckBox"/>
                                    <label
                                        className="form-check-label cursor-pointer mb-n1 fw-light detail-text text-light"
                                        htmlFor="RemissionCheckBox">
                                        Assistant
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div
                        className="accordion-item rounded-0 border-start-0 border-end-0 border-top-0 border-bottom border-black-20">
                        <h2 className="accordion-header patients-filter-modal-header">
                            <button
                                className="accordion-button px-0 py-3 text-dark fw-normal"
                                type="button"
                                data-bs-toggle="collapse"
                                data-bs-target="#panelsStayOpen-collapsethree">
                                Program
                            </button>
                        </h2>
                        <div id="panelsStayOpen-collapsethree"
                             className="accordion-collapse collapse show">
                            <div className="accordion-body px-0 pt-0 pb-3">
                                <div className="form-check d-flex gap-2 align-items-center mb-2">
                                    <input
                                        className="form-check-input shadow-none cursor-pointer border-secondary patients-filter-modal-checkbox"
                                        type="checkbox" value="" id="ActiveCheckBox"/>
                                    <label
                                        className="form-check-label cursor-pointer mb-n1 fw-light detail-text text-light"
                                        htmlFor="ActiveCheckBox">
                                        Diabetes
                                    </label>
                                </div>
                                <div className="form-check d-flex gap-2 align-items-center mb-2">
                                    <input
                                        className="form-check-input shadow-none cursor-pointer border-secondary patients-filter-modal-checkbox"
                                        type="checkbox" value="" id="RemissionCheckBox"/>
                                    <label
                                        className="form-check-label cursor-pointer mb-n1 fw-light detail-text text-light"
                                        htmlFor="RemissionCheckBox">
                                        Cardiology
                                    </label>
                                </div>

                                <div className="form-check d-flex gap-2 align-items-center mb-2">
                                    <input
                                        className="form-check-input shadow-none cursor-pointer border-secondary patients-filter-modal-checkbox"
                                        type="checkbox" value="" id="DermatologyCheckBox"/>
                                    <label
                                        className="form-check-label cursor-pointer mb-n1 fw-light detail-text text-light"
                                        htmlFor="DermatologyCheckBox">
                                        Dermatology
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="d-flex align-items-center justify-content-between mt-3">
                <button onClick={handleFilter}
                        className="d-flex align-items-center btn btn-primary border-0 py-2 px-3 rounded-2 fs-14 fw-normal">
                    Apply Filter
                </button>
                <button
                    className="cancel-dark-blue-btn d-flex align-items-center bg-transparent border border-dark-blue text-dark-blue py-2 px-3 rounded-2 fs-14 fw-normal">
                    Clear All
                </button>

            </div>
        </div>
    </>)
}

export default ProvidersInProgramFilter;