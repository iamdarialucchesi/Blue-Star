import React, {useContext, useEffect, useState} from "react";
import ProviderLayout from "../../../../layouts/provider/ProviderLayout.jsx";
import SearchIcon from "../../../../assets/images/icons/search.svg";
import FilterDarkBlue from "../../../../assets/images/icons/filter-dark-blue.svg";
import ProviderPatientsFilter from "./partials/ProviderPatientsFilter.jsx";
import AvaiblableProviderProfilePicture1 from "../../../../assets/images/available-provider-profile-1.jfif";
import AvaiblableProviderProfilePicture2 from "../../../../assets/images/available-provider-profile-2.jfif"
import AvaiblableProviderProfilePicture3 from "../../../../assets/images/available-provider-profile-3.jfif"
import AvaiblableProviderProfilePicture4 from "../../../../assets/images/available-provider-profile-4.jfif"
import ProvidersInProgramFilter from "./partials/ProvidersInProgramFilter.jsx";
import ProviderProgramService from "./service/ProviderProgramService.js";
import {AuthContext} from "../../../../context/AuthContext.jsx";
import {useLocation} from "react-router-dom";
import {useProviderDataStore} from "../../../../stores/ProviderDataStore.js";

const ProvidersInPrograms = () => {
    const {authToken} = useContext(AuthContext);
    const location = useLocation();
    const { providerOrganizationID } = useProviderDataStore();
    const [allProviders, setAllProviders] = useState([]);
    const [duplicateAllProviders, setDuplicateAllProviders] = useState([])
    const [searchInput, setSearchInput] = useState('');
    const [isShowFilterModal, setIsShowFilterModal] = useState(false)

    useEffect(() => {
        if (location.state && location.state.program) {
            const program = location.state.program;
            fetchProgramDetail(program);
        }
    }, [location.state]);

    const fetchProgramDetail = async (program) => {
        const result = await ProviderProgramService.fetchProgramDetail(authToken,program.ProgramName,providerOrganizationID);
        if (result.providers) {
            setAllProviders(result.providers);
            setDuplicateAllProviders(result.providers);
        }
    }

    useEffect(() => {
        if (searchInput) {
            const filteredProviders = allProviders.filter(
                (provider) =>
                    provider.FirstName.toLowerCase().includes(searchInput.toLowerCase()) ||
                    provider.LastName.toLowerCase().includes(searchInput.toLowerCase())
            );
            setAllProviders(filteredProviders);
        } else {
            setAllProviders(duplicateAllProviders);
        }
    }, [searchInput]);



    return (<ProviderLayout headerTitle="Users" isDashboard={true}>
        <div>
            <div
                className="admin-program-table-top d-flex flex-md-row flex-column align-items-center justify-content-md-between">
                <h5 className="mb-md-0 mb-3 fw-bolder fs-19">{allProviders && allProviders.length} Total Users</h5>

                <div className="d-flex align-items-stretch gap-2 position-relative">
                    <div
                        className="admin-program-table-searchbar providers-in-programs-searchbar d-flex align-items-center rounded-2 bg-white border border-black-10 px-3 py-1 gap-1">
                        <input
                            className="border-0 bg-transparent input-focus-none flex-grow-1 flex-shrink-1 fs-14"
                            placeholder="Search Patient"
                            id="header-searchbar-input"
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                        />
                        <label htmlFor="header-searchbar-input" className="d-flex align-items-center">
                            <img src={SearchIcon}/>
                        </label>
                    </div>
                    {/*<button*/}
                    {/*    onClick={() => setIsShowFilterModal(true)}*/}
                    {/*    aria-expanded="false"*/}
                    {/*    className="admin-program-filter-btn bg-white border border-grey rounded-3 d-flex align-items-center justify-content-center">*/}
                    {/*    <img src={FilterDarkBlue}/>*/}
                    {/*</button>*/}

                    {/* FILTER MODAL POPUP*/}
                    {
                        (isShowFilterModal) &&
                        <ProvidersInProgramFilter setIsShowFilterModal={setIsShowFilterModal}
                                                isShowFilterModal={isShowFilterModal}/>}
                </div>
            </div>

            <div className="providers-in-program-users gap-3 mt-4">
                {allProviders && allProviders.map((provider) => (
                    <div key={provider.OrganizationUserID}
                        className="providers-in-program-user border border-dark-blue-14 rounded-2 p-3 d-flex align-items-center gap-3">
                        <img src={AvaiblableProviderProfilePicture1}
                             className="rounded-circle object-fit-cover"/>
                        <div>
                            <div className="text-near-black fw-normal">{provider.FirstName + ' ' + provider.LastName}</div>
                            <p className="mb-0 content-small-text-color fw-light">MD, Orthopedist</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </ProviderLayout>)
}

export default ProvidersInPrograms
