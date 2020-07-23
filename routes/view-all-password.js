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
   
    var options={
      offset:  1,
      limit:  3
    };
  passModel.paginate({},options).then(function(result){
   
   
    res.render('viewAllPassword', { title: 'View Password List' ,
    loginUser: loginUser,
    records: result.docs,
    current: result.offset,
    pages: Math.ceil(result.total / result.limit)
  
  });
  });
    });
  
    router.get('/:page',checkLoginUser, function(req, res, next) {
      var loginUser=localStorage.getItem('loginUser');
      var perPage= 3;
      var page= req.params.page || 1;
    getAllPass.skip((perPage * page) - perPage)
    .limit(perPage).exec(function(err,data){
      if(err) throw err;
      passModel.countDocuments({}).exec((err,count)=>{
      res.render('viewAllPassword', { title: 'View Password List' ,
      loginUser: loginUser,
      records: data,
      current: page,
      pages: Math.ceil(count / perPage)
    });
    });
    });
      });
  
  
    router.get('/edit/:id',checkLoginUser, function(req, res, next) {
      var loginUser=localStorage.getItem('loginUser');
      var id=req.params.id;
      var getPassDetails=passModel.findById({_id:id})
      getPassDetails.exec(function(err,data){ 
        if(err) throw err;
        getPassCat.exec(function(err,data1){
          res.render('edit_password_detail', { title: 'View Password List' ,loginUser:loginUser,records:data1, record:data,success:''});
        });
      
      });
      
    });
  
    router.post('/edit/:id',checkLoginUser, function(req, res, next) {
      var loginUser=localStorage.getItem('loginUser');
      var id=req.params.id;
      var passcat=req.body.pass_cate;
      var project_name=req.body.project_name;
      var pass_details=req.body.pass_details;
       passModel.findByIdAndUpdate(id,{password_category:passcat,project_name:project_name,password_detail:pass_details}).exec(function(err){
      if(err) throw err;
        var getPassDetails=passModel.findById({_id:id})
      getPassDetails.exec(function(err,data){ 
        if(err) throw err;
        getPassCat.exec(function(err,data1){
          res.render('edit_password_detail', { title: 'View Password List' ,loginUser:loginUser,records:data1, record:data,success:'Password Updated Successfully!!!'});
       
        });
        });
      
      });
      
    });
   
    router.get('/delete/:id',checkLoginUser, function(req, res, next) {
      var loginUser=localStorage.getItem('loginUser');
      var id=req.params.id;
      var passDelete=passModel.findByIdAndDelete(id);
      passDelete.exec(function(err,data){
        if(err) throw err;
     res.redirect('/view-all-password');
    
    });
    });
  
  
module.exports = router;
