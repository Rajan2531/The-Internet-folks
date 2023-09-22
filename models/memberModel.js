const mongoose=require("mongoose");
const {Snowflake}=require("@theinternetfolks/snowflake")
const memberSchema=new mongoose.Schema({
   
    community:{
        type:mongoose.Schema.ObjectId,
        ref:"Community",
        required:true
        
    },
    user:{
        type:mongoose.Schema.ObjectId,
        ref:"User",
        required:true
    },
    role:{
        type:mongoose.Schema.ObjectId,
        ref:"Role",
        require:true
    },
    created_at:{
        type:Date,
        default:Date.now()
    }
})

memberSchema.pre(/^find/,function(next){
    this.populate({
        path:"user",
        select:"name"
    }).populate({
        path:"role",
        select:"name"
    })
    next();
})

const Member=mongoose.model("Member",memberSchema);
module.exports=Member;