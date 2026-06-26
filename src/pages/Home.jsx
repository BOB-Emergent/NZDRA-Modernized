import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Calendar, Trophy, BookOpen, Zap } from "lucide-react";
import { api } from "../lib/api";
import LogoFlip from "../components/LogoFlip";
import SponsorWall from "../components/SponsorWall";

const HERO_BG = "https://static.prod-images.emergentagent.com/jobs/ab9a1b9b-f1d1-4b5b-a19f-599999625b57/images/8088e0a2a8b6218e0958fe55100b5b4f35b5adf30bfc49b6493b39c1a8fcc6b6.png";

export default function Home() {
    const [nextEvents, setNextEvents] = useState([]);
    const [latestNews, setLatestNews] = useState([]);
    const [latestResults, setLatestResults] = useState([]);

    useEffect(() => {
        const today = new Date().toISOString().slice(0, 10);
        api.get("/events", { params: { from_date: today } })
            .then((r) => setNextEvents(Array.isArray(r?.data) ? r.data.slice(0, 4) : []))
            .catch(() => setNextEvents([]));
        api.get("/news", { params: { limit: 3 } })
            .then((r) => setLatestNews(Array.isArray(r?.data) ? r.data : []))
            .catch(() => setLatestNews([]));
        api.get("/results", { params: { limit: 5 } })
            .then((r) => setLatestResults(Array.isArray(r?.data) ? r.data : []))
            .catch(() => setLatestResults([]));
    }, []);

    return (
        <div data-testid="home-page">
            {/* HERO */}
            <section className="relative overflow-hidden border-b border-white/10">
                <div className="absolute inset-0">
                    <img src={HERO_BG} alt="" className="w-full h-full object-cover opacity-50" />
                    <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                </div>
                <div className="relative max-w-[1400px] mx-auto px-6 md:px-12 py-24 md:py-32 grid lg:grid-cols-12 gap-12 items-center">
                    <div className="lg:col-span-7">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="flex items-center gap-3 mb-6"
                        >
                            <span className="h-px w-10 bg-nzdra-red" />
                            <span className="font-mono text-xs uppercase tracking-[0.4em] text-nzdra-red">
                                Sanctioned · Quarter Mile · Aotearoa
                            </span>
                        </motion.div>
                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.1 }}
                            className="font-display text-5xl sm:text-6xl lg:text-8xl uppercase tracking-tighter leading-[0.9] text-white"
                        >
                            Where seconds<br />
                            <span className="text-nzdra-red">become legends.</span>
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.7, delay: 0.3 }}
                            className="mt-8 text-lg text-zinc-300 max-w-xl leading-relaxed"
                        >
                            The official home of New Zealand drag racing — calendars, results, rules, and the AI rulebook assistant, all in one command room.
                        </motion.p>
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.45 }}
                            className="mt-10 flex flex-wrap gap-4"
                        >
                            <Link
                                to="/calendar"
                                data-testid="hero-cta-calendar"
                                className="group inline-flex items-center gap-3 bg-nzdra-red text-white px-7 py-4 font-semibold uppercase tracking-wider hover:bg-nzdra-redDark active:scale-95 transition-all"
                            >
                                View Race Calendar
                                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link
                                to="/rulebook"
                                data-testid="hero-cta-rulebook"
                                className="inline-flex items-center gap-3 border border-white/30 text-white px-7 py-4 font-semibold uppercase tracking-wider hover:bg-white hover:text-black active:scale-95 transition-all"
                            >
                                Ask the AI Rulebook
                            </Link>
                        </motion.div>
                    </div>

                    <div className="lg:col-span-5 flex flex-col items-center">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.7, delay: 0.2 }}
                            className="relative"
                        >
                            <div className="absolute -inset-6 border border-nzdra-red/30 rounded-full" />
                            <div className="absolute -inset-12 border border-white/5 rounded-full" />
                            <LogoFlip size="lg" intervalMs={3500} />
                        </motion.div>
                        <p className="mt-8 text-center font-mono text-[10px] uppercase tracking-[0.3em] text-zinc-500 max-w-[280px]">
                            Heritage meets modern. A nod to 1968, built for today.
                        </p>
                    </div>
                </div>
            </section>

            <div className="h-1 bg-gradient-to-r from-amber-500 via-amber-500 to-green-500" />

            <SponsorWall marquee />

            <section className="border-b border-white/10 bg-black">
                <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
                    {[
                        { value: "5", label: "Sanctioned Tracks" },
                        { value: "23", label: "2025/26 Events" },
                        { value: "57", label: "Years of Racing" },
                        { value: "G1·G2", label: "National Series" },
                    ].map((s, i) => (
                        <div key={i} className="border-l border-nzdra-red pl-4">
                            <div className="font-display text-5xl text-white">{s.value}</div>
                            <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.3em] text-zinc-500">{s.label}</div>
                        </div>
                    ))}
                </div>
            </section>

            <section className="max-w-[1400px] mx-auto px-6 md:px-12 py-20">
                <div className="flex items-end justify-between mb-10">
                    <div>
                        <div className="font-mono text-xs uppercase tracking-[0.4em] text-nzdra-red mb-2">Up Next</div>
                        <h2 className="font-display text-4xl md:text-5xl uppercase tracking-tight text-white">Coming Race Dates</h2>
                    </div>
                    <Link to="/calendar" className="hidden md:flex items-center gap-2 text-sm uppercase tracking-widest text-zinc-400 hover:text-nzdra-red">
                        Full calendar <ArrowRight size={16} />
                    </Link>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4" data-testid="home-next-events">
                    {nextEvents.length === 0 && (
                        <div className="col-span-full text-zinc-500 text-sm">No upcoming events.</div>
                    )}
                    {nextEvents.map((e) => (
                        <Link
                            key={e.id}
                            to="/calendar"
                            className="group relative bg-zinc-900 border border-zinc-800 hover:border-nzdra-red p-6 transition-colors"
                            data-testid={`next-event-${(e.track || "track").toLowerCase()}`}
                        >
                            <Calendar size={20} className="text-nzdra-red" />
                            <div className="mt-4 font-display text-3xl text-white leading-tight uppercase">
                                {formatDate(e.date)}
                            </div>
                            <div className="mt-1 font-mono text-xs uppercase tracking-widest text-amber-500">{e.track}</div>
                            <div className="mt-3 text-sm text-zinc-300 line-clamp-2">{e.title}</div>
                        </Link>
                    ))}
                </div>
            </section>

            <section className="border-y border-white/10 bg-zinc-950/50">
                <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-20 grid lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-2">
                        <div className="font-mono text-xs uppercase tracking-[0.4em] text-nzdra-red mb-2">Latest Times</div>
                        <h2 className="font-display text-4xl uppercase tracking-tight text-white mb-8 flex items-center gap-3">
                            <Trophy size={28} className="text-nzdra-red" /> Results
                        </h2>
                        <div className="border border-zinc-800 overflow-x-auto">
                            <table className="w-full text-sm" data-testid="home-results-table">
                                <thead className="bg-zinc-900 border-b-2 border-zinc-700">
                                    <tr className="text-left">
                                        <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-widest text-zinc-400">Date</th>
                                        <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-widest text-zinc-400">Track</th>
                                        <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-widest text-zinc-400">Class</th>
                                        <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-widest text-zinc-400">Driver</th>
                                        <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-widest text-zinc-400 text-right">ET</th>
                                        <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-widest text-zinc-400 text-right">MPH</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {latestResults.map((r, i) => (
                                        <tr key={r.id} className={i % 2 === 0 ? "bg-zinc-950" : "bg-zinc-900/40"}>
                                            <td className="px-4 py-3 text-zinc-400 font-mono text-xs">{r.date}</td>
                                            <td className="px-4 py-3 text-zinc-300">{r.track}</td>
                                            <td className="px-4 py-3 text-zinc-300">{r.race_class}</td>
                                            <td className="px-4 py-3 text-white font-medium">{r.driver}</td>
                                            <td className="px-4 py-3 text-right font-mono text-green-400">{(r.et || 0).toFixed(3)}</td>
                                            <td className="px-4 py-3 text-right font-mono text-green-400">{(r.mph || 0).toFixed(2)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <Link to="/results" className="mt-6 inline-flex items-center gap-2 text-sm uppercase tracking-widest text-nzdra-red hover:text-nzdra-redLight">
                            All results <ArrowRight size={14} />
                        </Link>
                    </div>

                    <div className="relative">
                        <div className="absolute -inset-1 race-stripes opacity-30" />
                        <div className="relative bg-black border border-amber-500/40 p-8">
                            <Zap size={28} className="text-amber-500" />
                            <h3 className="mt-5 font-display text-2xl uppercase tracking-tight text-white">
                                Ask Treena<br />— NZDRA Rulebook AI
                            </h3>
                            <p className="mt-3 text-sm text-zinc-400 leading-relaxed">
                                Treena is the NZDRA Tech Official AI. Powered by Claude 4.5. Direct, authoritative answers on classifications, safety specs, and recent results — straight from the official rulebook.
                            </p>
                            <Link
                                to="/rulebook"
                                className="mt-6 inline-flex items-center gap-2 border border-amber-500/60 text-amber-400 px-4 py-2 text-xs uppercase tracking-widest hover:bg-amber-500 hover:text-black transition-colors"
                                data-testid="home-ai-cta"
                            >
                                Talk to Treena <ArrowRight size={14} />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            <section className="max-w-[1400px] mx-auto px-6 md:px-12 py-20">
                <div className="flex items-end justify-between mb-10">
                    <div>
                        <div className="font-mono text-xs uppercase tracking-[0.4em] text-nzdra-red mb-2">Latest</div>
                        <h2 className="font-display text-4xl md:text-5xl uppercase tracking-tight text-white flex items-center gap-3">
                            <BookOpen size={28} className="text-nzdra-red" /> News & Updates
                        </h2>
                    </div>
                </div>
                <div className="grid md:grid-cols-3 gap-6">
                    {latestNews.map((n) => (
                        <article key={n.id} className="group bg-zinc-900 border border-zinc-800 hover:border-nzdra-red transition-colors overflow-hidden flex flex-col">
                            {n.image_url && (
                                <div className="aspect-[16/10] overflow-hidden">
                                    <img src={n.image_url} alt={n.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                </div>
                            )}
                            <div className="p-6 flex-1 flex flex-col">
                                <h3 className="font-display text-xl uppercase tracking-tight text-white">{n.title}</h3>
                                <p className="mt-3 text-sm text-zinc-400 line-clamp-3 flex-1">{n.excerpt}</p>
                                <div className="mt-4 font-mono text-[10px] uppercase tracking-widest text-zinc-600">
                                    {new Date(n.published_at).toLocaleDateString("en-NZ", { year: "numeric", month: "short", day: "numeric" })}
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </section>

            <section className="border-t border-white/10 bg-zinc-950/50">
                <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-20">
                    <div className="font-mono text-xs uppercase tracking-[0.4em] text-nzdra-red mb-2 text-center">With Thanks To</div>
                    <h2 className="font-display text-4xl md:text-5xl uppercase tracking-tight text-white text-center mb-12">
                        Our Sponsors
                    </h2>
                    <div className="flex justify-center">
                        <SponsorWall />
                    </div>
                </div>
            </section>
        </div>
    );
}

function formatDate(iso) {
    if (!iso) return "COMING SOON";
    const d = new Date(iso);
    if (isNaN(d.getTime())) return "TBA";
    return d.toLocaleDateString("en-NZ", { day: "2-digit", month: "short" }).toUpperCase();
}
