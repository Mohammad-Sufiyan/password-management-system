const mongoose=require('mongoose');
mongoose.connect("mongodb://localhost:27017/pms",{useNewUrlParser:true,useCreateIndex:true,});
var con=mongoose.connections;
var passwordCategorySchema=new mongoose.Schema({
    password_category:{type:String,
        required:true,
        
         },
       
            date:{
                type:Date,
                default:Date.now
            }
});

var passCateModel=mongoose.model('password_categories',passwordCategorySchema);
module.exports=passCateModel;