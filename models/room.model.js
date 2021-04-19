
const NO_IMAGE="public\\img\\no_image.jpg"
module.exports=(sequelize,Sequelize)=>{
    const Room=sequelize.define("room",{
        id:{
            type:Sequelize.INTEGER,
            primaryKey:true,
            autoIncrement:true,
            allowNull:false
        },
        type:{
            type:Sequelize.STRING,
            allowNull:false,
        },
        price:{
            type:Sequelize.DOUBLE,
            allowNull:false
        },
        facilities:{
            type:Sequelize.ARRAY(Sequelize.STRING),
            allowNull:false
        },
        locked:{
            type:Sequelize.BOOLEAN,
            allowNull:false,
            defaultValue:true

        },
        photos:{
            type:Sequelize.ARRAY(Sequelize.STRING),
            defaultValue:[NO_IMAGE],
            allowNull:true
        }
    },
    {updatedAt: false,createdAt:false});
    return Room;
    
}