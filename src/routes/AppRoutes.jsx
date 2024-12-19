import React, { useContext, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useAdminDataStore } from "../stores/AdminDataStore.js";

// Import components
import PageNotFound from "../pages/PageNotFound.jsx";
import Login from "../auth/Login.jsx";
import TwoFactorAuthentication from "../auth/TwoFactorAuthentication.jsx";
import VerifyCode from "../auth/VerifyCode.jsx";
import ForgetPassword from "../auth/ForgetPassword.jsx";
import ChangePassword from "../auth/ChangePassword.jsx";

// Admin Dashboard imports
import AdminDashboard from "../pages/dashboard/admin/AdminDashboard.jsx";
import Patients from "../pages/dashboard/patients/Patients.jsx";
import AddPatient from "../pages/dashboard/patients/AddPatient.jsx";
import EditPatient from "../pages/dashboard/patients/EditPatient.jsx";
import ViewPatient from "../pages/dashboard/patients/ViewPatient.jsx";
import Program from "../pages/dashboard/programs/Program.jsx";
import ProgramDetail from "../pages/dashboard/programs/ProgramDetail.jsx";
import CreateProgram from "../pages/dashboard/programs/CreateProgram.jsx";
import EditProgram from "../pages/dashboard/programs/EditProgram.jsx";
import AdminSettings from "../pages/dashboard/settings/admin/Settings.jsx";
import AdminProfileView from "../pages/dashboard/settings/admin/ProfileView.jsx";
import AdminProfileChangePassword from "../pages/dashboard/settings/admin/AdminProfileChangePassword.jsx";
import OrganizationListing from "../pages/dashboard/organization-and-practices/index.jsx";
import AddOrganization from "../pages/dashboard/organization-and-practices/AddOrganization.jsx";
import EditOrganization from "../pages/dashboard/organization-and-practices/EditOrganization.jsx";
import OrganizationDetail from "../pages/dashboard/organization-and-practices/OrganizationDetail.jsx";
import OrganizationAddUser from "../pages/dashboard/organization-and-practices/OrganizationAddUser.jsx";
import OrganizationEditUser from "../pages/dashboard/organization-and-practices/OrganizationEditUser.jsx";
import OrganizationPractices from "../pages/dashboard/organization-and-practices/OrganizationPractices.jsx";
import AuditLog from "../pages/dashboard/audit-log/AuditLog.jsx";
import Feedback from "../pages/dashboard/feedback/Feedback.jsx";
import RolesAccessibility from "../pages/dashboard/role-accessibility/RolesAccessibility.jsx";
import WhiteLabel from "../pages/dashboard/white-label/WhiteLabel.jsx";
import WhiteLabelView from "../pages/dashboard/white-label/WhiteLabelView.jsx";
import AdminInteractions from "../pages/dashboard/admin/interactions/AdminInteractions.jsx";
import AdminInteractionDetail from "../pages/dashboard/admin/interactions/AdminInteractionDetail.jsx";
import AdminNotifications from "../pages/dashboard/admin/notifications/AdminNotifications.jsx";
import AdminNotificationDetail from "../pages/dashboard/admin/notifications/AdminNotificationDetail.jsx";

