import React, { createContext, useContext, useEffect, useState } from "react";
import { api } from "./api";

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("nzdra_token");
        if (token) {
            api.get("/auth/me")
                .then(({ data }) => setUser(data))
                .catch(() => { localStorage.removeItem("nzdra_token"); });
        }
    }, []);

    const login = async (email, password) => {
        const { data } = await api.post("/auth/login", { email, password });
        localStorage.setItem("nzdra_token", data.token);
        const me = await api.get("/auth/me");
        setUser(me.data);
    };

    const logout = () => {
        localStorage.removeItem("nzdra_token");
        setUser(null);
    };

    return <AuthCtx.Provider value={{ user, login, logout }}>{children}</AuthCtx.Provider>;
}

export const useAuth = () => useContext(AuthCtx);
