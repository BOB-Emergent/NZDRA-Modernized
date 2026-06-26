import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { api } from "../lib/api";
import { useTenant } from "../lib/tenant";
import { ChevronDown, Globe } from "lucide-react";

export default function TenantSwitcher() {
    const [open, setOpen] = useState(false);
    const [tenants, setTenants] = useState([]);
    const { tenant } = useTenant();
    const nav = useNavigate();
    const loc = useLocation();

    useEffect(() => {
        api.get("/tenants").then((r) => setTenants(r.data)).catch(() => {});
    }, []);

    const goTo = (slug) => {
        setOpen(false);
        if (!slug) {
            const rest = loc.pathname.replace(/^\/t\/[^/]+/, "") || "/";
            nav(rest);
        } else {
            nav(`/t/${slug}`);
        }
    };

    const label = tenant ? tenant.name : "NZDRA Hub";

    return (
        <div className="relative" data-testid="tenant-switcher">
            <button
                onClick={() => setOpen(!open)}
                className="flex items-center gap-2 px-3 py-2 text-xs uppercase tracking-widest border border-white/20 text-white hover:border-white/60 transition-colors"
                data-testid="tenant-switcher-button"
            >
                <Globe size={14} style={{ color: tenant ? "var(--tenant-primary)" : "#dc2626" }} />
                <span className="hidden sm:inline">{label}</span>
                <ChevronDown size={14} className={`transition-transform ${open ? "rotate-180" : ""}`} />
            </button>
            {open && (
                <div className="absolute right-0 mt-2 w-64 bg-black border border-white/20 shadow-xl z-50" data-testid="tenant-switcher-menu">
                    <div className="px-3 py-2 border-b border-white/10 font-mono text-[10px] uppercase tracking-widest text-zinc-500">
                        Franchise Demo
                    </div>
                    <TenantOption
                        active={!tenant}
                        onClick={() => goTo(null)}
                        primary="#dc2626"
                        name="NZDRA Central Hub"
                        tag="The association"
                        testid="tenant-option-central"
                    />
                    {tenants.map((t) => (
                        <TenantOption
                            key={t.slug}
                            active={tenant?.slug === t.slug}
                            onClick={() => goTo(t.slug)}
                            primary={t.brand?.primary_color || "#dc2626"}
                            name={t.name}
                            tag={t.tagline}
                            testid={`tenant-option-${t.slug}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

function TenantOption({ active, onClick, primary, name, tag, testid }) {
    return (
        <button
            onClick={onClick}
            data-testid={testid}
            className={`w-full text-left px-3 py-2.5 flex items-start gap-3 border-l-2 transition-colors ${
                active ? "bg-white/5" : "hover:bg-white/5"
            }`}
            style={{ borderLeftColor: active ? primary : "transparent" }}
        >
            <span className="block w-3 h-3 mt-1 flex-shrink-0" style={{ background: primary }} />
            <span className="flex-1">
                <span className="block text-sm text-white">{name}</span>
                <span className="block font-mono text-[10px] uppercase tracking-widest text-zinc-500 mt-0.5">{tag}</span>
            </span>
        </button>
    );
}
