

module.exports=(sequelize,Sequelize)=>{
    const Reservation=sequelize.define('reservation',{
        id:{
            type:Sequelize.INTEGER,
            primaryKey:true,
            autoIncrement:true,
            allowNull:false
        },
        check_in_date:{
            type:Sequelize.DATEONLY,
            allowNull:false
        },
        check_out_date:{
            type:Sequelize.DATEONLY,
            allowNull:false
        },
        nr_days:{
            type:Sequelize.INTEGER,
            allowNull:true
        },
        total_price:{
            type:Sequelize.DOUBLE,
            allowNull:true
        },
        status:{
            type:Sequelize.STRING,
            allowNull:false,
            defaultValue:'Open'
        }
    },
    {updatedAt: false,createdAt:false})
    return Reservation
}