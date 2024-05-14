const mysqlConnection = require('../src/helper/mysql');

function saveOrderToDatabase(order) {
    const { productId, quantity, customerId } = order;
    const query = 'INSERT INTO orders (product_id, quantity, customer_id) VALUES (?, ?, ?)';
    mysqlConnection.query(query, [productId, quantity, customerId], (error, results) => {
        if (error) {
            console.error('Error saving order to MySQL:', error);
        } else {
            console.log('Order saved to MySQL:', order);
        }
    });
}

function decreaseStock(order) {
    const { productId, quantity } = order;
    const query = 'UPDATE products SET stock = stock - ? WHERE id = ?';
    mysqlConnection.query(query, [quantity, productId], (error, results) => {
        if (error) {
            console.error('Error decreasing product stock:', error);
        } else {
            console.log('Product stock decreased:', productId);
        }
    });
}

module.exports = {
    saveOrderToDatabase,
    decreaseStock
};