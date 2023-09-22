const Role=require("./../models/roleModel.js");
const snowflake=require("@theinternetfolks/snowflake")
const pagination=require("./../utils/pagination.js");
const appError=require("./../utils/appError.js")
const { catchAsync } = require("../utils/asyncError.js");
exports.createRole=catchAsync(async(req,res,next)=>{
 
      
        const {name}=req.body;
        if(name.length<2)
        {
            return next(new appError("Name should be at least 2 characters.",400,"INVALID_INPUT","name"));
        }
        const role=await Role.create({name});
        if(!role)
        {
            return next(new appError("role could not be created",404));
        }
        console.log(role);
        res.status(200).json({
            status:true,
            content:{
                data:role
            }
        })

    
})

exports.getAllRoles=catchAsync(async(req,res)=>{
   
       


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
     
        const totalDocuments=await Role.countDocuments();
        
        const totalPages=Math.ceil(totalDocuments/limitPerPage);
        const currentPage=req.query.page||1;
        let query=Role.find();
      
        let paginate=  new pagination(query,req.query).pagination();
       
        const roles =await paginate.mongoQuery;
        
        res.status(200).json({
            status:true,
            content:{
                meta:{
                    total:totalDocuments,
                    pages:totalPages,
                    page:currentPage
                },
                data:roles
            }
        })
    })
    