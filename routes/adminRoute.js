const express = require('express');
const router = express.Router();

const {signup, login, upload, aSignUp, aLoginPost, dashboard} = require('../controller/adminController');

router.get('/signup', signup);
router.get('/login', login);
router.post('/signup', upload.single('image'), aSignUp);
router.post('/login', aLoginPost);
router.get('/dashboard', dashboard);
// router.get('/addPro', addPro);
// router.post('/addPro', upload.single('image'), addProPost);
// router.get('/viewPro', viewPro);
// router.get('/edit/:r_id', edit);
// router.post('/editP/:r_id', editP);
// router.get('/delete/:r_id', deleteP);
// router.get('/logout', logout);

module.exports = router;
