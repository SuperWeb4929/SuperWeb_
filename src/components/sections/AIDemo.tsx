import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bot,
  User,
  Send,
  GraduationCap,
  Building2,
  SlidersHorizontal,
  Sparkles,
  Mic,
  MicOff,
  Paperclip,
  Zap,
  Gauge,
  MessageSquare,
  Download,
  Copy,
  Check,
  X,
  MessageCircle,
  Loader2,
  ChevronDown,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Message {
  id: string;
  sender: "bot" | "user";
  text: string;
  timestamp: number;
  streaming?: boolean;
  latencyMs?: number;
  tokensEst?: number;
}

type Mode = "school" | "business" | "custom";

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

// ---------------------------------------------------------------------------
// Static config
// ---------------------------------------------------------------------------

const WHATSAPP_NUMBER = "9606664929";
const WHATSAPP_LINK = `https://wa.me/91${WHATSAPP_NUMBER}`;

const modelOptions = [
  { id: "llama-3.3-70b-versatile", label: "Llama 3.3 70B", desc: "Highest quality" },
  { id: "llama-3.1-8b-instant", label: "Llama 3.1 8B", desc: "Fastest response" },
];

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

const modeMeta: Record<Mode, { label: string; sub: string; icon: typeof GraduationCap; ring: string; chip: string }> = {
  school: {
    label: "School Admissions",
    sub: "Simulates parental enquiries about school guidelines, admission dates, and bus routes.",
    icon: GraduationCap,
    ring: "from-blue-500 to-cyan-400",
    chip: "bg-blue-600/10 border-blue-500/50 shadow-[0_0_20px_rgba(37,99,235,0.15)]",
  },
  business: {
    label: "Business Lead Generator",
    sub: "Simulates prospect client leads asking for design estimates, support, or portal timeline.",
    icon: Building2,
    ring: "from-violet-500 to-fuchsia-400",
    chip: "bg-violet-600/10 border-violet-500/50 shadow-[0_0_20px_rgba(139,92,246,0.15)]",
  },
  custom: {
    label: "Custom System Workflow",
    sub: "Write your own system instructions and tune the model to test custom responses.",
    icon: SlidersHorizontal,
    ring: "from-cyan-400 to-emerald-400",
    chip: "bg-cyan-500/10 border-cyan-400/50 shadow-[0_0_20px_rgba(34,211,238,0.15)]",
  },
};

const LEAD_INTENT_REGEX =
  /\b(price|pricing|cost|quote|call me|call back|contact|whatsapp|consult|consultation|book|meeting|talk to (a )?human|speak to someone|demo)\b/i;

const greetingFor = (mode: Mode, customInstruction: string) => {
  if (mode === "school") {
    return "Hello! I am the SuperWeb Admission Assistant. Ask me anything about our school curriculum, transport, or admission guidelines!";
  }
  if (mode === "business") {
    return "Hi! I'm the SuperWeb Business Lead Assistant. How can we help you scale your business? Ask about websites, pricing, or custom software!";
  }
  return `Mode initialized with instruction: "${customInstruction}". Go ahead and chat with me!`;
};

const systemPromptFor = (mode: Mode, customInstruction: string) => {
  if (mode === "school") {
    return "You are the SuperWeb Admissions Assistant for a premium academy. Answer the user's questions about admissions guidelines, curriculum options, bus routes, facilities, and academic requirements. Keep your answers brief (under 3 sentences), highly professional, polite, and encouraging. Suggest contacting Prathap V on WhatsApp at 9606664929 for scheduling a campus visit.";
  }
  if (mode === "business") {
    return "You are the SuperWeb Business Lead Assistant. Your goal is to showcase SuperWeb's digital services (websites, custom school portals, apps, AI chatbot workflows) and help capture the user's interest. Keep responses under 3 sentences. Be extremely helpful, clear, and proactive in suggesting booking a 10-minute consultation call with our founder Prathap V (WhatsApp: 9606664929).";
  }
  return customInstruction || "You are a helpful assistant.";
};

// ---------------------------------------------------------------------------
// Markdown-lite renderer
// ---------------------------------------------------------------------------

