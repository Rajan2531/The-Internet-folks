const mongoose =require('mongoose');
const slugify=require("slugify");
const {Snowflake}=require("@theinternetfolks/snowflake")
const communitySchema = new mongoose.Schema({

    name:{
        type:String
    },
    slug:{
        type:String,
       
        unique:true
    },
    owner:{
        type:String,
        ref:'User'
    },
    created_at:{
        type:Date,
        default:Date.now()
    },
    updated_at:{
        type:Date,
        default:Date.now()
    }

})

// communitySchema.pre(/^find/,function(next){
//     this.populate({
//         path:'owner',
//         select:"name"})

//     next();
// })
communitySchema.pre('save',function(next){
    this.slug=slugify(this.name,{lower:true});
    next();
})
const Community=mongoose.model("Community",communitySchema);

module.exports=Community;