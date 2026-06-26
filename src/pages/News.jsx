import React, { useEffect, useState } from "react";
import { api } from "../lib/api";

export default function News() {
    const [posts, setPosts] = useState([]);
    useEffect(() => {
        api.get("/news")
            .then((r) => setPosts(Array.isArray(r.data) ? r.data : []))
            .catch(() => setPosts([]));
    }, []);

    return (
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-16" data-testid="news-page">
            <div className="font-mono text-xs uppercase tracking-[0.4em] text-nzdra-red mb-3">From the Strip</div>
            <h1 className="font-display text-5xl md:text-7xl uppercase tracking-tighter text-white">News & Releases</h1>

            <div className="mt-12 grid md:grid-cols-2 gap-6">
                {posts.map((n) => (
                    <article key={n.id} className="group bg-zinc-900 border border-zinc-800 hover:border-nzdra-red transition-colors overflow-hidden">
                        {n.image_url && (
                            <div className="aspect-[16/9] overflow-hidden">
                                <img src={n.image_url} alt={n.title} className="w-full h-full object-cover" />
                            </div>
                        )}
                        <div className="p-6">
                            <div className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">
                                {new Date(n.published_at).toLocaleDateString("en-NZ", { year: "numeric", month: "long", day: "numeric" })}
                            </div>
                            <h2 className="mt-2 font-display text-2xl uppercase tracking-tight text-white">{n.title}</h2>
                            <p className="mt-3 text-zinc-300">{n.excerpt}</p>
                            <p className="mt-4 text-sm text-zinc-400 leading-relaxed">{n.body}</p>
                        </div>
                    </article>
                ))}
                {posts.length === 0 && <div className="col-span-full py-20 text-center text-zinc-600 border border-zinc-800 border-dashed">No news articles yet.</div>}
            </div>
        </div>
    );
}
