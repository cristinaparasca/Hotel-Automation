const { body } = require("express-validator");
const {  param, validationResult } = require('express-validator');
const db=require("../index.js")
const jwt=require('jsonwebtoken')
const User=db.User;
const bcrypt=require('bcrypt');
const { Role } = require("../index.js");
const Guest=2;
var fs=require('fs')
exports.create=async(req,res)=>{
    try{
        var path
        const invalidUser=await User.findOne({where:{email:req.body.email}})
        if(invalidUser){
            return res.status(404).send({message:"User already exists"})
        }
        path='public\\img\\not-found.jpg'
        if(req.file){
            path=req.file.path
        }
        if(!req.body.roleId)
            req.body.roleId=Guest
        const hashedPass=bcrypt.hashSync(req.body.password,10)
        const user={
            first_name:req.body.first_name,
            last_name:req.body.last_name,
            email:req.body.email,
            password:hashedPass,
            gender:req.body.gender,
            age:req.body.age,
            profile_photo:path,
            roleId:req.body.roleId
        }
        User.create(user)
        res.status(200).json();
    }
    catch(err){
        if(req.file)
            fs.unlinkSync(req.file.path)
        res.status(500).send({
            message:err.message||"Some error ocured while creating user."
        })
    }
}
exports.getUser=async(req,res)=>{
    try{
        let token=req.headers.token;
        console.log(token)
        jwt.verify(token,process.env.ACCESS_TOKEN_SECRET,async(err,decoded)=>{
            if(err){
                return res.status(401).send({message:"unauthorized"})
            }
            const user=await User.findOne({
                where:{id:decoded.userId},
                attributes:{exclude:['password']}
            })
            if(!user){
                
                return res.status(404).send({message:"No user with given id"})
            }
                
            console.log(decoded.userId) 
            res.status(200).send(user)
        })
        
    }
    catch(err){
        res.status(500).send({err:err.message})
    }

}

exports.findByRole=async(req,res)=>{
    try{
        const id=req.params.roleId;
        const user=await User.findAll({where:{roleId:id},
            include:[{
                model:Role,
                attributes:['name']
            }]
        })
        if(!user)
            return res.status(404).send({message:`Cannot get User with id=${id}`})
        res.status(200).send(user);
    }
    catch(err){
        res.status(500).send({err:err.message})
    }
}
exports.findAll=(req,res)=>{
    User.findAll()
    .then(data=>{
        res.send(data);
    })
    .catch(err=>{
        res.status(500).send({
            message:err.message||"Some error ocured while getting users."
        })
    })
}

exports.update=async(req,res)=>{
    try{
        const id=req.params.id
        const user=await User.update(req.body,{where:{id:id}})
        if(user!=1)
            return res.status(404).send({message:`No user with id=${id}`})
        res.status(200).send({message:"User updated sucessfully!"})
    }
    catch(err){
        res.status(500).send({err:err.mesage})
    }
}
exports.updateProfile=async(req,res)=>{
    try{
        let token=req.headers.token;
        var decoded=jwt.decode(token)
        const id=decoded.userId
        const user=await User.findOne({where:{id:id}})
        if(!user){
            if(req.file)
                fs.unlinkSync(req.file.path)
            return res.status(404).send(`No user with id=${id}`)
        }
        if(req.file){
            if(user.profile_photo!=='public\\img\\not-found.jpg')
                fs.unlinkSync(user.profile_photo)
            user.profile_photo=req.file.path
        }
        if(req.body.email&&req.body.email!==user.email){
            const email=await User.findOne({where:{email:req.body.email}})
            if(email)
                return res.status(404).send("Email exists already")
        }
        if(req.body.password){
            req.body.password=bcrypt.hashSync(req.body.password,10)
        }
        if(req.body){
            Object.keys(req.body).forEach(value => {
                if (value !== 'profile_photo') {
                    user[value] = req.body[value];
                }
            });
            user.save();
        }
        res.status(200).send(user)
    }
    catch(err){
        if(req.file)
            fs.unlinkSync(req.file.path)
        res.status(500).send({err:err.message})
    } 
}

exports.sendMail=async(req,res)=>{
    try{
        const guests=await User.findAll({where:{roleId:req.params.roleId}});
        const transporter=require('../utils/mail')
        let emails=[];
        emails=guests.map(guest=>guest.email)
        const message={
            from:'"Hotel Atlantic" <admin@atlantic.com>',
            to:emails,
            text:req.body.message
        }
        let info=await transporter.sendMail(message)
        res.status(200).send("Mail sent!")
    }
    catch(err){
        res.status(500).send({err:err.message})
    }

}
exports.delete=async(req,res)=>{
    try{
        const id=req.params.id;
        const user=await User.findOne({where:{id:id}})
        User.destroy({where:{id:id}})
        if(!user){
            return res.status(404).send(`No user with id=${id}`)
        }
        if(user.profile_photo!=='public\\img\\not-found.jpg')
            fs.unlinkSync(user.profile_photo)
        res.status(200).send("User was deleted succesfully!")
    }
    catch(err){
        res.status(500).send({err:err.message})
    }
}

exports.validationRules=method=>{
    switch(method){
        case('create'):{
            return[
            body(['first_name','last_name']).exists().withMessage("Doesn't exist").isString().withMessage("Is not string"),
            body(['email']).exists().withMessage("Doesn't exist").bail().isEmail().withMessage("Is not string"),
            body(['password']).exists().withMessage("Enter password! ").bail().isString().withMessage("Is not string").notEmpty().withMessage("is empty"),
            body(['age']).optional().isInt().withMessage("Is not integer"),
            body(['gender','profile_photo']).optional()]
            break;
        }
        case('update'):{
            return[
                body(['first_name','last_name']).optional().isString().withMessage("Is not string"),
                body(['email']).optional().bail().isEmail().withMessage("Is not Email"),
                body(['password']).optional().bail().isString().withMessage("Is not string"),
                body(['age']).optional().isInt().withMessage("Is not integer"),
                body(['gender','profile_photo']).optional().isString()]
                break;
        }
    }
}
exports.validate=(req,res,next)=>{
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        if (req.file) {
            fs.unlinkSync(req.file.path);
        }
        const err = errors.array().map(object => {return  {msg: `${object.param}: ${object.msg}`}});
        res.status(422).json({ errors: err});
        return;
    }
    else {
        next();
        return;
    }
}
