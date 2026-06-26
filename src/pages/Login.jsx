import React, { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../lib/auth";
import { Loader2 } from "lucide-react";

export default function Login() {
    const { user, login } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [err, setErr] = useState("");
    const [busy, setBusy] = useState(false);
    const nav = useNavigate();

    if (user) return <Navigate to="/admin" replace />;

    const submit = async (e) => {
        e.preventDefault();
        setErr("");
        setBusy(true);
        try {
            await login(email, password);
            nav("/admin");
        } catch (e2) {
            setErr("Invalid credentials.");
        } finally {
            setBusy(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-6 py-16" data-testid="login-page">
            <div className="w-full max-w-md">
                <div className="text-center mb-10">
                    <div className="font-mono text-xs uppercase tracking-[0.4em] text-nzdra-red mb-3">Officials</div>
                    <h1 className="font-display text-5xl uppercase tracking-tighter text-white">Sign In</h1>
                    <p className="mt-3 text-sm text-zinc-400">Track officials, NZDRA admins and local track admins.</p>
                </div>

                <form onSubmit={submit} className="bg-zinc-900 border border-zinc-800 p-8 space-y-5" data-testid="login-form">
                    <div>
                        <label className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            data-testid="login-email"
                            className="mt-2 w-full bg-zinc-950 border border-zinc-700 text-white px-4 py-3 text-sm focus:border-nzdra-red focus:outline-none"
                        />
                    </div>
                    <div>
                        <label className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            data-testid="login-password"
                            className="mt-2 w-full bg-zinc-950 border border-zinc-700 text-white px-4 py-3 text-sm focus:border-nzdra-red focus:outline-none"
                        />
                    </div>
                    {err && <div className="text-sm text-nzdra-red" data-testid="login-error">{err}</div>}
                    <button
                        type="submit"
                        disabled={busy}
                        data-testid="login-submit"
                        className="w-full bg-nzdra-red hover:bg-nzdra-redDark text-white py-3 font-semibold uppercase tracking-widest text-sm active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {busy && <Loader2 size={14} className="animate-spin" />} Sign In
                    </button>
                </form>

                <div className="mt-6 text-center text-xs text-zinc-500 font-mono">
                    Need access? Contact <span className="text-zinc-300">manager@nzdra.co.nz</span>
                </div>
            </div>
        </div>
    );
}
