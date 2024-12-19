import React, {useContext, useEffect, useState} from "react"
import AdminLayout from "../../../layouts/dashboard/AdminLayout.jsx";
import PlusBlackIcon from "../../../assets/images/icons/black-plus.svg";
import SearchIcon from "../../../assets/images/icons/search.svg";
import OrderByGreyIcon from "../../../assets/images/icons/order-by-grey.svg";
import DustbinRedWhitePicture from "../../../assets/images/dustbin-red-white.png";
import EditCyanIcon from "../../../assets/images/icons/edit-cyan.svg";
import DustbinRedIcon from "../../../assets/images/icons/dustbin-red.svg";
import LeftArrowGreyIcon from "../../../assets/images/icons/arrow-left-light-grey.svg";
import RightArrowGreyIcon from "../../../assets/images/icons/arrow-right-light-grey.svg";
import {Link, useNavigate} from "react-router-dom";
import OrganizationAndPracticesService from "./service/OrganizationAndPracticesService.js";
import {AuthContext} from "../../../context/AuthContext.jsx";
import {useOrganizationDataStore} from "../../../stores/OrganizationDataStore.js";
import {useAdminDataStore} from "../../../stores/AdminDataStore.js";
import Spinner from "../../../components/Spinner.jsx";
import config from "../../../config.json";


import {CognitoIdentityProviderClient, AdminDisableUserCommand} from "@aws-sdk/client-cognito-identity-provider";


const clientAccessKey = config.REACT_APP_CLIENT_ACCESS_KEY_ID;
const clientAccessSecretKey = config.REACT_APP_CLIENT_SECRET_ACCESS_KEY_ID;
export const cognitoClient = new CognitoIdentityProviderClient({
    region: "us-east-2",
    credentials: {
        accessKeyId: clientAccessKey,
        secretAccessKey: clientAccessSecretKey
    }
});

