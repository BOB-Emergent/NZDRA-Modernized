import React from "react";
import { Link } from "react-router-dom";
import { Mail, Facebook } from "lucide-react";
import Logo from "./Logo";

export default function Footer() {
    return (
        <footer className="border-t border-white/10 bg-black mt-20" data-testid="site-footer">
            <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-16">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                    <div className="md:col-span-2">
                        <Logo size="md" />
                        <p className="mt-6 text-sm text-zinc-400 max-w-md leading-relaxed">
                            The New Zealand Drag Racing Association — the sanctioning body for quarter-mile competition across Aotearoa. Established 1968.
                        </p>
                        <div className="mt-6 flex items-center gap-4">
                            <a
                                href="mailto:manager@nzdra.co.nz"
                                className="flex items-center gap-2 text-sm text-zinc-400 hover:text-nzdra-red transition-colors"
                                data-testid="footer-email"
                            >
                                <Mail size={16} /> manager@nzdra.co.nz
                            </a>
                            <a
                                href="https://www.facebook.com/NZDRA"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-zinc-400 hover:text-nzdra-red transition-colors"
                                data-testid="footer-facebook"
                            >
                                <Facebook size={18} />
                            </a>
                        </div>
                    </div>
                    <div>
                        <h4 className="font-display text-lg uppercase tracking-tight text-white mb-4">Race</h4>
                        <ul className="space-y-2 text-sm text-zinc-400">
                            <li><Link to="/calendar" className="hover:text-nzdra-red">Calendar</Link></li>
                            <li><Link to="/results" className="hover:text-nzdra-red">Results</Link></li>
                            <li><Link to="/rulebook" className="hover:text-nzdra-red">Rulebook</Link></li>
                            <li><Link to="/tracks" className="hover:text-nzdra-red">Tracks</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-display text-lg uppercase tracking-tight text-white mb-4">Association</h4>
                        <ul className="space-y-2 text-sm text-zinc-400">
                            <li><Link to="/news" className="hover:text-nzdra-red">News</Link></li>
                            <li><Link to="/contact" className="hover:text-nzdra-red">Contact</Link></li>
                            <li><Link to="/login" className="hover:text-nzdra-red">Officials Login</Link></li>
                        </ul>
                    </div>
                </div>
                <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-xs text-zinc-500 font-mono uppercase tracking-widest">
                        © {new Date().getFullYear()} New Zealand Drag Racing Association
                    </p>
                    <p className="text-xs text-zinc-500 font-mono uppercase tracking-widest">
                        Sanctioned by FIA · MotorSport NZ
                    </p>
                </div>
            </div>
        </footer>
    );
}
