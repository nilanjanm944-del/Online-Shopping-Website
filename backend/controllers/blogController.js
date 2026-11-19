const Blog = require('../models/Blog');

exports.getBlogs = async (req, res, next) => {
  try {
    const { page = 1, limit = 9, category } = req.query;
    const query = { isPublished: true };
    if (category) query.category = category;
    const [blogs, total] = await Promise.all([
      Blog.find(query).populate('author', 'name avatar').sort({ publishedAt: -1 }).skip((page-1)*limit).limit(parseInt(limit)),
      Blog.countDocuments(query)
    ]);
    res.json({ success: true, data: blogs, total, pages: Math.ceil(total / limit) });
  } catch (err) { next(err); }
};

exports.getBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug, isPublished: true }).populate('author', 'name avatar');
    if (!blog) return res.status(404).json({ success: false, message: 'Blog not found' });
    blog.views += 1;
    await blog.save();
    res.json({ success: true, data: blog });
  } catch (err) { next(err); }
};

exports.createBlog = async (req, res, next) => {
  try {
    req.body.author = req.user._id;
    req.body.authorName = req.user.name;
    if (req.body.isPublished) req.body.publishedAt = Date.now();
    const blog = await Blog.create(req.body);
    res.status(201).json({ success: true, data: blog });
  } catch (err) { next(err); }
};

exports.updateBlog = async (req, res, next) => {
  try {
    if (req.body.isPublished) req.body.publishedAt = Date.now();
    const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!blog) return res.status(404).json({ success: false, message: 'Blog not found' });
    res.json({ success: true, data: blog });
  } catch (err) { next(err); }
};

exports.deleteBlog = async (req, res, next) => {
  try {
    await Blog.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Blog deleted' });
  } catch (err) { next(err); }
};
