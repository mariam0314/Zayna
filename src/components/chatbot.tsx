"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Clock, Wifi, Coffee, Heart } from "lucide-react";

type Message = {
  role: "user" | "assistant";
  content: string;
  timestamp?: Date;
};

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Quick action buttons
  const quickActions = [
    { text: "Check-in times", icon: Clock },
    { text: "Wi-Fi info", icon: Wifi },
    { text: "Breakfast hours", icon: Coffee },
    { text: "Spa services", icon: Heart },
  ];

  const handleSend = async (messageText?: string) => {
    const messageToSend = messageText || input.trim();
    if (!messageToSend || loading) return;

    const userMessage: Message = { 
      role: "user", 
      content: messageToSend,
      timestamp: new Date()
    };
    
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: messageToSend }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      setMessages([
        ...newMessages,
        { 
          role: "assistant", 
          content: data.reply || "I apologize, but I'm having trouble right now. Please call our front desk at (555) 123-4567.",
          timestamp: new Date()
        },
      ]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages([
        ...newMessages,
        { 
          role: "assistant", 
          content: "I apologize, but I'm experiencing technical difficulties. Please call our front desk at (555) 123-4567 for immediate assistance.",
          timestamp: new Date()
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAction = (action: string) => {
    handleSend(action);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <div className="w-96 h-[500px] bg-white shadow-2xl rounded-3xl flex flex-col border border-gray-200 overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
          {/* Header */}
          <div className="flex justify-between items-center px-6 py-4 bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-600 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-black bg-opacity-10"></div>
            <div className="flex items-center space-x-3 relative z-10">
              <div className="p-2 bg-white bg-opacity-20 rounded-full">
                <MessageCircle size={20} />
              </div>
              <div>
                <span className="font-bold text-lg">Zayna Assistant</span>
                <p className="text-xs opacity-90">Always here to help</p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="hover:bg-white hover:bg-opacity-20 p-2 rounded-full transition-all duration-200 relative z-10"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-gray-50 to-white">
            {messages.length === 0 && (
              <div className="text-center py-8">
                <div className="bg-gradient-to-br from-amber-100 to-orange-100 p-6 rounded-2xl mb-4">
                  <MessageCircle size={40} className="mx-auto mb-3 text-amber-600" />
                  <h3 className="font-bold text-gray-800 mb-2">Welcome to Zayna Hotel!</h3>
                  <p className="text-sm text-gray-600 mb-4">I'm here to help with information about our luxury accommodations, amenities, and services.</p>
                  
                  {/* Quick Action Buttons */}
                  <div className="grid grid-cols-2 gap-2 mt-4">
                    {quickActions.map((action, idx) => {
                      const IconComponent = action.icon;
                      return (
                        <button
                          key={idx}
                          onClick={() => handleQuickAction(action.text)}
                          className="flex items-center justify-center space-x-2 p-2 bg-white rounded-lg border border-gray-200 hover:border-amber-300 hover:bg-amber-50 transition-all duration-200 text-sm"
                        >
                          <IconComponent size={14} className="text-amber-600" />
                          <span className="text-gray-700 font-medium">{action.text}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
            
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-in fade-in-0 slide-in-from-bottom-2 duration-300`}
              >
                <div
                  className={`max-w-[280px] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg"
                      : "bg-white text-gray-800 shadow-md border border-gray-100"
                  }`}
                >
                  {msg.content}
                  {msg.timestamp && (
                    <div className={`text-xs mt-1 ${msg.role === "user" ? "text-amber-100" : "text-gray-400"}`}>
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {loading && (
              <div className="flex justify-start animate-in fade-in-0 slide-in-from-bottom-2 duration-300">
                <div className="bg-white text-gray-500 px-4 py-3 rounded-2xl text-sm shadow-md border border-gray-100">
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-amber-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{animationDelay: "0.1s"}}></div>
                      <div className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce" style={{animationDelay: "0.2s"}}></div>
                    </div>
                    <span className="ml-2 text-amber-600">Assistant is typing...</span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-gray-100">
            <div className="flex space-x-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about rooms, amenities, or services..."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200"
                disabled={loading}
              />
              <button
                onClick={() => handleSend()}
                disabled={loading || !input.trim()}
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-white p-3 rounded-2xl transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 shadow-lg"
              >
                <Send size={16} />
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              For immediate assistance, call <span className="text-amber-600 font-semibold">(555) 123-4567</span>
            </p>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-600 hover:from-amber-600 hover:via-orange-600 hover:to-yellow-700 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-amber-500 focus:ring-opacity-50 animate-pulse"
        >
          <MessageCircle size={24} />
        </button>
      )}
    </div>
  );
}