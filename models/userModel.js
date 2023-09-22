const { Snowflake } = require("@theinternetfolks/snowflake");
const mongoose=require("mongoose");
const validator=require("validator");
const bcrypt= require("bcryptjs")
const userSchema=new mongoose.Schema({

    name:{
        type:String,
        
        minLength:[2,"Name should be atleast 2 characters"]
    },
    email:{
        type:String,
        required:true,
        unique:true,
        validate:[validator.isEmail, "Invalid email format"]
            
        
    },
    password:{
        type:String,
        required:true,
        select:false
    },
    created_at:{
        type:Date,
        default:Date.now()
    }
});

// only run this fuction if password was actually modified
userSchema.pre('save', async function(next){
    if(!this.isModified("password"))
    return next();
    // hash the password 
    this.password=await bcrypt.hash(this.password,12);
    next();

})

 // creating an instance method
 userSchema.methods.comparePassword=async function(inputPassword, databasePassword)
                                    {
                                        return await bcrypt.compare(inputPassword,databasePassword)
                                    }
const User = mongoose.model('User',userSchema);

module.exports=User;