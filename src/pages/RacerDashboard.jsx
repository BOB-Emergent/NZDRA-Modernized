import React, { useState, useRef } from "react";
import LicensePrintExport from "../components/LicensePrintExport";
import { QRCodeSVG } from "qrcode.react";
import { Loader2, AlertTriangle, LogOut } from "lucide-react";
import { api } from "../lib/api";

const MOCK_RACERS = {
    "8027": { memberNumber: "8027", firstName: "Dale", lastName: "Scott", address: "56 Boundary Road", city: "Masterton", dob: "09/06/1984", expiry: "30/06/2026", medExpiry: "N/A", vehicle1: "", vehicle2: "", photo: "https://customer-assets.emergentagent.com/wingman/0bd5dc57-0e05-4678-a3e4-d7742a49f543/attachments/bdc254d3f4894db8a8d1489f4277bf1e_93DEF9EA-C18D-408B-9E62-9E357D1DA2A4.PNG", status: "ACTIVE", class: "Associate Member" },
    "8041": { memberNumber: "8041", firstName: "John", lastName: "Smith", address: "12 Main St", city: "Auckland", dob: "15/03/1990", expiry: "15/01/2025", medExpiry: "N/A", vehicle1: "", vehicle2: "", status: "EXPIRED", class: "Competition" },
};

export default function RacerDashboard() {
    const [memberNum, setMemberNum] = useState("");
    const [racer, setRacer] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); setError(""); setRacer(null);
        const mock = MOCK_RACERS[memberNum];
        if (mock) { 
            setRacer(mock); 
        } else {
            try { 
                const res = await api.get(`/api/racers/${memberNum}`); 
                if (res.data && res.data.memberNumber) {
                    setRacer(res.data); 
                } else {
                    setError("Member not found. Try 8027 or 8041.");
                }
            } catch (err) {
                setError("Member not found. Try 8027 or 8041.");
            }
        }
        setLoading(false);
    };

    const handleLogout = () => { setRacer(null); setMemberNum(""); setError(""); };

    return (
        <div className="max-w-[1100px] mx-auto px-6 md:px-12 py-16" data-testid="racer-dashboard-page">
            <div className="font-mono text-xs uppercase tracking-[0.4em] text-nzdra-red mb-3">Racer Portal</div>
            <h1 className="font-display text-5xl md:text-7xl uppercase tracking-tighter text-white">Your License</h1>
            <p className="mt-4 text-zinc-400 max-w-2xl">Enter your NZDRA member number to view your digital racing license.</p>
            {!racer ? (
                <form onSubmit={handleSubmit} className="mt-10 flex flex-col sm:flex-row gap-4 max-w-md" data-testid="license-form">
                    <input type="text" value={memberNum} onChange={(e) => setMemberNum(e.target.value)} placeholder="e.g. 8027"
                        className="flex-1 px-4 py-3 bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-nzdra-red"
                        data-testid="member-number-input" />
                    <button type="submit" disabled={loading || !memberNum}
                        className="px-6 py-3 bg-nzdra-red text-white font-bold uppercase tracking-wider rounded-lg hover:bg-red-700 disabled:opacity-50 transition-all active:scale-95"
                        data-testid="show-license-button">
                        {loading ? <Loader2 className="animate-spin mx-auto" size={20} /> : "Show My License"}
                    </button>
                </form>
            ) : (
                <div className="mt-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <button onClick={handleLogout} className="flex items-center gap-2 text-zinc-400 hover:text-white mb-6 transition-colors font-mono text-xs uppercase tracking-widest" data-testid="logout-button">
                        <LogOut size={14} /> Sign out
                    </button>
                    <LicenseCard racer={racer} />
                </div>
            )}
            {error && <div className="mt-6 flex items-center gap-2 text-amber-400 animate-pulse" data-testid="error-message"><AlertTriangle size={18} /> {error}</div>}
        </div>
    );
}

const LICENSE_BG = "https://customer-assets.emergentagent.com/wingman/0bd5dc57-0e05-4678-a3e4-d7742a49f543/attachments/1e10641bcd724d0b8660d9e701074fc1_NZDRA%20LICENCE%20TEMPLATE.png";

