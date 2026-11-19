import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Play, Eye } from 'lucide-react';
import { vlogAPI } from '../services/api';

export default function VlogPage() {
  const [vlogs, setVlogs] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    vlogAPI.getAll().then(res => { setVlogs(res.data.data); }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8">
      <div className="page-container">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black text-gray-900 dark:text-white">WORLDKART Vlog</h1>
          <p className="text-gray-500 mt-2">Product unboxings, reviews, fashion hauls and shopping tips</p>
        </div>

        {/* Video Player */}
        {selected && (
          <div className="bg-black rounded-2xl overflow-hidden mb-8 relative pb-[56.25%] h-0">
            <iframe
              src={`https://www.youtube.com/embed/${selected.youtubeId}?autoplay=1`}
              className="absolute inset-0 w-full h-full"
              allowFullScreen
              title={selected.title}
            />
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => <div key={i} className="rounded-2xl overflow-hidden"><div className="skeleton aspect-video" /><div className="p-4 space-y-2"><div className="skeleton h-4 rounded" /></div></div>)}
          </div>
        ) : vlogs.length === 0 ? (
          <div className="text-center py-16 text-gray-400">No videos yet.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {vlogs.map(vlog => (
              <div key={vlog._id} onClick={() => setSelected(vlog)}
                className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-card cursor-pointer group hover:shadow-card-hover transition-shadow">
                <div className="relative aspect-video bg-gray-900 overflow-hidden">
                  <img
                    src={vlog.thumbnail || `https://img.youtube.com/vi/${vlog.youtubeId}/maxresdefault.jpg`}
                    alt={vlog.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <div className="w-14 h-14 bg-red-500/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Play size={24} fill="white" className="text-white ml-1" />
                    </div>
                  </div>
                  {vlog.duration && (
                    <span className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-0.5 rounded">{vlog.duration}</span>
                  )}
                </div>
                <div className="p-4">
                  <span className="badge badge-primary text-xs mb-1 capitalize">{vlog.category?.replace('-', ' ')}</span>
                  <h3 className="font-bold text-gray-900 dark:text-white text-sm line-clamp-2 group-hover:text-orange-500 transition-colors">{vlog.title}</h3>
                  <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                    <span className="flex items-center gap-1"><Eye size={12} /> {vlog.views?.toLocaleString()}</span>
                    <span>{new Date(vlog.publishedAt || vlog.createdAt).toLocaleDateString('en-IN')}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
