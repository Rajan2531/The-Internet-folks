


const sendErrorForDevelopmentMode=function(err,res){
   
   
    const param=err.param;
    res.status(err.statusCode).json({

        status:false,
        errors:[{
            param,
           message:err.message,
           code:err.code,
           
        }]
     
       
        
    })
}

const castErrorHandler=function(err,res)
{
    res.status(500).json({
        status:false,
        message:"Invalid id provided or failed to cast to required data type"
    })
}
const errorOrganizer=function(err,res)
{
    res.status(404).json({
       
        status:false,
        errors:err
       
    })
}
module.exports=(err,req,res,next)=>{
 
    if(err.code==11000)
    {
        err.message="Duplicate data";
    }
   if(err.isOperational!=true)
   errorOrganizer(err,res);
    if(err.name==="CastError")
    castErrorHandler(err,res);
    console.log(err.name)
    if(process.env.NODE_ENV==='development')
    {
        sendErrorForDevelopmentMode(err,res);
    }
 
    
}