function LicenseCard({ racer }) {
    const cardRef = useRef(null);
    const isActive = racer.status === "ACTIVE";
    return (
        <div className="flex flex-col items-center w-full max-w-[700px] mx-auto">
            <div data-testid="license-card" ref={cardRef} className="relative w-full aspect-[1500/950] rounded-xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] bg-transparent">
                <img src={LICENSE_BG} alt="" className="absolute inset-0 w-full h-full object-fill z-0 select-none"/>
                
                {/* The White Data Box */}
                <div style={{position:"absolute",top:"16.32%",left:"3.73%",width:"62.2%",height:"69.37%",backgroundColor:"#ffffff",borderRadius:"4px",border:"1px solid #000",overflow:"visible",zIndex:1,fontFamily:"'Arial Black','Arimo',sans-serif",fontWeight:"bold"}}>
                    <span style={{position:"absolute",left:"4.7%",top:"14.4%",fontSize:"17pt",fontWeight:"bold",color:"#FF0000"}}>{racer.class || "Associate Member"}</span>
                    <span style={{position:"absolute",left:"79.7%",top:"14.4%",fontSize:"17pt",fontWeight:"bold",color:"#000"}}>{racer.memberNumber||""}</span>
                    <span style={{position:"absolute",left:"4.7%",top:"25.0%",fontSize:"17pt",fontWeight:"bold",color:"#000"}}>{racer.firstName||racer.name||""}</span>
                    <span style={{position:"absolute",left:"47.6%",top:"25.0%",fontSize:"17pt",fontWeight:"bold",color:"#000"}}>{racer.lastName||""}</span>
                    <span style={{position:"absolute",left:"4.7%",top:"34.1%",fontSize:"12pt",color:"#000"}}>{racer.address||""}</span>
                    <span style={{position:"absolute",left:"63.7%",top:"34.1%",fontSize:"12pt",color:"#000"}}>{racer.city||""}</span>
                    <span style={{position:"absolute",left:"4.7%",top:"44.8%",fontSize:"14pt",fontWeight:"bold",color:"#000"}}>Date of Birth:</span>
                    <span style={{position:"absolute",left:"32.6%",top:"44.8%",fontSize:"12pt",color:"#000"}}>{racer.dob||"N/A"}</span>
                    <span style={{position:"absolute",left:"4.7%",top:"55.4%",fontSize:"14pt",fontWeight:"bold",color:"#000"}}>Licence Expires:</span>
                    <span style={{position:"absolute",left:"36.9%",top:"55.4%",fontSize:"16pt",fontWeight:"bold",color:"#000"}}>{racer.expiry||racer.expiryDate||"N/A"}</span>
                    <span style={{position:"absolute",left:"4.7%",top:"66.0%",fontSize:"17pt",fontWeight:"bold",color:"#000"}}>Medical Expires:</span>
                    <span style={{position:"absolute",left:"36.9%",top:"66.0%",fontSize:"17pt",fontWeight:"bold",color:"#000"}}>{racer.medExpiry||"N/A"}</span>
                    <span style={{position:"absolute",left:"4.7%",top:"76.6%",fontSize:"12pt",color:"#000"}}>Vehicle #1:</span>
                    <span style={{position:"absolute",left:"36.9%",top:"76.6%",fontSize:"12pt",color:"#000"}}>{racer.vehicle1||""}</span>
                    <span style={{position:"absolute",left:"4.7%",top:"87.3%",fontSize:"12pt",color:"#000"}}>Vehicle #2:</span>
                    <span style={{position:"absolute",left:"36.9%",top:"87.3%",fontSize:"12pt",color:"#000"}}>{racer.vehicle2||""}</span>
                </div>

                {/* Racer Photo Area */}
                <div style={{position:"absolute",top:"30.21%",left:"70%",width:"26.33%",height:"55.47%",borderRadius:"6px",overflow:"hidden",backgroundColor:"transparent",zIndex:1}}>
                    {racer.photo ? (
                        <img src={racer.photo} alt="Racer" style={{width:"100%",height:"100%",objectFit:"cover",border:"none",boxShadow:"none",outline:"none"}}/>
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-zinc-100 text-zinc-400 text-xs">No Photo</div>
                    )}
                </div>

                {/* Status Badge Over Template */}
                <div style={{position:"absolute",top:"74.84%",left:"71.53%",width:"23.33%",height:"8.42%",alignItems:"center",display:"flex",justifyContent:"center",zIndex:3}}>
                    <span className={`px-4 py-1 rounded-full text-white text-[10px] font-bold uppercase tracking-widest ${isActive ? "bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.4)]" : "bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.4)]"}`} data-print-hide="badge">
                        {isActive ? "ACTIVE" : "EXPIRED"}
                    </span>
                </div>
            </div>

            {/* Actions & QR Footer */}
            <div className="w-full bg-white rounded-b-xl p-8 flex flex-col items-center justify-center text-center shadow-lg mt-3" data-testid="license-qr-section">
                <div className="mb-6 animate-in zoom-in duration-500" data-print-hide="qr">
                    <QRCodeSVG value={`https://nzdra.amw.net.nz/dashboard?verify=${racer.memberNumber||""}`} size={140} level="H" />
                    <p className="mt-3 text-[10px] font-mono uppercase tracking-widest text-zinc-400">Secure Verification ID</p>
                </div>
                <LicensePrintExport cardRef={cardRef} memberNumber={racer.memberNumber} />
            </div>
        </div>
    );
}
