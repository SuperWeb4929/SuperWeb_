import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, User, Send, GraduationCap, Building2, SlidersHorizontal, Sparkles } from "lucide-react";


interface Message {
  sender: "bot" | "user";
  text: string;
}

const schoolSuggestions = [
  "When do admissions start for next academic year?",
  "What is the fee structure and transport options?",
  "Do you offer sports or extra-curricular activities?",
];

const businessSuggestions = [
  "How much does a 5-page business website cost?",
  "How fast can you build a custom school portal?",
  "What is included in the zero-code support plan?",
];

const customSuggestions = [
  "Tell me a joke about web design.",
  "Write a tagline for a science school.",
];

export const AIDemo = () => {
  const [activeMode, setActiveMode] = useState<"school" | "business" | "custom">("school");
  const [customInstruction, setCustomInstruction] = useState("You are a friendly pirate developer assistant.");
  const [messages, setMessages] = useState<Message[]>([
    { sender: "bot", text: "Hello! I am the SuperWeb Admission Assistant. Ask me anything about our school curriculum, transport, or admission guidelines!" }
  ]);
  const [inputVal, setInputVal] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Set initial greeting on mode change
  useEffect(() => {
    if (activeMode === "school") {
      setMessages([
        { sender: "bot", text: "Hello! I am the SuperWeb Admission Assistant. Ask me anything about our school curriculum, transport, or admission guidelines!" }
      ]);
    } else if (activeMode === "business") {
      setMessages([
        { sender: "bot", text: "Hi! I'm the SuperWeb Business Lead Assistant. How can we help you scale your business? Ask about websites, pricing, or custom software!" }
      ]);
    } else {
      setMessages([
        { sender: "bot", text: `Mode initialized with instruction: "${customInstruction}". Go ahead and chat with me!` }
      ]);
    }
  }, [activeMode]);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (messages.length > 1 || isTyping) {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    // Add user message
    setMessages((prev) => [...prev, { sender: "user", text }]);
    setInputVal("");
    setIsTyping(true);

    const historyMessages = [
      ...messages.slice(-6).map((msg) => ({
        role: msg.sender === "bot" ? ("assistant" as const) : ("user" as const),
        content: msg.text,
      })),
      { role: "user", content: text },
    ];

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: historyMessages,
          activeMode,
          customInstruction,
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      const botResponse = data.choices?.[0]?.message?.content || "I ran into an issue processing that query. Please try again or reach out on WhatsApp!";
      setMessages((prev) => [...prev, { sender: "bot", text: botResponse }]);
    } catch (error) {
      console.error("Error communicating with Groq API:", error);
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "I am having trouble connecting to my service right now. Please reach out to Prathap V directly on WhatsApp (9606664929) to discuss!",
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const currentSuggestions =
    activeMode === "school"
      ? schoolSuggestions
      : activeMode === "business"
      ? businessSuggestions
      : customSuggestions;

  return (
    <section id="ai-demo" className="relative py-24 bg-[#0A0A0A] text-white border-t border-white/5">
      <div className="absolute inset-0 bg-gradient-radial from-purple-600/5 via-transparent to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-sans">
            Try Our{" "}
            <span className="bg-gradient-to-r from-blue-500 to-purple-400 bg-clip-text text-transparent">
              Live AI Demo
            </span>
          </h2>
          <p className="text-base sm:text-lg text-gray-400">
            See how our integrated AI agents instantly engage visitors, respond to inquiries, and capture leads 24/7.
          </p>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch max-w-6xl mx-auto">
          {/* Left Column: Mode Selectors */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            <h3 className="text-lg font-bold font-sans text-gray-300 px-1 mb-2">
              Select Demo Assistant Mode
            </h3>

            {/* School Admissions */}
            <button
              onClick={() => setActiveMode("school")}
              className={`p-5 rounded-2xl border text-left flex items-start gap-4 transition-all duration-300 ${
                activeMode === "school"
                  ? "bg-blue-600/10 border-blue-500/50 shadow-[0_0_20px_rgba(37,99,235,0.15)]"
                  : "bg-[#121212]/30 border-white/5 hover:border-white/10 hover:bg-[#121212]/50"
              }`}
            >
              <div className={`p-2.5 rounded-xl ${activeMode === "school" ? "bg-blue-600 text-white" : "bg-white/5 text-gray-400"}`}>
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-sm text-white">School Admissions</div>
                <div className="text-xs text-gray-400 mt-1">Simulates parental enquiries about school guidelines, admission dates, and bus routes.</div>
              </div>
            </button>

            {/* Business Leads */}
            <button
              onClick={() => setActiveMode("business")}
              className={`p-5 rounded-2xl border text-left flex items-start gap-4 transition-all duration-300 ${
                activeMode === "business"
                  ? "bg-blue-600/10 border-blue-500/50 shadow-[0_0_20px_rgba(37,99,235,0.15)]"
                  : "bg-[#121212]/30 border-white/5 hover:border-white/10 hover:bg-[#121212]/50"
              }`}
            >
              <div className={`p-2.5 rounded-xl ${activeMode === "business" ? "bg-blue-600 text-white" : "bg-white/5 text-gray-400"}`}>
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-sm text-white">Business Lead Generator</div>
                <div className="text-xs text-gray-400 mt-1">Simulates prospect client leads asking for design estimates, support, or portal timeline.</div>
              </div>
            </button>

            {/* Custom Workflow */}
            <button
              onClick={() => setActiveMode("custom")}
              className={`p-5 rounded-2xl border text-left flex items-start gap-4 transition-all duration-300 ${
                activeMode === "custom"
                  ? "bg-blue-600/10 border-blue-500/50 shadow-[0_0_20px_rgba(37,99,235,0.15)]"
                  : "bg-[#121212]/30 border-white/5 hover:border-white/10 hover:bg-[#121212]/50"
              }`}
            >
              <div className={`p-2.5 rounded-xl ${activeMode === "custom" ? "bg-blue-600 text-white" : "bg-white/5 text-gray-400"}`}>
                <SlidersHorizontal className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-sm text-white">Custom System Workflow</div>
                <div className="text-xs text-gray-400 mt-1">Write your own system instructions to test custom responses client-side.</div>
              </div>
            </button>

            {/* Custom instruction textarea (only shown when custom mode active) */}
            <AnimatePresence>
              {activeMode === "custom" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden mt-2"
                >
                  <label className="text-xs text-gray-400 block mb-1.5 font-semibold">Custom Persona Instruction:</label>
                  <textarea
                    value={customInstruction}
                    onChange={(e) => setCustomInstruction(e.target.value)}
                    className="w-full bg-[#121212]/60 border border-white/10 rounded-xl p-3 text-xs text-gray-300 focus:outline-none focus:border-blue-500/50 resize-none h-20"
                    placeholder="Enter prompt rules..."
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Column: Chat Box */}
          <div className="lg:col-span-8 flex flex-col min-h-0">
            <div className="border border-white/5 bg-[#121212]/30 rounded-3xl backdrop-blur-md overflow-hidden flex flex-col h-[520px] max-h-[520px] min-h-0 shadow-2xl">
              {/* Chat Header */}
              <div className="p-5 border-b border-white/5 bg-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-blue-600/20 flex items-center justify-center text-blue-400 relative">
                    <Bot className="w-5 h-5" />
                    <span className="w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-[#121212] absolute bottom-0 right-0 animate-pulse" />
                  </div>
                  <div>
                    <div className="font-bold text-sm text-white">
                      {activeMode === "school"
                        ? "School Admissions Assistant"
                        : activeMode === "business"
                        ? "Business Lead Bot"
                        : "Custom AI Persona"}
                    </div>
                    <div className="text-[10px] text-green-400 uppercase tracking-widest font-semibold mt-0.5">Online & Active</div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 bg-white/5 text-gray-300 px-3 py-1 rounded-full text-xs font-semibold">
                  <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                  AI Agent
                </div>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 p-5 overflow-y-auto space-y-4 min-h-0">
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex items-start gap-3 max-w-[85%] ${
                      msg.sender === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs ${
                        msg.sender === "user" ? "bg-white/10 text-white" : "bg-blue-600/10 text-blue-400"
                      }`}
                    >
                      {msg.sender === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                    </div>
                    <div
                      className={`p-4 rounded-2xl text-sm leading-relaxed ${
                        msg.sender === "user"
                          ? "bg-blue-600 text-white rounded-tr-none"
                          : "bg-white/5 text-gray-300 border border-white/5 rounded-tl-none"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}

                {/* Typing Indicator */}
                {isTyping && (
                  <div className="flex items-start gap-3 mr-auto max-w-[85%]">
                    <div className="w-8 h-8 rounded-full bg-blue-600/10 text-blue-400 flex items-center justify-center shrink-0">
                      <Bot className="w-4 h-4" />
                    </div>
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5 rounded-tl-none flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Suggestions chips */}
              <div className="px-5 py-3 border-t border-white/5 bg-white/[0.02] flex items-center gap-2 overflow-x-auto whitespace-nowrap scrollbar-none">
                {currentSuggestions.map((sug) => (
                  <button
                    key={sug}
                    onClick={() => handleSendMessage(sug)}
                    className="text-[11px] font-semibold bg-white/5 hover:bg-white/10 border border-white/5 text-gray-300 px-3 py-1.5 rounded-full transition-colors duration-200 cursor-pointer shrink-0"
                  >
                    {sug}
                  </button>
                ))}
              </div>

              {/* Chat Input */}
              <div className="p-4 border-t border-white/5 bg-white/5 flex gap-2">
                <input
                  type="text"
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage(inputVal)}
                  className="flex-1 bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50"
                  placeholder="Type a custom query here..."
                />
                <button
                  onClick={() => handleSendMessage(inputVal)}
                  className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-3 rounded-xl flex items-center justify-center transition-colors duration-200"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AIDemo;
