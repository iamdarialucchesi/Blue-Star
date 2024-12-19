import React from "react";
import { formatDistanceToNow } from "date-fns";


function ProviderRecent({allAuditLogs}) {
    return (
        <>
            <div className="recent-activities-section border rounded-3 p-3 custom-scrollbar-section">
                <div className="border-bottom pb-2">
                    {/*section heading*/}
                    <h4 className="card-heading fw-bold m-0">Recent Activities</h4>
                </div>

                {/*list*/}
                <div className="mt-3">
                    {allAuditLogs &&
                        allAuditLogs.map((log) => {
                            const timeAgo = formatDistanceToNow(new Date(log.TimeStamp), { addSuffix: true });
                            return (
                                <p
                                    key={log.AuditID}
                                    className="provider-activites-text-background-color text-light fw-light detail-text rounded-3 p-3"
                                >
                                    {log.UserName} {log.Activity} <span className="text-muted">({timeAgo})</span>
                                </p>
                            );
                    })}
                </div>
            </div>
        </>
    )
}

export default ProviderRecent;