const OrganizationListing = () => {
    const navigate = useNavigate();
    const {authToken} = useContext(AuthContext);
    const { loginUser } = useAdminDataStore();
    const { setOrganizationData } = useOrganizationDataStore();
    const [deletedOrganization, setDeletedOrganization] = useState({}) // d-flex
    const [allOrganizations, setAllOrganizations] = useState([]) // d-flex
    const [duplicateAllOrganizations, setDuplicateAllOrganizations] = useState([]) // d-flex
    const [isShowDeleteBox, setIsShowDeleteBox] = useState("d-none") // d-flex
    const [isShowOrderByBox, setIsShowOrderByBox] = useState("d-none") // d-block
    const [currentOffset, setCurrentOffset] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [itemsPerPage] = useState(10);
    const [searchInput, setSearchInput] = useState('');
    const [order, setOrder] = useState('desc');
    const [isLoading, setIsLoading] = useState(false);



    const showDeleteModal = async (e, organization) => {
        e.stopPropagation();
        await setDeletedOrganization(organization)
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
    const handleOrganizationDelete = async (e) => {
        e.stopPropagation();
        setIsLoading(true);
        if (deletedOrganization.UserCount && deletedOrganization.UserCount.length > 0) {
            const organizationUsers = deletedOrganization.UserCount;
            let deleted_result = null;
            for (const organizationUser of organizationUsers) {
                deleted_result = await deleteCognitoUser(organizationUser.EmailAddress);
            }
            const httpStatusCode = deleted_result?.$metadata?.httpStatusCode;
            if (httpStatusCode === 200) {
                const result = await OrganizationAndPracticesService.deleteOrganization(authToken, deletedOrganization.OrganizationID, loginUser);
                setIsLoading(false);
                if (result.status === 200) {
                    setIsShowDeleteBox("d-none")
                    if (result.status === 200) {
                        setAllOrganizations(prevPrograms =>
                            prevPrograms.filter(p => p.OrganizationID !== deletedOrganization.OrganizationID)
                        );
                    }
                }
            }
        } else {
            const result = await OrganizationAndPracticesService.deleteOrganization(authToken, deletedOrganization.OrganizationID, loginUser);
            setIsLoading(false);
            if (result.status === 200) {
                setIsShowDeleteBox("d-none")
                if (result.status === 200) {
                    setAllOrganizations(prevPrograms =>
                        prevPrograms.filter(p => p.OrganizationID !== deletedOrganization.OrganizationID)
                    );
                }
            }
        }
        setIsLoading(false);
    }

    const handleOrganizationEdit = (e,organization) => {
        e.stopPropagation();
        navigate('/organizations/edit-organization', { state: { organization } });
    }

    useEffect(() => {
        fetchAllOrganizations();
    }, [currentPage,order]);

    useEffect(() => {
        if (searchInput) {
            const filteredOrganization = allOrganizations.filter(
                (organization) =>
                    organization.OfficialName.toLowerCase().includes(searchInput.toLowerCase())
            );
            setAllOrganizations(filteredOrganization);
        } else {
            setAllOrganizations(duplicateAllOrganizations);
        }
    }, [searchInput]);

    const fetchAllOrganizations = async () => {
        setIsLoading(true);
        const result = await OrganizationAndPracticesService.fetchOrganizations(authToken,order,navigate);
        setIsLoading(false);
        if (result && result.organizations) {
            setAllOrganizations(result.organizations);
            setDuplicateAllOrganizations(result.organizations);
            const totalCount = result.totalCount;
            // setTotalPages(Math.ceil(totalCount / itemsPerPage));
            // if (result.nextOffset){
            //     setCurrentOffset(result.nextOffset.OrganizationID);
            // }
        }

    }

    const handlePrevPage = () => {
        if (currentPage > 1) {
            const newPage = currentPage - 1;
            setCurrentPage(newPage);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            const newPage = currentPage + 1;
            setCurrentPage(newPage);
        }
    };

    const handleOrderChange = (newOrder) => {
        setOrder(newOrder);
        setIsShowOrderByBox("d-none");
    };

    const handleRowClick = async (e, organization) => {
        // Prevent navigation when clicking on Link or button
        if (e.target.closest('a') || e.target.closest('button')) {
            return;
        }
        await setOrganizationData(organization);
        navigate('/organizations/organization-detail');
    };

    if (isLoading) {
        return <Spinner />
    }

    return (<AdminLayout headerTitle="Organizations" isDashboard={false}>
            <div>
                <section className="border border-light-grey rounded-4 px-3 pt-4 pb-0">
                    <div
                        className="admin-program-table-top d-flex flex-md-row flex-column align-items-center justify-content-md-between">
                        <h5 className="mb-md-0 mb-3 fw-bolder fs-19">{allOrganizations.length} Organizations Total</h5>

                        <div className="d-flex align-items-stretch gap-2 position-relative">

                            <div
                                className="admin-program-table-searchbar d-flex align-items-center rounded-2 bg-white border border-black-10 px-3 py-1 gap-1">
                                <label htmlFor="header-searchbar-input" className="d-flex align-items-center">
                                    <img src={SearchIcon}/>
                                </label>
                                <input
                                    className="border-0 bg-transparent input-focus-none flex-grow-1 flex-shrink-1 fs-14"
                                    placeholder="Search Organization"
                                    id="header-searchbar-input"
                                    value={searchInput}
                                    onChange={(e) => setSearchInput(e.target.value)}
                                />
                            </div>
                            <button
                                onClick={() => setIsShowOrderByBox("d-block")}
                                className="admin-program-filter-btn bg-transparent border border-grey rounded-3 d-flex align-items-center justify-content-center">
                                <img src={OrderByGreyIcon}/>
                            </button>

                            {/*ORDER BY POPUP*/}
                            <div onClick={() => setIsShowOrderByBox("d-none")}
                                 className={`admin-program-table-delete-confirm ${isShowOrderByBox} bg-black-10`}></div>
                            <ul className={`admin-program-order-by-popup ${isShowOrderByBox} list-unstyled mb-0 border border-light-grey rounded-3 overflow-hidden position-absolute end-0`}>
                                <li role="button" className="px-3 py-2 text-dark-grey bg-white border-bottom"
                                    onClick={() => handleOrderChange('desc')}
                                >
                                    Newest First
                                </li>

                                <li role="button" className="px-3 py-2 text-dark-grey bg-white"
                                    onClick={() => handleOrderChange('asc')}
                                >
                                    Oldest First
                                </li>
                            </ul>

                            <Link to="/organizations/add-organization"
                                  className="d-flex align-items-center gap-2 bg-parrot-green text-decoration-none border-0 py-2 px-3 rounded-2">
                                <span className="d-md-inline-block d-none fs-14 text-dull-black">Add Organization</span>
                                <img width={10} height={10} src={PlusBlackIcon}/>
                            </Link>
                        </div>
                    </div>

                    <div className="mt-3">
                        <div className="table-responsive">
                            <table className="table">
                                <thead>
                                <tr className="admin-program-table-heading-row">
                                    <th scope="col" className="fw-normal fs-17">Name</th>
                                    <th scope="col" className="fw-normal fs-17">Date Joint</th>
                                    <th scope="col" className="fw-normal fs-17">Users</th>
                                    <th scope="col" className="fw-normal fs-17">Patients</th>
                                    <th scope="col" className="fw-normal fs-17">Actions</th>
                                </tr>
                                </thead>
                                <tbody>
                                {allOrganizations.map((organization) => (
                                    <tr key={organization.OrganizationID} onClick={(e) => handleRowClick(e,organization)}
                                        className="admin-program-table-body-row fw-light fs-14">

                                        <td>{organization.OfficialName}</td>
                                        <td>
                                            {new Date(organization.CreatedAt).toLocaleDateString('en-GB', {
                                                day: '2-digit',
                                                month: 'short',
                                                year: 'numeric',
                                            })}
                                        </td>
                                        <td>{organization.UserCount && organization.UserCount.length}</td>
                                        <td>{organization.PatientCount}</td>
                                        <td>
                                            <div className="d-flex gap-2">
                                                <button onClick={(e) => handleOrganizationEdit(e, organization)}
                                                      className="admin-program-table-edit-btn border border-cyan-50 rounded-3 d-flex align-items-center justify-content-center">
                                                    <img src={EditCyanIcon}/>
                                                </button>
                                                <button
                                                    onClick={(e) => showDeleteModal(e, organization)}
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
                        {/*DELETE POPUP*/}
                        <div
                            onClick={() => setIsShowDeleteBox("d-none")}
                            className={`admin-program-table-delete-confirm bg-black-10 ${isShowDeleteBox} d-flex align-items-center justify-content-center`}>
                            <div
                                onClick={(e) => e.stopPropagation()}
                                className="admin-program-table-delete-confirm-box mx-3 py-4 bg-white border border-black-20 rounded-2 d-flex flex-column align-items-center justify-content-center text-center">
                                <img src={DustbinRedWhitePicture}/>
                                <h5 className="mb-1 mt-2 fw-normal fs-18">Delete Organization?</h5>
                                <p className="mb-0 text-dark-grey fw-light fs-14">Are you sure you want to
                                    delete this organization?</p>

                                <div className="d-flex align-items-center gap-2 mt-3">
                                    <button
                                        onClick={(e) => handleOrganizationDelete(e)}
                                        className="d-flex align-items-center bg-parrot-green border-0 py-2 px-3 rounded-2 fs-14 fw-normal">
                                        Yes, Delete
                                    </button>
                                    <button
                                        onClick={() => setIsShowDeleteBox("d-none")}
                                        className="d-flex align-items-center bg-transparent border border-dark-blue text-dark-blue py-2 px-3 rounded-2 fs-14 fw-normal">
                                        Keep Organization
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="d-flex justify-content-end align-items-center mt-4 gap-4">
                    <div className="text-dark-grey-2">Page {currentPage}/{totalPages}</div>
                    <div className="d-flex align-items-center gap-2">
                        <button
                            onClick={handlePrevPage}
                            disabled={currentPage === 1}
                            className="admin-program-prev-page-btn border border-black-10 rounded-1 bg-transparent d-flex align-items-center">
                            <img src={LeftArrowGreyIcon}/>
                        </button>
                        <button
                            onClick={handleNextPage}
                            disabled={currentPage === totalPages}
                            className="admin-program-prev-page-btn border border-black-10 rounded-1 bg-transparent d-flex align-items-center justify-content-center">
                            <img src={RightArrowGreyIcon}/>
                        </button>
                    </div>
                </div>
            </div>
        </AdminLayout>
    )
}
export default OrganizationListing
