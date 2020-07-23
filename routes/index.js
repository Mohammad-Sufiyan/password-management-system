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


 router.get('/', function(req, res, next) {
  var loginUser=localStorage.getItem('loginUser');
  if(loginUser){
    res.redirect('/dashboard')
  }else{
  res.render('index', { title: 'Password Management System', msg:'' });
  }
});

router.post('/', function(req, res, next) {
  var username=req.body.txt1;
  var password=req.body.txt2;
  var checkUser=userModule.findOne({username:username});
  checkUser.exec(function(err, data){
if(err) throw err;
var getUserId=data._id;
var getPassword=data.password;
if(bcrypt.compareSync(password,getPassword)){
  var token = jwt.sign({userId:getUserId}, 'loginToken');
  localStorage.setItem('userToken', token);
  localStorage.setItem('loginUser', username);
  res.redirect('/dashboard');
}else{
  res.render('index', { title: 'Password Management System', msg:'Invalid Username and Password!!!'});
}
  });
 });


router.get('/dashboard',checkLoginUser, function(req, res, next) {
  var loginUser=localStorage.getItem('loginUser');
  res.render('dashboard', { title: 'Password Management System', msg:'',loginUser:loginUser });

});


router.get('/signup', function(req, res, next) {
  var loginUser=localStorage.getItem('loginUser');
  if(loginUser){
    res.redirect('/dashboard')
  }else{
  res.render('signup', { title: 'Password Management System',msg:'' });
  }
});

router.post('/signup',checkUsername,checkEmail, function(req, res, next) {
var username=req.body.txt3;
var email=req.body.txt4;
var password=req.body.txt5;
var confpassword=req.body.txt6;
if(password!=confpassword){
  res.render('signup', { title: 'Password Management System', msg:'Password not matched from ConfirmPassword!!!' });
}else{
password= bcrypt.hashSync(req.body.txt5,10);
var userDetails=new userModule({
  username:username,
  email:email,
  password:password
});
userDetails.save(function(err,doc){
if(err) throw err;
res.render('signup', { title: 'Password Management System', msg:'User Registered Seccessfully!!!' });
});}
});

router.get('/passwordCategory',checkLoginUser, function(req, res, next) {
  var loginUser=localStorage.getItem('loginUser');
  getPassCat.exec(function(err,data){
    if(err) throw err;
  res.render('password_category', { title: 'Password Category List' ,loginUser:loginUser,records:data });

});
});

router.get('/passwordCategory/delete/:id',checkLoginUser, function(req, res, next) {
  var loginUser=localStorage.getItem('loginUser');
  var passcatId=req.params.id;
  var passDelete=passCateModel.findByIdAndDelete(passcatId);
  passDelete.exec(function(err,data){
    if(err) throw err;
 res.redirect('/passwordCategory');

});
});

router.get('/passwordCategory/edit/:id',checkLoginUser, function(req, res, next) {
  var loginUser=localStorage.getItem('loginUser');
  var passcatId=req.params.id;
  var getPassCat=passCateModel.findById(passcatId);
  getPassCat.exec(function(err,data){
    if(err) throw err;
    res.render('editPasswordCategory', { title: 'Password Category List' ,loginUser:loginUser,errors:'',success:'',records:data,id:passcatId });

});
});


router.post('/passwordCategory/edit/',checkLoginUser, function(req, res, next) {
  var loginUser=localStorage.getItem('loginUser');
  var passcatId=req.body.id;
  var passCatName=req.body.passcat;
  var updatePassCat=passCateModel.findByIdAndUpdate(passcatId,{password_category:passCatName});
  updatePassCat.exec(function(err,doc){
    if(err) throw err;
   res.redirect('/passwordCategory');
});
});


router.get('/add-new-category',checkLoginUser, function(req, res, next) {
  var loginUser=localStorage.getItem('loginUser');
  
res.render('addNewCategory', { title: 'Password Category List' ,loginUser:loginUser,errors:'',success:''});

  
});

router.post('/add-new-category',checkLoginUser,[check('passcat','Enter Password Category Name').isLength({ min : 1})] ,function(req, res, next) {
  var loginUser=localStorage.getItem('loginUser');
  const errors = validationResult(req);
  if(!errors.isEmpty()){
  
    res.render('addNewCategory', { title: 'Password Category List' ,loginUser:loginUser, errors:errors.mapped(),success:''});
  }else{
    var passCatName=req.body.passcat;
    var passwordCatDetails=new passCateModel({
      password_category:passCatName
    });
    passwordCatDetails.save(function(err,doc){
      if(err) throw err;
      res.render('addNewCategory', { title: 'Password Category List' ,loginUser:loginUser,errors:'',success:'Password Category Inserted Successfully'});
    });
    
  }
 

});

router.get('/add-new-password',checkLoginUser, function(req, res, next) {
  var loginUser=localStorage.getItem('loginUser');
  getPassCat.exec(function(err,data){
    if(err) throw err;
    res.render('addNewPassword', { title: 'Password Category List',loginUser:loginUser,records:data,success:'' });
  });
 

});

router.post('/add-new-password',checkLoginUser, function(req, res, next) {
  var loginUser=localStorage.getItem('loginUser');
  var pass_cate=req.body.pass_cate;
  var pass_detail=req.body.pass_details;
  var project_name=req.body.project_name;
  var password_details=new passModel({
    password_category:pass_cate,
    project_name:project_name,
    password_detail:pass_detail
  });
  
    password_details.save(function(err,doc){
      getPassCat.exec(function(err,data){
        if(err) throw err;
      res.render('addNewPassword', { title: 'Password Category List',loginUser:loginUser,records:data,success:'Password Details Inserted Successfully!!!' });

    });
   
  });
 

});

/*
router.get('/view-all-password',checkLoginUser, function(req, res, next) {
  var loginUser=localStorage.getItem('loginUser');
  var perPage= 3;
  var page= 1;
getAllPass.skip((perPage * page)- perPage)
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


  router.get('/view-all-password/:page',checkLoginUser, function(req, res, next) {
    var loginUser=localStorage.getItem('loginUser');
    var perPage= 1;
    var page= req.params.page || 1;
  getAllPass.skip((perPage * page)- perPage)
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
*/
router.get('/view-all-password',checkLoginUser, function(req, res, next) {
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

  router.get('/view-all-password/:page',checkLoginUser, function(req, res, next) {
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


  router.get('/view-all-password/edit/:id',checkLoginUser, function(req, res, next) {
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

  router.post('/view-all-password/edit/:id',checkLoginUser, function(req, res, next) {
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
 
  router.get('/view-all-password/delete/:id',checkLoginUser, function(req, res, next) {
    var loginUser=localStorage.getItem('loginUser');
    var id=req.params.id;
    var passDelete=passModel.findByIdAndDelete(id);
    passDelete.exec(function(err,data){
      if(err) throw err;
   res.redirect('/view-all-password');
  
  });
  });

router.get('/logout', function(req, res, next) {
  localStorage.removeItem('userToken');
  localStorage.removeItem('loginUser');
  res.redirect('/');

});


module.exports = router;
