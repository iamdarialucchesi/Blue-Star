import React, {useEffect, useState} from "react";
import {useProviderDataStore} from "../../../../../stores/ProviderDataStore.js";

function ReminderFilterModal({
                                 setIsShowFilterModalReminder,
                                 isShowFilterModalReminder,
                                 filteredTypes,
                                 filteredDueDate,
                                 filteredPriority,
                                 filteredStatus,
                                 handleFilterReminders}) {
    const {providerWhiteLabels} = useProviderDataStore();
    const {ButtonColor} = providerWhiteLabels;
    const [resetKey, setResetKey] = useState(0); // State variable to force re-render
    const [formValues, setFormValues] = useState({
        selectedTypes: [],
        selectedDueDate: '',
        selectedPriority: '',
        selectedStatus: ''
    });

    useEffect(() => {
        if (isShowFilterModalReminder) {
            setFormValues(prevState => ({
                ...prevState,
                selectedTypes: filteredTypes,
                selectedDueDate: filteredDueDate,
                selectedPriority: filteredPriority,
                selectedStatus: filteredStatus

            }));
        }
    }, [isShowFilterModalReminder,filteredTypes,filteredDueDate,filteredPriority]);
    const priorities = [
        {value: 'Low', label: 'Low'},
        {value: 'Medium', label: 'Medium'},
        {value: 'High', label: 'High'}
    ];
    const dueDates = [
        {value: 'Today', label: 'Today'},
        {value: 'This Week', label: 'This Week'},
        {value: 'This Month', label: 'This Month'},
        {value: 'Overdue', label: 'Overdue'},
    ];

    const types = [
        {value: 'Appointments', label: 'Appointments'},
        {value: 'Medication Review', label: 'Medication Review'},
        {value: 'Treatment Follow-up', label: 'Treatment Follow-up'},
        {value: 'Routine Check-up', label: 'Routine Check-up'},
        {value: 'Test Results Review', label: 'Test Results Review'},
    ];
    const statuses = [
        {value: 'Resolved', label: 'Resolved'},
        {value: 'Unresolved', label: 'Unresolved'},
    ];

    const handleTypeChange = (event) => {
        const {value, checked} = event.target;
        setFormValues(prevState => {
            const updatedTypes = checked
                ? [...prevState.selectedTypes, value]
                : prevState.selectedTypes.filter(type => type !== value);
            return {...prevState, selectedTypes: updatedTypes};
        });
    };
    const handleDueDateChange = (event) => {
        const {value} = event.target;
        setFormValues(prevState => ({...prevState, selectedDueDate: value}));
    };

    const handlePriorityChange = (event) => {
        const {value} = event.target;
        setFormValues(prevState => ({...prevState, selectedPriority: value}));
    };


    const handleStatusChange = (event) => {
        const {value} = event.target;
        setFormValues(prevState => ({ ...prevState, selectedStatus: value}));
    };
    const handleFilter = async () => {
        handleFilterReminders(formValues)
        await setIsShowFilterModalReminder(false);
    };

    const handleClearAll = () => {
        setFormValues({
            selectedTypes: [],
            selectedDueDate: '',
            selectedPriority: '',
        });
        setResetKey(prevKey => prevKey + 1);
    };


    return (
        <div key={resetKey}>
            <div onClick={() => setIsShowFilterModalReminder(false)}
                 className={`light-black-modal-overlay ${isShowFilterModalReminder} bg-black-10`}>
            </div>
            <div
                className="reminder-filter-modal position-absolute end-0 bg-white border border-light-grey rounded-3 overflow-hidden px-3 pb-3">

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
                                    Type of reminder
                                </button>
                            </h2>
                            <div id="panelsStayOpen-collapseOne"
                                 className="accordion-collapse collapse show">
                                <div className="accordion-body px-0 pt-0 pb-3">
                                    {types.map((type, index) => (
                                        <div key={index} className="form-check d-flex gap-2 align-items-center mb-2">
                                            <input
                                                className="form-check-input shadow-none cursor-pointer border-secondary patients-filter-modal-checkbox"
                                                type="checkbox" value={type.value}
                                                id={`${type.label}CheckBox`}
                                                checked={formValues.selectedTypes.includes(type.value)}
                                                onChange={handleTypeChange}
                                            />

                                            <label
                                                className="form-check-label cursor-pointer mb-n1 fw-light detail-text text-light"
                                                htmlFor={`${type.label}CheckBox`}>
                                                {type.label}
                                            </label>
                                        </div>
                                    ))}
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
                                    data-bs-target="#panelsStayOpen-collapsetwo">
                                    Priority
                                </button>
                            </h2>
                            <div id="panelsStayOpen-collapsetwo"
                                 className="accordion-collapse collapse show">
                                <div className="accordion-body px-0 pt-0 pb-3">
                                    {priorities.map((priority, index) => (
                                        <div key={index} className="form-check form-check-inline">
                                            <input
                                                className="form-check-input shadow-none cursor-pointer border-secondary patients-filter-modal-checkbox"
                                                type="checkbox" value={priority.value}
                                                id={`${priority.label}CheckBox`}
                                                checked={formValues.selectedPriority.includes(priority.value)}
                                                onChange={handlePriorityChange}
                                            />

                                            <label
                                                className="form-check-label cursor-pointer mb-n1 fw-light detail-text text-light"
                                                htmlFor={`${priority.label}CheckBox`}>
                                                {priority.label}
                                            </label>
                                        </div>
                                    ))}
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
                                    data-bs-target="#panelsStayOpen-collapseFour">
                                    Status
                                </button>
                            </h2>
                            <div id="panelsStayOpen-collapseFour"
                                 className="accordion-collapse collapse show">
                                <div className="accordion-body px-0 pt-0 pb-3">
                                    {statuses.map((status, index) => (
                                        <div key={index} className="form-check form-check-inline">
                                            <input
                                                className="form-check-input shadow-none cursor-pointer border-secondary patients-filter-modal-checkbox"
                                                type="checkbox"
                                                name="status" // Add name attribute for radio buttons
                                                value={status.value}
                                                id={`${status.label}RadioButton`}
                                                checked={formValues.selectedStatus === status.value}
                                                onChange={handleStatusChange}
                                            />
                                            <label
                                                className="form-check-label cursor-pointer mb-n1 fw-light detail-text text-light"
                                                htmlFor={`${status.label}RadioButton`}>
                                                {status.label}
                                            </label>
                                        </div>
                                    ))}
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
                                    Due Date
                                </button>
                            </h2>
                            <div id="panelsStayOpen-collapsethree"
                                 className="accordion-collapse collapse show">
                                <div className="accordion-body px-0 pt-0 pb-3">
                                    {dueDates.map((date, index) => (
                                        <div key={index} className="form-check d-flex gap-2 align-items-center mb-2">
                                            <input
                                                className="form-check-input shadow-none cursor-pointer border-secondary patients-filter-modal-checkbox"
                                                type="checkbox" value={date.value}
                                                id={`${date.label}CheckBox`}
                                                checked={formValues.selectedDueDate.includes(date.value)}
                                                onChange={handleDueDateChange}
                                            />

                                            <label
                                                className="form-check-label cursor-pointer mb-n1 fw-light detail-text text-light"
                                                htmlFor={`${date.label}CheckBox`}>
                                                {date.label}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


                <div className="d-flex align-items-center justify-content-between mt-3">
                    <button
                        onClick={handleFilter}
                            className={`d-flex align-items-center border-0 py-2 px-3 rounded-2 fs-14 fw-normal ${!ButtonColor && "btn-primary"}`}
                            style={{backgroundColor: ButtonColor && ButtonColor}}>
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
    )
}

export default ReminderFilterModal;
