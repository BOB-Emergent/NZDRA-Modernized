import React from "react";
import { Mail, Phone, MapPin } from "lucide-react";

export default function Contact() {
    return (
        <section className="max-w-[800px] mx-auto px-6 py-20" data-testid="contact-page">
            <h1 className="font-display text-4xl uppercase text-white tracking-tight mb-8">Contact Us</h1>
            <p className="text-zinc-400 mb-8">The NZDRA management team is here to help with licensing, event queries, and sponsorship inquiries.</p>
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <Mail size={20} className="text-nzdra-red" />
                    <div>
                        <p className="text-white font-medium">Email</p>
                        <a href="mailto:manager@nzdra.co.nz" className="text-zinc-400 hover:text-white">manager@nzdra.co.nz</a>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <Phone size={20} className="text-nzdra-red" />
                    <div>
                        <p className="text-white font-medium">Phone</p>
                        <p className="text-zinc-400">Contact via email for phone inquiries</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <MapPin size={20} className="text-nzdra-red" />
                    <div>
                        <p className="text-white font-medium">Office</p>
                        <p className="text-zinc-400">New Zealand</p>
                    </div>
                </div>
            </div>
        </section>
    );
}
