'use strict';
module.exports = (sequelize, DataTypes) => {
    const Category = sequelize.define('Category', {
        name: DataTypes.STRING
    }, {});

    // eslint-disable-next-line
    Category.associate = function(models) {
        // associations can be defined here
        Category.hasMany(models.Product, {
            foreignKey: 'categoryId'
        });
    };
    return Category;
};