import React, {useContext, useEffect, useState} from 'react';
import AdminLayout from "../../../layouts/dashboard/AdminLayout.jsx";
import PlusBlackIcon from "../../../assets/images/icons/black-plus.svg";
import SearchIcon from "../../../assets/images/icons/search.svg";
import OrderByGreyIcon from "../../../assets/images/icons/order-by-grey.svg";
import FilterDarkGreyIcon from "../../../assets/images/icons/filter-dark-grey.svg";
import ArrowRightParrotGreenIcon from "../../../assets/images/icons/arrow-right-parrot-green.svg";
import EditCyanIcon from "../../../assets/images/icons/edit-cyan.svg";
import DustbinRedIcon from "../../../assets/images/icons/dustbin-red.svg";
import DustbinRedWhitePicture from "../../../assets/images/dustbin-red-white.png";
import OrganizationDetailFilterDropdown from "./partials/OrganizationDetailFilterDropdown.jsx";
import OrganizationDetailCreateOrganizationRole from "./partials/OrganizationDetailCreateOrganizationRole.jsx";
import OrganizationDetailAddPracticeModal from "./partials/OrganizationDetailAddPracticeModal.jsx";
import OrganizationDetailCreatePracticeRole from "./partials/OrganizationDetailCreatePracticeRole.jsx";
import OrganizationDetailEditPracticeModal from "./partials/OrganizationDetailEditPracticeModal.jsx";
import {Link, useLocation, useNavigate} from "react-router-dom";
import OrganizationAndPracticesService from "./service/OrganizationAndPracticesService.js";
import {AuthContext} from "../../../context/AuthContext.jsx";
import {useOrganizationDataStore} from "../../../stores/OrganizationDataStore.js";
import {useAdminDataStore} from "../../../stores/AdminDataStore.js";
import PatientsService from "../patients/service/PatientsService.js";
import Spinner from "../../../components/Spinner.jsx";
import config from "../../../config.json";
import {AdminDeleteUserCommand, CognitoIdentityProviderClient, AdminDisableUserCommand} from "@aws-sdk/client-cognito-identity-provider";


const clientAccessKey = config.REACT_APP_CLIENT_ACCESS_KEY_ID;
const clientAccessSecretKey = config.REACT_APP_CLIENT_SECRET_ACCESS_KEY_ID;
export const cognitoClient = new CognitoIdentityProviderClient({
    region: "us-east-2",
    credentials: {
        accessKeyId: clientAccessKey,
        secretAccessKey: clientAccessSecretKey
    }
});

