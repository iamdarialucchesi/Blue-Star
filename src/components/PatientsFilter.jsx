import React, {useContext, useEffect, useState} from 'react';
import {useProviderDataStore} from "../stores/ProviderDataStore.js";

const PatientsFilter = ({
                            isShowFilterModal,
                            setIsShowFilterModal,
                            programNames,
                            organizationID,
                            selectedProgramNames,
                            filterSelectedGender,
                            handleFilterPatients
                        }) => {
    const [isShow, setIsShow] = useState(false);
    const {providerWhiteLabels} = useProviderDataStore();
    const {LinkColor,ButtonColor} = providerWhiteLabels;

    const [resetKey, setResetKey] = useState(0); // State variable to force re-render

    useEffect(() => {
        if (isShowFilterModal) {
            setFormValues(prevState => ({
                ...prevState,
                selectedPrograms: selectedProgramNames,
                selectedGender: filterSelectedGender,
                OrganizationID: organizationID

            }));
        }
    }, [isShowFilterModal,selectedProgramNames,filterSelectedGender]);

    function handleShowCheckBoxes() {
        setIsShow(show => !show);
    }

    const handleFilter = async () => {
        handleFilterPatients(formValues)
        await setIsShowFilterModal(false);
    };

    const [formValues, setFormValues] = useState({
        selectedPrograms: [],  // Array for multiple selected programs
        selectedStatus: [],    // Array for multiple selected status options
        selectedGender: '',     // Single selected gender
        OrganizationID: organizationID
    });

    const handleProgramChange = (event) => {
        const {value, checked} = event.target;
        setFormValues(prevState => {
            const updatedPrograms = checked
                ? [...prevState.selectedPrograms, value]
                : prevState.selectedPrograms.filter(program => program !== value);
            return {...prevState, selectedPrograms: updatedPrograms};
        });
    };

    const handleStatusChange = (event) => {
        const {value, checked} = event.target;
        // setFormValues(prevState => {
        //     const updatedStatus = checked
        //         ? [...prevState.selectedStatus, value]
        //         : prevState.selectedStatus.filter(status => status !== value);
        //     return { ...prevState, selectedStatus: updatedStatus };
        // });
    };

    const handleGenderChange = (event) => {
        const {value} = event.target;
        setFormValues(prevState => ({...prevState, selectedGender: value}));
    };

    const statusOptions = [
        {value: 'Active', label: 'Active'},
        {value: 'Remission', label: 'Remission'},
        {value: 'Resolved', label: 'Resolved'}
    ];

    const genderOptions = [
        {value: 'Male', label: 'Male'},
        {value: 'Female', label: 'Female'}
    ];


    const handleClearAll = () => {
        setFormValues({
            selectedPrograms: [],
            selectedStatus: [],
            selectedGender: '',
            OrganizationID: organizationID
        });
        setResetKey(prevKey => prevKey + 1); // Update the key to force re-render
    };



    return (
        <div key={resetKey}>
            <div onClick={() => setIsShowFilterModal(false)}
                 className={`light-black-modal-overlay ${isShowFilterModal ? 'show' : ''} bg-black-10`}>
            </div>
            <div
                className={`patients-filter-modal position-absolute end-0 bg-white border border-light-grey rounded-3 overflow-hidden px-3 pb-3`}>
                <div>
                    <div className="accordion" id="accordionPanelsStayOpenExample">
                        <div
                            className="accordion-item rounded-0 border-start-0 border-end-0 border-top-0 border-bottom border-black-20">
                            <h2 className="accordion-header patients-filter-modal-header">
                                <button
                                    className="accordion-button px-0 py-3 text-dark fw-normal"
                                    type="button"
                                    data-bs-toggle="collapse"
                                    data-bs-target="#panelsStayOpen-collapseOne">
                                    Programs
                                </button>
                            </h2>
                            <div id="panelsStayOpen-collapseOne"
                                 className="accordion-collapse collapse show">
                                <div className="accordion-body px-0 pt-0 pb-3">
                                    {programNames.slice(0, 4).map((program, index) => (
                                        <div key={index} className="form-check d-flex gap-2 align-items-center mb-2">
                                            <input
                                                className="form-check-input shadow-none cursor-pointer border-secondary patients-filter-modal-checkbox"
                                                type="checkbox" value={program.ProgramName}
                                                id={`${program.ProgramName}CheckBox`}
                                                checked={formValues.selectedPrograms.includes(program.ProgramName)}
                                                onChange={handleProgramChange}
                                            />

                                            <label
                                                className="form-check-label cursor-pointer mb-n1 fw-light detail-text text-light"
                                                htmlFor={`${program.ProgramName}CheckBox`}>
                                                {program.ProgramName}
                                            </label>
                                        </div>
                                    ))}
                                    {isShow && programNames.slice(4).map((program, index) => (
                                        <div key={index} className="form-check d-flex gap-2 align-items-center mb-2">
                                            <input
                                                className="form-check-input shadow-none cursor-pointer border-secondary patients-filter-modal-checkbox"
                                                type="checkbox" value={program.ProgramName}
                                                id={`${program.ProgramName}CheckBox`}
                                                checked={formValues.selectedPrograms.includes(program.ProgramName)}
                                                onChange={handleProgramChange}
                                            />
                                            <label
                                                className="form-check-label cursor-pointer mb-n1 fw-light detail-text text-light"
                                                htmlFor={`${program.ProgramName}CheckBox`}>
                                                {program.ProgramName}
                                            </label>
                                        </div>
                                    ))}
                                    {programNames.length > 4 && (
                                        <button onClick={handleShowCheckBoxes}
                                                className={`btn btn-sm p-0 rounded-0 ${!LinkColor ? "text-primary border border-primary border-top-0 border-start-0 border-end-0" : ""}`}
                                                style={{
                                                    color: LinkColor || '',
                                                    borderBottom: LinkColor ? `1px solid ${LinkColor}` : '',
                                                }}>
                                            {isShow ? "Show Less" : "Show More"}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/*<div*/}
                        {/*    className="accordion-item rounded-0 border-start-0 border-end-0 border-top-0 border-bottom border-black-20">*/}
                        {/*    <h2 className="accordion-header patients-filter-modal-header">*/}
                        {/*        <button*/}
                        {/*            className="accordion-button px-0 py-3 text-dark fw-normal"*/}
                        {/*            type="button"*/}
                        {/*            data-bs-toggle="collapse"*/}
                        {/*            data-bs-target="#panelsStayOpen-collapsetwo">*/}
                        {/*            Status*/}
                        {/*        </button>*/}
                        {/*    </h2>*/}
                        {/*    <div id="panelsStayOpen-collapsetwo"*/}
                        {/*         className="accordion-collapse collapse show">*/}
                        {/*        <div className="accordion-body px-0 pt-0 pb-3">*/}
                        {/*            {statusOptions.map((status, index) => (*/}
                        {/*                <div key={index} className="form-check d-flex gap-2 align-items-center mb-2">*/}
                        {/*                    <input*/}
                        {/*                        className="form-check-input shadow-none cursor-pointer border-secondary patients-filter-modal-checkbox"*/}
                        {/*                        type="checkbox" value={status.value}*/}
                        {/*                        id={`${status.value}CheckBox`}*/}
                        {/*                        onChange={handleStatusChange}/>*/}
                        {/*                    <label*/}
                        {/*                        className="form-check-label cursor-pointer mb-n1 fw-light detail-text text-light"*/}
                        {/*                        htmlFor={`${status.value}CheckBox`}>*/}
                        {/*                        {status.label}*/}
                        {/*                    </label>*/}
                        {/*                </div>*/}
                        {/*            ))}*/}
                        {/*        </div>*/}
                        {/*    </div>*/}
                        {/*</div>*/}
                    </div>
                </div>

                <div className="pt-3">
                    <p className="text-dark fw-normal detail-text mb-2">Gender</p>
                    {genderOptions.map((gender, index) => (
                        <div key={index} className="form-check form-check-inline">
                            <input
                                className="form-check-input shadow-none cursor-pointer border-secondary patients-filter-modal-checkbox rounded-1"
                                type="radio" name="gender" value={gender.value}
                                id={`flexRadio${gender.value}`}
                                checked={formValues.selectedGender.includes(gender.value)}
                                onChange={handleGenderChange}
                            />
                            <label className="form-check-label cursor-pointer mb-n1 fw-light detail-text text-light"
                                   htmlFor={`flexRadio${gender.value}`}>
                                {gender.label}
                            </label>
                        </div>
                    ))}
                </div>

                <div className="d-flex align-items-center justify-content-between mt-3">
                    <button onClick={handleFilter}
                            className={`d-flex align-items-center border-0 py-2 px-3 rounded-2 fs-14 fw-normal ${!ButtonColor ? "bg-primary" : ""}`}
                    style={{backgroundColor: ButtonColor ? ButtonColor : ""}}>
                        Apply Filter
                    </button>
                    <button
                        onClick={handleClearAll}
                        className="d-flex align-items-center add-button py-2 px-3 rounded-2 fs-14 fw-normal">
                        Clear All
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PatientsFilter;
