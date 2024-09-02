"use client";

import React, { useState, useEffect } from "react";
import { Send, Phone, Video, ChevronDown, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";

export default function ChatInterface({ accounts, activeAccount, userId }) {
  const [selectedAccount, setSelectedAccount] = useState(activeAccount || null);
  const [message, setMessage] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState({});

  const [messages, setMessages] = useState([]);

  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    if (userId) {
      const channel = supabase.channel("online-users");
      channel
        .on("presence", { event: "sync" }, () => {
          const newState = channel.presenceState();
          setOnlineUsers(newState);
        })
        .subscribe(async (status) => {
          if (status === "SUBSCRIBED") {
            await channel.track({
              user_id: userId,
              online_at: new Date().toISOString(),
            });
          }
        });

      return () => {
        channel.untrack({ user_id: userId });
        channel.unsubscribe();
      };
    }
  }, [userId]);

  useEffect(() => {
    if (selectedAccount) {
      // Fetch existing messages
      fetchMessages();

      // Set up real-time subscription
      const subscription = supabase
        .channel(`public:messages:chat_id=eq.${selectedAccount.id}`)
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "messages" },
          handleNewMessage
        )
        .subscribe();

      // Cleanup subscription on unmount
      return () => {
        subscription.unsubscribe();
      };
    }
  }, [selectedAccount]);

  const isAccountOnline = (account) => {
    console.log(account.user);
    const userPresence = Object.values(onlineUsers).find((presence) =>
      presence.some((p) => p.user_id === account)
    );
    console.log(userPresence);
    return Boolean(userPresence);
  };

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("chat_id", selectedAccount.id)
        .order("sent_at", { ascending: true });

      if (error) throw error;

      setMessages(data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (message.trim() && selectedAccount) {
      try {
        const { data, error } = await supabase
          .from("messages")
          .insert({
            content: message,
            sender_id: userId,
            chat_id: selectedAccount.id,
          })
          .single();

        if (error) throw error;
        setMessage("");
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };

  const handleNewMessage = (payload) => {
    console.log(payload);
    setMessages((prevMessages) => [...prevMessages, payload.new]);
  };

  const handleAccountSelect = (account) => {
    setSelectedAccount(account);
    setIsDropdownOpen(false);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      <div className="flex-1 flex overflow-hidden">
        {/* Desktop sidebar */}
        <div className="bg-white w-64 flex-shrink-0 border-r border-gray-200 hidden md:block">
          <div className="h-full flex flex-col">
            <Link href="/dashboard" className="p-4">
              <h2 className="text-2xl font-bold mt-2 text-sky-600">Care9ja</h2>
            </Link>
            <nav className="flex-1 overflow-y-auto">
              {accounts.map((account) => (
                <AccountButton
                  key={account.id}
                  account={account}
                  isSelected={selectedAccount?.id === account.id}
                  onClick={() => handleAccountSelect(account)}
                  isAccountOnline={isAccountOnline}
                />
              ))}
            </nav>
          </div>
        </div>

        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Mobile account selector */}
          <div className="md:hidden bg-white border-b border-gray-200 p-4">
            <div className="relative flex items-center">
              <Link href="/dashboard" className="mr-4">
                <ArrowLeft className="h-5 w-5 text-sky-600" />
              </Link>
              <button
                className="w-full text-left px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                {selectedAccount
                  ? selectedAccount.user?.full_name ||
                    selectedAccount.user?.user?.full_name
                  : "Select a account"}
                <ChevronDown className="absolute right-4 top-3 h-5 w-5 text-gray-400" />
              </button>
              {isDropdownOpen && (
                <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md">
                  {accounts.map((account) => (
                    <button
                      key={account.id}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center space-x-3"
                      onClick={() => handleAccountSelect(account)}
                    >
                      <img
                        className="h-10 w-10 rounded-full"
                        src={
                          account.user?.user?.profile_picture_url ||
                          account.user?.profile_picture_url
                        }
                        alt=""
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {account.user?.user?.full_name ||
                            account.user?.full_name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {account.user?.specialization}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {selectedAccount ? (
            <>
              <div className="bg-white border-b border-gray-200 flex items-center justify-between p-4">
                <div className="flex items-center">
                  <div className="relative">
                    <img
                      className="h-10 w-10 rounded-full"
                      src={
                        selectedAccount.user?.user?.profile_picture_url ||
                        selectedAccount.user?.profile_picture_url
                      }
                      alt=""
                    />
                    <span
                      className={`absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full ring-2 ring-white ${
                        isAccountOnline(
                          selectedAccount.user?.id ||
                            selectedAccount.user?.user?.id
                        )
                          ? "bg-green-400"
                          : isAccountOnline(
                              selectedAccount.user?.id ||
                                selectedAccount.user?.user?.id
                            ) === false
                          ? "bg-gray-300"
                          : "bg-yellow-400"
                      }`}
                    />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">
                      {selectedAccount.user?.user?.full_name ||
                        selectedAccount.user?.full_name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {selectedAccount.user?.specialization}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button className="p-2 rounded-full text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500">
                    <Phone className="h-5 w-5" />
                  </button>
                  <button
                    className="p-2 rounded-full text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
                    onClick={() => router.push("/call")}
                  >
                    <Video className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <MessageList messages={messages} userId={userId} />

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
                Select a account to start chatting
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const MessageList = ({ messages, userId }) => (
  <div className="flex-1 overflow-y-auto p-4 space-y-4">
    {messages.map((msg) => (
      <div
        key={msg.id}
        className={`flex ${
          msg.sender_id === userId ? "justify-end" : "justify-start"
        }`}
      >
        <div
          className={`max-w-xs lg:max-w-md xl:max-w-lg px-4 py-2 rounded-lg ${
            msg.sender_id === userId
              ? "bg-sky-500 text-white"
              : "bg-gray-200 text-gray-900"
          }`}
        >
          <p>{msg.content}</p>
          <p
            className={`text-xs mt-1 ${
              msg.sender_id === userId ? "text-sky-100" : "text-gray-500"
            }`}
          >
            {msg.timestamp}
          </p>
        </div>
      </div>
    ))}
  </div>
);

const AccountButton = ({ account, isSelected, onClick, isAccountOnline }) => (
  <button
    className={`w-full text-left px-4 py-2 flex items-center space-x-3 hover:bg-gray-100 ${
      isSelected ? "bg-gray-100" : ""
    }`}
    onClick={onClick}
  >
    <div className="relative">
      <img
        className="h-10 w-10 rounded-full"
        src={
          account.user?.user?.profile_picture_url ||
          account.user.profile_picture_url
        }
        alt={`${
          account.user?.user?.full_name || account.user.full_name
        }'s profile`}
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = "/placeholder-profile.png";
        }}
      />
      <span
        className={`absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full ring-2 ring-white ${
          isAccountOnline(account.user?.id || account.user?.user?.id)
            ? "bg-green-400"
            : isAccountOnline(account.user?.id || account.user?.user?.id) ===
              false
            ? "bg-gray-300"
            : "bg-yellow-400"
        }`}
      />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-sm font-medium text-gray-900 truncate">
        {account.user?.user?.full_name || account.user.full_name}
      </p>
      <p className="text-sm text-gray-500 truncate">
        {account.user?.specialization}
      </p>
    </div>
  </button>
);
