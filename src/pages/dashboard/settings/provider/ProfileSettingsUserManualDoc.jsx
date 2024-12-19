import React from "react";
import ProviderLayout from "../../../../layouts/provider/ProviderLayout.jsx";

const ProfileSettingsUserManualDoc = () => {
    return (
        <ProviderLayout headerTitle="User Manual" isDashboard={true}>
            <section className="pt-3 px-3 pb-4 border rounded-3">
                <h5 className="fw-bolder fs-20 text-dark-grey mt-2 mb-3">Manage your app settings by reading this article</h5>

                <p className="text-dark-grey mb-3">
                    Lorem ipsum dolor sit amet consectetur. Habitant proin sit euismod faucibus porta. Quam nisl nibh pellentesque suspendisse scelerisque. Nunc pellentesque vitae tincidunt arcu egestas viverra et aliquet ut. Nisi nibh augue tempor in massa orci sit duis. Mi sed lectus in pulvinar lectus nunc. Nulla cursus sed tellus sed risus. Enim sem sed vitae enim vitae vel. Leo sit cursus etiam pharetra sit urna. Orci ullamcorper est dignissim aliquet morbi sodales. Sed at diam neque nam ultricies magna nulla in. Nec amet elementum quis id et varius congue velit sed. Tellus elit tristique mauris morbi massa sed. Commodo sed at dui tellus sollicitudin eget mi enim adipiscing. Phasellus risus lobortis ut non pharetra semper.
                </p>

                <ul className="list-unstyled mb-0 d-flex flex-column gap-3">
                    <li className="d-flex align-items-start gap-2">
                        <h6 className="text-near-black mb-0 text-nowrap mt-1">Step 1:</h6>
                        <p className="mb-0 text-dark-grey flex-grow-1">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut
                            labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
                            laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
                            voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                        </p>
                    </li>

                    <li className="d-flex align-items-start gap-2">
                        <h6 className="text-near-black mb-0 text-nowrap mt-1">Step 2:</h6>
                        <p className="mb-0 text-dark-grey flex-grow-1">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                        </p>
                    </li>

                    <li className="d-flex align-items-start gap-2">
                        <h6 className="text-near-black mb-0 text-nowrap mt-1">Step 3:</h6>
                        <p className="mb-0 text-dark-grey flex-grow-1">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                        </p>
                    </li>
                </ul>
            </section>
        </ProviderLayout>
    )
}

export default ProfileSettingsUserManualDoc