const express= require("express");
const dotenv=require("dotenv");
dotenv.config();
const app=express();
const globalErrorHandler=require("./controllers/errorController")
const memberRouter=require("./routes/memberRouter.js");
const communityRouter=require("./routes/communityRouter.js")
const roleRouter=require("./routes/roleRouter.js");
const userRouter=require("./routes/userRouter.js");
app.use(express.json());
app.use("/v1/auth",userRouter);
app.use("/v1/role/",roleRouter);
app.use("/v1/community",communityRouter);
app.use("/v1/member",memberRouter);
app.use(globalErrorHandler);
module.exports=app;