import React, {createContext, useEffect, useState} from 'react';
import {
    CognitoIdentityProviderClient,
    InitiateAuthCommand,
    ChangePasswordCommand,
    ResendConfirmationCodeCommand,
    RespondToAuthChallengeCommand, GetUserCommand,
    GlobalSignOutCommand,
    ForgotPasswordCommand,
    ConfirmForgotPasswordCommand
} from "@aws-sdk/client-cognito-identity-provider";
import config from "../config.json"
import {useNavigate} from "react-router-dom";
import Cookies from 'js-cookie';
import {useAdminDataStore} from "../stores/AdminDataStore.js";
import {useProviderDataStore} from "../stores/ProviderDataStore.js";
import {BASE_URL} from "../config.js";
import Spinner from "../components/Spinner.jsx";
import UserBlockModal from "../components/UserBlockModal.jsx";


export const cognitoClient = new CognitoIdentityProviderClient({
    region: config.region,
});
export const AuthContext = createContext();


const setLoginUserCookie = (userId, email, type) => {
    const loginUserData = {
        UserID: userId,
        Email: email,
        Type: type
    };
    Cookies.set('loginUser', JSON.stringify(loginUserData), { expires: 7 });
};

// Function to get user information from the cookie
const getLoginUserFromCookie = () => {
    const loginUserData = Cookies.get('loginUser');
    return loginUserData ? JSON.parse(loginUserData) : null;
};

// Function to clear user information cookie
const clearLoginUserCookie = () => {
    Cookies.remove('loginUser');
};


