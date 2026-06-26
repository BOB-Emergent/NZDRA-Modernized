import React, { useState } from "react";
import { api } from "../lib/api";

export default function RacerDashboard() {
    const [memberNum, setMemberNum] = useState("");
    const [racer, setRacer] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); setError(""); setRacer(null);
        try {
            const res = await api.get(`/racers/${memberNum}`);
            setRacer(res.data);
        } catch {
            setError("Member not found.");
        }
        setLoading(false);
    };

    return (
        <div className="max-w-[1100px] mx-auto px-6 md:px-12 py-16">
            <h1 className="font-display text-5xl md:text-7xl uppercase tracking-tighter text-white">Your License</h1>
            <form onSubmit={handleSubmit} className="mt-10 flex gap-4 max-w-md">
                <input 
                    value={memberNum} 
                    onChange={(e) => setMemberNum(e.target.value)} 
                    className="flex-1 px-4 py-3 bg-zinc-900 border border-zinc-700 text-white"
                    placeholder="Member # (e.g. 8027)"
                />
                <button className="bg-nzdra-red px-6 text-white uppercase font-bold">View</button>
            </form>
            {error && <div className="mt-4 text-nzdra-red">{error}</div>}
            {racer && <div className="mt-8 text-white">Welcome, {racer.firstName}!</div>}
        </div>
    );
}
