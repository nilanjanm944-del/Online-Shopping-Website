import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit, Eye } from 'lucide-react';
import { blogAPI } from '../../services/api';
import useAuthStore from '../../store/authStore';
import { AdminSidebar } from './AdminDashboard';
import toast from 'react-hot-toast';

const emptyBlog = {
  title: '', excerpt: '', content: '', category: 'news', tags: '', featuredImage: '', isPublished: false
};

export default function AdminBlog() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyBlog);
  const [saving, setSaving] = useState(false);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    blogAPI.getAll({ limit: 50 }).then(res => setBlogs(res.data.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data = { ...form, tags: form.tags ? form.tags.split(',').map(t => t.trim()) : [] };
      if (editId) {
        const res = await blogAPI.update(editId, data);
        setBlogs(prev => prev.map(b => b._id === editId ? res.data.data : b));
        toast.success('Blog updated!');
      } else {
        const res = await blogAPI.create(data);
        setBlogs(prev => [res.data.data, ...prev]);
        toast.success('Blog created!');
      }
      setShowForm(false); setForm(emptyBlog); setEditId(null);
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this blog post?')) return;
    try {
      await blogAPI.delete(id);
      setBlogs(prev => prev.filter(b => b._id !== id));
      toast.success('Blog deleted');
    } catch { toast.error('Failed to delete'); }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-6">
      <div className="page-container">
        <div className="flex gap-6">
          <AdminSidebar active="/admin/blog" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Blog Posts</h1>
              <button onClick={() => { setShowForm(!showForm); setEditId(null); setForm(emptyBlog); }} className="btn-primary text-sm py-2">
                <Plus size={16} /> New Post
              </button>
            </div>

            {showForm && (
              <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-card mb-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2"><label className="label text-xs">Title *</label><input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} required className="input-field py-2 text-sm" /></div>
                    <div>
                      <label className="label text-xs">Category</label>
                      <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} className="input-field py-2 text-sm">
                        {['news','fashion','technology','shopping-guide','product-review','buying-guide','lifestyle'].map(c => <option key={c} value={c}>{c.replace('-', ' ')}</option>)}
                      </select>
                    </div>
                    <div><label className="label text-xs">Featured Image URL</label><input value={form.featuredImage} onChange={e => setForm(p => ({ ...p, featuredImage: e.target.value }))} className="input-field py-2 text-sm" placeholder="https://..." /></div>
                    <div className="sm:col-span-2"><label className="label text-xs">Excerpt</label><textarea value={form.excerpt} onChange={e => setForm(p => ({ ...p, excerpt: e.target.value }))} rows={2} className="input-field resize-none text-sm" /></div>
                    <div className="sm:col-span-2"><label className="label text-xs">Content (HTML supported) *</label><textarea value={form.content} onChange={e => setForm(p => ({ ...p, content: e.target.value }))} required rows={8} className="input-field resize-none text-sm font-mono" /></div>
                    <div><label className="label text-xs">Tags (comma-separated)</label><input value={form.tags} onChange={e => setForm(p => ({ ...p, tags: e.target.value }))} className="input-field py-2 text-sm" placeholder="fashion, tips, guide" /></div>
                    <div className="flex items-center gap-3 pt-6">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={form.isPublished} onChange={e => setForm(p => ({ ...p, isPublished: e.target.checked }))} className="accent-orange-500 w-4 h-4" />
                        <span className="text-sm font-medium">Publish immediately</span>
                      </label>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button type="submit" disabled={saving} className="btn-primary text-sm">{saving ? 'Saving...' : (editId ? 'Update Post' : 'Create Post')}</button>
                    <button type="button" onClick={() => setShowForm(false)} className="btn-ghost border border-gray-200 text-sm">Cancel</button>
                  </div>
                </form>
              </div>
            )}

            <div className="space-y-3">
              {blogs.map(blog => (
                <div key={blog._id} className="bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-card flex items-start gap-4">
                  {blog.featuredImage && (
                    <img src={blog.featuredImage} alt={blog.title} className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                      onError={e => { e.target.style.display = 'none'; }} />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-800 dark:text-gray-200 text-sm line-clamp-1">{blog.title}</h3>
                      <span className={`badge text-xs ${blog.isPublished ? 'badge-success' : 'badge-warning'}`}>{blog.isPublished ? 'Published' : 'Draft'}</span>
                    </div>
                    <p className="text-xs text-gray-500 line-clamp-1">{blog.excerpt}</p>
                    <p className="text-xs text-gray-400 mt-1">{new Date(blog.createdAt).toLocaleDateString('en-IN')} · {blog.views} views</p>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button onClick={() => { setForm({ ...blog, tags: blog.tags?.join(', ') || '' }); setEditId(blog._id); setShowForm(true); }} className="p-1.5 text-gray-400 hover:text-orange-500"><Edit size={14} /></button>
                    <button onClick={() => handleDelete(blog._id)} className="p-1.5 text-gray-400 hover:text-red-500"><Trash2 size={14} /></button>
                  </div>
                </div>
              ))}
              {blogs.length === 0 && !loading && <div className="text-center py-8 text-gray-400">No blog posts yet.</div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
