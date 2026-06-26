import React, { useEffect, useMemo, useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { api } from "../lib/api";
import { Search, Send, Sparkles, Loader2, FileDown } from "lucide-react";

const RULEBOOK_PDF_URL = "https://www.nzdra.co.nz/images/NZDRA_Rule_Book_25-26_clean_v3a.pdf";

export default function RuleBook() {
    const [searchParams] = useSearchParams();
    const isEmbed = searchParams.get("embed") === "1";
    const [q, setQ] = useState("");
    const [rules, setRules] = useState([]);
    const [expanded, setExpanded] = useState(null);

    // chat state
    const [sessionId] = useState(() => `sess_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`);
    const [messages, setMessages] = useState([
        { role: "assistant", content: "Kia ora — Treena here, NZDRA Tech Official. Ask me about classifications, safety specs, licencing, or recent race results. I'll cite the rule section." },
    ]);
    const [input, setInput] = useState("");
    const [sending, setSending] = useState(false);
    const chatEnd = useRef(null);

    useEffect(() => {
        api.get("/rules", { params: { q: q || undefined } }).then((r) => setRules(r.data));
    }, [q]);

    useEffect(() => {
        chatEnd.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, sending]);

    const grouped = useMemo(() => {
        const map = {};
        rules.forEach((r) => {
            map[r.section] = map[r.section] || [];
            map[r.section].push(r);
        });
        return map;
    }, [rules]);

    const send = async () => {
        if (!input.trim() || sending) return;
        const userMsg = input.trim();
        setInput("");
        setMessages((m) => [...m, { role: "user", content: userMsg }]);
        setSending(true);
        try {
            const { data } = await api.post("/chat/rulebook", { session_id: sessionId, message: userMsg });
            setMessages((m) => [...m, { role: "assistant", content: data.response }]);
        } catch (e) {
            setMessages((m) => [...m, { role: "assistant", content: "Sorry, the assistant is unavailable right now. Please try again shortly." }]);
        } finally {
            setSending(false);
        }
    };

    return (
        <div className={isEmbed ? "p-4 bg-zinc-950 min-h-screen" : "max-w-[1400px] mx-auto px-6 md:px-12 py-16"} data-testid="rulebook-page">
            {!isEmbed && (
            <>
            <div className="font-mono text-xs uppercase tracking-[0.4em] text-nzdra-red mb-3">The Book</div>
            <h1 className="font-display text-5xl md:text-7xl uppercase tracking-tighter text-white">Rulebook</h1>
            <p className="mt-4 text-zinc-400 max-w-2xl">
                Search the official NZDRA regulations or ask the AI assistant to explain rules and answer questions about recent results.
            </p>

            {/* Official PDF download — prominent, top of page */}
            <div className="mt-6 flex flex-wrap items-center gap-3" data-testid="rulebook-pdf-cta">
                <a
                    href={RULEBOOK_PDF_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                    data-testid="rulebook-download-pdf"
                    className="group inline-flex items-center gap-3 bg-nzdra-red hover:bg-nzdra-redDark text-white px-6 py-3 font-semibold uppercase tracking-wider active:scale-95 transition-all"
                >
                    <FileDown size={18} />
                    Download Full Rule Book (PDF)
                    <span className="font-mono text-[10px] tracking-widest opacity-70 hidden sm:inline">2025/26</span>
                </a>
                <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">
                    Official NZDRA · v3a · opens in new tab
                </span>
            </div>
            </>
            )}

            <div className={isEmbed ? "" : "mt-12 grid lg:grid-cols-5 gap-8"}>
                {/* Rule list */}
                {!isEmbed && (
                <div className="lg:col-span-3" data-testid="rulebook-list">
                    <div className="relative mb-6">
                        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
                        <input
                            type="text"
                            value={q}
                            onChange={(e) => setQ(e.target.value)}
                            placeholder="Search by keyword or section…"
                            data-testid="rulebook-search-input"
                            className="w-full bg-zinc-900 border border-zinc-800 text-white pl-12 pr-4 py-4 focus:border-nzdra-red focus:outline-none transition-colors"
                        />
                    </div>

                    <div className="space-y-6">
                        {Object.entries(grouped).map(([section, items]) => (
                            <div key={section} className="border-l border-zinc-800 pl-6">
                                <h2 className="font-mono text-[10px] uppercase tracking-[0.3em] text-nzdra-red mb-4">Section {section}</h2>
                                <div className="space-y-3">
                                    {items.map((r) => (
                                        <div key={r.id} className="group">
                                            <button
                                                onClick={() => setExpanded(expanded === r.id ? null : r.id)}
                                                className="w-full text-left bg-zinc-900/50 hover:bg-zinc-900 border border-zinc-800 p-4 transition-colors"
                                            >
                                                <div className="flex items-center justify-between">
                                                    <span className="font-display text-lg uppercase tracking-tight text-white">{r.title}</span>
                                                    <span className="font-mono text-[10px] text-zinc-600">{r.code}</span>
                                                </div>
                                                {expanded === r.id && (
                                                    <div className="mt-4 pt-4 border-t border-white/5 text-sm text-zinc-400 leading-relaxed">
                                                        {r.content}
                                                    </div>
                                                )}
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                        {rules.length === 0 && <div className="py-12 text-center text-zinc-600">No rules matching your search.</div>}
                    </div>
                </div>
                )}

                {/* AI Assistant */}
                <div className={isEmbed ? "" : "lg:col-span-2"}>
                    <div className="sticky top-24 bg-zinc-900 border border-amber-500/30 flex flex-col h-[650px]" data-testid="rulebook-ai-chat">
                        <div className="p-4 border-b border-white/5 bg-black flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-amber-500 blur-md opacity-20 animate-pulse" />
                                    <Sparkles size={20} className="text-amber-500 relative" />
                                </div>
                                <div>
                                    <div className="text-xs font-mono uppercase tracking-widest text-white">Treena</div>
                                    <div className="text-[10px] text-zinc-500">NZDRA Tech Assistant</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="h-1.5 w-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                                <span className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest">Online</span>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                            {messages.map((m, i) => (
                                <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                                    <div className={`max-w-[85%] p-3 text-xs leading-relaxed ${
                                        m.role === "user" 
                                            ? "bg-nzdra-red text-white ml-8"
                                            : "bg-zinc-800 text-zinc-300 mr-8"
                                    }`}>
                                        {m.content}
                                    </div>
                                </div>
                            ))}
                            {sending && (
                                <div className="flex justify-start">
                                    <div className="bg-zinc-800 p-3 flex items-center gap-2">
                                        <Loader2 size={14} className="animate-spin text-amber-500" />
                                        <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest animate-pulse">Thinking…</span>
                                    </div>
                                </div>
                            )}
                            <div ref={chatEnd} />
                        </div>

                        <div className="p-4 border-t border-white/5 bg-black/40">
                            <div className="relative">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && send()}
                                    placeholder="Ask about safety, classes, results…"
                                    className="w-full bg-zinc-950 border border-zinc-800 text-xs text-white pl-4 pr-10 py-3 focus:border-amber-500/50 focus:outline-none transition-all"
                                />
                                <button
                                    onClick={send}
                                    disabled={sending || !input.trim()}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-amber-500 hover:text-amber-400 disabled:opacity-30 transition-colors"
                                >
                                    <Send size={16} />
                                </button>
                            </div>
                            <p className="mt-3 text-[9px] text-zinc-600 leading-tight">
                                Treena uses the 2025/26 rulebook. AI can make mistakes — always verify critical safety specs with a Tech Official.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
