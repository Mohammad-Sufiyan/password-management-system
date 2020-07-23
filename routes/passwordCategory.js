var express = require('express');
var router = express.Router();
var userModule=require('../module/user');
var passCatModel=require('../module/passwordCategory');
var passModel=require('../module/addPassword');
var bcrypt=require('bcryptjs')
var jwt=require('jsonwebtoken');
const { LocalStorage } = require('node-localstorage');
const {check, validationResult } = require('express-validator');

const passCateModel = require('../module/passwordCategory');
 var getPassCat=passCateModel.find({});
 var getAllPass=passModel.find({});
/* GET home page. */


function checkLoginUser(req,res,next){
  var userToken=localStorage.getItem('userToken');
  try{
var decoded= jwt.verify(userToken,'loginToken')
  }catch(err){
    res.redirect('/');
  }
  next();
}




if(typeof localStorage === "undefined" || localStorage === null){
  var localStorage = require('node-localstorage').localStorage;
  localStorage = new LocalStorage('./scratch');
}



function checkUsername(req,res,next){
  var username=req.body.txt3;
  var checkexistUsername=userModule.findOne({username:username});
  checkexistUsername.exec(function(err,data){
if(err) throw err;
if(data){
return res.render('signup', { title: 'Password Management System',msg:'Username already exist' });
}
next();
  });  
 }


 function checkEmail(req,res,next){
  var email=req.body.txt4;
  var checkexistemail=userModule.findOne({email:email});
  checkexistemail.exec(function(err,data){
if(err) throw err;
if(data){
return res.render('signup', { title: 'Password Management System',msg:'Email already exist' });
}
next();
  });  
 }

 
router.get('/',checkLoginUser, function(req, res, next) {
    var loginUser=localStorage.getItem('loginUser');
    getPassCat.exec(function(err,data){
      if(err) throw err;
    res.render('password_category', { title: 'Password Category List' ,loginUser:loginUser,records:data });
  
  });
  });
  
  router.get('/delete/:id',checkLoginUser, function(req, res, next) {
    var loginUser=localStorage.getItem('loginUser');
    var passcatId=req.params.id;
    var passDelete=passCateModel.findByIdAndDelete(passcatId);
    passDelete.exec(function(err,data){
      if(err) throw err;
   res.redirect('/passwordCategory');
  
  });
  });
  
  router.get('/edit/:id',checkLoginUser, function(req, res, next) {
    var loginUser=localStorage.getItem('loginUser');
    var passcatId=req.params.id;
    var getPassCat=passCateModel.findById(passcatId);
    getPassCat.exec(function(err,data){
      if(err) throw err;
      res.render('editPasswordCategory', { title: 'Password Category List' ,loginUser:loginUser,errors:'',success:'',records:data,id:passcatId });
  
  });
  });
  
  
  router.post('/edit/',checkLoginUser, function(req, res, next) {
    var loginUser=localStorage.getItem('loginUser');
    var passcatId=req.body.id;
    var passCatName=req.body.passcat;
    var updatePassCat=passCateModel.findByIdAndUpdate(passcatId,{password_category:passCatName});
    updatePassCat.exec(function(err,doc){
      if(err) throw err;
     res.redirect('/passwordCategory');
  });
  });
  
module.exports = router;
