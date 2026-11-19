import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, Eye } from 'lucide-react';
import { blogAPI } from '../services/api';

export default function BlogPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    blogAPI.getAll({ limit: 12 })
      .then(res => setBlogs(res.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8">
      <div className="page-container">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black text-gray-900 dark:text-white">WORLDKART Blog</h1>
          <p className="text-gray-500 mt-2">Shopping guides, fashion trends, tech news and more</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => <div key={i} className="rounded-2xl overflow-hidden"><div className="skeleton h-48" /><div className="p-4 space-y-2"><div className="skeleton h-4 rounded" /><div className="skeleton h-6 rounded" /></div></div>)}
          </div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-16 text-gray-400">No blog posts yet.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map(blog => (
              <Link key={blog._id} to={`/blog/${blog.slug}`} className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-shadow group">
                <div className="overflow-hidden h-48 bg-gray-100 dark:bg-gray-800">
                  {blog.featuredImage ? (
                    <img src={blog.featuredImage} alt={blog.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={e => { e.target.style.display = 'none'; }} />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-5xl bg-orange-50 dark:bg-orange-900/20">📝</div>
                  )}
                </div>
                <div className="p-5">
                  <span className="badge badge-primary mb-2 capitalize">{blog.category?.replace('-', ' ')}</span>
                  <h3 className="font-bold text-gray-900 dark:text-white line-clamp-2 mb-2 group-hover:text-orange-500 transition-colors">{blog.title}</h3>
                  <p className="text-sm text-gray-500 line-clamp-2 mb-3">{blog.excerpt}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-400">
                    <span className="flex items-center gap-1"><Calendar size={12} /> {new Date(blog.publishedAt).toLocaleDateString('en-IN')}</span>
                    <span className="flex items-center gap-1"><Clock size={12} /> {blog.readTime || 3} min read</span>
                    <span className="flex items-center gap-1"><Eye size={12} /> {blog.views?.toLocaleString()}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
