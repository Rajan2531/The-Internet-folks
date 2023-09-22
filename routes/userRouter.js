const User= require('./../models/userModel');
const express=require("express");
const userController=require("./../controllers/userController.js");
const Router=express.Router();
Router.route('/signup').post(userController.signup);
Router.post('/login',userController.login);
Router.route('/me').get(userController.protect,userController.getMe);
module.exports=Router;