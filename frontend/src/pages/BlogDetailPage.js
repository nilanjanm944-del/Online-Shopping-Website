import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { blogAPI } from '../services/api';

export default function BlogDetailPage() {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    blogAPI.getBySlug(slug).then(res => setBlog(res.data.data)).catch(() => {}).finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" /></div>;
  if (!blog) return <div className="text-center py-16"><p className="text-gray-500">Blog not found</p><Link to="/blog" className="btn-primary mt-4 inline-block">Back to Blog</Link></div>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8">
      <div className="page-container max-w-3xl">
        <Link to="/blog" className="text-orange-500 hover:text-orange-600 text-sm mb-4 inline-flex items-center gap-1">← Back to Blog</Link>
        
        {blog.featuredImage && (
          <img src={blog.featuredImage} alt={blog.title}
            className="w-full h-72 object-cover rounded-2xl mb-6"
            onError={e => { e.target.style.display = 'none'; }} />
        )}

        <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-card">
          <span className="badge badge-primary mb-3 capitalize">{blog.category?.replace('-', ' ')}</span>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-4">{blog.title}</h1>
          <div className="flex items-center gap-4 text-sm text-gray-400 mb-6 pb-6 border-b border-gray-100 dark:border-gray-800">
            <span>By {blog.authorName}</span>
            <span>{new Date(blog.publishedAt).toLocaleDateString('en-IN')}</span>
            <span>{blog.readTime} min read</span>
            <span>{blog.views} views</span>
          </div>
          <div className="prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-300 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: blog.content }} />
        </div>
      </div>
    </div>
  );
}
