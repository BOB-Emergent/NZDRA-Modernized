import React, { useEffect, useRef, useState } from "react";
import { X, Send, Loader2 } from "lucide-react";
import { api } from "../lib/api";

export default function FloatingTreena() {
    const [open, setOpen] = useState(false);
    const [sessionId] = useState(() => `floating_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`);
    const [messages, setMessages] = useState([
        { role: "assistant", content: "Kia ora \u2014 Treena here, NZDRA Tech Official. Ask me any rule." },
    ]);
    const [input, setInput] = useState("");
    const [sending, setSending] = useState(false);
    const endRef = useRef(null);

    useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, sending, open]);

    const send = async () => {
        if (!input.trim() || sending) return;
        const msg = input.trim();
        setInput("");
        setMessages((m) => [...m, { role: "user", content: msg }]);
        setSending(true);
        try {
            const { data } = await api.post("/chat/rulebook", { session_id: sessionId, message: msg });
            setMessages((m) => [...m, { role: "assistant", content: data.response }]);
        } catch {
            setMessages((m) => [...m, { role: "assistant", content: "I'm offline right now. Try again shortly." }]);
        } finally { setSending(false); }
    };

    return (
        <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 9999 }} data-testid="floating-trina">
            {open && (
                <div
                    style={{
                        width: 360, height: 520, backgroundColor: "#0a0a0a",
                        border: "2px solid #dc2626", borderRadius: 12, marginBottom: 12,
                        display: "flex", flexDirection: "column",
                        boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
                    }}
                    data-testid="floating-trina-panel"
                >
                    <div style={{
                        padding: "12px 16px", background: "#dc2626", borderRadius: "10px 10px 0 0",
                        display: "flex", justifyContent: "space-between", alignItems: "center",
                    }}>
                        <span style={{ color: "white", fontWeight: 700, fontFamily: "'Anton', Impact, sans-serif", letterSpacing: 2, textTransform: "uppercase" }}>
                            Treena \u00b7 NZDRA Tech Official
                        </span>
                        <button onClick={() => setOpen(false)} aria-label="Close" style={{ background: "none", border: "none", color: "white", cursor: "pointer", padding: 0 }} data-testid="floating-trina-close">
                            <X size={18} />
                        </button>
                    </div>
                    <div style={{ flex: 1, overflowY: "auto", padding: 14, display: "flex", flexDirection: "column", gap: 8 }}>
                        {messages.map((m, i) => (
                            <div key={i} style={{
                                alignSelf: m.role === "user" ? "flex-end" : "flex-start",
                                maxWidth: "85%",
                                padding: "8px 12px",
                                fontSize: 13,
                                lineHeight: 1.5,
                                color: m.role === "user" ? "#fff" : "#e4e4e7",
                                background: m.role === "user" ? "#27272a" : "#18181b",
                                border: m.role === "user" ? "none" : "1px solid rgba(245,158,11,0.25)",
                            }}>
                                {m.content}
                            </div>
                        ))}
                        {sending && (
                            <div style={{ color: "#a1a1aa", fontSize: 12, display: "flex", alignItems: "center", gap: 6 }}>
                                <Loader2 size={12} className="animate-spin" /> Treena is thinking\u2026
                            </div>
                        )}
                        <div ref={endRef} />
                    </div>
                    <div style={{ borderTop: "1px solid rgba(220,38,38,0.3)", padding: 10, display: "flex", gap: 8 }}>
                        <input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && send()}
                            placeholder="Ask Treena about NZDRA rules\u2026"
                            data-testid="floating-trina-input"
                            style={{
                                flex: 1, background: "#0a0a0a", border: "1px solid #27272a",
                                color: "#fff", padding: "6px 10px", fontSize: 13, outline: "none",
                            }}
                        />
                        <button
                            onClick={send}
                            disabled={!input.trim() || sending}
                            data-testid="floating-trina-send"
                            style={{
                                background: "#f59e0b", border: "none", padding: "0 12px",
                                color: "#000", cursor: input.trim() ? "pointer" : "not-allowed",
                                opacity: input.trim() ? 1 : 0.4,
                            }}
                        >
                            <Send size={14} />
                        </button>
                    </div>
                </div>
            )}
            <button
                onClick={() => setOpen(!open)}
                aria-label={open ? "Close Treena" : "Open Treena"}
                title="Treena \u2014 NZDRA Rulebook AI"
                data-testid="floating-trina-bubble"
                style={{
                    width: 56, height: 56, borderRadius: "50%",
                    background: "#dc2626", border: "2px solid #0a0a0a",
                    cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                    boxShadow: "0 4px 20px rgba(220,38,38,0.5)",
                    transition: "transform 0.15s ease",
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.08)"}
                onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
            >
                {open ? (
                    <X size={24} color="white" />
                ) : (
                    <span style={{ color: "white", fontSize: 26, fontWeight: 900, fontFamily: "'Anton', Impact, sans-serif" }}>T</span>
                )}
            </button>
        </div>
    );
}
