"use client";

import React, { useState } from "react";
import { Send, Menu, X, Phone, Video } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ChatInterface() {
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [message, setMessage] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const router = useRouter();

  const doctors = [
    {
      id: 1,
      name: "Dr. Sarah Johnson",
      specialty: "Cardiologist",
      avatar: "/api/placeholder/40/40",
    },
    {
      id: 2,
      name: "Dr. Michael Lee",
      specialty: "Dermatologist",
      avatar: "/api/placeholder/40/40",
    },
    {
      id: 3,
      name: "Dr. Emily Chen",
      specialty: "Pediatrician",
      avatar: "/api/placeholder/40/40",
    },
  ];

  const messages = [
    {
      id: 1,
      sender: "doctor",
      content: "Hello! How can I help you today?",
      timestamp: "10:00 AM",
    },
    {
      id: 2,
      sender: "user",
      content: "Hi Dr. Johnson, I have a question about my medication.",
      timestamp: "10:05 AM",
    },
    {
      id: 3,
      sender: "doctor",
      content: "Of course, what would you like to know?",
      timestamp: "10:07 AM",
    },
  ];

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      // Here you would typically send the message to your backend
      console.log("Sending message:", message);
      setMessage("");
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <span className="text-2xl font-bold text-sky-600">
                  Neighbourly
                </span>
              </div>
            </div>
            <div className="flex items-center">
              <button
                className="md:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-sky-500"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              >
                {isSidebarOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex-1 flex overflow-hidden">
        <div
          className={`bg-white w-64 flex-shrink-0 border-r border-gray-200 ${
            isSidebarOpen ? "block" : "hidden"
          } md:block`}
        >
          <div className="h-full flex flex-col">
            <div className="p-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Your Doctors
              </h2>
            </div>
            <nav className="flex-1 overflow-y-auto">
              {doctors.map((doctor) => (
                <button
                  key={doctor.id}
                  className={`w-full text-left px-4 py-2 flex items-center space-x-3 hover:bg-gray-100 ${
                    selectedDoctor === doctor.id ? "bg-gray-100" : ""
                  }`}
                  onClick={() => {
                    setSelectedDoctor(doctor.id);
                    setIsSidebarOpen(false);
                  }}
                >
                  <img
                    className="h-10 w-10 rounded-full"
                    src={doctor.avatar}
                    alt=""
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {doctor.name}
                    </p>
                    <p className="text-sm text-gray-500 truncate">
                      {doctor.specialty}
                    </p>
                  </div>
                </button>
              ))}
            </nav>
          </div>
        </div>

        <div className="flex-1 flex flex-col overflow-hidden">
          {selectedDoctor ? (
            <>
              <div className="bg-white border-b border-gray-200 flex items-center justify-between p-4">
                <div className="flex items-center">
                  <img
                    className="h-10 w-10 rounded-full"
                    src={doctors.find((d) => d.id === selectedDoctor).avatar}
                    alt=""
                  />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">
                      {doctors.find((d) => d.id === selectedDoctor).name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {doctors.find((d) => d.id === selectedDoctor).specialty}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button className="p-2 rounded-full text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500">
                    <Phone className="h-5 w-5" />
                  </button>
                  <button className="p-2 rounded-full text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500">
                    <Video
                      onClick={() => router.push("call")}
                      className="h-5 w-5"
                    />
                  </button>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${
                      msg.sender === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md xl:max-w-lg px-4 py-2 rounded-lg ${
                        msg.sender === "user"
                          ? "bg-sky-500 text-white"
                          : "bg-gray-200 text-gray-900"
                      }`}
                    >
                      <p>{msg.content}</p>
                      <p
                        className={`text-xs mt-1 ${
                          msg.sender === "user"
                            ? "text-sky-100"
                            : "text-gray-500"
                        }`}
                      >
                        {msg.timestamp}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-white border-t border-gray-200 p-4">
                <form onSubmit={handleSendMessage} className="flex space-x-2">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="flex-1 focus:ring-sky-500 focus:border-sky-500 block w-full rounded-md sm:text-sm border-gray-300 focus:outline-none"
                    placeholder="Type a message..."
                  />
                  <button
                    type="submit"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
                  >
                    <Send className="h-5 w-5" />
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-gray-50">
              <p className="text-gray-500 text-lg">
                Select a doctor to start chatting
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