// Provider Dashboard imports
import ProviderDashboard from "../pages/dashboard/provider/ProviderDashboard.jsx";
import ProviderPatients from "../pages/dashboard/provider/patients/ProviderPatients.jsx";
import ProviderAddPatient from "../pages/dashboard/provider/patients/ProviderAddPatient.jsx";
import ProviderEditPatient from "../pages/dashboard/provider/patients/ProviderEditPatient.jsx";
import ProviderViewPatient from "../pages/dashboard/provider/patients/ProviderViewPatient.jsx";
import ProviderPatientDetail from "../pages/dashboard/provider/patients/ProviderPatientDetail.jsx";
import ProviderProgram from "../pages/dashboard/provider/programs/index.jsx";
import ProviderProgramDetail from "../pages/dashboard/provider/programs/ProviderProgramDetail.jsx";
import ProgramPatientList from "../pages/dashboard/provider/programs/ProgramPatientList.jsx";
import ProvidersInPrograms from "../pages/dashboard/provider/programs/ProvidersInPrograms.jsx";
import ProviderInteractions from "../pages/dashboard/provider/interactions/ProviderInteractions.jsx";
import ProviderInteractionDetail from "../pages/dashboard/provider/interactions/ProviderInteractionDetail.jsx";
import ProviderNotifications from "../pages/dashboard/provider/notifications/ProviderNotifications.jsx";
import ProviderNotificationDetail from "../pages/dashboard/provider/notifications/ProviderNotificationDetail.jsx";
import ProviderFeedback from "../pages/dashboard/provider/feedback/ProviderFeedback";
import ProfileSettingsEdit from "../pages/dashboard/settings/provider/ProfileSettingsEdit.jsx";
import ProfileSettingsView from "../pages/dashboard/settings/provider/ProfileSettingsView.jsx";
import ProfileSettingsChangePassword from "../pages/dashboard/settings/provider/ProfileSettingsChangePassword.jsx";
import ProfileSettingsUserManualMain from "../pages/dashboard/settings/provider/ProfileSettingsUserManualMain.jsx";
import ProfileSettingsFaqs from "../pages/dashboard/settings/provider/ProfileSettingsFaqs.jsx";
import ProfileSettingsUserManualDoc from "../pages/dashboard/settings/provider/ProfileSettingsUserManualDoc.jsx";
import ProfileSettingsUserManualVideo from "../pages/dashboard/settings/provider/ProfileSettingsUserManualVideo.jsx";
import ProfileSettingsSupportAndHelp from "../pages/dashboard/settings/provider/ProfileSettingsSupportAndHelp.jsx";
import ProfileSettingsFeedback from "../pages/dashboard/settings/provider/ProfileSettingsFeedback.jsx";
import ProfileSettingsSuggestions from "../pages/dashboard/settings/provider/ProfileSettingsSuggestions.jsx";
import PatientDetail from "../pages/dashboard/patients/PatientDetail.jsx";
import UserManualMain from "../pages/dashboard/settings/admin/UserManualMain.jsx";
import UserFaqs from "../pages/dashboard/settings/admin/UserFaqs.jsx";
import SupportAndHelp from "../pages/dashboard/settings/admin/SupportAndHelp.jsx";
import Roles from "../pages/dashboard/roles/Roles.jsx";

