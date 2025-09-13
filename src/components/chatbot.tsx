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
    <div className="fixed bottom-4 right-4 z-[9999]">
      {isOpen ? (
        <div className="w-96 h-[500px] card-black shadow-2xl rounded-3xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
          {/* Header */}
          <div className="flex justify-between items-center px-6 py-4 bg-gold-gradient text-black relative overflow-hidden">
            <div className="absolute inset-0 bg-black bg-opacity-10"></div>
            <div className="flex items-center space-x-3 relative z-10">
              <div className="p-2 bg-black bg-opacity-20 rounded-full">
                <MessageCircle size={20} className="text-black" />
              </div>
              <div>
                <span className="font-bold text-lg text-black">Zayna Assistant</span>
                <p className="text-xs opacity-90 text-black">AI-powered concierge</p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="hover:bg-black hover:bg-opacity-20 p-2 rounded-full transition-all duration-200 relative z-10"
            >
              <X size={20} className="text-black" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-[var(--surface)] to-[var(--background)]">
            {messages.length === 0 && (
              <div className="text-center py-8">
                <div className="bg-gradient-to-br from-[var(--surface)] to-[var(--background)] border border-gold/30 p-6 rounded-2xl mb-4">
                  <MessageCircle size={40} className="mx-auto mb-3 text-gold" />
                  <h3 className="font-bold text-gold mb-2">Welcome to Zayna Hotel!</h3>
                  <p className="text-sm text-foreground mb-4">I'm your AI-powered concierge, ready to help with tourism, spa bookings, dining orders, and any hotel questions.</p>
                  
                  {/* Quick Action Buttons */}
                  <div className="grid grid-cols-2 gap-2 mt-4">
                    {quickActions.map((action, idx) => {
                      const IconComponent = action.icon;
                      return (
                        <button
                          key={idx}
                          onClick={() => handleQuickAction(action.text)}
                          className="flex items-center justify-center space-x-2 p-2 bg-surface rounded-lg border border-border hover:border-gold hover:bg-gold/10 transition-all duration-200 text-sm"
                        >
                          <IconComponent size={14} className="text-gold" />
                          <span className="text-foreground font-medium">{action.text}</span>
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
                      ? "bg-gold-gradient text-black shadow-lg"
                      : "bg-surface text-foreground shadow-md border border-border"
                  }`}
                >
                  {msg.content}
                  {msg.timestamp && (
                    <div className={`text-xs mt-1 ${msg.role === "user" ? "text-black/70" : "text-foreground/60"}`}>
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {loading && (
              <div className="flex justify-start animate-in fade-in-0 slide-in-from-bottom-2 duration-300">
                <div className="bg-surface text-foreground px-4 py-3 rounded-2xl text-sm shadow-md border border-border">
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gold rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gold-light rounded-full animate-bounce" style={{animationDelay: "0.1s"}}></div>
                      <div className="w-2 h-2 bg-gold-dark rounded-full animate-bounce" style={{animationDelay: "0.2s"}}></div>
                    </div>
                    <span className="ml-2 text-gold">AI Assistant is thinking...</span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-surface border-t border-border">
            <div className="flex space-x-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about tourism, spa, dining, or any hotel services..."
                className="input-gold flex-1 text-sm"
                disabled={loading}
              />
              <button
                onClick={() => handleSend()}
                disabled={loading || !input.trim()}
                className="btn-gold disabled:opacity-50 disabled:cursor-not-allowed p-3 rounded-2xl transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 shadow-lg"
              >
                <Send size={16} />
              </button>
            </div>
            <p className="text-xs text-foreground/60 mt-2 text-center">
              For immediate assistance, call <span className="text-gold font-semibold">(555) 123-4567</span>
            </p>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-gold text-black p-5 rounded-full shadow-2xl hover:scale-110 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-gold focus:ring-opacity-50 animate-bounce border-4 border-gold-light"
          style={{
            background: "linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FFD700 100%)",
            boxShadow: "0 0 20px rgba(255, 215, 0, 0.8), 0 0 40px rgba(255, 215, 0, 0.4)"
          }}
        >
          <MessageCircle size={28} />
        </button>
      )}
    </div>
  );
}