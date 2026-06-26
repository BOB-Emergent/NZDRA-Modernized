import React, { createContext, useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { api } from "./api";

const TenantCtx = createContext({ tenant: null, loading: false, slug: null });

function slugFromPath(pathname) {
    const m = pathname.match(/^\/t\/([^/]+)/);
    return m ? m[1].toLowerCase() : null;
}

function resolveSlugFromHost() {
    if (typeof window === "undefined") return null;
    const host = window.location.hostname;
    const known = ["masterton", "meremere", "teretonga", "tokoroa", "motueka", "hamilton"];
    for (const k of known) {
        if (host.startsWith(`${k}.`)) return k;
    }
    return null;
}

export function TenantProvider({ children }) {
    const loc = useLocation();
    const slug = slugFromPath(loc.pathname) || resolveSlugFromHost();
    const [tenant, setTenant] = useState(null);
    const [loading, setLoading] = useState(!!slug);

    useEffect(() => {
        if (!slug) {
            setTenant(null);
            document.documentElement.style.removeProperty("--tenant-primary");
            document.documentElement.style.removeProperty("--tenant-accent");
            return;
        }
        setLoading(true);
        api.get(`/tenants/${slug}`)
            .then((r) => {
                setTenant(r.data);
                document.documentElement.style.setProperty("--tenant-primary", r.data.brand?.primary_color || "#dc2626");
                document.documentElement.style.setProperty("--tenant-accent", r.data.brand?.accent_color || "#f59e0b");
            })
            .catch(() => setTenant(null))
            .finally(() => setLoading(false));
    }, [slug]);

    return (
        <TenantCtx.Provider value={{ tenant, loading, slug }}>
            {children}
        </TenantCtx.Provider>
    );
}

export const useTenant = () => useContext(TenantCtx);
