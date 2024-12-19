import React, {useEffect, useState} from 'react';
import {useOrganizationDataStore} from "../../../../stores/OrganizationDataStore.js";
const OrganizationDetailFilterDropdown = ({
                                              isShowFilterModal,
                                              setIsShowFilterModal,
                                              organizationPracticeNames,
                                              organizationPracticeStates,
                                              filterSelectedPractices,
                                              filterSelectedRoles,
                                              filterSelectedState,
                                              filterSelectedKey,
                                              handleFilterOrganizationData}) => {
    const { setOrganizationFilterKey } = useOrganizationDataStore();
    const [isFilterItemsChecked, setIsFilterItemsChecked] = useState({
        typeUsers: true,
        typePractice: false,
    })

    const [formValues, setFormValues] = useState({
        selectedPractices: [],
        selectedRoles: [],
        selectedState: '',
        selectedKey: 'user'
    });

    const [resetKey, setResetKey] = useState(0); // State variable to force re-render

    const OrganizationRoles = [
        { value: 'Administrator', label: 'Administrator' },
        { value: 'Super Administrator', label: 'Super Administrator' },
    ];

    useEffect(() => {
        if (isShowFilterModal) {
            const defaultKey = filterSelectedKey || 'user';

            setFormValues(prevState => ({
                ...prevState,
                selectedPractices: filterSelectedPractices,
                selectedRoles: filterSelectedRoles,
                selectedState: filterSelectedState,
                selectedKey: defaultKey
            }));

            setIsFilterItemsChecked(prevState => ({
                ...prevState,
                typeUsers: defaultKey === 'user',
                typePractice: defaultKey === 'practice'
            }));
        }
    }, [isShowFilterModal, filterSelectedPractices, filterSelectedRoles, filterSelectedState, filterSelectedKey]);

    const handleFilterCheckboxChange = (event) => {
        const {name, checked} = event.target;

        // Update state with the new checked value for the specific checkbox
        setIsFilterItemsChecked((prevState) => ({
            ...prevState,
            [name]: checked,
        }));
    };

    const handleStateChange = (event) => {
        const { value } = event.target;
        setFormValues(prevState => ({ ...prevState, selectedState: value }));
    };
    const handleRolesChange = (event) => {
        const { value, checked } = event.target;
        setFormValues(prevState => {
            const updatedStatus = checked
                ? [...prevState.selectedRoles, value]
                : prevState.selectedRoles.filter(status => status !== value);
            return { ...prevState, selectedRoles: updatedStatus };
        });
    };
    const handlePracticeChange = (event) => {
        const { value, checked } = event.target;
        setFormValues(prevState => {
            const updatedStatus = checked
                ? [...prevState.selectedPractices, value]
                : prevState.selectedPractices.filter(status => status !== value);
            return { ...prevState, selectedPractices: updatedStatus };
        });
    };

    const handleFilter = async () => {
        handleFilterOrganizationData(formValues)
        await setIsShowFilterModal(false);
    };

    const handleTypeUserFilterCheckboxChange = async (event) => {
        setFormValues(prevState => ({ ...prevState, selectedKey: 'user' }));
        handleFilterCheckboxChange(event)
        setIsFilterItemsChecked((prevState) => ({...prevState, typePractice: !prevState.typeUsers}))
    }

    const handleTypePracticeFilterCheckboxChange = async (event) => {
        setFormValues(prevState => ({ ...prevState, selectedKey: 'practice' }));
        handleFilterCheckboxChange(event)
        setIsFilterItemsChecked((prevState) => ({...prevState, typeUsers: !prevState.typePractice}))
    }

    const handleClearAll = () => {
        setFormValues({
            selectedPractices: [],
            selectedRoles: [],
            selectedState: '',
            selectedKey: 'user'
        });
        setResetKey(prevKey => prevKey + 1); // Update the key to force re-render
    };


    return (
        <div key={resetKey}>
            <div onClick={() => setIsShowFilterModal(false)}
                 className={`light-black-modal-overlay ${isShowFilterModal} bg-black-10`}>
            </div>
            <div
                className={`organization-detail-filter-modal position-absolute end-0 bg-white border border-light-grey rounded-3 overflow-hidden p-3`}>

                <div>
                    <div className="accordion" id="accordionPanelsStayOpenExample">
                        <div
                            className="accordion-item rounded-0 border-start-0 border-end-0 border-top-0 border-bottom border-black-20">
                            <h2 className="accordion-header">
                                <button
                                    className="accordion-button px-0 py-3 text-black"
                                    type="button"
                                    data-bs-toggle="collapse"
                                    data-bs-target="#panelsStayOpen-collapseOne"
                                    aria-expanded="true"
                                    aria-controls="panelsStayOpen-collapseOne">
                                    Type
                                </button>
                            </h2>
                            <div id="panelsStayOpen-collapseOne"
                                 className="accordion-collapse collapse show">
                                <div className="accordion-body px-0 pt-0 pb-3">
                                    <ul className="list-unstyled mb-0 d-flex flex-column gap-2">
                                        <li className="d-flex align-items-center gap-3">
                                            <input
                                                id="filter-type-users-checkbox"
                                                className="organization-detail-filter-item-checkbox"
                                                type="checkbox"
                                                checked={isFilterItemsChecked.typeUsers}
                                                name="typeUsers"
                                                onChange={handleTypeUserFilterCheckboxChange}
                                            />
                                            <label
                                                htmlFor="filter-type-users-checkbox"
                                                className="text-dark-grey fw-light">Users</label>
                                        </li>

                                        <li className="d-flex align-items-center gap-3">
                                            <input
                                                id="filter-type-practice-checkbox"
                                                className="organization-detail-filter-item-checkbox"
                                                type="checkbox"
                                                checked={isFilterItemsChecked.typePractice}
                                                name="typePractice"
                                                onChange={handleTypePracticeFilterCheckboxChange}
                                            />
                                            <label
                                                htmlFor="filter-type-practice-checkbox"
                                                className="text-dark-grey fw-light">Practice</label>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        {
                            (isFilterItemsChecked.typeUsers) ? (
                                    <>
                                        <div
                                            className="accordion-item rounded-0 border-start-0 border-end-0 border-top-0 border-bottom border-black-20">
                                            <h2 className="accordion-header">
                                                <button
                                                    className="accordion-button px-0 py-3 text-black"
                                                    type="button"
                                                    data-bs-toggle="collapse"
                                                    data-bs-target="#panelsStayOpen-collapseTwo"
                                                    aria-expanded="true"
                                                    aria-controls="panelsStayOpen-collapseTwo">
                                                    Practices
                                                </button>
                                            </h2>
                                            <div id="panelsStayOpen-collapseTwo"
                                                 className="accordion-collapse collapse show">
                                                <div className="accordion-body px-0 pt-0 pb-3">
                                                    {organizationPracticeNames.map((practice, index) => (
                                                        <div key={index} className="d-flex gap-2 align-items-center mb-2">
                                                            <input
                                                                className="organization-detail-filter-item-checkbox"
                                                                type="checkbox"
                                                                value={practice}
                                                                id={`${practice}CheckBox`}
                                                                checked={formValues.selectedPractices.includes(practice)}
                                                                onChange={handlePracticeChange}
                                                            />
                                                            <label
                                                                className="text-dark-grey fw-light"
                                                                htmlFor={`${practice}CheckBox`}>
                                                                {practice}
                                                            </label>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        <div
                                            className="accordion-item rounded-0 border-start-0 border-end-0 border-top-0 border-bottom border-black-20">
                                            <h2 className="accordion-header">
                                                <button
                                                    className="accordion-button px-0 py-3 text-black"
                                                    type="button"
                                                    data-bs-toggle="collapse"
                                                    data-bs-target="#panelsStayOpen-collapseThree"
                                                    aria-expanded="true"
                                                    aria-controls="panelsStayOpen-collapseThree">
                                                    Organization Role
                                                </button>
                                            </h2>
                                            <div id="panelsStayOpen-collapseThree"
                                                 className="accordion-collapse collapse show">
                                                <div className="accordion-body px-0 pt-0 pb-3">
                                                    {OrganizationRoles.map((role, index) => (
                                                        <div key={index} className="d-flex gap-2 align-items-center mb-2">
                                                            <input
                                                                className="organization-detail-filter-item-checkbox"
                                                                type="checkbox"
                                                                value={role.value}
                                                                id={`${role.value}CheckBox`}
                                                                checked={formValues.selectedRoles.includes(role.value)}
                                                                onChange={handleRolesChange}
                                                            />
                                                            <label
                                                                className="text-dark-grey fw-light"
                                                                htmlFor={`${role.value}CheckBox`}>
                                                                {role.label}
                                                            </label>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                ) :
                                <div
                                    className="accordion-item rounded-0 border-0">
                                    <h2 className="accordion-header">
                                        <button
                                            className="accordion-button px-0 py-3 text-black"
                                            type="button"
                                            data-bs-toggle="collapse"
                                            data-bs-target="#panelsStayOpen-collapseFour"
                                            aria-expanded="true"
                                            aria-controls="panelsStayOpen-collapseFour">
                                            State
                                        </button>
                                    </h2>
                                    <div id="panelsStayOpen-collapseFour"
                                         className="accordion-collapse collapse show">
                                        <div className="accordion-body px-0 pt-0 pb-2">
                                            <select
                                                id="admin-create-program-assistant"
                                                className="form-select border-light-grey text-dark-grey fw-light"
                                                aria-label="Default select example"
                                                value={formValues.selectedState}
                                                onChange={handleStateChange}
                                            >
                                                <option value="">Select State</option>
                                                {organizationPracticeStates.map((option, index) => (
                                                    <option
                                                        key={index}
                                                        selected={formValues.selectedState.includes(option)}
                                                        value={option}
                                                    >
                                                        {option}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                        }
                    </div>

                </div>

                <div className="d-flex align-items-center justify-content-between mt-3">
                    <button onClick={handleFilter}
                            className="d-flex align-items-center bg-parrot-green border-0 py-2 px-3 rounded-2 fs-14 fw-normal">
                        Apply Filter
                    </button>
                    <button
                        onClick={handleClearAll}
                        className="d-flex align-items-center bg-transparent border border-dark-blue text-dark-blue py-2 px-3 rounded-2 fs-14 fw-normal">
                        Clear All
                    </button>

                </div>
            </div>
        </div>
    )
}

export default OrganizationDetailFilterDropdown;
