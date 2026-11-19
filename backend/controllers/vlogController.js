const Vlog = require('../models/Vlog');

exports.getVlogs = async (req, res, next) => {
  try {
    const { page = 1, limit = 9, category } = req.query;
    const query = { isPublished: true };
    if (category) query.category = category;
    const [vlogs, total] = await Promise.all([
      Vlog.find(query).populate('author', 'name avatar').sort({ publishedAt: -1 }).skip((page-1)*limit).limit(parseInt(limit)),
      Vlog.countDocuments(query)
    ]);
    res.json({ success: true, data: vlogs, total, pages: Math.ceil(total / limit) });
  } catch (err) { next(err); }
};

exports.getVlog = async (req, res, next) => {
  try {
    const vlog = await Vlog.findById(req.params.id).populate('author', 'name avatar');
    if (!vlog || !vlog.isPublished) return res.status(404).json({ success: false, message: 'Video not found' });
    vlog.views += 1;
    await vlog.save();
    res.json({ success: true, data: vlog });
  } catch (err) { next(err); }
};

exports.createVlog = async (req, res, next) => {
  try {
    req.body.author = req.user._id;
    req.body.authorName = req.user.name;
    if (req.body.isPublished) req.body.publishedAt = Date.now();
    const vlog = await Vlog.create(req.body);
    res.status(201).json({ success: true, data: vlog });
  } catch (err) { next(err); }
};

exports.updateVlog = async (req, res, next) => {
  try {
    const vlog = await Vlog.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!vlog) return res.status(404).json({ success: false, message: 'Video not found' });
    res.json({ success: true, data: vlog });
  } catch (err) { next(err); }
};

exports.deleteVlog = async (req, res, next) => {
  try {
    await Vlog.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Video deleted' });
  } catch (err) { next(err); }
};
