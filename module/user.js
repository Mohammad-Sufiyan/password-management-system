const mongoose=require('mongoose');
mongoose.connect("mongodb+srv://sufiyan:sufiyan123@cluster0-zhxqr.mongodb.net/pms?retryWrites=true&w=majority",{useNewUrlParser:true,useCreateIndex:true,});
var con=mongoose.connections;
var userSchema=new mongoose.Schema({
    username:{type:String,
        required:true,
        index:{
            unique:true,
        } },
        email:{
            type:String,
            required:true,
            index:{
                unique:true,
            } },
            password:{
                type:String,
                required:true
            },
            date:{
                type:Date,
                default:Date.now
            }
});

var userModel=mongoose.model('users',userSchema);
module.exports=userModel;