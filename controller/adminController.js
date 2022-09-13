const mongoose = require('mongoose');
const Admin = require('../model/admin');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');


let storage = multer.diskStorage({
    destination: (req, file, cb) => {
      //cb(null, 'uploads')
      cb(null, __dirname + '/uploads')
    },
    filename: (req, file, cb) => {
      cb(null, file.fieldname, '_' + Date.now())
    }
});

const upload = multer({storage: storage});

//Admin Signup
const signup = (req, res) => {
res.render('signup');
}

const aSignUp = (req, res) => {
  const {fn, ln, email, username, pass1, pass2} = req.body;
  let error = [];
  if(!fn || !ln || !email || !username || !pass1 || !pass2) {
    error.push({"msg": "Some fields are missing. Please fill all fields"});
  }

  if(pass1 !== pass2) {
    error.push({"msg": "Passwords do not match"});
  }

  if(error.length > 0) {
    res.render('signup', {error, fn, ln, email, username, pass1, pass2})
  } else {
   // BELOW WE ENCRYPT OUR Password
   bcrypt.hash(pass1, 10, (error, hash) => {
     const newAdmin = new Admin({
       fn,
       ln,
       email,
       username,
       password:hash,
       image:{
         data:fs.readFileSync(path.join(__dirname+'/uploads/'+req.file.filename)),
         contentType: '/image/png'
       }
     })

     newAdmin.save((err) => {
       if(err){
         req.flash('error_msg', 'There was a problem saving into the database');
         res.redirect('/signup');
       } else {
         req.flash('message', "Data successfully Captured. Now you can login");
        res.redirect('/login');
       }
     })
   })
  }
}

//Admin Login
const login = (req, res) => {
  res.render('login');
}

const aLoginPost = (req, res) => {

  const {username, password} = req.body;

  Admin.findOne({username:username}, (error, result) => {
    if(error) {
      res.send("There's an issue. Trying to resolve it");
    }

    if(!result) {
      req.flash('error_msg', "Username does not exist");
      res.redirect('/login');
    } else {
      // WE COMPARE THE PASSWORD ENTERED WITH THE HASHED PASSWORD
      bcrypt.compare(password, result.password, (err, isVerified) => {
        if(err) {
          req.flash('error_msg', "Something uncommon has happened.");
          res.redirect('/login');
        }

        if(isVerified){
            req.session.admin_id = result._id;
            req.session.username = result.username;
            res.redirect('/dashboard');
        } else {
          req.flash('error_msg', "Incorrect Password");
          res.redirect('/login');
        }

      })
    }
  })
}

const dashboard = (req, res) => {
  if(!req.session.admin_id && !req.session.username) {
    req.flash('error_msg', "Please login to access this Page");
    res.redirect('/login');
  } else {
    Admin.findOne({username:req.session.username}, (err, result) => {
      if(result){
        res.render('dashboard', {admin_id:req.session.admin_id, username:req.session.username, r:result});
      }
    })
  }
}


module.exports = ({
  signup,
  login,
  upload,
  aSignUp,
  aLoginPost,
  dashboard
})
