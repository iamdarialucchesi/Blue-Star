import React, { useState,useEffect } from "react";
import {useProviderDataStore} from "../../../../../stores/ProviderDataStore.js";

const ProviderProgramFilterModal = ({ isShowFilterModal, setIsShowFilterModal ,practicesNames,selectedPracticesNames,organizationID,handleFilterPrograms}) => {
    const [filterValues, setFilterValues] = useState({
        practicesPractice1: false,
        practicesPractice2: true,
        orgRoleDirectorOfOps1: true,
        orgRoleDirectorOfOps2: false,
    });
    const [formValues, setFormValues] = useState({
        selectedPractices: [],
        selectedRoles: [],
        OrganizationID: organizationID
    });
    const {providerWhiteLabels} = useProviderDataStore();

    const {ButtonColor} = providerWhiteLabels;

    const [resetKey, setResetKey] = useState(0); // State variable to force re-render

    const handleFilterCheckboxChange = (e) => {
        const { name, checked } = e.target;
        setFilterValues((prev) => ({
            ...prev,
            [name]: checked,
        }));
    };

    const organizationRoles = [
        { value: 'Administrator', label: 'Administrator' }
    ];

    const handlePracticeChange = (event) => {
        const { value, checked } = event.target;
        setFormValues(prevState => {
            const updatedPractices = checked
                ? [...prevState.selectedPractices, value]
                : prevState.selectedPractices.filter(program => program !== value);
            return { ...prevState, selectedPractices: updatedPractices };
        });
    };

    const handleRoleChange = (event) => {
        const { value, checked } = event.target;
        setFormValues(prevState => {
            const updatedRoles = checked
                ? [...prevState.selectedRoles, value]
                : prevState.selectedRoles.filter(program => program !== value);
            return { ...prevState, selectedRoles: updatedRoles };
        });
    };

    const handleFilter = async () => {
        handleFilterPrograms(formValues)
        await setIsShowFilterModal(false);
    };

    // Clear all and refresh modal
    const handleClearAll = () => {
        setFormValues({
            selectedPractices: [],
            selectedRoles: [],
            OrganizationID: organizationID
        });
        setFilterValues({
            practicesPractice1: false,
            practicesPractice2: true,
            orgRoleDirectorOfOps1: true,
            orgRoleDirectorOfOps2: false,
        });
        setResetKey(prevKey => prevKey + 1); // Update the key to force re-render
    };

    useEffect(() => {
        if (isShowFilterModal) {
            setFormValues(prevState => ({
                ...prevState,
                selectedPractices: selectedPracticesNames
            }));
        }
    }, [isShowFilterModal, selectedPracticesNames]);

    return (
        <div key={resetKey}>
            <div
                onClick={() => setIsShowFilterModal(false)}
                className={`light-black-modal-overlay ${isShowFilterModal} bg-black-10`}
            ></div>
            <div
                className={`provider-program-filter-modal position-absolute end-0 bg-white border border-light-grey rounded-3 overflow-hidden p-3`}
            >
                <div className="accordion" id="accordionPanelsStayOpenExample">
                    <div className="accordion-item rounded-0 border-start-0 border-end-0 border-top-0 border-bottom border-black-20">
                        <h2 className="accordion-header">
                            <button
                                className="accordion-button px-0 py-3 text-black"
                                type="button"
                                data-bs-toggle="collapse"
                                data-bs-target="#panelsStayOpen-collapseOne"
                                aria-expanded="true"
                                aria-controls="panelsStayOpen-collapseOne"
                            >
                                Practices
                            </button>
                        </h2>
                        <div
                            id="panelsStayOpen-collapseOne"
                            className="accordion-collapse collapse show"
                        >
                            <div className="accordion-body px-0 pt-0 pb-3">
                                {practicesNames.map((practice, index) => (
                                    <div key={index} className="form-check d-flex gap-2 align-items-center mb-2">
                                        <input
                                            className="form-check-input shadow-none cursor-pointer border-secondary patients-filter-modal-checkbox"
                                            type="checkbox" value={practice.OrganizationPracticeID}
                                            id={`${practice.OrganizationPracticeID}CheckBox`}
                                            checked={formValues.selectedPractices.includes(practice.OrganizationPracticeID)}
                                            onChange={handlePracticeChange} />
                                        <label
                                            className="form-check-label cursor-pointer mb-n1 fw-light detail-text text-light"
                                            htmlFor={`${practice.OrganizationPracticeID}CheckBox`}>
                                            {practice.PracticeName}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="accordion-item rounded-0 border-start-0 border-end-0 border-top-0 border-bottom border-black-20">
                        <h2 className="accordion-header">
                            <button
                                className="accordion-button px-0 py-3 text-black"
                                type="button"
                                data-bs-toggle="collapse"
                                data-bs-target="#panelsStayOpen-collapseTwo"
                                aria-expanded="true"
                                aria-controls="panelsStayOpen-collapseTwo"
                            >
                                Organization Role
                            </button>
                        </h2>
                        <div
                            id="panelsStayOpen-collapseTwo"
                            className="accordion-collapse collapse show"
                        >
                            <div className="accordion-body px-0 pt-0 pb-3">
                                {organizationRoles.map((organization, index) => (
                                    <div key={index} className="form-check d-flex gap-2 align-items-center mb-2">
                                        <input
                                            className="form-check-input shadow-none cursor-pointer border-secondary patients-filter-modal-checkbox"
                                            type="checkbox" value={organization.value}
                                            id={`${organization.value}CheckBox`}
                                            onChange={handleRoleChange} />
                                        <label
                                            className="form-check-label cursor-pointer mb-n1 fw-light detail-text text-light"
                                            htmlFor={`${organization.value}CheckBox`}>
                                            {organization.label}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="d-flex align-items-center justify-content-between mt-3">
                    <button onClick={handleFilter} className={`d-flex align-items-center border-0 py-2 px-3 rounded-2 fs-14 fw-normal ${!ButtonColor ? "bg-primary" : ""}`}
                            style={{backgroundColor: ButtonColor ? ButtonColor : ""}}>
                        Apply Filter
                    </button>
                    <button onClick={handleClearAll} className="d-flex align-items-center add-button py-2 px-3 rounded-2 fs-14 fw-normal">
                        Clear All
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProviderProgramFilterModal;