export const AuthProvider = ({children}) => {
    const { setResendTokenSend, resendTokenSend } = useAdminDataStore();
    const { setProviderUserData,setProviderOrganizationID } = useProviderDataStore();
    const { setLoginUser,loginUser,setAdminUserData,setGlobalUserName,setGlobalProfilePicture } = useAdminDataStore();
    const [authToken, setAuthToken] = useState(null);
    const [userType, setUserType] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isUserBlocked, setIsUserBlocked] = useState(false);
    const [timeoutId, setTimeoutId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchUserDetails() {
            try {
                // setResendTokenSend(false);
                const storedTokens = await Cookies.get('authToken');
                const storedUserType = await getLoginUserFromCookie();
                if (storedTokens && storedUserType.Type) {
                    const accessToken = await Cookies.get('AccessToken');
                    await checkTokenValidity(accessToken);
                    await setAuthToken(storedTokens);
                    await setUserType(storedUserType.Type);
                }
                else if (resendTokenSend) {
                    await setAuthToken(null);
                    navigate('/verify-code');
                }
                else {
                    const isResetPassword = await Cookies.get('isResetPassword');
                    if (isResetPassword){
                        navigate('/forget-password');
                    }
                    else {
                        navigate('/login');
                    }
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchUserDetails();
    }, [navigate,userType]);


    // Check if the auth token is valid
    const checkTokenValidity = async (token) => {
        try {
            const command = new GetUserCommand({ AccessToken: token });
            await cognitoClient.send(command);
        } catch (error) {
            if (error.name === "NotAuthorizedException") {
                await handleAuthError(error);
            }
        }
    };

    const signIn = async (username, password, selectedMfaType = 'SMS_MFA') => {
        await Cookies.remove('User_Id');
        await Cookies.remove('Session');
        await Cookies.set('Stored_Username', username);
        await Cookies.set('Stored_Password', password);
    
        const params = {
            AuthFlow: "USER_PASSWORD_AUTH",
            ClientId: config.clientId,
            AuthParameters: {
                USERNAME: username,
                PASSWORD: password,
            },
        };
    
        try {
            setIsLoading(true);
            const command = new InitiateAuthCommand(params);
            const resp = await cognitoClient.send(command);

            if (resp.ChallengeName === 'SMS_MFA' || resp.ChallengeName === 'SOFTWARE_TOKEN_MFA') {
                await Cookies.set('User_Id', resp.ChallengeParameters.USER_ID_FOR_SRP, { expires: 7 });
                await Cookies.set('Session', resp.Session, { expires: 7 });
                await setResendTokenSend(true);
                setIsLoading(false);
                navigate('/verify-code');
    
                if (timeoutId) {
                    clearTimeout(timeoutId);
                }
                // Set a new timeout and store its ID in the state
                const newTimeoutId = setTimeout(() => {
                    setResendTokenSend(false); // No need to await this
                    navigate('/login'); // Navigate after resetting the state
                }, 120000); // 2 minutes in milliseconds
    
                setTimeoutId(newTimeoutId); // Store the new timeout ID in state
    
            } else if (resp.ChallengeName === 'SELECT_MFA_TYPE') {
                await Cookies.set('User_Id', resp.ChallengeParameters.USER_ID_FOR_SRP, { expires: 7 });
                await Cookies.set('Session', resp.Session, { expires: 7 });
    
                const mfaType = selectedMfaType;
                await Cookies.set('MFA_Type', mfaType, { expires: 7 });
    
                const respondToMfaChallengeParams = {
                    ChallengeName: resp.ChallengeName,
                    ClientId: config.clientId,
                    ChallengeResponses: {
                        USERNAME: resp.ChallengeParameters.USER_ID_FOR_SRP,
                        ANSWER: mfaType
                    },
                    Session: resp.Session
                };
    
                const respondToMfaChallenge = new RespondToAuthChallengeCommand(respondToMfaChallengeParams);
                const mfa_resp = await cognitoClient.send(respondToMfaChallenge);
                await Cookies.set('Session', mfa_resp.Session, { expires: 7 });
                await setResendTokenSend(true);
    
                setIsLoading(false);
                navigate('/verify-code');
    
                // Reset timeout for session expiration
                if (timeoutId) {
                    clearTimeout(timeoutId);
                }
                const newTimeoutId = setTimeout(() => {
                    setResendTokenSend(false); // No need to await this
                    navigate('/login'); // Navigate after resetting the state
                }, 120000); // 2 minutes in milliseconds
    
                setTimeoutId(newTimeoutId);
            } else {
                setAuthToken(null);
                setIsLoading(false);
                Cookies.remove('authToken');
            }
        } catch (error) {
            setIsLoading(false);
            await handleAuthError(error);
        }
    };        

    const verifyMfa = async (code) => {
        setIsLoading(true);
        const User_Id = await Cookies.get('User_Id');
        const Session = await Cookies.get('Session');
        const mfaType = await Cookies.get('MFA_Type') || '';
        
        const ChallengeResponses = {
            USERNAME: User_Id,
            [!mfaType || mfaType === 'SMS_MFA' ? 'SMS_MFA_CODE' : 'SOFTWARE_TOKEN_MFA_CODE']: code
        };
    
        const params = {
            ChallengeName: !mfaType ? 'SMS_MFA' : mfaType,
            ChallengeResponses,
            ClientId: config.clientId,
            UserPoolId: config.userPoolId,
            Session: Session,
        };
    
        try {
            const command = new RespondToAuthChallengeCommand(params);
            const { AuthenticationResult } = await cognitoClient.send(command);
            
            if (AuthenticationResult) {
                if (timeoutId) clearTimeout(timeoutId);
                setAuthToken(AuthenticationResult.IdToken);
                await Cookies.set('authToken', AuthenticationResult.IdToken, { expires: 7 });
                await Cookies.set('AccessToken', AuthenticationResult.AccessToken, { expires: 7 });
                await setResendTokenSend(false);
                await fetchUserId(AuthenticationResult.AccessToken);
                setIsLoading(false);
            }
        } catch (error) {
            setIsLoading(false);
            if (error.name === "NotAuthorizedException") {
                setResendTokenSend(false);
                await handleAuthError(error);
            } else if (error.name === "CodeMismatchException") {
                alert(error.message);
                console.error("Error verifying MFA: ", error);
            } else {
                console.error("Error verifying MFA: ", error);
                throw error;
            }
        }
    };    

    const getAttributeValue = (attributes, name) => {
        const attribute = attributes.find(attr => attr.Name === name);
        return attribute ? attribute.Value : null;
    };

    const fetchUserId = async (token) => {
        try {
            const params = {
                AccessToken: token
            };
            const command = new GetUserCommand(params);
            const response = await cognitoClient.send(command);
            if (response && response.UserAttributes){
                const email = getAttributeValue(response.UserAttributes, 'email');
                const phoneNumber = getAttributeValue(response.UserAttributes, 'phone_number');
                const userId = getAttributeValue(response.UserAttributes, 'sub');

                const data = await fetchLoginUserMetaData(userId,email)
                if (data && data.UserStatus == 1){
                    await setIsUserBlocked(true);
                    await setIsLoading(false);
                    await setResendTokenSend(false);
                    await Cookies.remove('authToken');
                    await Cookies.remove('Session');
                    await Cookies.remove('AccessToken');
                    await Cookies.remove('User_Id');
                }
                const userInfo = data.UserInfo;
                if (userInfo.Type === 'Admin'){
                    const admin = data.AdminData;
                    await setAdminUserData(admin);
                    if (admin && admin.FirstName){
                        const userName = admin.FirstName + ' ' + admin.LastName;
                        await setGlobalUserName(userName);
                        await setGlobalProfilePicture(admin.ProfilePicture);
                    }
                    else {
                        const userName = null;
                        await setGlobalUserName(userName);
                    }
                }
                else if (userInfo.Type === 'Provider'){
                    await setProviderUserData(data.ProviderData);
                    const provider = data.ProviderData;
                    if (provider && provider.OrganizationID){
                        await setProviderOrganizationID(provider.OrganizationID);
                    }
                    if (provider && provider.FirstName){
                        const userName = provider.FirstName + ' ' + provider.LastName;
                        setGlobalUserName(userName);
                        await setGlobalProfilePicture(provider.ProfilePicture);

                    }
                    else {
                        const userName = null;
                        await setGlobalUserName(userName);
                    }
                }
                await setLoginUserCookie(userId, email, userInfo.Type);

                await setLoginUser({
                    UserId: userId,
                    Email: email,
                    PhoneNumber: phoneNumber,
                    FullName: null,
                    Type: userInfo.Type
                })

                if (userInfo.Type === 'Admin'){
                    setUserType(userInfo.Type);
                    navigate('/');
                }
                else if (userInfo.Type === 'Provider') {
                    setUserType(userInfo.Type);
                    navigate('/provider-dashboard');
                }

            }
        } catch (error) {
            await handleAuthError(error);
        }
    }

    const changePassword = async (currentPassword, newPassword) => {
        const AccessToken = await Cookies.get('AccessToken');
        const params = {
            AccessToken,  // Use the access token from the authenticated user
            PreviousPassword: currentPassword,
            ProposedPassword: newPassword,
        };

        try {
            const command = new ChangePasswordCommand(params);
            await cognitoClient.send(command);
            if (userType === 'Admin'){
                navigate('/admin/profile-view');
            }
            else if (userType === 'Provider'){
                navigate('/profile/settings/view');
            }
            alert("Password changed successfully!");
        } catch (error) {
            await handleAuthError(error);
        }
    };

    const resendCode = async () => {
        const User_Id = await Cookies.get('User_Id');

        // Clear the previous session and invalidate old code
        await setResendTokenSend(false); // Reset the resend state to handle new codes

        const params = {
            ClientId: config.clientId,
            Username: User_Id,
        };
        try {
            const command = new ResendConfirmationCodeCommand(params);
            const { CodeDeliveryDetails } = await cognitoClient.send(command);
            if (CodeDeliveryDetails) {
                await setResendTokenSend(true);

                setTimeout(() => {
                    setResendTokenSend(false); // No need to await this
                    navigate('/login'); // Navigate after resetting the state
                }, 120000); // 2 minutes in milliseconds
            }
        } catch (error) {
            console.error("Resend Code Error: ", error);
            alert(error.message);
            throw error;
        }
    };

    const resetUserInfo = async () => {
        Cookies.remove('authToken');
        Cookies.remove('Session');
        Cookies.remove('AccessToken');
        await clearLoginUserCookie();
        navigate('/login', { replace: true });
        window.location.reload();
    };


    const fetchLoginUserMetaData = async (userId, email) => {
        try {
            const authenticationToken = await Cookies.get('authToken');
            const response = await fetch(`${BASE_URL}/user-authorization?UserID=${userId}&Email=${email}`, {
                method: 'GET',
                headers: {
                    Authorization: `${authenticationToken}`,
                    'Content-Type': 'application/json',
                },
            });
            if (response.status === 200) {
                const result = await response.json();
                return result;
            }
        } catch (error) {
            console.log("error");
            console.log(error);
            await handleAuthError(error);
        }
    }

    const signOut = async () => {
        try {
            const AccessToken = Cookies.get('AccessToken');
            if (AccessToken) {
                const params = {
                    AccessToken,
                };
                const command = new GlobalSignOutCommand(params);
                await cognitoClient.send(command);
                await resetUserInfo();
            }
        } catch (error) {
            await handleAuthError(error);
        }
    };
    const forgotPassword = async (formValues) => {
        const phoneNumberWithCountryCode = `+1${formValues.userPhoneNumber.replace(/\D/g, '')}`;
        const params = {
            ClientId: config.clientId,
            Username: phoneNumberWithCountryCode,
            // Username: formValues.userPhoneNumber,
        };

        try {
            const command = new ForgotPasswordCommand(params);
            await cognitoClient.send(command);
        } catch (error) {
            await handleAuthError(error);
        }
    }

    const confirmForgotPassword = async (formValues) => {
        const params = {
            ClientId: config.clientId,
            Username: formValues.userPhoneNumber,
            ConfirmationCode: formValues.verificationCode,
            Password: formValues.newPassword,
        };

        try {
            const command = new ConfirmForgotPasswordCommand(params);
            await cognitoClient.send(command);
            alert("Password reset successfully! You can now log in with your new password.");
            await Cookies.remove('isResetPassword');
            navigate('/login');
        } catch (error) {
            await handleAuthError(error);
        }
    };

    const handleAuthError = async (error) => {
        if (error && (error.name === 'NotAuthorizedException' || error.name === 'InvalidParameterException' || error.name === 'CodeMismatchException')) {
            setIsLoading(false);
            Cookies.remove('authToken');
            Cookies.remove('Session');
            Cookies.remove('AccessToken');
            Cookies.remove('MFA_Type');
            Cookies.remove('Stored_Username');
            Cookies.remove('Stored_Password');
            await setResendTokenSend(false);
            await clearLoginUserCookie();
            alert(error.message);
            navigate('/login', { replace: true });
            window.location.reload();
            throw error;
        } else {
            setIsLoading(false);
            Cookies.remove('authToken');
            Cookies.remove('Session');
            Cookies.remove('AccessToken');
            Cookies.remove('MFA_Type');
            Cookies.remove('Stored_Username');
            Cookies.remove('Stored_Password');
            await setResendTokenSend(false);
            await clearLoginUserCookie();
            alert(error.message);
            navigate('/login', { replace: true });
            window.location.reload();
            throw error;
        }
    };


    if (isLoading) {
        return <Spinner />
    }

    if (isUserBlocked) {
        return <UserBlockModal onClose={() => handleAuthError("error")} />;
    }


    return (
        <AuthContext.Provider
            value={{
                authToken,
                userType,
                setUserType,
                cognitoClient,
                signIn,
                forgotPassword,
                confirmForgotPassword,
                signOut,
                verifyMfa,
                resetUserInfo,
                resendCode,
                changePassword
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
