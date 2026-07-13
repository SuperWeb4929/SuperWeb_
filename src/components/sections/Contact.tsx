import React, { useState } from "react";
import { MessageSquareCode, Send, Mail, MapPin, Shield, Loader2, ExternalLink, Globe, Briefcase, Scale } from "lucide-react";
import Logo from "../Logo";

const WHATSAPP_URL = "https://wa.me/919606664929";

export const Contact = () => {
  const [name, setName] = useState("");
  const [org, setOrg] = useState("");
  const [phone, setPhone] = useState("");
  const [msg, setMsg] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !msg.trim()) return;

    setStatus("submitting");

    try {
      const response = await fetch("https://formspree.io/f/mdarpono", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          name,
          organization: org,
          phone,
          message: msg
        })
      });

      if (response.ok) {
        setStatus("success");
        setName("");
        setOrg("");
        setPhone("");
        setMsg("");
      } else {
        setStatus("error");
      }
    } catch (err) {
      console.error("Form submission failed:", err);
      setStatus("error");
    }
  };

  return (
    <section id="contact" className="relative pt-24 pb-12 bg-[#0A0A0A] text-white border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start mb-20">
          {/* Left Column: Direct Info */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-4">
              <span className="text-xs font-bold tracking-widest text-blue-500 uppercase">
                Get In Touch
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-sans">
                Let's Build Something Great Together
              </h2>
              <p className="text-base text-gray-400">
                Have questions about school portals, custom database integrations, or pricing? Fill out the quick form or jump directly to chat.
              </p>
            </div>

            {/* Direct Contacts List */}
            <div className="space-y-4 text-sm text-gray-300">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-blue-400">
                  <Mail className="w-4 h-4" />
                </div>
                <span>prathap.v5214@gmail.com</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-blue-400">
                  <MapPin className="w-4 h-4" />
                </div>
                <span>Bangalore, Karnataka, India</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-blue-400">
                  <Shield className="w-4 h-4" />
                </div>
                <span>Zero-Code Support Active Global Service</span>
              </div>
            </div>

            {/* Founder details */}
            <div className="p-5 border border-white/5 bg-[#121212]/30 rounded-2xl flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-600/10 flex items-center justify-center text-blue-400 font-extrabold text-lg">
                PV
              </div>
              <div>
                <div className="font-bold text-sm text-white">Prathap V</div>
                <div className="text-xs text-gray-400 mt-0.5">Founder & Lead Architect, SuperWeb</div>
              </div>
            </div>
          </div>

          {/* Right Column: Custom Form */}
          <div className="lg:col-span-7">
            <div className="p-8 border border-white/5 bg-[#121212]/30 rounded-3xl backdrop-blur-md shadow-2xl">
              <h3 className="text-lg font-bold font-sans text-white mb-6">
                Send Project Enquiry
              </h3>
              
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-gray-400 block mb-1.5 font-semibold">Your Name:</label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50"
                      placeholder="e.g. John Doe"
                      disabled={status === "submitting"}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 block mb-1.5 font-semibold">School / Business Name:</label>
                    <input
                      type="text"
                      name="org"
                      value={org}
                      onChange={(e) => setOrg(e.target.value)}
                      className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50"
                      placeholder="e.g. St. Mary Academy"
                      disabled={status === "submitting"}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-gray-400 block mb-1.5 font-semibold">WhatsApp / Contact Phone:</label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50"
                    placeholder="e.g. +91 96066 64929"
                    disabled={status === "submitting"}
                  />
                </div>

                <div>
                  <label className="text-xs text-gray-400 block mb-1.5 font-semibold">Describe Your Project Requirements:</label>
                  <textarea
                    name="message"
                    required
                    value={msg}
                    onChange={(e) => setMsg(e.target.value)}
                    className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 resize-none h-28"
                    placeholder="Describe portal features, pages, or automation rules..."
                    disabled={status === "submitting"}
                  />
                </div>

                {status === "success" && (
                  <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-sm flex items-center gap-3 transition-all duration-300 animate-fadeIn">
                    <span className="flex-shrink-0 w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Thank you! Your enquiry has been sent successfully. We will get back to you soon.</span>
                  </div>
                )}

                {status === "error" && (
                  <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl text-sm flex items-center gap-3 transition-all duration-300 animate-fadeIn">
                    <span className="flex-shrink-0 w-2 h-2 rounded-full bg-rose-400 animate-pulse" />
                    <span>Oops! Something went wrong. Please try again or contact us directly.</span>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-4 pt-2">
                  <button
                    type="submit"
                    disabled={status === "submitting"}
                    className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 disabled:cursor-not-allowed text-white font-semibold py-4 rounded-xl text-sm transition-all duration-300 hover:shadow-[0_0_20px_rgba(37,99,235,0.3)] cursor-pointer"
                  >
                    {status === "submitting" ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Send Enquiry
                      </>
                    )}
                  </button>
                  <a
                    href={WHATSAPP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white border border-white/10 font-semibold py-4 rounded-xl text-sm transition-all duration-300"
                  >
                    <MessageSquareCode className="w-4 h-4 text-blue-400" />
                    Start Quick Chat
                  </a>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* ─── Enhanced Footer ─── */}
        <div className="border-t border-white/5 pt-14">

          {/* Footer grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 pb-14 border-b border-white/5">

            {/* Brand column */}
            <div className="sm:col-span-2 lg:col-span-1">
              <div className="flex items-center gap-3 mb-4">
                <Logo variant="icon" size={36} />
                <div>
                  <div className="font-extrabold text-base tracking-tight text-white">SuperWeb</div>
                  <div className="text-[9px] tracking-[1.5px] uppercase text-gray-600 font-bold">We Build. You Grow.</div>
                </div>
              </div>
              <p className="text-sm text-gray-500 leading-relaxed mb-5 max-w-[240px]">
                Professional digital solutions for businesses, schools, and startups across India.
              </p>
              <div className="inline-flex items-center gap-2 bg-emerald-500/[0.07] border border-emerald-500/20 px-3 py-1.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10.5px] font-bold text-emerald-400 tracking-wide">Active &amp; Accepting Projects</span>
              </div>
            </div>

            {/* Services */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Briefcase className="w-3.5 h-3.5 text-blue-500" />
                <span className="text-[10.5px] font-extrabold tracking-widest uppercase text-gray-600">Services</span>
              </div>
              <ul className="space-y-2.5">
                {[
                  "Website Design",
                  "E-commerce Stores",
                  "PWA Development",
                  "AI Integrations",
                  "Web Hosting & Domains",
                  "SEO Optimization",
                ].map((s) => (
                  <li key={s}>
                    <a href="#services" className="text-sm text-gray-500 hover:text-white transition-colors duration-150 flex items-center gap-1.5 group">
                      <span className="w-1 h-1 rounded-full bg-blue-600/50 group-hover:bg-blue-400 transition-colors" />
                      {s}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Globe className="w-3.5 h-3.5 text-blue-500" />
                <span className="text-[10.5px] font-extrabold tracking-widest uppercase text-gray-600">Company</span>
              </div>
              <ul className="space-y-2.5">
                {[
                  { label: "Home", href: "/" },
                  { label: "Portfolio", href: "#portfolio" },
                  { label: "Pricing", href: "#pricing" },
                  { label: "Contact Us", href: "#contact" },
                  { label: "WhatsApp Chat", href: "https://wa.me/919606664929", external: true },
                ].map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      target={l.external ? "_blank" : undefined}
                      rel={l.external ? "noopener noreferrer" : undefined}
                      className="text-sm text-gray-500 hover:text-white transition-colors duration-150 flex items-center gap-1.5 group"
                    >
                      <span className="w-1 h-1 rounded-full bg-blue-600/50 group-hover:bg-blue-400 transition-colors" />
                      {l.label}
                      {l.external && <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-60 transition-opacity" />}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Scale className="w-3.5 h-3.5 text-blue-500" />
                <span className="text-[10.5px] font-extrabold tracking-widest uppercase text-gray-600">Legal</span>
              </div>
              <ul className="space-y-2.5">
                <li>
                  <a
                    href="/terms.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-400 hover:text-blue-300 transition-colors duration-150 flex items-center gap-1.5 group font-medium"
                  >
                    <span className="w-1 h-1 rounded-full bg-blue-400" />
                    Terms &amp; Conditions
                    <ExternalLink className="w-3 h-3 opacity-60" />
                  </a>
                </li>
                {[
                  { label: "Privacy Policy", href: "#" },
                  { label: "Refund Policy", href: "#" },
                  { label: "Cookie Policy", href: "#" },
                ].map((l) => (
                  <li key={l.label}>
                    <a href={l.href} className="text-sm text-gray-500 hover:text-white transition-colors duration-150 flex items-center gap-1.5 group">
                      <span className="w-1 h-1 rounded-full bg-blue-600/50 group-hover:bg-blue-400 transition-colors" />
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Footer bottom bar */}
          <div className="pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <Logo variant="icon" size={22} />
              <span>&copy; {new Date().getFullYear()} SuperWeb. All rights reserved. Bengaluru, Karnataka, India.</span>
            </div>
            <div className="flex flex-wrap gap-4 text-xs text-gray-600">
              <a
                href="/terms.html"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gray-400 transition-colors flex items-center gap-1"
              >
                Terms &amp; Conditions <ExternalLink className="w-3 h-3" />
              </a>
              <a href="#" className="hover:text-gray-400 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-gray-400 transition-colors">Refund Policy</a>
              <a href="#contact" className="hover:text-gray-400 transition-colors">Contact</a>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Contact;
