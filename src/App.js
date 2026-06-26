import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";

import { AuthProvider } from "./lib/auth";
import { TenantProvider } from "./lib/tenant";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import CalendarPage from "./pages/CalendarPage";
import Results from "./pages/Results";
import RuleBook from "./pages/RuleBook";
import News from "./pages/News";
import Tracks from "./pages/Tracks";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import TenantHome from "./pages/TenantHome";
import DragCentralHome from "./pages/DragCentralHome";
import RacerDashboard from "./pages/RacerDashboard";
import FloatingTreena from "./components/FloatingTreena";

export default function App() {
    return (
        <div className="App min-h-screen bg-zinc-950 text-zinc-300">
            <BrowserRouter>
                <TenantProvider>
                    <AuthProvider>
                        <Navbar />
                        <main>
                            <Routes>
                                {/* Central NZDRA hub */}
                                <Route path="/" element={<Home />} />
                                <Route path="/calendar" element={<CalendarPage />} />
                                <Route path="/results" element={<Results />} />
                                <Route path="/rulebook" element={<RuleBook />} />
                                <Route path="/news" element={<News />} />
                                <Route path="/tracks" element={<Tracks />} />
                                <Route path="/contact" element={<Contact />} />
                                <Route path="/login" element={<Login />} />
                                <Route path="/admin" element={<AdminDashboard />} />
                                <Route path="/dashboard" element={<RacerDashboard />} />

                                {/* DragCentral — sister portal surfacing every NZ strip */}
                                <Route path="/dragcentral" element={<DragCentralHome />} />
                                <Route path="/dragcentral/tracks" element={<Tracks />} />

                                {/* White-label tenant portals — same components, branded shell */}
                                <Route path="/t/:slug" element={<TenantHome />} />
                                <Route path="/t/:slug/calendar" element={<CalendarPage />} />
                                <Route path="/t/:slug/results" element={<Results />} />
                                <Route path="/t/:slug/rulebook" element={<RuleBook />} />
                                <Route path="/t/:slug/news" element={<News />} />
                            </Routes>
                        </main>
                        <Footer />
                        <FloatingTreena />
                        <Toaster theme="dark" position="top-right" />
                    </AuthProvider>
                </TenantProvider>
            </BrowserRouter>
        </div>
    );
}
