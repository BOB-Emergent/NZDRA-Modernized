import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

const FRAMES = [
    {
        id: "heritage",
        url: "https://static.prod-images.emergentagent.com/jobs/0bd5dc57-0e05-4678-a3e4-d7742a49f543/images/a9545696cf0bbaf50bc80dd78fad2af7c0f1a0efea8444163392d0c6d5a8b3ea.png",
        alt: "NZDRA \u2014 sharpened heritage logo",
        caption: "Heritage \u00b7 Est 1968",
    },
    {
        id: "modern-red",
        url: "https://customer-assets.emergentagent.com/wingman/0bd5dc57-0e05-4678-a3e4-d7742a49f543/attachments/87674f5c86ba4733ad992e2e1a108102_e779def96fd1c1436095ca247ba21e9c29d4de724d80480cf90d6799f031b62a.png",
        alt: "NZDRA \u2014 polished official logo",
        caption: "Polished Official \u00b7 2026",
    },
    {
        id: "drag-car",
        url: "https://static.prod-images.emergentagent.com/jobs/0bd5dc57-0e05-4678-a3e4-d7742a49f543/images/94e5e64fd69a4d69fcb1e9569610349af92aed0cacf8d85e1ba7e7f9bb72d75b.png",
        alt: "NZDRA \u2014 modern logo with drag car",
        caption: "Modern Era \u00b7 Today",
    },
];

const BOX = {
    sm: { w: 160, h: 130 },
    md: { w: 240, h: 195 },
    lg: { w: 320, h: 260 },
};

const FRAME_MS = 3200;

export default function LogoFlip({ size = "lg", frameMs = FRAME_MS }) {
    const [active, setActive] = useState(0);
    const { w, h } = BOX[size];

    useEffect(() => {
        const t = setInterval(() => {
            setActive((i) => (i + 1) % FRAMES.length);
        }, frameMs);
        return () => clearInterval(t);
    }, [frameMs]);

    return (
        <div className="inline-block" data-testid="logo-flip">
            <div className="relative" style={{ width: w, height: h }}>
                <div
                    className="absolute inset-0 -m-10 rounded-full blur-3xl pointer-events-none"
                    style={{
                        background:
                            "radial-gradient(ellipse at center, rgba(220,38,38,0.30), transparent 65%)",
                    }}
                />

                {FRAMES.map((f, i) => (
                    <motion.div
                        key={f.id}
                        initial={false}
                        animate={{ opacity: active === i ? 1 : 0 }}
                        transition={{ duration: 0.9, ease: "easeInOut" }}
                        className="absolute inset-0 flex items-center justify-center"
                        style={{ willChange: "opacity" }}
                        data-testid={`logo-frame-${f.id}`}
                    >
                        <img
                            src={f.url}
                            alt={f.alt}
                            draggable={false}
                            className="w-full h-full object-contain select-none"
                        />
                    </motion.div>
                ))}
            </div>

            <div className="mt-5 text-center" style={{ height: 38 }}>
                <div className="relative h-4">
                    {FRAMES.map((f, i) => (
                        <motion.div
                            key={f.id}
                            initial={false}
                            animate={{ opacity: active === i ? 1 : 0 }}
                            transition={{ duration: 0.6, ease: "easeInOut" }}
                            className="absolute inset-x-0 font-mono text-[10px] uppercase tracking-[0.35em] text-zinc-500"
                        >
                            {f.caption}
                        </motion.div>
                    ))}
                </div>
                <div className="mt-3 mx-auto h-[2px] w-32 bg-zinc-800 overflow-hidden">
                    <motion.div
                        key={`bar-${active}`}
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: frameMs / 1000, ease: "linear" }}
                        style={{ transformOrigin: "left" }}
                        className="h-full bg-nzdra-red"
                    />
                </div>
            </div>
        </div>
    );
}
