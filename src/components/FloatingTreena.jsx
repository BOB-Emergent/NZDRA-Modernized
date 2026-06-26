import React, { useEffect, useRef, useState } from "react";
import { X, Send, Loader2, Sparkles } from "lucide-react";
import { api } from "../lib/api";

export default function FloatingTreena() {
    const [open, setOpen] = useState(false);
    const [sessionId] = useState(() => `floating_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`);
    const [messages, setMessages] = useState([
        { role: "assistant", content: "Kia ora — Treena here, NZDRA Tech Official. Ask me any rule." },
    ]);
    const [input, setInput] = useState("");
    const [sending, setSending] = useState(false);
    const endRef = useRef(null);

    useEffect(() => { 
        if (open) endRef.current?.scrollIntoView({ behavior: "smooth" }); 
    }, [messages, sending, open]);

    const send = async () => {
        if (!input.trim() || sending) return;
        const msg = input.trim();
        setInput("");
        setMessages((m) => [...m, { role: "user", content: msg }]);
        setSending(true);
        try {
            const { data } = await api.post("/chat/rulebook", { session_id: sessionId, message: msg });
            setMessages((m) => [...m, { role: "assistant", content: data?.response || "I couldn't find that in the rulebook right now." }]);
        } catch {
            setMessages((m) => [...m, { role: "assistant", content: "I'm offline right now. Try again shortly." }]);
        } finally { setSending(false); }
    };

    return (
        <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 999999 }} data-testid="floating-trina">
            {open && (
                <div className="flex flex-col bg-zinc-950 border-2 border-nzdra-red rounded-xl shadow-2xl mb-3 overflow-hidden animate-in slide-in-from-bottom-2 duration-300" style={{ width: 360, height: 520 }}>
                    <div className="p-4 bg-nzdra-red flex items-center justify-between">
                        <span className="text-white font-display uppercase tracking-widest text-sm">
                            Treena · NZDRA Tech Official
                        </span>
                        <button onClick={() => setOpen(false)} className="text-white/80 hover:text-white"><X size={20} /></button>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {messages.map((m, i) => (
                            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                                <div className={`max-w-[85%] p-3 text-xs ${m.role === "user" ? "bg-nzdra-red text-white" : "bg-zinc-800 text-zinc-300"}`}>
                                    {m.content}
                                </div>
                            </div>
                        ))}
                        {sending && <div className="text-zinc-500 text-[10px] animate-pulse uppercase tracking-widest font-mono">Thinking...</div>}
                        <div ref={endRef} />
                    </div>
                    <div className="p-3 bg-black/40 border-t border-white/10">
                        <div className="relative flex gap-2">
                            <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} placeholder="Ask a rule..." className="flex-1 bg-zinc-900 border border-zinc-700 text-white px-3 py-2 text-xs focus:outline-none focus:border-nzdra-red" />
                            <button onClick={send} className="bg-nzdra-red p-2 text-white hover:bg-red-700 transition-colors"><Send size={16} /></button>
                        </div>
                    </div>
                </div>
            )}
            {!open && (
                <button 
                    onClick={() => setOpen(true)} 
                    className="group relative w-16 h-16 bg-nzdra-red rounded-full flex items-center justify-center shadow-[0_10px_40px_rgba(220,38,38,0.5)] hover:scale-105 active:scale-95 transition-all"
                >
                    <div className="absolute inset-0 bg-white/20 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300" />
                    <Sparkles size={28} className="text-white" />
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 rounded-full border-2 border-zinc-950 animate-bounce" />
                </button>
            )}
        </div>
    );
}