const renderMessageText = (text: string) => {
  return text.split("\n").map((line, index) => {
    if (line.trim() === "") return <div key={index} className="h-2" />;
    const regex = /(\*\*.*?\*\*)/g;

    const renderParts = (content: string) =>
      content.split(regex).map((part, i) =>
        part.startsWith("**") && part.endsWith("**") ? (
          <strong key={i} className="font-bold text-white">
            {part.slice(2, -2)}
          </strong>
        ) : (
          part
        )
      );

    if (line.trim().startsWith("- ")) {
      return (
        <div
          key={index}
          className="pl-5 mb-2 relative before:content-['•'] before:absolute before:left-1 before:text-blue-400 before:font-bold text-gray-300 leading-relaxed"
        >
          {renderParts(line.trim().slice(2))}
        </div>
      );
    }

    const numMatch = line.trim().match(/^(\d+\.)\s+(.*)/);
    if (numMatch) {
      return (
        <div key={index} className="flex gap-2 pl-1 mb-2 text-gray-300 leading-relaxed">
          <span className="font-bold text-blue-400 shrink-0 select-none font-mono">{numMatch[1]}</span>
          <div>{renderParts(numMatch[2])}</div>
        </div>
      );
    }

    return (
      <p key={index} className="mb-2 text-gray-300 last:mb-0 leading-relaxed">
        {renderParts(line)}
      </p>
    );
  });
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export const AIDemo = () => {
  const [activeMode, setActiveMode] = useState<Mode>("school");
  const [customInstruction, setCustomInstruction] = useState("You are a friendly pirate developer assistant.");
  const [messages, setMessages] = useState<Message[]>([
    { id: "greet-0", sender: "bot", text: greetingFor("school", ""), timestamp: Date.now() },
  ]);
  const [inputVal, setInputVal] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [listening, setListening] = useState(false);
  const [leadIntentId, setLeadIntentId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [selectedModel, setSelectedModel] = useState(modelOptions[0].id);
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(200);

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const messagesRef = useRef<Message[]>(messages);
  const streamIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const recognitionRef = useRef<any>(null);

  const speechSupported = typeof window !== "undefined" && (window.SpeechRecognition || window.webkitSpeechRecognition);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  // Reset greeting + clear in-flight streaming whenever mode changes
  useEffect(() => {
    if (streamIntervalRef.current) clearInterval(streamIntervalRef.current);
    setIsTyping(false);
    setLeadIntentId(null);
    setMessages([{ id: `greet-${Date.now()}`, sender: "bot", text: greetingFor(activeMode, customInstruction), timestamp: Date.now() }]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeMode]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({ top: chatContainerRef.current.scrollHeight, behavior: "smooth" });
    }
  }, [messages, isTyping]);

  useEffect(() => {
    return () => {
      if (streamIntervalRef.current) clearInterval(streamIntervalRef.current);
      recognitionRef.current?.stop?.();
    };
  }, []);

  const streamText = useCallback((id: string, fullText: string) => {
    let i = 0;
    if (streamIntervalRef.current) clearInterval(streamIntervalRef.current);
    streamIntervalRef.current = setInterval(() => {
      i += 3;
      setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, text: fullText.slice(0, i) } : m)));
      if (i >= fullText.length) {
        if (streamIntervalRef.current) clearInterval(streamIntervalRef.current);
        setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, text: fullText, streaming: false } : m)));
      }
    }, 14);
  }, []);

  const handleSendMessage = async (rawText: string) => {
    const text = rawText.trim();
    if (!text || isTyping) return;

    const userMsg: Message = { id: `u-${Date.now()}`, sender: "user", text, timestamp: Date.now() };
    setMessages((prev) => [...prev, userMsg]);
    setInputVal("");
    setLeadIntentId(LEAD_INTENT_REGEX.test(text) ? userMsg.id : null);
    setIsTyping(true);

    const history = [
      ...messagesRef.current.slice(-6).map((m) => ({
        role: m.sender === "bot" ? ("assistant" as const) : ("user" as const),
        content: m.text,
      })),
      { role: "user", content: text },
    ];

    const apiMessages = [{ role: "system", content: systemPromptFor(activeMode, customInstruction) }, ...history];
    const start = performance.now();

    try {
      const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
      if (!GROQ_API_KEY) throw new Error("API key not configured");

      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: { Authorization: `Bearer ${GROQ_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          model: selectedModel,
          messages: apiMessages,
          max_tokens: maxTokens,
          temperature,
        }),
      });

      if (!response.ok) throw new Error(`API error: ${response.status}`);

      const data = await response.json();
      const botResponse: string =
        data.choices?.[0]?.message?.content || "I ran into an issue processing that query. Please try again or reach out on WhatsApp!";
      const latencyMs = Math.round(performance.now() - start);
      const botId = `b-${Date.now()}`;

      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        { id: botId, sender: "bot", text: "", timestamp: Date.now(), streaming: true, latencyMs, tokensEst: Math.round(botResponse.length / 4) },
      ]);
      streamText(botId, botResponse);
    } catch (error) {
      console.error("Error communicating with Groq API:", error);
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: `b-err-${Date.now()}`,
          sender: "bot",
          text: "I am having trouble connecting right now. Please reach out to Prathap V directly on WhatsApp (9606664929)!",
          timestamp: Date.now(),
        },
      ]);
    }
  };

  const toggleVoice = () => {
    const Ctor = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Ctor) return;
    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);
      return;
    }
    const recognition = new Ctor();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.onresult = (e: any) => {
      const transcript = e.results?.[0]?.[0]?.transcript;
      if (transcript) setInputVal(transcript);
    };
    recognition.onerror = () => setListening(false);
    recognition.onend = () => setListening(false);
    recognitionRef.current = recognition;
    recognition.start();
    setListening(true);
  };

  const copyMessage = (id: string, text: string) => {
    navigator.clipboard?.writeText(text).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1500);
    });
  };

  const exportTranscript = () => {
    const lines = messages
      .map((m) => `[${new Date(m.timestamp).toLocaleTimeString()}] ${m.sender === "user" ? "You" : "Assistant"}: ${m.text}`)
      .join("\n");
    const blob = new Blob([lines], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "superweb-chat-transcript.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  const lastCompletedBot = useMemo(() => [...messages].reverse().find((m) => m.sender === "bot" && m.latencyMs && !m.streaming), [messages]);
  const tokensPerSec = lastCompletedBot?.latencyMs && lastCompletedBot?.tokensEst ? (lastCompletedBot.tokensEst / (lastCompletedBot.latencyMs / 1000)).toFixed(1) : null;
  const userMessageCount = messages.filter((m) => m.sender === "user").length;

  const currentSuggestions = activeMode === "school" ? schoolSuggestions : activeMode === "business" ? businessSuggestions : customSuggestions;
  const currentModel = modelOptions.find((m) => m.id === selectedModel) ?? modelOptions[0];
  const meta = modeMeta[activeMode];

  return (
    <section id="ai-demo" className="relative py-24 bg-[#060608] text-white border-t border-white/5 overflow-hidden">
      {/* Aurora background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-24 left-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px]" />
        <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-violet-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-1/3 w-[350px] h-[350px] bg-cyan-500/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest text-cyan-300/80 bg-cyan-400/5 border border-cyan-400/20 rounded-full px-3 py-1 mb-2">
            <Zap className="w-3 h-3" />
            Live telemetry · Voice input · Tunable model
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-sans">
            Try Our{" "}
            <span className="bg-gradient-to-r from-blue-500 to-purple-400 bg-clip-text text-transparent">Live AI Demo</span>
          </h2>
          <p className="text-base sm:text-lg text-gray-400">
            See how our integrated AI agents instantly engage visitors, respond to inquiries, and capture leads 24/7.
          </p>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-6xl mx-auto">
          {/* Left Column */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            <h3 className="text-lg font-bold font-sans text-gray-300 px-1 mb-1">Select Demo Assistant Mode</h3>

            {(Object.keys(modeMeta) as Mode[]).map((m) => {
              const Icon = modeMeta[m].icon;
              const active = activeMode === m;
              return (
                <button
                  key={m}
                  onClick={() => setActiveMode(m)}
                  className={`p-5 rounded-2xl border text-left flex items-start gap-4 transition-all duration-300 ${
                    active ? modeMeta[m].chip : "bg-[#121212]/30 border-white/5 hover:border-white/10 hover:bg-[#121212]/50"
                  }`}
                >
                  <div
                    className={`p-2.5 rounded-xl bg-gradient-to-br ${active ? modeMeta[m].ring : "from-white/5 to-white/5"} ${
                      active ? "text-white" : "text-gray-400"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-sm text-white">{modeMeta[m].label}</div>
                    <div className="text-xs text-gray-400 mt-1">{modeMeta[m].sub}</div>
                  </div>
                </button>
              );
            })}

            <AnimatePresence>
              {activeMode === "custom" && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
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

            {/* Model & Tuning panel */}
            <div className="mt-2 p-5 rounded-2xl border border-white/5 bg-[#121212]/30 space-y-4">
              <div className="flex items-center gap-2 text-sm font-bold text-gray-300">
                <SlidersHorizontal className="w-4 h-4 text-cyan-300" />
                Model &amp; Tuning
              </div>

              <div className="space-y-1.5">
                <div className="text-[11px] uppercase tracking-wider text-gray-500 font-semibold">Model</div>
                <div className="grid grid-cols-2 gap-2">
                  {modelOptions.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setSelectedModel(m.id)}
                      className={`text-left px-3 py-2 rounded-xl border text-[11px] font-semibold transition-colors ${
                        selectedModel === m.id ? "bg-blue-600/15 border-blue-500/50 text-white" : "bg-white/5 border-white/5 text-gray-400 hover:border-white/10"
                      }`}
                    >
                      <div>{m.label}</div>
                      <div className="text-[10px] font-normal text-gray-500 mt-0.5">{m.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-[11px] uppercase tracking-wider text-gray-500 font-semibold">
                  <span>Creativity</span>
                  <span className="text-cyan-300 font-mono">{temperature.toFixed(1)}</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.1}
                  value={temperature}
                  onChange={(e) => setTemperature(parseFloat(e.target.value))}
                  className="w-full accent-blue-500"
                />
                <div className="flex justify-between text-[10px] text-gray-500">
                  <span>Precise</span>
                  <span>Creative</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-[11px] uppercase tracking-wider text-gray-500 font-semibold">
                  <span>Response length</span>
                  <span className="text-cyan-300 font-mono">{maxTokens}t</span>
                </div>
                <input
                  type="range"
                  min={80}
                  max={400}
                  step={20}
                  value={maxTokens}
                  onChange={(e) => setMaxTokens(parseInt(e.target.value))}
                  className="w-full accent-blue-500"
                />
                <div className="flex justify-between text-[10px] text-gray-500">
                  <span>Concise</span>
                  <span>Detailed</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Chat */}
          <div className="lg:col-span-8 flex flex-col min-h-0">
            <div className="border border-white/5 bg-[#121212]/30 rounded-3xl backdrop-blur-md overflow-hidden flex flex-col h-[600px] max-h-[600px] min-h-0 shadow-2xl">
              {/* Chat Header */}
              <div className="p-5 border-b border-white/5 bg-white/5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${meta.ring} flex items-center justify-center text-white relative shrink-0`}>
                    <Bot className="w-5 h-5" />
                    <span className="w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-[#121212] absolute bottom-0 right-0 animate-pulse" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold text-sm text-white truncate">{meta.label} Assistant</div>
                    <div className="text-[10px] text-green-400 uppercase tracking-widest font-semibold mt-0.5">Online &amp; Active</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <div className="hidden sm:flex items-center gap-1.5 bg-white/5 text-gray-300 px-3 py-1 rounded-full text-[11px] font-semibold font-mono">
                    {currentModel.label}
                  </div>
                  <div className="flex items-center gap-1.5 bg-white/5 text-gray-300 px-3 py-1 rounded-full text-xs font-semibold">
                    <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                    AI Agent
                  </div>
                </div>
              </div>

              {/* Telemetry strip */}
              <div className="px-5 py-2.5 border-b border-white/5 bg-black/20 flex items-center gap-4 text-[11px] font-mono text-gray-400 overflow-x-auto">
                <div className="flex items-center gap-1.5 shrink-0">
                  <Zap className="w-3.5 h-3.5 text-cyan-300" />
                  <span>{lastCompletedBot?.latencyMs ? `${lastCompletedBot.latencyMs}ms latency` : "— latency"}</span>
                </div>
                <div className="w-px h-3 bg-white/10 shrink-0" />
                <div className="flex items-center gap-1.5 shrink-0">
                  <Gauge className="w-3.5 h-3.5 text-cyan-300" />
                  <span>{tokensPerSec ? `${tokensPerSec} tok/s` : "— tok/s"}</span>
                </div>
                <div className="w-px h-3 bg-white/10 shrink-0" />
                <div className="flex items-center gap-1.5 shrink-0">
                  <MessageSquare className="w-3.5 h-3.5 text-cyan-300" />
                  <span>{userMessageCount} messages</span>
                </div>
                <button onClick={exportTranscript} className="ml-auto flex items-center gap-1.5 text-gray-400 hover:text-white transition-colors shrink-0">
                  <Download className="w-3.5 h-3.5" />
                  Export
                </button>
              </div>

              {/* Messages */}
              <div ref={chatContainerRef} className="flex-1 p-5 overflow-y-auto space-y-4 min-h-0">
                {messages.map((msg) => (
                  <div key={msg.id}>
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25 }}
                      className={`group flex items-start gap-3 max-w-[85%] ${msg.sender === "user" ? "ml-auto flex-row-reverse" : "mr-auto"}`}
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs ${
                          msg.sender === "user" ? "bg-white/10 text-white" : "bg-blue-600/10 text-blue-400"
                        }`}
                      >
                        {msg.sender === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                      </div>
                      <div className="min-w-0">
                        <div
                          className={`p-4 rounded-2xl text-sm leading-relaxed ${
                            msg.sender === "user" ? "bg-blue-600 text-white rounded-tr-none" : "bg-white/5 text-gray-300 border border-white/5 rounded-tl-none"
                          }`}
                        >
                          {msg.sender === "user" ? (
                            msg.text
                          ) : (
                            <>
                              {renderMessageText(msg.text)}
                              {msg.streaming && <span className="inline-block w-1.5 h-4 bg-cyan-300 ml-0.5 align-middle animate-pulse" />}
                            </>
                          )}
                        </div>
                        <div className={`flex items-center gap-2 mt-1 px-1 text-[10px] text-gray-500 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                          <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                          {msg.sender === "bot" && msg.text && !msg.streaming && (
                            <button
                              onClick={() => copyMessage(msg.id, msg.text)}
                              className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 hover:text-gray-300"
                            >
                              {copiedId === msg.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                            </button>
                          )}
                        </div>
                      </div>
                    </motion.div>

                    {leadIntentId === msg.id && (
                      <motion.div
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-3 ml-11 max-w-[85%] p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-3"
                      >
                        <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                        <div className="text-xs text-emerald-200 flex-1">
                          Looks like you want specifics — Prathap V can jump on WhatsApp right now.
                        </div>
                        <a
                          href={WHATSAPP_LINK}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[11px] font-semibold bg-emerald-500 hover:bg-emerald-400 text-black px-3 py-1.5 rounded-full transition-colors shrink-0"
                        >
                          Chat now
                        </a>
                        <button onClick={() => setLeadIntentId(null)} className="text-emerald-300/60 hover:text-emerald-200 shrink-0">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </motion.div>
                    )}
                  </div>
                ))}

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
              </div>

              {/* Suggestions */}
              <div className="px-5 py-3 border-t border-white/5 bg-white/[0.02] flex items-center gap-2 overflow-x-auto whitespace-nowrap scrollbar-none">
                {currentSuggestions.map((sug) => (
                  <button
                    key={sug}
                    onClick={() => handleSendMessage(sug)}
                    disabled={isTyping}
                    className="text-[11px] font-semibold bg-white/5 hover:bg-white/10 border border-white/5 text-gray-300 px-3 py-1.5 rounded-full transition-colors duration-200 cursor-pointer shrink-0 disabled:opacity-40"
                  >
                    {sug}
                  </button>
                ))}
              </div>

              {/* Input */}
              <div className="p-4 border-t border-white/5 bg-white/5 flex items-center gap-2">
                <button
                  disabled
                  title="File attachments coming soon"
                  className="p-3 rounded-xl bg-white/5 text-gray-500 border border-white/5 cursor-not-allowed shrink-0"
                >
                  <Paperclip className="w-4 h-4" />
                </button>
                <button
                  onClick={toggleVoice}
                  title={speechSupported ? "Speak your question" : "Voice input not supported in this browser"}
                  disabled={!speechSupported}
                  className={`p-3 rounded-xl border transition-colors shrink-0 ${
                    listening
                      ? "bg-red-500/20 border-red-500/40 text-red-300 animate-pulse"
                      : "bg-white/5 border-white/5 text-gray-300 hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed"
                  }`}
                >
                  {listening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>
                <input
                  type="text"
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage(inputVal)}
                  placeholder={listening ? "Listening..." : "Type a custom query here..."}
                  className="flex-1 bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 min-w-0"
                />
                <button
                  onClick={() => handleSendMessage(inputVal)}
                  disabled={isTyping || !inputVal.trim()}
                  className="bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:hover:bg-blue-600 text-white px-4 py-3 rounded-xl flex items-center justify-center transition-colors duration-200 shrink-0"
                >
                  {isTyping ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between mt-2 px-1 text-[11px] text-gray-500">
              <span>Powered by Groq · {currentModel.label}</span>
              <span className="flex items-center gap-1">
                <ChevronDown className="w-3 h-3 rotate-180" />
                Tune model behavior on the left
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AIDemo;
