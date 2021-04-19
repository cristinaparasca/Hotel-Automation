const { Op } = require("sequelize");
module.exports = (sequelize, Sequelize) => {
    console.log('Creating Role');

    const Role = sequelize.define("role", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        
    },{updatedAt: false,createdAt:false});
    return Role;
}