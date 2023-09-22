const User=require("./../models/userModel.js");
const snowflake=require('@theinternetfolks/snowflake')
const {catchAsync}=require("./../utils/asyncError.js");
const appError= require("./../utils/appError.js")
const jwt = require("jsonwebtoken");
const util=require("util");
const Member=require("./../models/memberModel.js");
const Role = require("../models/roleModel.js");
const Community=require("./../models/communityModel.js")
// sign up function
exports.signup=catchAsync(async(req,res,next)=>{
    let {name,email,password}=req.body;
    // if(!validator.isEmail(email))
    // {
    //     return next(new appError("Please provide valid email address",400,"INVALID_INPUT","email"));
    // }
    if(!email||!password)
    {
        return next(new appError("Please provide email and password",400,"NO_DATA","email"));  
    }

    if(name.length<2)
    {
        return next(new appError("Name should be at least 2 characters.",400,"INVALID_INPUT","name"));
    }
    if(password.length<6)
    {
        return next(new appError("Password should be at least 6 characters.",400,"INVALID_INPUT","password"));
    }
    let userDetails={name,email,password};
  
    const checkUserExists=await User.findOne({email:email});
    if(checkUserExists)
    {
        return next(new appError("User with this email address already exists",400,"RESOURCE_EXISTS",""));
    }
    const newUser=await User.create(userDetails);
    if(!newUser)
    {
       
        return next(new appError("something went wrong",400,"INVALID_DATA",""));
    }
    const token=jwt.sign({_id:newUser._id},process.env.SECRET_JWT_CODE,{
        expiresIn:"2h"
    });
    res.status(200).json({
        status:true,
        content:{
            data:{
                _id:newUser._id,
                name:newUser.name,
                email:newUser.email,
                create_at:newUser.create_at
            },
            meta:{
                access_token:token
            }
        }});
    })

exports.login=catchAsync(async(req,res,next)=>{

    const {email,password}=req.body;
    // if(!validator.isEmail(email))
    // {
    //     return next(new appError("Please provide valid email address",400,"INVALID_INPUT","email"));
    // }
    if(!email||!password)
    {
        return next(new appError("Please provide email and password",400,"NO_DATA","email"));  
    }

    const user=await User.findOne({email:email}).select("+password"); 

    if(!user)
    {
        return next(new appError("Please provide a valid email address.", 400,"INVALID_INPUT","email"));
    }


    const correctPassword=await user.comparePassword(password,user.password);

    // console.log(correctPassword);


    if(!correctPassword)
    {
        return next(new appError("The credentials you provided are invalid.",400,"INVALID_CREDENTIALS","password"));
    }

    const token=jwt.sign({id:user._id},process.env.SECRET_JWT_CODE,{
        expiresIn:"2h"
    })
    res.status(200).json({
        status:true,
        content:{
            data:{
                _id:user._id,
                name:user.name,
                email:user.email,
                created_at:user.created_at
            },
            meta:{
                access_token:token
            }
        }
    })

})

exports.protect=catchAsync(async(req,res,next)=>{
    let token;
    if(req.headers.authorization&&req.headers.authorization.startsWith('Bearer'))
    {
        token=req.headers.authorization.split(' ')[1];
    }
    if(!token)
    {
        return next(new appError("You are not logged in! Please log in to get access",401,"NOT_SIGNEDIN"));
    }
  
    const decodedTokenData=await util.promisify(jwt.verify)(token,process.env.SECRET_JWT_CODE);
    console.log(decodedTokenData);
     const user=await User.findOne({_id:decodedTokenData.id})
     
     if(!user)
     {
        return next(new appError("Invalid credentials",401));
     }
     req.users=user;
    
     next();

})

exports.getMe=catchAsync(async(req,res,next)=>{
        const users=req.users;
        res.status(200).json({
            status:true,
            content:{
                data:users,
                

        }})
    })

exports.authorize=catchAsync(async(req,res,next)=>{
    const id=req.users._id;
    
   
    const member=await Member.findOne({user:id,community:req.body.community}).populate({path:"role",select:"name"});
  
   
    

    if(!member)
    {
        return next(new appError("You are not authorized to perform this action.",400,"NOT_ALLOWED_ACCESS"))
    }
   // const role=await Role.findOne({_id:member.role});
   
    if(member.role.name!="Community admin")
    return next(new appError("NOT_ALLOWED_ACCESS",404));
    next();
})