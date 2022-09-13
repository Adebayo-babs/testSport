const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  fn:{
    type:String,
    required:true
  },
  ln:{
    type:String,
    required:true
  },
  email:{
    type:String,
    required:true
  },
  username:{
    type:String,
    required:true
  },
  password:{
    type:String,
    required:true
  },
  image:{
    data:Buffer,
    contentType: String
  },
  dateregistered:{
    type:Date,
    default: Date.now()
  }
})

module.exports = new mongoose.model('Admin', adminSchema);
