const db=require('../index.js')
const Room=db.Room;
const Reservation=db.Reservation;
const { body } = require("express-validator");
var fs=require('fs')
const NO_IMAGE='public\\img\\no_image.jpg'
exports.create=(req,res)=>{
    paths=[NO_IMAGE,NO_IMAGE,NO_IMAGE]
    if(req.files!=null)
        paths = req.files.map(file => file.path)
    let fac = req.body.facilities;
    let facil = fac.split(",")
    const room={
        type:req.body.type,
        status:req.body.status,
        price:req.body.price,
        facilities:req.body.facilities,
        photos:paths
    }
    Room.create(room)
    .then(data=>{
        res.status(200).send(data)
    })
    .catch(err=>{
        if(paths){
            paths.forEach(path=>{
                fs.unlinkSync(path)
            })
        }
        res.status(500).send({
            message:err.message||"Some error occured while creating the room"
        })
    })
}
exports.findAll=async (req,res)=>{
    try{
        const rooms=await Room.findAll();
        res.status(200).send(rooms);     
    }
    catch(err){
        res.status(500).send({err:err.message||"Some error ocuured while getting rooms"})
    }
}
exports.findByType=async(req,res)=>{
    try{
        const type=req.params.type
        const rooms=await Room.findAll({where:{type:type}})
        res.status(200).send(rooms)
    }
    catch(err){
        res.status(500).send({err:err.message})
    }
}
exports.update=async(req,res)=>{
    var paths=null
    try{
        if(req.files)
        var paths = req.files.map(file => file.path)
        const id=req.params.id;
        const room=await Room.findOne({where:{id:id}})
        if(!room){
            if(paths){
                paths.forEach(path=>{
                    fs.unlinkSync(path)
                })
            }
            return res.status(404).send(`No room with id=${id}`)
        }
            
        if(paths){
            if(room.photos[0]!==NO_IMAGE){
                room.photos.forEach(path=>{
                    fs.unlinkSync(path)
                })
            }
            room.photos=paths
        }

        if(req.body){
            Object.keys(req.body).forEach(value => {
                if (value !== 'photos') {
                    room[value] = req.body[value];
                }
            });
            room.save();
        }
        res.status(200).send("Room updated succesfully!")
    }
    catch(err){
        if(paths){
            paths.forEach(path=>{
                fs.unlinkSync(path)
            })
        }
        res.status(500).send({err:err.message})
    }
}
exports.delete=async(req,res)=>{
    try{
        const id=req.params.id;
        const room=await Room.findOne({where:{id:id}})
        if(!room)
            return res.status(404).send(`No room with id=${id}`)
            
        Room.destroy({where:{id:id}})
        if(room.photos[0]!==NO_IMAGE){
            room.photos.forEach(path=>{
                if(path!==NO_IMAGE)
                fs.unlinkSync(path)
            })
        }
        res.status(200).send("Room deleted succesfully!")
    }
    catch(err){
        res.status(500).send({err:err.message})
    }
}
exports.validationRules=method=>{
    switch(method){
        case('create'):{
            return[
                body(['type']).exists().withMessage("Doesn't exist").isString().withMessage("Is not string"),
                body(['price']).exists().withMessage("Doesn't exist").withMessage("Is not double"),
                body(['facilities']).exists().withMessage("Doesn't exist!").isArray().withMessage("Is not array").notEmpty().withMessage("is empty"),
                body(['photos']).optional()]
            break;
        }
        case('update'):{
            return[
                body(['type']).optional().isString().withMessage("Is not string"),
                body(['price']).optional(),
                body(['facilities']).optional().isArray().withMessage("Is not array"),
                body(['photos']).optional()
            ]
            break;
        }
    }
}
