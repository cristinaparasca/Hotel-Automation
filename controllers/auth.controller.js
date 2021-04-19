const db = require("../index")
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')

exports.login=async(req,res,next)=>{
    try{
        const user= await db.User.findOne({where:{
            email:req.body.email
        }})
        if(!user){
            return res.status(404).send({message:"Email not found!"})
        }
        if(!bcrypt.compareSync(req.body.password,user.password)){
            return res.status(404).send({message:"Password incorrect!"})
        }
        let token=jwt.sign({userId:user.id,roleId:user.roleId},process.env.ACCESS_TOKEN_SECRET);
        return res.status(200).send({
            title:"login",
            token:token
        })
    }
    catch(err){
        res.status(500).send(err.message);
    }
    
}
exports.authenticated=(req,res,next)=>{
    let token=req.headers.token;
    console.log(token)
    jwt.verify(token,process.env.ACCESS_TOKEN_SECRET,(err,decoded)=>{
        if(err){
            return res.status(401).send({message:"unauthorized"})
        }
        next()
    })
}
exports.authenticatedAdmin=async(req,res,next)=>{
    let token=req.headers.token;
    console.log(token)
    jwt.verify(token,process.env.ACCESS_TOKEN_SECRET,async(err,decoded)=>{
        if(err){
            return res.status(401).send({message:"unauthorized"})
        }
        const user=await db.User.findOne({where:{id:decoded.userId}})
        if(!user)
            return res.status(404).send({message:"No user with given id"})

        if(user.roleId!=1)
            return res.status(401).send({message:"unauthorized"})
        next()
    })
    
    
}