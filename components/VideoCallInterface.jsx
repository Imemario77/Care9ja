"use client";

import React, { useState, useEffect } from "react";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  PhoneOff,
  MessageSquare,
  MoreVertical,
  Maximize,
  Minimize,
  Plus,
  Calendar,
} from "lucide-react";
import {
  useStreamVideoClient,
  StreamCall,
  VideoPreview,
  StreamTheme,
  CallParticipantsList,
  SpeakerLayout,
  CallControls,
} from "@stream-io/video-react-sdk";

export default function VideoChatInterface({ userData, callId }) {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const client = useStreamVideoClient();
  const [showBookingDialog, setShowBookingDialog] = useState(false);
  const [callDetails, setCallDetails] = useState();
  const [meetingDate, setMeetingDate] = useState();
  const [meetingDescription, setMeetingDescription] = useState();
  const [isConnecting, setIsConnecting] = useState(false);

  const toggleMute = () => setIsMuted(!isMuted);
  const toggleVideo = () => setIsVideoOff(!isVideoOff);
  const toggleFullScreen = () => setIsFullScreen(!isFullScreen);
  const toggleChat = () => setShowChat(!showChat);

  const createMeeting = async () => {
    if (!userData || !client) return;
    try {
      setIsConnecting(true);
      const id = callId || "marioime";
      const call = client.call("default", id);

      if (!call) throw new Error("Call not created");

      const startsAt =
        meetingDate?.toISOString || new Date(Date.now()).toISOString();
      const description = meetingDescription || "Instant Meeting";

      await call.getOrCreate({
        data: {
          starts_at: startsAt,
          custom: {
            description,
          },
        },
      });

      setCallDetails(call);
      console.log("callId: " + call.id);
    } catch (error) {
      console.log(error);
      alert(error);
    } finally {
      setIsConnecting(false);
    }
  };

  const endCall = () => {
    if (callDetails) {
      callDetails.leave();
      setCallDetails(undefined);
    }
  };
  return (
    <>
      {callDetails ? (
        <StreamCall call={callDetails}>
          <StreamTheme className="my-theme-overrides">
            <SpeakerLayout />
            <CallControls />
          </StreamTheme>
        </StreamCall>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <div className="space-y-4">
            <button
              onClick={createMeeting}
              disabled={isConnecting}
              className={`w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded flex items-center justify-center ${
                isConnecting ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <Plus className="mr-2 h-4 w-4" />
              {isConnecting ? "Connecting..." : "Create Instant Meeting"}
            </button>
            <button
              onClick={() => setShowBookingDialog(true)}
              className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded flex items-center justify-center"
            >
              <Calendar className="mr-2 h-4 w-4" /> Book a Meeting
            </button>
          </div>
        </div>
      )}
    </>
  );
  return (
    <div className="h-screen absolute w-screen top-0 flex flex-col bg-gray-900">
      <div className="flex-1 flex">
        {callDetails ? (
          <StreamCall call={callDetails}>
            <StreamTheme>
              <VideoArea
                name={userData.full_name}
                isMuted={isMuted}
                isVideoOff={isVideoOff}
                call={callDetails}
              />
              {showChat && <ChatSidebar />}
            </StreamTheme>
          </StreamCall>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="space-y-4">
              <button
                onClick={createMeeting}
                disabled={isConnecting}
                className={`w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded flex items-center justify-center ${
                  isConnecting ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <Plus className="mr-2 h-4 w-4" />
                {isConnecting ? "Connecting..." : "Create Instant Meeting"}
              </button>
              <button
                onClick={() => setShowBookingDialog(true)}
                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded flex items-center justify-center"
              >
                <Calendar className="mr-2 h-4 w-4" /> Book a Meeting
              </button>
            </div>
          </div>
        )}
      </div>

      {callDetails && (
        <div className="bg-gray-800 p-4 flex items-center justify-center space-x-4">
          <ControlButton
            activeIcon={MicOff}
            inactiveIcon={Mic}
            isActive={isMuted}
            onClick={toggleMute}
          />
          <ControlButton
            activeIcon={VideoOff}
            inactiveIcon={Video}
            isActive={isVideoOff}
            onClick={toggleVideo}
          />
          <button
            onClick={endCall}
            className="p-3 rounded-full bg-red-500 text-white hover:bg-opacity-80"
          >
            <PhoneOff />
          </button>
          <button
            onClick={toggleChat}
            className={`p-3 rounded-full ${
              showChat ? "bg-sky-500" : "bg-gray-700"
            } text-white hover:bg-opacity-80`}
          >
            <MessageSquare />
          </button>
          <button className="p-3 rounded-full bg-gray-700 text-white hover:bg-opacity-80">
            <MoreVertical />
          </button>
          <button
            onClick={toggleFullScreen}
            className="p-3 rounded-full bg-gray-700 text-white hover:bg-opacity-80"
          >
            {isFullScreen ? <Minimize /> : <Maximize />}
          </button>
        </div>
      )}

      {showBookingDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-xl">
            <h2 className="text-2xl font-bold mb-4">Book a Meeting</h2>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="date"
                  className="block text-sm font-medium text-gray-700"
                >
                  Date
                </label>
                <input
                  id="date"
                  type="datetime"
                  value={meetingDate}
                  onChange={(e) => setMeetingDate(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label
                  htmlFor="time"
                  className="block text-sm font-medium text-gray-700"
                >
                  Time
                </label>
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setShowBookingDialog(false)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={bookMeeting}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                >
                  Book Meeting
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const ControlButton = ({
  onClick,
  isActive,
  activeIcon: ActiveIcon,
  inactiveIcon: InactiveIcon,
}) => (
  <button
    onClick={onClick}
    className={`p-3 rounded-full ${
      isActive ? "bg-red-500" : "bg-gray-700"
    } text-white hover:bg-opacity-80`}
  >
    {isActive ? <ActiveIcon /> : <InactiveIcon />}
  </button>
);

const VideoArea = ({ name, isMuted, isVideoOff, call }) => {
  useEffect(() => {
    if (isMuted) {
      call.microphone.disable();
    } else {
      call.microphone.enable();
    }
    if (isVideoOff) {
      call.camera.disable();
    } else {
      call.camera.enable();
    }
  }, [isMuted, isVideoOff, call?.camera, call?.microphone]);

  return (
    <div className="flex-1 relative">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="max-w-full max-h-full object-cover">
          <CallParticipantsList />
        </div>
      </div>
      <div className="fixed bottom-20 right-4 w-48 h-36  rounded-lg overflow-hidden shadow-lg">
        <VideoPreview className="w-full h-full object-cover" />
      </div>
      <div className="absolute top-4 left-4 bg-gray-800 bg-opacity-50 text-white px-2 py-1 rounded-md">
        00:15:30
      </div>
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-gray-800 bg-opacity-50 text-white px-3 py-1 rounded-md">
        {name}
      </div>
    </div>
  );
};

const ChatSidebar = () => (
  <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
    <div className="p-4 border-b border-gray-200">
      <h2 className="text-lg font-semibold">Chat</h2>
    </div>
    <div className="flex-1 overflow-y-auto p-4">
      <p className="text-gray-600">No messages yet</p>
    </div>
    <div className="p-4 border-t border-gray-200">
      <input
        type="text"
        placeholder="Type a message..."
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
      />
    </div>
  </div>
);
