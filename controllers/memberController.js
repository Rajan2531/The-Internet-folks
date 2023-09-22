const Community = require("../models/communityModel");
const appError = require("../utils/appError");
const { catchAsync } = require("../utils/asyncError");
const Member=require("./../models/memberModel.js");
const Role=require("./../models/roleModel.js");
const User=require("./../models/userModel.js");

exports.addMember=catchAsync(async(req,res,next)=>{
    const memberDetails={community:req.body.community,user:req.body.user,role:req.body.role};
    
    const existing=await Member.findOne({community:memberDetails.community,user:memberDetails.user});
    const roleExists=await Role.findOne({_id:req.body.role});
    const userExists=await User.findOne({_id:req.body.user});
    const  communityExists=await Community.findOne({_id:req.body.community});
    if(!userExists)
    {
        return next(new appError("User not found.",400,"RESOURCE_NOT_FOUND","user"));
    }
    if(!roleExists)
    {
        return next(new appError("Role not found.",400,"RESOURCE_NOT_FOUND","role"));
    }
   
    if(!communityExists)
    {
        return next(new appError("Community not found",400,"RESOURCE_NOT_FOUND","community"))
    }

    
    if(existing)
    {
        return next(new appError("User is already added in the community",400,"RESOURCE_EXISTS"));
    }
    const member=await Member.create(memberDetails);
    res.status(200).json({
        status:true,
        content:{
            data:member
        }
    })
})

exports.deleteMember=catchAsync(async(req,res,next)=>{
     const memberIdToBeDeleted=req.params.id;

    
     const memberDetails=await Member.findOne({_id:memberIdToBeDeleted}).populate({path:"community"});
     if(!memberDetails)
     return next(new appError("Member not found.",200,"RESOURCE_NOT_FOUND"));

     const loggedInUserMemberDetails=await Member.findOne({user:req.users._id,community:memberDetails.community}).populate({path:"role",select:"name"});
    console.log(loggedInUserMemberDetails)
    if(!loggedInUserMemberDetails)
    {
        return next(new appError("NOT_ALLOWED_ACCESS",200));
    }
     if(loggedInUserMemberDetails.role.name!=="Community admin"&&loggedInUserMemberDetails.role.name!=="Community Moderator")
     return next(new appError("NOT_ALLOWED_ACCESS",401));

     const member=await Member.deleteOne({_id:memberIdToBeDeleted});
    
     const memberCountForCommunity=await Member.countDocuments();
     if(memberCountForCommunity==0)
     await Community.deleteOne({_id:memberDetails.community._id});

     res.status(200).json({
        status:true
     })


})