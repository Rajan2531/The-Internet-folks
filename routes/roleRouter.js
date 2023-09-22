const express=require("express");
const Router=express.Router();
const userController=require("./../controllers/userController.js");
const roleController= require("./../controllers/roleController.js");
Router.route("/").get(userController.protect,roleController.getAllRoles).post(roleController.createRole);


module.exports=Router;