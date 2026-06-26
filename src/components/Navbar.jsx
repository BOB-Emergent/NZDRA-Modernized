import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Menu, X, LogOut, ShieldCheck } from "lucide-react";
import Logo from "./Logo";
import TenantSwitcher from "./TenantSwitcher";
import { useAuth } from "../lib/auth";
import { useTenant } from "../lib/tenant";

const links = [
    { to: "/", label: "Home" },
    { to: "/calendar", label: "Calendar" },
    { to: "/results", label: "Results" },
    { to: "/rulebook", label: "Rulebook" },
    { to: "/news", label: "News" },
    { to: "/tracks", label: "Tracks" },
    { to: "/dashboard", label: "Dashboard" },
    { to: "/contact", label: "Contact" },
];

export default function Navbar() {
    const [open, setOpen] = useState(false);
    const { user, logout } = useAuth();
    const { tenant } = useTenant();
    const nav = useNavigate();

    const prefix = tenant ? `/t/${tenant.slug}` : "";
    const navLinks = tenant
        ? [
              { to: prefix, label: "Home" },
              { to: `${prefix}/calendar`, label: "Calendar" },
              { to: `${prefix}/results`, label: "Results" },
              { to: `${prefix}/rulebook`, label: "Rulebook" },
              { to: `${prefix}/news`, label: "News" },
          ]
        : links;

    return (
        <header
            className="sticky top-0 z-50 backdrop-blur-xl bg-black/70 border-b border-white/10"
            data-testid="site-navbar"
        >
            {tenant ? (
                <div className="h-1" style={{ background: `linear-gradient(90deg, var(--tenant-primary) 0%, var(--tenant-primary) 50%, var(--tenant-accent) 50%, var(--tenant-accent) 100%)` }} />
            ) : (
                <div className="h-1 bg-gradient-to-r from-nzdra-red via-amber-500 to-green-500" />
            )}
            <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex items-center justify-between h-24">
                <Link to={prefix || "/"} data-testid="nav-home-logo" className="flex items-center gap-4">
                    <Logo size="md" />
                    {tenant && (
                        <span className="hidden md:inline-block font-mono text-[10px] uppercase tracking-[0.3em] text-zinc-500 border-l border-zinc-700 pl-4" data-testid="tenant-name-badge">
                            <span className="block" style={{ color: "var(--tenant-primary)" }}>{tenant.name}</span>
                            <span className="block text-zinc-600 mt-0.5">{tenant.tagline}</span>
                        </span>
                    )}
                </Link>

                <nav className="hidden lg:flex items-center gap-8">
                    {navLinks.map((l) => (
                        <NavLink
                            key={l.to}
                            to={l.to}
                            end={l.to === "/" || l.to === prefix}
                            data-testid={`nav-link-${l.label.toLowerCase()}`}
                            className={({ isActive }) =>
                                `text-sm uppercase tracking-widest font-medium transition-colors ${
                                    isActive ? "text-white pb-1" : "text-zinc-400 hover:text-white"
                                }`
                            }
                            style={({ isActive }) => isActive ? { borderBottom: `2px solid ${tenant ? "var(--tenant-primary)" : "#dc2626"}` } : {}}
                        >
                            {l.label}
                        </NavLink>
                    ))}
                </nav>

                <div className="hidden lg:flex items-center gap-3">
                    <TenantSwitcher />
                    {user ? (
                        <>
                            <Link
                                to="/admin"
                                data-testid="nav-admin-link"
                                className="flex items-center gap-2 px-4 py-2 text-white text-sm font-semibold uppercase tracking-wider transition-colors"
                                style={{ background: tenant ? "var(--tenant-primary)" : "#dc2626" }}
                            >
                                <ShieldCheck size={16} /> Admin
                            </Link>
                            <button
                                onClick={() => { logout(); nav("/"); }}
                                data-testid="nav-logout-btn"
                                className="p-2 text-zinc-400 hover:text-white transition-colors"
                                title="Sign out"
                            >
                                <LogOut size={18} />
                            </button>
                        </>
                    ) : (
                        <Link
                            to="/login"
                            data-testid="nav-login-link"
                            className="px-5 py-2 border border-white/20 text-white text-sm font-semibold uppercase tracking-wider hover:bg-white hover:text-black transition-colors"
                        >
                            Sign In
                        </Link>
                    )}
                </div>

                <button
                    onClick={() => setOpen(!open)}
                    className="lg:hidden p-2 text-white"
                    data-testid="mobile-menu-toggle"
                >
                    {open ? <X /> : <Menu />}
                </button>
            </div>

            {open && (
                <div className="lg:hidden border-t border-white/10 bg-black">
                    <div className="px-6 py-4 flex flex-col gap-4">
                        {links.map((l) => (
                            <NavLink
                                key={l.to}
                                to={l.to}
                                onClick={() => setOpen(false)}
                                className="text-sm uppercase tracking-widest text-zinc-300 hover:text-white"
                            >
                                {l.label}
                            </NavLink>
                        ))}
                        {user ? (
                            <Link to="/admin" onClick={() => setOpen(false)} className="text-sm uppercase tracking-widest text-nzdra-red">Admin Console</Link>
                        ) : (
                            <Link to="/login" onClick={() => setOpen(false)} className="text-sm uppercase tracking-widest text-nzdra-red">Sign In</Link>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
}