const OrganizationDetail = () => {
    const {authToken } = useContext(AuthContext);
    const { organizationData,setOrganizationPractice ,organizationReload,setOrganizationReload,
        setOrganizationPracticeNames,organizationPracticeNames,setOrganizationPracticeStates,organizationPracticeStates,setOrganizationRoles,setPracticeRoles} = useOrganizationDataStore();
    const { loginUser } = useAdminDataStore();
    const navigate = useNavigate()
    const [deletedOrganizationPractice, setDeletedOrganizationPractice] = useState({}) // d-block
    const [deletedOrganizationUser, setDeletedOrganizationUser] = useState({}) // d-block
    const [isShowOrderByBox, setIsShowOrderByBox] = useState("d-none") // d-block
    const [isShowDeleteBox, setIsShowDeleteBox] = useState("d-none") // d-flex
    const [isShowPracticeDeleteBox, setIsShowPracticeDeleteBox] = useState("d-none") // d-flex
    const [isShowFilterModal, setIsShowFilterModal] = useState(false) // true
    const [organizationUsers, setOrganizationUsers] = useState([]);
    const [duplicateOrganizationUsers, setDuplicateOrganizationUsers] = useState([]);
    const [organizationPractices, setOrganizationPractices] = useState([]);
    const [duplicateOrganizationPractices, setDuplicateOrganizationPractices] = useState([]);
    const [order, setOrder] = useState('desc');
    const [isLoading, setIsLoading] = useState(false);

    // for filter
    const [filterSelectedPractices, setFilterSelectedPractices] = useState([]);
    const [filterSelectedRoles, setFilterSelectedRoles] = useState([]);
    const [filterSelectedState, setFilterSelectedState] = useState('');
    const [filterSelectedKey, setFilterSelectedKey] = useState('');


    const [searchInput, setSearchInput] = useState('');
    const [changeValues, setChangeValues] = useState({
        OrganizationUserID: "",
        OrganizationRole: "",
    });



    useEffect(() => {
        const fetchOrganizationData = async () => {
            if (organizationData && organizationData.OrganizationID) {
                await setOrganizationReload(false);
                try {
                    setIsLoading(true);
                    const organizationPractices = await OrganizationAndPracticesService.fetchOrganizationPractices(authToken, organizationData.OrganizationID,order);
                    if (organizationPractices) {
                        const practiceNames = organizationPractices.map(practice => practice.PracticeName);
                        const practiceStates = [...new Set(organizationPractices.map(practice => practice.State))];
                        await setOrganizationPracticeNames(practiceNames);
                        await setOrganizationPracticeStates(practiceStates);
                        setOrganizationPractices(organizationPractices);
                        setDuplicateOrganizationPractices(organizationPractices);
                    }
                    const result = await OrganizationAndPracticesService.fetchOrganizationUsers(authToken, organizationData.OrganizationID,order);
                    if (result && (result.organizationUsers || result.organization_roles || result.practice_roles)) {
                        setOrganizationUsers(result.organizationUsers);
                        setDuplicateOrganizationUsers(result.organizationUsers);
                        await setOrganizationRoles(result.organization_roles);
                        await setPracticeRoles(result.practice_roles);
                    }
                    setIsLoading(false);
                } catch (error) {
                    setIsLoading(false);
                    console.error("Error fetching organization data:", error);
                }
            }
        };

        fetchOrganizationData();
    }, [organizationData,organizationReload,order]);

    useEffect(() => {
        if (searchInput) {
            const filteredOrganizationUsers = organizationUsers.filter(
                (user) =>
                    user.FirstName.toLowerCase().includes(searchInput.toLowerCase()) ||
                    user.LastName.toLowerCase().includes(searchInput.toLowerCase()) ||
                    user.Practice.toLowerCase().includes(searchInput.toLowerCase()) ||
                    user.OrganizationRole.toLowerCase().includes(searchInput.toLowerCase())
            );
            setOrganizationUsers(filteredOrganizationUsers);
            const filteredOrganizationPractices = organizationPractices.filter(
                (practice) =>
                    practice.PracticeName.toLowerCase().includes(searchInput.toLowerCase()) ||
                    practice.Street.toLowerCase().includes(searchInput.toLowerCase()) ||
                    practice.City.toLowerCase().includes(searchInput.toLowerCase()) ||
                    practice.State.toLowerCase().includes(searchInput.toLowerCase())
            );
            setOrganizationPractices(filteredOrganizationPractices);
        } else {
            setOrganizationUsers(duplicateOrganizationUsers);
            setOrganizationPractices(duplicateOrganizationPractices);
        }
    }, [searchInput]);


    const handleAddOrganizationUser = (e) => {
        e.stopPropagation();
        navigate('/organizations/organization-add-user');
    };
    const handleOrganizationUserEdit = (e,organizationUser) => {
        e.stopPropagation();
        navigate('/organizations/organization-edit-user', { state: { organizationUser } });
    };

    const showOrganizationUserDeleteBox = async (e,organizationUser) => {
        e.stopPropagation();
        await setDeletedOrganizationUser(organizationUser)
        setIsShowDeleteBox("d-flex")
    }

    const deleteCognitoUser = async (username) => {
        const disableParams = {
            UserPoolId: config.userPoolId,
            Username: username
        };

        try {
            const command = new AdminDisableUserCommand(disableParams);
            const result = await cognitoClient.send(command);
            return result;
        } catch (error) {
            console.log("error");
            console.log(error);
        }
    };
    const handleOrganizationUserDelete = async (e) => {
        e.stopPropagation();
        setIsLoading(true);
        const deleted_result = await deleteCognitoUser(deletedOrganizationUser.EmailAddress);
        // Access the HTTP status code from the $metadata object
        const httpStatusCode = deleted_result?.$metadata?.httpStatusCode;
        if (httpStatusCode === 200) {
            const result = await OrganizationAndPracticesService.deleteOrganizationUser(authToken,deletedOrganizationUser.OrganizationUserID,loginUser);
            setIsLoading(false);
            if (result.status === 200) {
                setIsShowDeleteBox("d-none")
                if (result.status === 200) {
                    setOrganizationUsers(prevOrganizationUser =>
                        prevOrganizationUser.filter(p => p.OrganizationUserID !== deletedOrganizationUser.OrganizationUserID)
                    );
                }
            }
        }
        setIsLoading(false);
    }

    // Practices Functions

    const showOrganizationPracticeDeleteBox = async (e,organizationPractice) => {
        e.stopPropagation();
        await setDeletedOrganizationPractice(organizationPractice)
        setIsShowPracticeDeleteBox("d-flex")
    }

    const handleOrganizationPracticeDelete = async (e) => {
        e.stopPropagation();
        setIsLoading(true);
        const result = await OrganizationAndPracticesService.deleteOrganizationPractice(authToken,deletedOrganizationPractice.OrganizationPracticeID,loginUser);
        if (result.status === 200) {
            setIsShowPracticeDeleteBox("d-none")
            if (result.status === 200) {
                setOrganizationPractices(prevOrganizationPractice =>
                    prevOrganizationPractice.filter(p => p.OrganizationPracticeID !== deletedOrganizationPractice.OrganizationPracticeID)
                );
            }
        }
        setIsLoading(false);
    }
    const handleAssignRole = async (user, role,roleType) => {
        setIsLoading(true);
        changeValues.OrganizationUserID = user;
        changeValues.Role = role;
        changeValues.RoleType = roleType;
        if (changeValues.OrganizationUserID){
            const result = await OrganizationAndPracticesService.changeOrganizationUserRole(authToken, changeValues,loginUser);
            if (result.status === 200) {
                window.location.reload();
            }
        }
        setIsLoading(false);
    };

    const handleFilterOrganizationData = async (formValues) => {
        try {
            if (organizationData && organizationData.OrganizationID){
                setIsLoading(true);
                await setFilterSelectedPractices(formValues.selectedPractices);
                await setFilterSelectedRoles(formValues.selectedRoles);
                await setFilterSelectedState(formValues.selectedState);
                await setFilterSelectedKey(formValues.selectedKey);
                formValues.OrganizationID = organizationData.OrganizationID;
                const result = await OrganizationAndPracticesService.filterOrganizationData(authToken, formValues);
                const data = result.filteredResults
                if (data && data.organizationUsers) {
                    setOrganizationUsers(data.organizationUsers);
                    setDuplicateOrganizationUsers(data.organizationUsers);
                }
                else if (data && data.organizationPractices){
                    setOrganizationPractices(data.organizationPractices);
                    setDuplicateOrganizationPractices(data.organizationPractices);
                }
                setIsLoading(false);
            }
        } catch (error) {
            setIsLoading(false);
            console.error('Update failed:', error);
        }
    }

    const handleOrderChange = (newOrder) => {
        setOrder(newOrder);
        setIsShowOrderByBox("d-none");
    };


    if (isLoading) {
        return <Spinner />
    }

    return (
        <AdminLayout headerTitle={"Organizations"} isDashboard={true}>
            <div>
                <section className="organization-detail rounded-3 px-3 pt-3 pb-4 bg-light-grey">
                    <div
                        className="admin-program-table-top d-flex flex-md-row flex-column align-items-center justify-content-md-between">
                        <h5 className="mb-md-0 mb-3 fw-bolder fs-19 text-dark-grey-3">{organizationData && organizationData.OfficialName}</h5>

                        <div className="d-flex align-items-stretch gap-2 position-relative">
                            <div
                                className="admin-program-table-searchbar organization-detail-main-searchbar d-flex align-items-center rounded-2 bg-white border border-black-10 px-3 py-1 gap-1">
                                <label htmlFor="header-searchbar-input" className="d-flex align-items-center">
                                    <img src={SearchIcon}/>
                                </label>
                                <input
                                    className="border-0 bg-transparent input-focus-none flex-grow-1 flex-shrink-1 fs-14"
                                    placeholder="Search"
                                    id="header-searchbar-input"
                                    value={searchInput}
                                    onChange={(e) => setSearchInput(e.target.value)}
                                />
                            </div>
                            <button
                                onClick={() => setIsShowOrderByBox("d-block")}
                                className="admin-program-filter-btn bg-white border border-grey rounded-3 d-flex align-items-center justify-content-center">
                                <img src={OrderByGreyIcon}/>
                            </button>
                            <button
                                onClick={() => setIsShowFilterModal(true)}
                                aria-expanded="false"
                                className="admin-program-filter-btn bg-white border border-grey rounded-3 d-flex align-items-center justify-content-center">
                                <img src={FilterDarkGreyIcon}/>
                            </button>

                            {/*ORDER BY POPUP*/}
                            <div onClick={() => setIsShowOrderByBox("d-none")}
                                 className={`admin-program-table-delete-confirm ${isShowOrderByBox} bg-black-10`}></div>
                            <ul className={`admin-program-order-by-popup ${isShowOrderByBox} list-unstyled mb-0 border border-light-grey rounded-3 overflow-hidden position-absolute end-0`}>
                                <li role="button"
                                    className="px-3 py-2 text-dark-grey bg-white border-bottom"
                                    onClick={() => handleOrderChange('desc')}
                                >
                                    Newest First
                                </li>

                                <li role="button"
                                    className="px-3 py-2 text-dark-grey bg-white"
                                    onClick={() => handleOrderChange('asc')}
                                >
                                    Oldest First
                                </li>
                            </ul>

                            {/*FILTER POPUP*/}
                            {
                                (isShowFilterModal) ? (
                                    <>
                                        <OrganizationDetailFilterDropdown setIsShowFilterModal={setIsShowFilterModal}
                                                                          isShowFilterModal={isShowFilterModal}
                                                                          organizationPracticeNames={organizationPracticeNames}
                                                                          organizationPracticeStates={organizationPracticeStates}
                                                                          filterSelectedPractices={filterSelectedPractices}
                                                                          filterSelectedRoles={filterSelectedRoles}
                                                                          filterSelectedState={filterSelectedState}
                                                                          filterSelectedKey={filterSelectedKey}
                                                                          handleFilterOrganizationData={handleFilterOrganizationData}
                                        />
                                    </>) : ""
                            }
                        </div>
                    </div>


                    {/*DELETE POPUP*/}
                    <div
                        onClick={() => setIsShowDeleteBox("d-none")}
                        className={`admin-program-table-delete-confirm bg-black-10 ${isShowDeleteBox} d-flex align-items-center justify-content-center`}>
                        <div
                            onClick={(e) => e.stopPropagation()}
                            className="admin-program-table-delete-confirm-box organization-detail-delete-modal mx-3 py-4 bg-white border border-black-20 rounded-2 d-flex flex-column align-items-center justify-content-center text-center">
                            <img src={DustbinRedWhitePicture}/>
                            <h5 className="mb-1 mt-2 fw-normal fs-18">Delete User?</h5>
                            <p className="mb-0 text-dark-grey fw-light fs-14">Are you sure you want to delete
                                this user?</p>

                            <div className="d-flex align-items-center gap-2 mt-3">
                                <button
                                    onClick={(e) => handleOrganizationUserDelete(e)}
                                    className="d-flex align-items-center bg-parrot-green border-0 py-2 px-3 rounded-2 fs-14 fw-normal">
                                    Yes, Delete
                                </button>
                                <button
                                    onClick={() => setIsShowDeleteBox("d-none")}
                                    className="d-flex align-items-center bg-transparent border border-dark-blue text-dark-blue py-2 px-3 rounded-2 fs-14 fw-normal">
                                    Keep User
                                </button>
                            </div>
                        </div>
                    </div>


                    <div
                        className="admin-program-detail-top-table custom-scrollbar-section-1 bg-white border border-light-grey rounded-3 px-3 pt-4 pb-0 mt-4">
                        <div
                            className="d-flex flex-sm-row flex-column gap-sm-0 gap-3 align-items-center justify-content-between border-bottom border-black-10 pb-3 mb-4">
                            <h5 className="mb-0 fw-bolder fs-18">Users</h5>

                            <div className="d-flex align-items-center gap-3">
                                <button onClick={(e) => handleAddOrganizationUser(e)}
                                    className="admin-program-detail-btn d-flex align-items-center justify-content-center bg-parrot-green border-0 rounded-circle aspect-ratio-1x1">
                                    <img src={PlusBlackIcon}/>
                                </button>
                                <div className="admin-program-heading-line-seperator my-1 d-sm-block d-none">
                                </div>
                                <button type="button" data-bs-toggle="modal"
                                        data-bs-target="#organization-detail-create-org-role-modal"
                                        className="bg-transparent border-0 p-0 d-flex align-items-center justify-content-center gap-2">
                                            <span
                                                className="text-parrot-green fw-bolder">Create Organization Role</span>
                                    <img src={ArrowRightParrotGreenIcon}/>
                                </button>

                                <OrganizationDetailCreateOrganizationRole organizationUser={organizationUsers} onAssignRole={handleAssignRole}  />
                            </div>
                        </div>

                        <div className="mt-2">
                            <div className="table-responsive">
                                <table className="table admin-program-detail-table">
                                    <thead>
                                    <tr className="admin-program-detail-table-heading-row">
                                        <th scope="col" className="fw-normal py-3">User Name</th>
                                        <th scope="col" className="fw-normal py-3">Practice</th>
                                        <th scope="col" className="fw-normal py-3">Registered Date</th>
                                        <th scope="col" className="fw-normal py-3">Organization Role</th>
                                        <th scope="col" className="fw-normal py-3">Actions</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {organizationUsers && organizationUsers.map((organizationUser) => (
                                    <tr key={organizationUser.OrganizationUserID} className="admin-program-detail-table-body-row fw-light fs-14">
                                        <td>{organizationUser.FirstName + ' ' + organizationUser.LastName}</td>
                                        <td>{organizationUser.Practice}</td>
                                        <td>
                                            {new Date(organizationUser.CreatedAt).toLocaleDateString('en-GB', {
                                                day: '2-digit',
                                                month: 'short',
                                                year: 'numeric',
                                            })}
                                        </td>
                                        <td>{organizationUser.OrganizationRole}</td>
                                        <td>
                                            <div className="d-flex gap-2">
                                                <button
                                                    onClick={(e) => handleOrganizationUserEdit(e, organizationUser)}
                                                    className="admin-program-table-edit-btn border border-cyan-50 rounded-3 d-flex align-items-center justify-content-center">
                                                    <img src={EditCyanIcon}/>
                                                </button>
                                                <button
                                                    onClick={(e) => showOrganizationUserDeleteBox(e,organizationUser)}
                                                    className="admin-program-table-delete-btn border border-red-50 rounded-3 d-flex align-items-center justify-content-center">
                                                    <img src={DustbinRedIcon}/>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                        ))}
                                    </tbody>
                                </table>

                            </div>
                        </div>
                    </div>

                    <div
                        className="admin-program-detail-top-table custom-scrollbar-section-1 bg-white border border-light-grey rounded-3 px-3 pt-4 pb-0 mt-4">
                        <div
                            className="d-flex flex-sm-row flex-column gap-sm-0 gap-3 align-items-center justify-content-between border-bottom border-black-10 pb-3 mb-4">
                            <h5 className="mb-0 fw-bolder fs-18">Practices</h5>

                            <div className="d-flex align-items-center gap-3">
                                <button
                                    // onClick={(e) => handleAddOrganizationPractice(e)}
                                    type="button" data-bs-toggle="modal"
                                    data-bs-target="#organization-detail-add-practice-modal"
                                    className="admin-program-detail-btn d-flex align-items-center justify-content-center bg-parrot-green border-0 rounded-circle aspect-ratio-1x1">
                                    <img src={PlusBlackIcon}/>
                                </button>
                                <div className="admin-program-heading-line-seperator my-1 d-sm-block d-none">
                                </div>
                                <button
                                    type="button" data-bs-toggle="modal"
                                    data-bs-target="#organization-detail-create-practice-role-modal"
                                    className="bg-transparent border-0 p-0 d-flex align-items-center justify-content-center gap-2">
                                    <span className="text-parrot-green fw-bolder">Create Practice Role</span>
                                    <img src={ArrowRightParrotGreenIcon}/>
                                </button>

                                <OrganizationDetailAddPracticeModal />
                                <OrganizationDetailCreatePracticeRole organizationUser={organizationUsers} onAssignRole={handleAssignRole}/>
                                {/*DELETE POPUP*/}
                                <div
                                    onClick={() => setIsShowPracticeDeleteBox("d-none")}
                                    className={`admin-program-table-delete-confirm bg-black-10 ${isShowPracticeDeleteBox} d-flex align-items-center justify-content-center`}>
                                    <div
                                        onClick={(e) => e.stopPropagation()}
                                        className="admin-program-table-delete-confirm-box organization-detail-delete-modal mx-3 py-4 bg-white border border-black-20 rounded-2 d-flex flex-column align-items-center justify-content-center text-center">
                                        <img src={DustbinRedWhitePicture}/>
                                        <h5 className="mb-1 mt-2 fw-normal fs-18">Delete Practice?</h5>
                                        <p className="mb-0 text-dark-grey fw-light fs-14">Are you sure you want to delete
                                            this practice?</p>

                                        <div className="d-flex align-items-center gap-2 mt-3">
                                            <button
                                                onClick={(e) => handleOrganizationPracticeDelete(e)}
                                                className="d-flex align-items-center bg-parrot-green border-0 py-2 px-3 rounded-2 fs-14 fw-normal">
                                                Yes, Delete
                                            </button>
                                            <button
                                                onClick={() => setIsShowDeleteBox("d-none")}
                                                className="d-flex align-items-center bg-transparent border border-dark-blue text-dark-blue py-2 px-3 rounded-2 fs-14 fw-normal">
                                                Keep Practice
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-2">
                            <div className="table-responsive">
                                <table className="table admin-program-detail-table">
                                    <thead>
                                    <tr className="admin-program-detail-table-heading-row">
                                        <th scope="col" className="fw-normal py-3">Practice Name</th>
                                        <th scope="col" className="fw-normal py-3">Street</th>
                                        <th scope="col" className="fw-normal py-3">City</th>
                                        <th scope="col" className="fw-normal py-3">State</th>
                                        <th scope="col" className="fw-normal py-3">Zip</th>
                                        <th scope="col" className="fw-normal py-3">Actions</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {organizationPractices && organizationPractices.map((organizationPractice) => (
                                        <tr key={organizationPractice.OrganizationPracticeID} className="admin-program-detail-table-body-row fw-light fs-14">
                                            <td>{organizationPractice.PracticeName}</td>
                                            <td>{organizationPractice.Street}</td>
                                            <td>{organizationPractice.City}</td>
                                            <td>{organizationPractice.State}</td>
                                            <td>{organizationPractice.ZipCode}</td>
                                            <td>
                                                <div className="d-flex gap-2">
                                                    <button
                                                        onClick={() => setOrganizationPractice(organizationPractice)}
                                                        type="button" data-bs-toggle="modal"
                                                        data-bs-target="#organization-detail-edit-practice-modal"
                                                        className="admin-program-table-edit-btn border border-cyan-50 rounded-3 d-flex align-items-center justify-content-center">
                                                        <img src={EditCyanIcon}/>
                                                    </button>
                                                    <button
                                                        onClick={(e) => showOrganizationPracticeDeleteBox(e,organizationPractice)}
                                                        className="admin-program-table-delete-btn border border-red-50 rounded-3 d-flex align-items-center justify-content-center">
                                                        <img src={DustbinRedIcon}/>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>

                                    ))}
                                    </tbody>
                                </table>

                                <OrganizationDetailEditPracticeModal/>

                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </AdminLayout>
    );
}

export default OrganizationDetail
