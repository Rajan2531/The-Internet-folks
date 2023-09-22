const express=require("express");
const Router=express.Router();
const userController=require("./../controllers/userController.js");
const memberController=require("./../controllers/memberController.js");
const Role=require("./../models/communityModel.js")
Router.route("/").post(userController.protect,userController.authorize,memberController.addMember);
Router.route("/:id").delete(userController.protect,memberController.deleteMember);

module.exports=Router;