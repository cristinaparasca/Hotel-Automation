const Sequelize=require('sequelize')
module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("user", {
       id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
       },
       first_name: {
        type: Sequelize.STRING,
        allowNull: false
       },
       last_name: {
        type: Sequelize.STRING,
        allowNull: false
       },
       email: {
        type: Sequelize.STRING,
        allowNull: false
       },
       password: {
        type: Sequelize.STRING,
        allowNull: false
       },
       gender: {
        type: Sequelize.STRING,
        allowNull: true
       },
       age: {
        type: Sequelize.INTEGER,
        allowNull: true
       },
       profile_photo: {
        type: Sequelize.STRING,
        defaultValue:"public\\img\\not-found.jpg",
        allowNull: true
       },
       createdAt: {
        field: 'created_at',
        type: Sequelize.DATEONLY,
        },
        
    },
    {updatedAt: false});
    return User;
};
