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

    const [sessionId] = useState(() => `sess_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`);
    const [messages, setMessages] = useState([
        { role: "assistant", content: "Kia ora — Treena here, NZDRA Tech Official. Ask me about classifications, safety specs, licencing, or recent race results. I'll cite the rule section." },
    ]);
    const [input, setInput] = useState("");
    const [sending, setSending] = useState(false);
    const chatEnd = useRef(null);

    useEffect(() => {
        api.get("/rules", { params: { q: q || undefined } })
            .then((r) => setRules(Array.isArray(r.data) ? r.data : []))
            .catch(() => setRules([]));
    }, [q]);

    useEffect(() => {
        chatEnd.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, sending]);

    const grouped = useMemo(() => {
        const map = {};
        (Array.isArray(rules) ? rules : []).forEach((r) => {
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
            <div className="mt-6 flex flex-wrap items-center gap-3">
                <a href={RULEBOOK_PDF_URL} target="_blank" rel="noopener noreferrer" download className="group inline-flex items-center gap-3 bg-nzdra-red hover:bg-nzdra-redDark text-white px-6 py-3 font-semibold uppercase tracking-wider active:scale-95 transition-all">
                    <FileDown size={18} /> Download Full Rule Book (PDF)
                </a>
            </div>
            </>
            )}

            <div className={isEmbed ? "" : "mt-12 grid lg:grid-cols-5 gap-8"}>
                <div className="lg:col-span-3">
                    <div className="relative mb-6">
                        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
                        <input
                            type="text"
                            value={q}
                            onChange={(e) => setQ(e.target.value)}
                            placeholder="Search by keyword or section…"
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
                                            <button onClick={() => setExpanded(expanded === r.id ? null : r.id)} className="w-full text-left bg-zinc-900/50 hover:bg-zinc-900 border border-zinc-800 p-4 transition-colors">
                                                <div className="flex items-center justify-between">
                                                    <span className="font-display text-lg uppercase tracking-tight text-white">{r.title}</span>
                                                    <span className="font-mono text-[10px] text-zinc-600">{r.code}</span>
                                                </div>
                                                {expanded === r.id && <div className="mt-4 pt-4 border-t border-white/5 text-sm text-zinc-400 leading-relaxed">{r.content}</div>}
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
