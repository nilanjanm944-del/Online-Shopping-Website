const express = require('express');
const router = express.Router();
const {
  register, login, logout, getMe, updateProfile, updatePassword,
  forgotPassword, resetPassword, addAddress, updateAddress, deleteAddress
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:token', resetPassword);

router.use(protect);
router.get('/me', getMe);
router.put('/updateprofile', updateProfile);
router.put('/updatepassword', updatePassword);
router.post('/address', addAddress);
router.put('/address/:id', updateAddress);
router.delete('/address/:id', deleteAddress);

module.exports = router;
