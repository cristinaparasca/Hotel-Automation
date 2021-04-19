const Sequelize=require('sequelize');
const sequelize=new Sequelize('hotelmanagement','postgres','123456',{
    host:'localhost',
    dialect:'postgres',
    comparatorsAliases:false,
    pool:{
        max:5,
        min:0,
        acquire:30000,
        idle:10000
    },
});
const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

sequelize
.authenticate()
.then(() => {
  console.log('Connection has been established successfully.');
})
.catch(err => {
  console.error('Unable to connect to the database:', err);
});

db.User=require("./models/user.model.js")(sequelize,Sequelize);
db.Role=require("./models/role.model.js")(sequelize,Sequelize);
db.Room=require("./models/room.model.js")(sequelize,Sequelize);
db.Reservation=require("./models/reservation.model.js")(sequelize,Sequelize);

db.User.belongsTo(db.Role);
db.Reservation.belongsTo(db.User);
db.Reservation.belongsTo(db.Room);
module.exports=db;