// Routing Component
const AppRoutes = () => {
    const { authToken,userType } = useContext(AuthContext);

    return (
        <Routes>
            {authToken ? (
                userType && userType === 'Admin' ? (
                    // Admin Routes
                    <>
                        <Route path="/" element={<AdminDashboard/>}/>

                        {/*Admin Routed*/}
                        <Route path="/admin-dashboard" element={<AdminDashboard/>}/>

                        {/*Patients Routes*/}
                        <Route path='patients' element={<Patients/>}/>
                        <Route path='patients/patient-detail' element={<PatientDetail/>}/>
                        <Route path='patients/add-patient' element={<AddPatient/>}/>
                        <Route path='patients/edit-patient' element={<EditPatient/>}/>
                        <Route path='patients/view-patient' element={<ViewPatient/>}/>

                        {/*Admin Settings Routes*/}
                        <Route path='/admin/settings' element={<AdminSettings/>}/>
                        <Route path='/admin/profile-view' element={<AdminProfileView/>}/>
                        <Route path="/admin/settings/change-password" element={<AdminProfileChangePassword/>}/>

                        <Route path="/admin/settings/user-manual-main" element={<UserManualMain/>}/>
                        <Route path="/admin/settings/faqs" element={<UserFaqs/>}/>
                        <Route path="/admin/settings/support-and-help" element={<SupportAndHelp/>}/>


                        {/*Audit Log Route*/}
                        <Route path='/audit-logs' element={<AuditLog/>}/>

                        {/*Feedback Route*/}
                        <Route path='/feedback' element={<Feedback/>}/>

                        {/*Roles Route*/}
                        <Route path='/roles' element={<Roles/>}/>

                        {/*Roles Accessibility Route*/}
                        <Route path='/roles-accessibility' element={<RolesAccessibility/>}/>

                        {/*White label Route*/}
                        <Route path='/white-label-view' element={<WhiteLabelView/>}/>
                        <Route path='/white-label-view/white-label' element={<WhiteLabel/>}/>

                        {/*PROGRAMS*/}
                        <Route path="/programs" element={<Program/>}/>
                        <Route path="/programs/program-detail" element={<ProgramDetail/>}/>
                        <Route path="/programs/create-program" element={<CreateProgram/>}/>
                        <Route path="/programs/edit-program" element={<EditProgram/>}/>
                        {/*Admin Interaction Route*/}
                        <Route path="/interactions" element={<AdminInteractions/>}/>
                        <Route path="/interactions/detail" element={<AdminInteractionDetail/>}/>

                        {/*Admin Notification Route*/}
                        <Route path="/notifications" element={<AdminNotifications/>}/>
                        <Route path="/notifications/detail" element={<AdminNotificationDetail/>}/>

                        {/*ORGANIZATION AND PRACTICES*/}
                        <Route path="/organizations" element={<OrganizationListing/>}/>
                        <Route path="/organizations/add-organization" element={<AddOrganization/>}/>
                        <Route path="/organizations/edit-organization" element={<EditOrganization/>}/>
                        <Route path="/organizations/organization-detail" element={<OrganizationDetail/>}/>
                        <Route path="/organizations/organization-add-user" element={<OrganizationAddUser/>}/>
                        <Route path="/organizations/organization-edit-user" element={<OrganizationEditUser/>}/>
                        <Route path="/organizations/organization-practices" element={<OrganizationPractices/>}/>
                    </>
                ) : userType && userType === 'Provider' && (
                    // Provider Routes
                    <>
                        <Route path="/" element={<ProviderDashboard/>}/>

                        {/*Provider*/}
                        <Route path="/provider-dashboard" element={<ProviderDashboard/>}/>

                        {/*Provider*/}
                        <Route path="/provider-feedback" element={<ProviderFeedback/>}/>

                        {/*Provider Patient Routes*/}
                        <Route path="/provider/patients" element={<ProviderPatients/>}/>
                        <Route path="/provider/patients/add-patient" element={<ProviderAddPatient/>}/>
                        <Route path="/provider/patients/edit-patient" element={<ProviderEditPatient/>}/>
                        <Route path="/provider/patients/view-patient" element={<ProviderViewPatient/>}/>
                        <Route path="/provider/patients/patient-detail" element={<ProviderPatientDetail/>}/>

                        {/*Provider programs*/}
                        <Route path="/provider/programs" element={<ProviderProgram/>}/>
                        <Route path="/provider/programs/program-detail" element={<ProviderProgramDetail/>}/>
                        <Route path="/provider/programs/patients-list" element={<ProgramPatientList/>}/>
                        <Route path="/provider/programs/providers-in-program" element={<ProvidersInPrograms/>}/>

                        {/*Provider Notification Route*/}
                        <Route path="/provider/notifications" element={<ProviderNotifications/>}/>
                        <Route path="/provider/notifications/detail" element={<ProviderNotificationDetail/>}/>

                        {/*Provider Interaction Screen*/}
                        <Route path="/provider/interactions" element={<ProviderInteractions/>}/>
                        <Route path="/provider/interactions/detail" element={<ProviderInteractionDetail/>}/>

                        {/*PROVIDER PROFILE SETTINGS*/}
                        <Route path="/profile/settings/edit" element={<ProfileSettingsEdit/>}/>
                        <Route path="/profile/settings/view" element={<ProfileSettingsView/>}/>
                        <Route path="/profile/settings/user-manual-main" element={<ProfileSettingsUserManualMain/>}/>
                        <Route path="/profile/settings/faqs" element={<ProfileSettingsFaqs/>}/>
                        <Route path="/profile/settings/user-manual-doc" element={<ProfileSettingsUserManualDoc/>}/>
                        <Route path="/profile/settings/user-manual-video" element={<ProfileSettingsUserManualVideo/>}/>
                        <Route path="/profile/settings/support-and-help" element={<ProfileSettingsSupportAndHelp/>}/>
                        <Route path="/profile/settings/feedback" element={<ProfileSettingsFeedback/>}/>
                        <Route path="/profile/settings/suggestions" element={<ProfileSettingsSuggestions/>}/>
                        <Route path="/profile/settings/change-password" element={<ProfileSettingsChangePassword/>}/>
                    </>
                )
            ) : (
                // Public Routes (Unauthenticated)
                <>
                    <Route path="/login" element={<Login />} />
                    <Route path="/two-factor-authentication" element={<TwoFactorAuthentication />} />
                    <Route path="/verify-code" element={<VerifyCode />} />
                    <Route path="/forget-password" element={<ForgetPassword />} />
                    <Route path="/change-password" element={<ChangePassword />} />
                </>
            )}
            {/* Catch-all route for unmatched routes */}
            {/*<Route path="*" element={<PageNotFound />} />*/}
        </Routes>
    );
};

export default AppRoutes;
