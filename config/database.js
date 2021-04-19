const Sequelize=require('sequelize');
module.exports=new Sequelize('hotelmanagement','postgres','123456',{
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