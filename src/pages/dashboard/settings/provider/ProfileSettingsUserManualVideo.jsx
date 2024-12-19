import React from "react";
import ProviderLayout from "../../../../layouts/provider/ProviderLayout.jsx";
// import Video from "https://www.youtube.com/embed/zpOULjyy-n8?rel=0"

const ProfileSettingsUserManualVideo = () => {
    return (
        <ProviderLayout headerTitle="User Manual" isDashboard={true}>
            <section className="pt-3 px-3 pb-4 border rounded-3">
                <div className="user-manual-video-section mx-auto p-3 mb-5 rounded-3">
                    <div className="ratio ratio-16x9">
                        <iframe className="rounded-3" src="https://www.youtube.com/embed/AKa2ABRRgPs" title="YouTube video"
                                allowFullScreen></iframe>
                        {/*<video width="100%" height="auto">*/}
                        {/*<source src={Video} type="video/mp4"/>*/}
                        {/*</video>*/}
                    </div>

                    <h6 className="text-center mt-4 mb-2 text-near-black">Manage your app settings by reading this article</h6>
                </div>

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

export default ProfileSettingsUserManualVideo