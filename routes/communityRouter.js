const express=require("express");
const Router=express.Router();
const Role=require("./../models/communityModel.js")
const communityController=require("./../controllers/communityController.js");
const userController=require("./../controllers/userController.js");
Router.route("/:id/members").get(communityController.getAllMembers)
Router.route("/").get(userController.protect,communityController.getAllCommunities).post(userController.protect,communityController.createCommunity);

Router.route("/me/owner").get(userController.protect,communityController.getMeOwnedCommunities)
Router.route("/me/member").get(userController.protect,communityController.getMeJoindCommunites);


module.exports=Router;