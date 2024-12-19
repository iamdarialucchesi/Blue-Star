import React from "react";
import ProviderLayout from "../../../../layouts/provider/ProviderLayout.jsx";

import ArticleGreyIcon from "../../../../assets/images/icons/article-dark-grey.svg"
import NavigateBtnCyanIcon from "../../../../assets/images/icons/navigate-btn-cyan.svg"
import CautionBlackIcon from "../../../../assets/images/icons/caution-black.svg"
import SuggestionMessageBlackIcon from "../../../../assets/images/icons/suggestion-message-black.svg"

const ProfileSettingsSupportAndHelp = () => {
    return (<ProviderLayout headerTitle="Support & Help" isDashboard={false}>
        <section className="support-and-help-common-issues p-3 border rounded-3 custom-scrollbar-section-1">
            <h5 className="fw-bolder fs-20 text-dark-grey mb-1">Help with Common Issues</h5>
            <p className="mb-0 text-dark-grey fw-light">A list of help articles with answers and tips</p>

            <ul className="mb-0 mt-2 list-unstyled">
                <li className="d-flex align-items-center gap-2 border-bottom py-3">
                    <img width={14} src={ArticleGreyIcon}/>
                    <p className="mb-0 flex-grow-1">Manage your app settings by reading this article</p>
                    <button className="bg-transparent p-0 border-0">
                        <img width={30} src={NavigateBtnCyanIcon}/>
                    </button>
                </li>
                <li className="d-flex align-items-center gap-2 border-bottom py-3">
                    <img width={14} src={ArticleGreyIcon}/>
                    <p className="mb-0 flex-grow-1">Manage your app settings by reading this article</p>
                    <button className="bg-transparent p-0 border-0">
                        <img width={30} src={NavigateBtnCyanIcon}/>
                    </button>
                </li>
                <li className="d-flex align-items-center gap-2 border-bottom py-3">
                    <img width={14} src={ArticleGreyIcon}/>
                    <p className="mb-0 flex-grow-1">Manage your app settings by reading this article</p>
                    <button className="bg-transparent p-0 border-0">
                        <img width={30} src={NavigateBtnCyanIcon}/>
                    </button>
                </li>
                <li className="d-flex align-items-center gap-2 border-bottom py-3">
                    <img width={14} src={ArticleGreyIcon}/>
                    <p className="mb-0 flex-grow-1">Manage your app settings by reading this article</p>
                    <button className="bg-transparent p-0 border-0">
                        <img width={30} src={NavigateBtnCyanIcon}/>
                    </button>
                </li>
                <li className="d-flex align-items-center gap-2 border-bottom py-3">
                    <img width={14} src={ArticleGreyIcon}/>
                    <p className="mb-0 flex-grow-1">Manage your app settings by reading this article</p>
                    <button className="bg-transparent p-0 border-0">
                        <img width={30} src={NavigateBtnCyanIcon}/>
                    </button>
                </li>
                <li className="d-flex align-items-center gap-2 border-bottom py-3">
                    <img width={14} src={ArticleGreyIcon}/>
                    <p className="mb-0 flex-grow-1">Manage your app settings by reading this article</p>
                    <button className="bg-transparent p-0 border-0">
                        <img width={30} src={NavigateBtnCyanIcon}/>
                    </button>
                </li>
                <li className="d-flex align-items-center gap-2 border-bottom py-3">
                    <img width={14} src={ArticleGreyIcon}/>
                    <p className="mb-0 flex-grow-1">Manage your app settings by reading this article</p>
                    <button className="bg-transparent p-0 border-0">
                        <img width={30} src={NavigateBtnCyanIcon}/>
                    </button>
                </li>
                <li className="d-flex align-items-center gap-2 border-bottom py-3">
                    <img width={14} src={ArticleGreyIcon}/>
                    <p className="mb-0 flex-grow-1">Manage your app settings by reading this article</p>
                    <button className="bg-transparent p-0 border-0">
                        <img width={30} src={NavigateBtnCyanIcon}/>
                    </button>
                </li>
                <li className="d-flex align-items-center gap-2 border-bottom py-3">
                    <img width={14} src={ArticleGreyIcon}/>
                    <p className="mb-0 flex-grow-1">Manage your app settings by reading this article</p>
                    <button className="bg-transparent p-0 border-0">
                        <img width={30} src={NavigateBtnCyanIcon}/>
                    </button>
                </li>
                <li className="d-flex align-items-center gap-2 pt-3 pb-2">
                    <img width={14} src={ArticleGreyIcon}/>
                    <p className="mb-0 flex-grow-1">Manage your app settings by reading this article</p>
                    <button className="bg-transparent p-0 border-0">
                        <img width={30} src={NavigateBtnCyanIcon}/>
                    </button>
                </li>
            </ul>
        </section>

            <section className="support-and-help-share-your-feedback p-3 border rounded-3 mt-4">
                <h5 className="fw-bolder fs-20 text-dark-grey mb-1">Share your feedback</h5>
                <p className="mb-0 text-dark-grey fw-light">Report or make a suggestion</p>

                <ul className="mb-0 mt-2 list-unstyled">
                    <li className="border-bottom py-3">
                    <div className="d-flex align-items-center gap-2">
                        <img width={17} src={CautionBlackIcon}/>
                        <p className="mb-0 flex-grow-1 text-dark-grey-4 fw-bolder">Report an issue</p>
                        <button className="bg-transparent p-0 border-0">
                            <img width={30} src={NavigateBtnCyanIcon}/>
                        </button>
                    </div>
                    <p className="mb-0 text-dark-grey">Let us know if something {"isn't"} working.</p>
                </li>

                <li className="py-3">
                    <div className="d-flex align-items-center gap-2">
                        <img width={17} src={SuggestionMessageBlackIcon}/>
                        <p className="mb-0 flex-grow-1 text-dark-grey-4 fw-bolder">Make a suggestion</p>
                        <button className="bg-transparent p-0 border-0">
                            <img width={30} src={NavigateBtnCyanIcon}/>
                        </button>
                    </div>
                    <p className="mb-0 text-dark-grey">Let us know if something {"isn't"} working.</p>
                </li>
            </ul>
        </section>
        </ProviderLayout>
    )
}

export default ProfileSettingsSupportAndHelp