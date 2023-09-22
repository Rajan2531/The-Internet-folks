const mongoose= require("mongoose");
const {Snowflake} = require("@theinternetfolks/snowflake");
const roleSchema = new mongoose.Schema({

    name:{
        type:String,
        unique:true,
        required:true,
        validate:{
            validator:function(val){
                return val.length>=2;
            },
            param:"name",
            message:"Name should be at least 2 characters",
            code:"invalid_input"
        }
    },
    create_at:{
        type:Date,
        default:Date.now()
    },
    updated_at:{
        type:Date,
        default:Date.now()
    }
})

const Role= mongoose.model('Role',roleSchema);


module.exports=Role;