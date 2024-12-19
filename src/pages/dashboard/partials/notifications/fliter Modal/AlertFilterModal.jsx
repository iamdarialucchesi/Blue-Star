import React from "react";
import { useProviderDataStore } from "../../../../../stores/ProviderDataStore.js";

function AlertFilterModal({
    isShowFilterModalAlert,
    setIsShowFilterModalAlert,
    tempFilterSeverity,
    setTempFilterSeverity,
    tempFilterResolvedStatus,
    setTempFilterResolvedStatus,
    applyFilters,
    clearFilters
}) {
    const severityOptions = [
        { id: "CriticalCheckBox", value: 1, label: "Critical" },
        { id: "WarningCheckBox", value: 2, label: "Warning" },
        { id: "InformationalCheckBox", value: 3, label: "Informational" },
    ];

    const statusOptions = [
        { id: "ResolvedCheckBox", value: true, label: "Resolved" },
        { id: "UnresolvedCheckBox", value: false, label: "Unresolved" },
    ];

    const handleFilterChange = (severity) => {
        setTempFilterSeverity((prev) =>
            prev.includes(severity) ? prev.filter((s) => s !== severity) : [...prev, severity]
        );
    };

    const handleStatusFilterChange = (status) => {
        setTempFilterResolvedStatus((prev) =>
            prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status]
        );
    };

    return (
        <>
            <div onClick={() => setIsShowFilterModalAlert(false)}
                 className={`admin-table-delete-confirm ${isShowFilterModalAlert} bg-black-10`}></div>
            <div className="alert-filter-modal position-absolute end-0 bg-white border border-light-grey rounded-3 overflow-hidden px-3 pb-3">
                <div className="accordion" id="accordionPanelsStayOpenExample">
                    {/* Severity Section */}
                    <div className="accordion-item rounded-0 border-start-0 border-end-0 border-top-0 border-bottom border-black-20">
                        <h2 className="accordion-header patients-filter-modal-header">
                            <button className="accordion-button px-0 py-3 text-dark fw-normal"
                                    type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapsetwo">
                                Severity
                            </button>
                        </h2>
                        <div id="panelsStayOpen-collapsetwo" className="accordion-collapse collapse show">
                            <div className="accordion-body px-0 pt-0 pb-3">
                                {severityOptions.map((option) => (
                                    <div className="form-check d-flex gap-2 align-items-center mb-2" key={option.id}>
                                        <input
                                            className="form-check-input shadow-none cursor-pointer border-secondary"
                                            type="checkbox"
                                            id={option.id}
                                            checked={tempFilterSeverity.includes(option.value)}
                                            onChange={() => handleFilterChange(option.value)}
                                        />
                                        <label className="form-check-label cursor-pointer mb-n1 fw-light detail-text text-light" htmlFor={option.id}>
                                            {option.label}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Status Section */}
                    <div className="accordion-item rounded-0 border-start-0 border-end-0 border-top-0 border-bottom border-black-20">
                        <h2 className="accordion-header patients-filter-modal-header">
                            <button className="accordion-button px-0 py-3 text-dark fw-normal"
                                    type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseStatus">
                                Status
                            </button>
                        </h2>
                        <div id="panelsStayOpen-collapseStatus" className="accordion-collapse collapse show">
                            <div className="accordion-body px-0 pt-0 pb-3">
                                {statusOptions.map((option) => (
                                    <div className="form-check d-flex gap-2 align-items-center mb-2" key={option.id}>
                                        <input
                                            className="form-check-input shadow-none cursor-pointer border-secondary"
                                            type="checkbox"
                                            id={option.id}
                                            checked={tempFilterResolvedStatus.includes(option.value)}
                                            onChange={() => handleStatusFilterChange(option.value)}
                                        />
                                        <label className="form-check-label cursor-pointer mb-n1 fw-light detail-text text-light" htmlFor={option.id}>
                                            {option.label}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="d-flex align-items-center justify-content-between mt-3">
                    <button onClick={applyFilters} className="d-flex align-items-center border-0 py-2 px-3 rounded-2 fs-14 fw-normal">
                        Apply Filter
                    </button>
                    <button onClick={clearFilters} className="d-flex align-items-center add-button py-2 px-3 rounded-2 fs-14 fw-normal">
                        Clear All
                    </button>
                </div>
            </div>
        </>
    );
}

export default AlertFilterModal;
