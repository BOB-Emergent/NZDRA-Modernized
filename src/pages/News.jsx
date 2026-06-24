import React, { useEffect, useState } from "react";
import { api } from "../lib/api";

export default function News() {
    const [news, setNews] = useState([]);

    useEffect(() => {
        api.get("/news").then(({ data }) => setNews(data)).catch(() => {});
    }, []);

    return (
        <section className="max-w-[1200px] mx-auto px-6 py-20" data-testid="news-page">
            <h1 className="font-display text-4xl uppercase text-white tracking-tight mb-8">News</h1>
            {news.length === 0 ? (
                <p className="text-zinc-500">No news articles yet.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {news.map((item) => (
                        <article key={item.id} className="bg-zinc-900 border border-zinc-800 p-6 rounded-lg">
                            {item.image_url && <img src={item.image_url} alt={item.title} className="w-full h-48 object-cover rounded mb-4" />}
                            <h3 className="text-white font-semibold text-lg mb-2">{item.title}</h3>
                            <p className="text-zinc-400 text-sm line-clamp-3">{item.content}</p>
                            <p className="text-xs text-zinc-500 mt-3">{new Date(item.date).toLocaleDateString()}</p>
                        </article>
                    ))}
                </div>
            )}
        </section>
    );
}
