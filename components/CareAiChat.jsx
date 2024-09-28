"use client";

import React, { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Image as ImageIcon } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { generateDoctorResponse } from "@/app/actions/chatAi";

const CareAiChat = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your AI doctor assistant. How can I help you today?",
      sender: "system",
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [imageData, setImageData] = useState(null);
  const [imageType, setImageType] = useState(null);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  const handleInputChange = (e) => {
    setInputMessage(e.target.value);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    console.log(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageData(reader.result);
        setImageType(file.type);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSendMessage = async () => {
    if ((inputMessage.trim() !== "" || imageData) && !isAnalyzing) {
      const newUserMessage = {
        id: messages.length + 1,
        text: inputMessage,
        sender: "user",
        image: imageData,
      };
      setMessages((prevMessages) => [...prevMessages, newUserMessage]);
      setInputMessage("");
      setIsAnalyzing(true);

      try {
        const aiResponse = await generateDoctorResponse(
          inputMessage,
          messages,
          imageData,
          imageType
        );
        const newAiMessage = {
          id: messages.length + 2,
          text: aiResponse,
          sender: "system",
        };
        setMessages((prevMessages) => [...prevMessages, newAiMessage]);
      } catch (error) {
        console.error("Error getting AI response:", error);
        const errorMessage = {
          id: messages.length + 2,
          text: "I'm sorry, but I encountered an error. Please try again later or consult with a real doctor for any urgent concerns.",
          sender: "system",
        };
        setMessages((prevMessages) => [...prevMessages, errorMessage]);
      } finally {
        setIsAnalyzing(false);
        setImageData(null);
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey && !isAnalyzing) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isChatOpen ? (
        <div className="bg-white rounded-lg shadow-2xl w-full sm:w-96 h-[70vh] sm:h-[600px] flex flex-col overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-4 rounded-t-lg flex justify-between items-center">
            <h3 className="text-lg font-semibold">AI Doctor Assistant</h3>
            <button
              onClick={toggleChat}
              className="text-white hover:text-gray-200 transition-colors duration-200"
            >
              <X size={24} />
            </button>
          </div>
          <div className="flex-grow p-4 overflow-y-auto bg-gray-50">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`mb-4 ${
                  message.sender === "user" ? "text-right" : "text-left"
                }`}
              >
                {message.image && (
                  <img
                    src={message.image}
                    alt="Uploaded"
                    className="max-w-xs rounded-lg mb-2 inline-block shadow-md"
                  />
                )}
                <div
                  className={`inline-block p-3 rounded-lg shadow-md max-w-[80%] ${
                    message.sender === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-800"
                  }`}
                >
                  {message.sender === "user" ? (
                    message.text
                  ) : (
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      className="markdown-body"
                      components={{
                        p: ({ node, ...props }) => (
                          <p className="mb-2" {...props} />
                        ),
                        ul: ({ node, ...props }) => (
                          <ul className="list-disc pl-4 mb-2" {...props} />
                        ),
                        ol: ({ node, ...props }) => (
                          <ol className="list-decimal pl-4 mb-2" {...props} />
                        ),
                        li: ({ node, ...props }) => (
                          <li className="mb-1" {...props} />
                        ),
                        h1: ({ node, ...props }) => (
                          <h1 className="text-xl font-bold mb-2" {...props} />
                        ),
                        h2: ({ node, ...props }) => (
                          <h2 className="text-lg font-bold mb-2" {...props} />
                        ),
                        h3: ({ node, ...props }) => (
                          <h3 className="text-md font-bold mb-2" {...props} />
                        ),
                        a: ({ node, ...props }) => (
                          <a
                            className="text-blue-500 hover:underline"
                            {...props}
                          />
                        ),
                      }}
                    >
                      {message.text}
                    </ReactMarkdown>
                  )}
                </div>
              </div>
            ))}
            {isAnalyzing && (
              <div className="flex items-center justify-center">
                <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full shadow-md">
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-800 mr-2"></div>
                    Analyzing...
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <div className="p-4 border-t bg-white">
            {imageData && (
              <div className="mb-2">
                <img
                  src={imageData}
                  alt="To be sent"
                  className="max-w-xs rounded-lg shadow-md"
                />
              </div>
            )}
            <div className="flex items-center space-x-2">
              <textarea
                value={inputMessage}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                placeholder="Describe your symptoms or ask a medical question..."
                className="flex-grow p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none bg-gray-50"
                rows={2}
                disabled={isAnalyzing}
              />
              <button
                onClick={() => fileInputRef.current.click()}
                className="bg-gray-200 text-gray-700 p-2 rounded-full hover:bg-gray-300 transition-colors duration-300 disabled:opacity-50"
                disabled={isAnalyzing}
              >
                <ImageIcon size={24} />
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
                disabled={isAnalyzing}
              />
              <button
                onClick={handleSendMessage}
                disabled={isAnalyzing}
                className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors duration-300 disabled:opacity-50"
              >
                <Send size={24} />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button
          onClick={toggleChat}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg transition-all duration-300 ease-in-out"
          aria-label="Open doctor assistant chat"
        >
          <MessageCircle size={28} />
        </button>
      )}
    </div>
  );
};

export default CareAiChat;
