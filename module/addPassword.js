var mongoosePaginate = require('mongoose-paginate');
const mongoose=require('mongoose');
const { schema } = require('./user');
mongoose.connect("mongodb://localhost:27017/pms",{useNewUrlParser:true,useCreateIndex:true,});
var con=mongoose.connections;
var passSchema=new mongoose.Schema({
    password_category:{type:String,
        required:true,
    },
        project_name:{type:String,
            required:true,
            },
        password_detail:{type:String,
            required:true,
            
             },
       
            date:{
                type:Date,
                default:Date.now
            }
});
passSchema.plugin(mongoosePaginate);
var passModel=mongoose.model('password_details',passSchema);
module.exports=passModel;