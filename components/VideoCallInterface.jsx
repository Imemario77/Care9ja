"use client";

import React, { useState } from "react";
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
} from "lucide-react";

export default function VideoChatInterface() {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showChat, setShowChat] = useState(false);

  const toggleMute = () => setIsMuted(!isMuted);
  const toggleVideo = () => setIsVideoOff(!isVideoOff);
  const toggleFullScreen = () => setIsFullScreen(!isFullScreen);
  const toggleChat = () => setShowChat(!showChat);

  return (
    <div className="h-screen absolute w-screen top-0 flex flex-col bg-gray-900">
      <div className="flex-1 flex">
        {/* Main video area */} 
        <div className="flex-1 relative">
          {/* Doctor's video (placeholder) */}
          <div className="absolute inset-0 flex items-center justify-center">
            <img
              src="/api/placeholder/800/600"
              alt="Doctor's video feed"
              className="max-w-full max-h-full object-cover"
            />
          </div>

          {/* User's video (placeholder) */}
          <div className="absolute bottom-4 right-4 w-48 h-36 bg-gray-800 rounded-lg overflow-hidden shadow-lg">
            <img
              src="/api/placeholder/192/144"
              alt="Your video feed"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Call timer */}
          <div className="absolute top-4 left-4 bg-gray-800 bg-opacity-50 text-white px-2 py-1 rounded-md">
            00:15:30
          </div>

          {/* Doctor's name */}
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-gray-800 bg-opacity-50 text-white px-3 py-1 rounded-md">
            Dr. Sarah Johnson
          </div>
        </div>

        {/* Chat sidebar */}
        {showChat && (
          <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold">Chat</h2>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              {/* Chat messages would go here */}
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
        )}
      </div>

      {/* Control bar */}
      <div className="bg-gray-800 p-4 flex items-center justify-center space-x-4">
        <button
          onClick={toggleMute}
          className={`p-3 rounded-full ${
            isMuted ? "bg-red-500" : "bg-gray-700"
          } text-white hover:bg-opacity-80`}
        >
          {isMuted ? <MicOff /> : <Mic />}
        </button>
        <button
          onClick={toggleVideo}
          className={`p-3 rounded-full ${
            isVideoOff ? "bg-red-500" : "bg-gray-700"
          } text-white hover:bg-opacity-80`}
        >
          {isVideoOff ? <VideoOff /> : <Video />}
        </button>
        <button className="p-3 rounded-full bg-red-500 text-white hover:bg-opacity-80">
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
    </div>
  );
}
