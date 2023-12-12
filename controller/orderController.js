const db = require('../db.js');

exports.createOrder = (req, res, next) => {
    let userOrders = req.body;
    console.log(userOrders);

    let orders = userOrders.map((e1) => {
        return [req.currentUser.id, e1.product_id, e1.address, e1.pincode, e1.city];
    });

    db.query(
        'INSERT INTO orders(user_id, product_id, address, pincode, city) VALUES $1',
        [orders],
        (err, result) => {
            if (err) {
                console.log(err);
                res.json({
                    err: 'Not able to create order',
                });
            } else {
                db.query(
                    'DELETE FROM cart WHERE user_id = $1',
                    [req.currentUser.id],
                    (err, result1) => {
                        // Handle the result of the DELETE operation if needed
                    }
                );
                res.json({
                    msg: 'Success',
                    result,
                });
            }
        }
    );
};


exports.getYourOrders = (req, res, next) => {
    db.query(
        'SELECT orders.id as id, order_date, address, pincode, city, price, discount, name, category, product_id, cover_image FROM orders JOIN products ON products.id = orders.product_id WHERE user_id = $1 ORDER BY order_date DESC',
        [req.params.id],
        (err, result) => {
            if (err) {
                res.json({
                    err: 'Not able to get your orders',
                });
            } else {
                res.json({
                    msg: 'Orders fetched',
                    orders: result.rows,
                });
            }
        }
    );
};