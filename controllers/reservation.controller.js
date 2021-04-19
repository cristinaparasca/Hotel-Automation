const db=require('../index.js')
const { Op, DATEONLY, Model } = require("sequelize");
const Sequelize=require('sequelize');
const { body,param } = require("express-validator");
const Room=db.Room;
const User=db.User
const Reservation=db.Reservation;
const jwt=require('jsonwebtoken')
exports.create=async(req,res)=>{
    try{
        const token=req.headers.token;
        const decoded=jwt.decode(token)
        const user=await User.findOne({where:{
            id:decoded.userId
        }})
        if(!user)
            return res.status(404).send({message:`No user with id=${decoded.userId}`})
        const room=await Room.findOne({where:{
            id:req.body.roomId
        }})
        if(!room)
            return res.status(404).send({message:`No room with id=${req.body.roomId}`})
        const exists=await Reservation.findOne({where:{
            userId:decoded.userId,
            roomId:req.body.roomId,
            check_in_date:req.body.check_in_date,
            check_out_date:req.body.check_out_date
        }})
        if(exists)
            return res.status(404).send({message:`Reservation exists already`})
        
            const reservation={
                userId:decoded.userId,
                roomId:req.body.roomId,
                check_in_date:req.body.check_in_date,
                check_out_date:req.body.check_out_date,
                nr_days:req.body.nr_days,
                total_price:req.body.total_price
            }
        const reservationCreated=await Reservation.create(reservation)  
        return res.status(200).send(reservationCreated)      
    }
    catch(err){
        res.status(500).send({err:err.message})
    }
}
exports.findAll=async(req,res)=>{
    try{
        const reservations=await Reservation.findAll({
            include:{
                model:User,
                attributes:['first_name','last_name']
            }
        });
        let now=require('moment')(Date.now()).format('YYYY-MM-DD')
        for(let value of reservations){
            if(new Date(now)>=new Date(value.check_out_date)&&value.status!=='Checked in'){
                const id=value.id
                value.status='Closed'
                await Reservation.update({status:'Closed'},{where:{id:id}})
            }
        }
        res.status(200).send(reservations);
    }
    catch(err){
        res.status(500).send({err:err.message||"Some error ocuured while retrieving reservations!"})
    }
}
exports.checkIn=async(req,res)=>{
    try{
        const token=req.headers.token;
        const decoded=jwt.decode(token)
        const userId=decoded.userId
        const reservation=await Reservation.findOne({
            where:{
                id:req.params.id,
                userId:userId
            }})
        if(!reservation)
            return res.status(404).send({message:"Reservation not found!"})
        let now=require('moment')(Date.now()).format('YYYY-MM-DD')
        if(new Date(now)<new Date(reservation.check_in_date)||new Date(now)>=new Date(reservation.check_out_date))
            return res.status(404).send({message:"Too early/late for checkIn"})
        if(reservation.status==='Checked in')
            return res.send({message:"Already checked In!"})
        if(reservation.status==='Closed')
            return res.send({message:"Reservation closed!"})
        reservation.status='Checked in'
        reservation.save()
        res.status(200).send(reservation)
    }
    catch(err){
        console.log(err)
    }
}
exports.checkOut=async(req,res)=>{
    try{
        const token=req.headers.token;
        const decoded=jwt.decode(token)
        const userId=decoded.userId
        const reservation=await Reservation.findOne({
            where:{
                id:req.params.id,
                userId:userId
            }})
        if(!reservation)
            return res.status(404).send({message:"Reservation not found!"})
        let now=require('moment')(Date.now()).format('YYYY-MM-DD')
        if(reservation.status!=='Checked in'&&new Date(now)>=new Date(reservation.check_out_date))
            return res.status(404).send({message:"You can't perform checkOut"})
        reservation.status='Closed'
        reservation.save()
        res.status(200).send(reservation)
    }
    catch(err){
        res.status(500).send(err)
        console.log(err)
    }
}
exports.findByUser=async(req,res)=>{
    try{
        const token=req.headers.token;
        const decoded=jwt.decode(token)
        const id=decoded.userId
        const user=User.findOne({where:{id:id}})
        if(!user){
            return res.status(404).send({message:`No user with id=${id}`})
        }
        const reservation=await Reservation.findAll({
            attributes:['id','check_in_date','check_out_date','total_price','nr_days','status'],
            where:{
                userId:id,
                status:{[Op.not]:'Closed'}
            },
            include: [{
                model: Room,
                attributes: ['type', 'photos']
            }]
        })
        let now=require('moment')(Date.now()).format('YYYY-MM-DD')
        
        reservation.forEach(value=>{
            value.dataValues.action='Cancel'
            if(new Date(now)>=new Date(value.check_in_date)&&new Date(now)<new Date(value.check_out_date))
            {   
                value.dataValues.action="Check in"
            }
            if(value.status==='Checked in'&&new Date(now)<=new Date(value.check_out_date))
            {
                value.dataValues.action="Check out"
            }
            if(new Date(now)>=new Date(value.check_out_date)&&value.status!=='Checked in'){
                const id=value.dataValues.id
                Reservation.update({status:'Closed'},{where:{id:id}})
                reservation.splice(reservation.indexOf(value),1)
            }
        })
        res.status(200).send(reservation)
    }
    catch(err){
        res.status(500).send({err:err.message})
    }
}
exports.delete=async(req,res)=>{
    try{
        const id=req.params.id
        const reservation=await Reservation.destroy({where:{id:id}})
        if(!reservation){
            return res.status(404).send({message:`No reservation with id=${id}`})
        }
        res.status(200).send("Reservation deleted succesfully!")
    }
    catch(err){
        res.status(500).send({err:err.message})
    }
}
exports.deleteMy=async(req,res)=>{
    try{
        const token=req.headers.token;
        const decoded=jwt.decode(token)
        const userId=decoded.userId
        const id=req.params.id
        const reservation=await Reservation.findOne({where:{
            id:id,
            status:{[Op.not]:'Closed'},
            userId:decoded.userId
        }})
        if(!reservation)
            return res.status(404).send({message:`Reservation unavailable for user id=${userId}`})
        if(new Date(reservation.check_in_date)<Date.now())
            return res.send({message:"Reservation already started!"})
        Reservation.update({status:'Closed'},{where:{
            id:id,
            userId:userId
        }})
        res.status(200).send("Reservation canceled succesfully!")
    }
    catch(err){
        res.status(500).send({err:err.message})
    }
}
exports.findRoomsAvailable=async(req,res)=>{
    try{
        var response={
            nr_days,
            single:[]
        }
        var roomsId=[]
        const reqIn=req.params.check_in_date
        const reqOut=req.params.check_out_date
        const roomsAvailable=await Reservation.findAll({where:{
            [Op.and]:[
                {status:{[Op.not]:'Closed'}},
                {[Op.or]:[
                    {
                        check_in_date:{
                            [Op.between]:[reqIn,reqOut]
                        }
                    },
                    {
                        check_out_date:{
                            [Op.between]:[reqIn,reqOut]
                        }
                    },
                    {
                        check_in_date:{[Op.lte]:reqIn},
                        check_out_date:{[Op.gte]:reqIn}
                    },
                    {
                        check_in_date:{[Op.lte]:reqOut},
                        check_out_date:{[Op.gte]:reqOut}
                    }
                ]}
        ] 
        }})
        var Difference_In_Time = new Date(reqOut).getTime() - new Date(reqIn).getTime();
        var nr_days = Difference_In_Time / (1000 * 3600 * 24);
        response.nr_days=nr_days
        roomsId=roomsAvailable.map(room=>room.roomId)
        const roomsSingle=await Room.findAll({
            where:{
                id:{[Op.notIn]:roomsId},
            },
            attributes: {
                include: [[Sequelize.literal(`${Sequelize.col('price').col} * ${nr_days}`), 'total_price'],'type','facilities'],
                exclude:['price','locked']
            },

        })
        response.single=roomsSingle
        res.status(200).json(response);
    }
    catch(err){
        res.status(500).send({
            message:err.message||"Error in getting rooms"
        })
    }  
}
exports.validationRules=method=>{
    switch(method){
        case('create'):{
            return[
                body(['roomId']).exists().withMessage("Doesn't exist").isInt().withMessage("Is not int"),
                body(['check_in_date','check_out_date'])
                .exists().withMessage("Doesn't exist")
                .isDate().withMessage("Is not date")
                .custom((value)=>{
                    let now=require('moment')(Date.now()).format('YYYY-MM-DD')
                    if(new Date(value)<new Date(now))
                        throw(new Error('Date must be after Date.Now'))
                    return true;
                }),
                body(['check_in_date']).custom((value, { req })=>{
                    if(new Date(value)>new Date(req.body.check_out_date))
                        throw(new Error('Check in date must be before check out'))
                    return true;
                }),
                body(['nr_days','price']).optional().not().isString()
            ]
        }
        case('available'):{
            return[
                param(['check_in_date','check_out_date'])
                .exists().withMessage("Doesn't exist")
                .isDate().withMessage("Is not date")
                .custom((value)=>{
                    let now=require('moment')(Date.now()).format('YYYY-MM-DD')
                    if(new Date(value)<new Date(now))
                        throw(new Error('Date must be after Date.Now'))
                    return true;
                }),
                param(['check_in_date']).custom((value, { req })=>{
                    if(new Date(value)>new Date(req.body.check_out_date))
                        throw(new Error('Must be before check out'))
                    return true;
                })
            ]
        }
    }
}