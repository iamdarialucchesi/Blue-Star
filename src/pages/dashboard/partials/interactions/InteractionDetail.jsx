import React, { useRef, useState, useEffect, useContext } from "react";
import { useLocation } from "react-router-dom";
import EmojiPicker from "emoji-picker-react";
import SearchIcon from "../../../../assets/images/icons/search.svg";
import emojiIcon from "../../../../assets/icons/emoji-icon.svg";
import clipIcon from "../../../../assets/icons/clip-icon.svg";
import chatSendIcon from "../../../../assets/icons/chat-send-green-icon.svg";
import PatientProgramService from "./service/PatientsProgramsService.js";
import { AuthContext } from "../../../../context/AuthContext.jsx";
import Spinner from "../../../../components/Spinner.jsx";

function InteractionDetail() {
    const { authToken } = useContext(AuthContext);
    const { state } = useLocation();
    const { patientData, programData } = state || {};
    const [programID, setProgramID] = useState(programData.ProgramID || null);
    const [activeTab, setActiveTab] = useState('Messaging');
    const [messages, setMessages] = useState([]);
    const [evaluation, setEvaluation] = useState({});
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (patientData && programData) {
            // Set initial programID if it's not set
            if (!programID) {
                setProgramID(programData.ProgramID);
            }
    
            // Initial fetch of evaluation and messages
            fetchEvaluation(patientData.PatientID, programID || programData.ProgramID);
            fetchMessages(patientData.PatientID, programID || programData.ProgramID, true);
    
            // Poll for new messages every 5 seconds
            const interval = setInterval(() => {
                fetchMessages(patientData.PatientID, programID || programData.ProgramID, false);
            }, 5000);
    
            // Clear interval when component unmounts
            return () => clearInterval(interval);
        }
    }, [patientData, programData, programID]);
    
    const fetchMessages = async (patientId, programId, isInitialCall = false) => {
        // Set programID to the new programId if it’s different from the current one
        if (programId !== programID) {
            setProgramID(programId);
        }
    
        try {
            if (isInitialCall) {
                setIsLoading(true); // Only show loading on the first call
            }
    
            const result = await PatientProgramService.fetchPatientMessages(authToken, patientId, programId);
    
            // Update messages from the result
            setMessages(result.Messages || []);
    
            if (isInitialCall) {
                setIsLoading(false); // Turn off loading after the initial fetch
            }
        } catch (error) {
            console.error('Error fetching messages:', error);
            setMessages([]);
            if (isInitialCall) {
                setIsLoading(false); // Ensure loading is turned off on error
            }
        }
    };  

    const fetchEvaluation = async (patientId, programId) => {
        try {
            setIsLoading(true);
            const result = await PatientProgramService.fetchConversationEvaluation(authToken, patientId, programId);
            setIsLoading(false);
            setEvaluation(result?.Evaluation || {});
        } catch (error) {
            console.error('Error fetching evaluation:', error);
        }
    };

    const handleSendMessage = async (patientId, programId, message) => {
        try {
            setIsLoading(true);
            const formValues = {
                PatientID: patientId,
                ProgramID: programId,
                Message: message,
            };
            const result = await PatientProgramService.sendMessage(authToken, formValues);
            setIsLoading(false);

            if (result.status === 200) {
                const newMessage = {
                    Content: message,
                    Role: 'assistant',
                    CreatedAt: new Date().toISOString(), // Create a timestamp for the message
                };

                // Update the messages state with the new message
                setMessages((prevMessages) => [...prevMessages, newMessage]);

                // Clear the input field after sending the message
                setInputValue('');
            }
        } catch (error) {
            console.error('Error sending message:', error);
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return <Spinner />;
    }

    return (
        <div className="provider-interaction-details">
            <div className="row">
                <div className="col-md-4">
                    <div className="border rounded-3 py-3 ">
                        <div className="d-flex align-items-center mx-3 rounded-3 bg-white border border-black-10 py-2 px-3 gap-2">
                            <label htmlFor="patient-searchbar-input" className="d-flex align-items-center">
                                <img src={SearchIcon} alt="search icon" />
                            </label>
                            <input
                                className="border-0 bg-transparent input-focus-none fs-14 w-100"
                                placeholder="Search"
                                id="patient-searchbar-input"
                            />
                        </div>
                        <div className="mt-3 interaction-detail-chat-inner-height overflow-y-auto">
                            <div className="interaction-detail-chat nav nav-pills" id="v-pills-tab" role="tablist" aria-orientation="vertical">
                                {patientData?.Programs.map((program) => (
                                    <button
                                        key={program.ProgramID}
                                        className="nav-link w-100 px-4 py-0 rounded-0 text-start"
                                        onClick={() => fetchMessages(patientData.PatientID, program.ProgramID, true)}
                                    >
                                        <div className="py-3">
                                            <div className="d-flex align-items-center justify-content-between text-dark fw-normal fs-16">
                                                {program.ProgramName}
                                                <span className="content-text-color fw-normal detail-text">
                                                    {program.MostRecentMessage?.CreatedAt ? formatDate(program.MostRecentMessage.CreatedAt) : ''}
                                                </span>
                                            </div>
                                            <p className="content-text-color fw-light detail-text-small-size m-0">
                                                {program?.MostRecentMessage?.Content || ''}
                                            </p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-8">
                    <div className="tabing-detail rounded-3 border mt-4 mt-md-0">
                        <div className="bg-midnight-blue rounded-top-3 p-3">
                            <h3 className="text-white fw-bold fs-17 m-0">{patientData?.PatientName || 'Patient Name'}</h3>
                        </div>
                        <div className="tab-content" id="v-pills-tabContent">
                            <div className="tab-pane fade show active" id="v-pills-1" role="tabpanel" tabIndex="0">
                                <SwitchingTab
                                    activeTab={activeTab}
                                    setActiveTab={setActiveTab}
                                    messages={messages}
                                    patient={patientData}
                                    program={programData}
                                    evaluation={evaluation}
                                    inputValue={inputValue}
                                    setInputValue={setInputValue}
                                    handleSendMessage={handleSendMessage}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function SwitchingTab({ 
    activeTab, 
    setActiveTab, 
    messages, 
    patient, 
    program, 
    evaluation, 
    inputValue, 
    setInputValue, 
    handleSendMessage 
}) {
    const fileInputRef = useRef(null);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);

    const handleEmojiClick = (emojiObject) => {
        setInputValue((prevValue) => prevValue + emojiObject.emoji);
        setShowEmojiPicker(false);
    };

    function handleInputType() {
        fileInputRef.current.click();
    }

    return (
        <>
            <div className="d-flex flex-column justify-content-between">
                <div className="d-flex border-bottom interaction-switching-tabs">
                    <button
                        onClick={() => setActiveTab('Summary')}
                        className={`btn fw-normal detail-text text-light border-end rounded-0 w-50 ${
                            activeTab === 'Summary' ? 'interaction-tab-active' : ''
                        }`}
                    >
                        AI Quick Summary
                    </button>
                    <button
                        onClick={() => setActiveTab('Messaging')}
                        className={`btn fw-normal rounded-0 border-end text-light detail-text w-50 ${
                            activeTab === 'Messaging' ? 'interaction-tab-active' : ''
                        }`}
                    >
                        Messaging
                    </button>
                </div>
                <div className="tabs-content-chat">
                    <RenderContent activeTab={activeTab} messages={messages} patient={patient} evaluation={evaluation} />
                </div>
            </div>

            <div className="border-top">
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        if (inputValue.trim()) {
                            handleSendMessage(patient.PatientID, program.ProgramID, inputValue);
                        }
                    }}
                >
                    <div className="px-2 px-lg-4 d-flex justify-content-between">
                        <div className="admin-table-searchbar position-relative w-85 d-flex align-items-center rounded-2 bg-white py-3 gap-2">
                            <img
                                src={emojiIcon}
                                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                                alt="emoji-picker"
                                className="cursor-pointer"
                            />
                            <input
                                className="w-85 border-0 bg-transparent input-focus-none flex-grow-1 fs-14"
                                placeholder="Your message here..."
                                id="chat-input"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                            />
                            {showEmojiPicker && (
                                <div className="emoji-picker-menu position-absolute">
                                    <EmojiPicker onEmojiClick={handleEmojiClick} />
                                </div>
                            )}
                        </div>
                        <div className="d-flex align-items-center">
                            <img src={clipIcon} className="me-2 cursor-pointer" onClick={handleInputType} />
                            <button type="submit" className="btn border-0 p-0">
                                <img src={chatSendIcon} />
                            </button>
                            <input type="file" className="form-control d-none" ref={fileInputRef} />
                        </div>
                    </div>
                </form>
            </div>
        </>
    );
}

function RenderContent({ activeTab, messages, patient, evaluation }) {
    switch (activeTab) {
        case 'Summary':
            return <Summary evaluation={evaluation}/>;
        case 'Messaging':
            return <Messaging messages={messages} patientName={patient.PatientName}/>;
        default:
            return null;
    }
}

// Format date utility function
const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
};

function Messaging({ messages, patientName }) {
    // Sort messages by CreatedAt in ascending order
    const sortedMessages = [...messages].sort((a, b) => new Date(a.CreatedAt) - new Date(b.CreatedAt));

    return (
        <div className="messaging-section px-2 px-lg-4 custom-scrollbar-section">
            {/* Display the oldest message date at the top */}
            {sortedMessages.length > 0 && (
                <div className="position-relative mb-5">
                    <hr />
                    <span
                        className="text-light fw-light detail-text text-center mb-0 position-absolute bg-white px-2"
                        style={{ left: '50%', top: 0, transform: 'translate(-50%, -50%)' }}
                    >
                        {formatDate(sortedMessages[0].CreatedAt)}
                    </span>
                </div>
            )}

            {sortedMessages.length === 0 && (
                <div className="position-relative mb-5">
                    <hr />
                    <span
                        className="text-light fw-light detail-text text-center mb-0 position-absolute bg-white px-2"
                        style={{ left: '50%', top: 0, transform: 'translate(-50%, -50%)' }}
                    >
                        No messages available
                    </span>
                </div>
            )}

            {/* Map through the sorted messages and render based on their role */}
            {sortedMessages.map((message, index) => (
                <div key={index} className={`d-flex ${message.Role === 'assistant' ? 'justify-content-end' : 'gap-2'}`}>
                    {/* Render different message styles based on the Role */}
                    {message.Role === 'user' ? (
                        <div className="other-message d-flex gap-2">
                            <span className="rounded-pill">
                                {patientName.charAt(0)}
                            </span>
                            <div>
                                <p style={{minWidth: '150px'}} className="interaction-chat-message-other alert-detail-action-text-background text-light detail-text fw-light p-3 w-75">
                                    {message.Content}
                                    <p style={{textWrap: 'nowrap'}} className="text-end m-0">{formatDate(message.CreatedAt)}</p>
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="my-message d-flex justify-content-end">
                            <div className="w-75">
                                <p style={{minWidth: '150px'}}  className="interaction-chat-message-me bg-success text-white detail-text fw-light p-3">
                                    {message.Content}
                                    <p style={{textWrap: 'nowrap'}} className="text-end m-0">{formatDate(message.CreatedAt)}</p>
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}

function Summary({ evaluation }) {
    return (
        <div className="px-4 custom-scrollbar-section">

            {/* Key Points */}
            {/* <div className='mt-3'>
                <p className='detail-text text-dark fw-normal mb-2'>Key Points</p>
                <ul className="">
                    <li className=" detail-text border-0 py-1 fw-light text-light">Ut aliquip ex ea commodo consequat.
                    </li>
                    <li className=" detail-text border-0 py-1 fw-light text-light">Sed do eiusmod tempor incididunt ut
                        labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
                        laboris nisi.
                    </li>
                    <li className=" detail-text border-0 py-1 fw-light text-light">Patient suffers from Lorem ipsum
                        dolor sit amet, consectetur adipiscing elit.
                    </li>
                </ul>
            </div> */}

            {/* Summary */}
            <div className='mt-3'>
                <p className='detail-text text-dark fw-normal mb-2'>Summary</p>
                <p className="text-light fw-light detail-text">
                    {evaluation?.KeyPoints && evaluation?.KeyPoints.length > 0 ? evaluation?.KeyPoints[0] : "No summary available"}
                </p>
            </div>

            {/* Actionable Items */}
            <div className='mt-3 mb-4'>
                <p className='text-dark fs-6 fw-normal detail-text'>Actionable Items</p>
                {evaluation?.ActionableItems && evaluation?.ActionableItems.length > 0 ? (
                    evaluation?.ActionableItems.map((item, index) => (
                        <p key={index} className='patient-label-background-color text-light detail-text fw-normal px-3 py-2 rounded-4'>
                            {item.action}
                        </p>
                    ))
                ) : (
                    <p className='text-light detail-text'>No actionable items available.</p>
                )}
            </div>
        </div>
    );
}

export default InteractionDetail;
