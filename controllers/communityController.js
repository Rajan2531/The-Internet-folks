const appError = require("../utils/appError.js");
const Member=require("./../models/memberModel.js");
const Community=require("./../models/communityModel.js");
const Role=require("./../models/roleModel.js")
const {catchAsync}=require("./../utils/asyncError.js");
const snowflake=require("@theinternetfolks/snowflake")
const pagination =require("./../utils/pagination.js");


exports.createCommunity=catchAsync(async(req,res,next)=>{
    console.log(req.users)
    const id=req.users._id;
    const name=req.body.name;
    if(name.length<2)
    {
        return next(new appError("Name should be at least 2 characters.",400,"INVALID_INPUT","name"));
    }
const community={
    name:name,
    owner:id
}
const role=await Role.findOne({name:"Community admin"});
console.log(community);
const newCommunity=await Community.create(community);
const membershipData={
    community:newCommunity._id,
    user:id,
    role:role._id
};
const member=await Member.create(membershipData);
if(!newCommunity)
return next(new appError("community could not be created",404));

res.status(200).json({
    status:true,
    content:{
        data:newCommunity
    }
})

})

exports.getAllCommunities=catchAsync(async(req,res,next)=>{

    if(!req.query)
    {
        req.query.page=null;
        req.query.limit=null;
    }
   if(!req.query.page)
   {
    req.query.page=1;
   }
   if(!req.query.limit)
   {
    req.query.limit=100
   }
   const {limit:limitPerPage}=req.query;
 
    const totalDocuments=await Community.countDocuments();
    
    const totalPages=Math.ceil(totalDocuments/limitPerPage);
    const currentPage=req.query.page||1;
    const query= Community.find();
    let paginate=  new pagination(query,req.query).pagination();
   
    const communities =await paginate.mongoQuery;
    res.status(200).json({
        status:true,
        content:{
            meta:{
                total:totalDocuments,
                pages:totalPages,
                page:currentPage
            },
            data:communities
        }
    })
})



exports.getAllMembers=catchAsync(async(req,res,next)=>{
    const id=(req.params.id);
    

    if(!req.query)
    {
        req.query.page=null;
        req.query.limit=null;
    }
   if(!req.query.page)
   {
    req.query.page=1;
   }
   if(!req.query.limit)
   {
    req.query.limit=100
   }
   const {limit:limitPerPage}=req.query;
 
    const totalDocuments=await Member.countDocuments({community:id});
    
    const totalPages=Math.ceil(totalDocuments/limitPerPage);
    const currentPage=req.query.page||1;
     
  




    const query= Member.find({community:id});
    let paginate=  new pagination(query,req.query).pagination();
   
    const members =await paginate.mongoQuery;
    console.log(members);
    res.status(200).json({
        status:true,
        content:{
            mete:{
                total:totalDocuments,
                pages:totalPages,
                page:currentPage
            },
            data:members
        }
    })
})


exports.getMeOwnedCommunities=catchAsync(async(req,res,next)=>{
    const ownerId=req.users._id;
    // checking if there is any query for limitation
   
    if(!req.query)
    {
        req.query.page=null;
        req.query.limit=null;
    }
   if(!req.query.page)
   {
    req.query.page=1;
   }
   if(!req.query.limit)
   {
    req.query.limit=100
   }
   const {limit:limitPerPage}=req.query;
    const totalDocuments=await Community.countDocuments({owner:ownerId});
    const totalPages=Math.ceil(totalDocuments/limitPerPage);
    const currentPage=req.query.page||1;
    const query= Community.find({owner:ownerId});
    let paginate=  new pagination(query,req.query).pagination();
    const communities =await paginate.mongoQuery;
    res.status(200).json({
        status:true,
        content:{
            meta:{total:totalDocuments,
                pages:totalPages,
                page:currentPage},
            data:communities
        }
    })
})

exports.getMeJoindCommunites=catchAsync(async(req,res,next)=>{
    const loggedInUserId=req.users._id;


    if(!req.query)
    {
        req.query.page=null;
        req.query.limit=null;
    }
   if(!req.query.page)
   {
    req.query.page=1;
   }
   if(!req.query.limit)
   {
    req.query.limit=100
   }
   const {limit:limitPerPage}=req.query;
 
    const totalDocuments=await Community.countDocuments({owner:{$ne:loggedInUserId}});
    
    const totalPages=Math.ceil(totalDocuments/limitPerPage);
    const currentPage=req.query.page||1;
     
    const query= Community.find({owner:{$ne:loggedInUserId}}).populate({path:"ownwer",select:"name"});

    let paginate=  new pagination(query,req.query).pagination();
   
    const communities =await paginate.mongoQuery;


   
    res.status(200).json({
        status:true,
        content:{
            meta:{total:totalDocuments,
                pages:totalPages,
                page:currentPage},
            data:communities
        }
    })
})