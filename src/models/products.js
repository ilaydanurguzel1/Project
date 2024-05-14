module.exports = (sequelize, Sequelize) => {
    const Product = sequelize.define("product", {
        name: {
            type: Sequelize.STRING
        },
        price: {
            type: Sequelize.INTEGER
        },
        picturePath: {
            type: Sequelize.STRING
        },
        description: {
            type: Sequelize.STRING
        }
    });
  
    return Product;
};