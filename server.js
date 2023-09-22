
const dotenv=require('dotenv'); 
const app=require('./app.js');
dotenv.config();
const mongoose=require("mongoose");

const url=process.env.DATABASE.replace("<PASSWORD>",process.env.DATABASE_PASSWORD);
mongoose.connect(url,{
    useNewUrlParser:true,
   
}).then(con=>{
   
    console.log("database connected successfully");
})




app.listen(process.env.PORT||3000,()=>{
    console.log('server is running on port 3000');
})