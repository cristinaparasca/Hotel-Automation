const db = require('../index.js');
const bcrypt = require('bcrypt');
const { findRoomsAvailable } = require('../controllers/reservation.controller');
exports.HardcodedDb=async()=>{
    try{
        db.Role.create({
        name:'Administrator'
      }),
      db.Role.create({
          name:'Guest'
      }),
      db.Role.create({
          name:'Cleaning Stuff'
      }),
      db.User.create({
        first_name:"Parasca",
        last_name:"Cristina",
        email:"cristina.parasca14@gmail.com",
        password:bcrypt.hashSync('123456',10),
        gender:"female",
        profile_photo:"public\\img\\girl_photo1.jpg",
        age:14,
        roleId:'1'
      }),
      db.User.create({
        first_name:"Tofan",
        last_name:"Stefan",
        email:"stefan.tofan@gmail.com",
        password:bcrypt.hashSync('123456',10),
        gender:"male",
        profile_photo:"public\\img\\photo2.jpeg",
        age:22,
        roleId:'2'
      }),
      db.User.create({
        first_name:"Gulf",
        last_name:"Mike",
        email:"mike.gulf@yahoo.com",
        password:bcrypt.hashSync('123456',10),
        profile_photo:"public\\img\\photo3.jpeg",
        gender:"male",
        age:23,
        roleId:'2'
      }),
      db.User.create({
        first_name:"Brooks",
        last_name:"Robert",
        email:"robert.brooks@gmail.com",
        password:bcrypt.hashSync('123456',10),
        profile_photo:"public\\img\\photo4.jpeg",
        gender:"male",
        age:30,
        roleId:'2'
      }),
      db.User.create({
        first_name:"Sarah",
        last_name:"Bells",
        email:"sarah.bells@gmail.com",
        password:bcrypt.hashSync('123456',10),
        profile_photo:"public\\img\\girl_photo2.jpg",
        gender:"male",
        age:30,
        roleId:'2'
      }),
      db.Room.create({
        type:'Double',
        status:'available',
        price:'70',
        facilities:['TV', 'Wi-Fi'],
        photos: [
          "public\\img\\double11.jpeg",
          "public\\img\\double12.jpeg",
          "public\\img\\double13.jpeg"
        ],
        locked:false
      }),
      db.Room.create({
        type:'Double',
        status:'available',
        price:'70',
        facilities:['TV', 'Wi-Fi', 'Air Conditioner'],
        photos: [
          "public\\img\\double21.jpeg",
          "public\\img\\double22.jpeg",
          "public\\img\\double23.jpeg"
        ],
        locked:false
      }),
      db.Room.create({
        type:'Double',
        status:'available',
        price:'70',
        facilities:['TV', 'Microwave', 'Sea View'],
        locked:false,
        photos: [
          "public\\img\\double1.jpg",
          "public\\img\\double2.jpg",
          "public\\img\\double3.jpg"
        ],
      }),
      db.Room.create({
        type:'Twin',
        status:'available',
        price:'60',
        facilities:['TV', 'Mini-Bar', 'Audio System'],
        photos: [
          "public\\img\\twin1.jpg",
          "public\\img\\twin2.jpg",
          "public\\img\\twin3.jpg"
        ],
        locked:false
      }),
      db.Room.create({
        type:'Twin',
        status:'available',
        price:'60',
        facilities:['TV','Wi-Fi','Mini-Bar', 'Audio System'],
        photos: [
          "public\\img\\twin11.jpeg",
          "public\\img\\twin12.jpeg",
          "public\\img\\twin13.jpeg"
        ],
        locked:false
      }),
      db.Room.create({
        type:'Single',
        status:'available',
        price:'40',
        facilities:['TV','Wi-Fi','Mini-Bar','Sea View'],
        photos: [
          "public\\img\\single1.jpg",
          "public\\img\\single2.jpg",
          "public\\img\\single3.jpg"
        ],
        locked:false
      }),
      db.Room.create({
        type:'Single',
        status:'available',
        price:'40',
        facilities:['TV','Wi-Fi','Mini-Bar','Sea View'],
        photos: [
          "public\\img\\single11.jpeg",
          "public\\img\\single12.jpeg",
          "public\\img\\single13.jpeg"
        ],
        locked:false
      }),
      db.Room.create({
        type:'Single',
        status:'available',
        price:'40',
        facilities:['TV','Wi-Fi','Mini-Bar','Audio System'],
        locked:false
      }),
      db.Reservation.create({
        roomId:3,
        userId:1,
        check_in_date:"2021-12-23",
        check_out_date:"2021-12-25",
        nr_days:2,
        total_price:80
      }),
      db.Reservation.create({
        roomId:2,
        userId:1,
        check_in_date:"2021-04-05",
        check_out_date:"2021-04-06",
        status:'Checked in',
        nr_days:2,
        total_price:80
      })
    }
    catch(err){
        console.log(err.message);
    }
}