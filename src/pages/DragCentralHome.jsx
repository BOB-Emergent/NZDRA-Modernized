import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, MapPin, Calendar, Trophy } from "lucide-react";

export default function DragCentralHome() {
    return (
        <div data-testid="dragcentral-home">
            <section className="relative overflow-hidden border-b border-white/10">
                <div className="absolute inset-x-0 top-0 h-2 bg-gradient-to-r from-cyan-400 via-amber-400 to-nzdra-red" />
                <div
                    className="absolute inset-0 opacity-20"
                    style={{ backgroundImage: "repeating-linear-gradient(135deg, #22d3ee 0, #22d3ee 1px, transparent 1px, transparent 16px)" }}
                />
                <div className="relative max-w-[1400px] mx-auto px-6 md:px-12 py-24">
                    <div className="font-mono text-xs uppercase tracking-[0.4em] text-cyan-400 mb-3">
                        DragCentral \u00b7 Global Drag Racing Directory
                    </div>
                    <h1 className="font-display text-5xl md:text-7xl uppercase tracking-tighter text-white">
                        Every strip,<br />every sanction.
                    </h1>
                    <p className="mt-6 text-lg text-zinc-300 max-w-2xl">
                        DragCentral is the neutral cross-body directory for drag racing in Aotearoa \u2014 NZDRA, IHRA, unsanctioned and independent strips treated equally.
                        Built sanction-agnostic so we can expand into Australia (ANDRA) and beyond without friction.
                    </p>
                    <div className="mt-10 flex flex-wrap gap-4">
                        <Link
                            to="/dragcentral/tracks"
                            data-testid="dc-cta-tracks"
                            className="group inline-flex items-center gap-3 bg-cyan-500 text-black px-7 py-4 font-semibold uppercase tracking-wider hover:bg-cyan-400 active:scale-95 transition-all"
                        >
                            Browse all strips
                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link
                            to="/"
                            data-testid="dc-back-nzdra"
                            className="inline-flex items-center gap-2 text-sm uppercase tracking-widest text-zinc-400 hover:text-white"
                        >
                            \u2190 NZDRA Hub
                        </Link>
                    </div>
                </div>
            </section>

            <section className="max-w-[1400px] mx-auto px-6 md:px-12 py-20 grid md:grid-cols-3 gap-6">
                <DcCard icon={MapPin} title="Track Directory" body="Every NZ strip \u2014 NZDRA member or affiliate. Pick your home strip." to="/dragcentral/tracks" tid="dc-card-tracks" />
                <DcCard icon={Calendar} title="National Calendar" body="Race weekends across every sanctioned strip in the country." to="/calendar" tid="dc-card-calendar" />
                <DcCard icon={Trophy} title="Times & Results" body="ET and MPH from every NZ track, one searchable table." to="/results" tid="dc-card-results" />
            </section>
        </div>
    );
}

function DcCard({ icon: Icon, title, body, to, tid }) {
    return (
        <Link
            to={to}
            data-testid={tid}
            className="bg-zinc-900 border border-zinc-800 p-6 hover:border-cyan-400 transition-colors block group"
        >
            <Icon className="text-cyan-400" />
            <div className="mt-4 font-display text-2xl uppercase tracking-tight text-white">{title}</div>
            <div className="mt-2 text-sm text-zinc-400">{body}</div>
            <div className="mt-4 inline-flex items-center gap-1 text-xs uppercase tracking-widest text-cyan-400 group-hover:translate-x-1 transition-transform">
                Open <ArrowRight size={12} />
            </div>
        </Link>
    );
}
