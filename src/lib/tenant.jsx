import React, { createContext, useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { api } from "./api";

const TenantCtx = createContext(null);

export function TenantProvider({ children }) {
    const location = useLocation();
    const [tenant, setTenant] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const m = location.pathname.match(/^\/t\/([^/]+)/);
        if (m) {
            const slug = m[1];
            setLoading(true);
            api.get(`/tenants/${slug}`)
                .then(({ data }) => {
                    setTenant(data);
                    // Apply tenant CSS vars
                    if (data.primary_color) document.documentElement.style.setProperty("--tenant-primary", data.primary_color);
                    if (data.accent_color) document.documentElement.style.setProperty("--tenant-accent", data.accent_color);
                })
                .catch(() => setTenant(null))
                .finally(() => setLoading(false));
        } else {
            setTenant(null);
            document.documentElement.style.removeProperty("--tenant-primary");
            document.documentElement.style.removeProperty("--tenant-accent");
        }
    }, [location.pathname]);

    return <TenantCtx.Provider value={{ tenant, loading }}>{children}</TenantCtx.Provider>;
}

export const useTenant = () => useContext(TenantCtx);
