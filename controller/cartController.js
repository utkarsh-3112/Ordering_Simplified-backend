const db = require('../db.js');
const format = require('pg-format')



exports.addItem = (req, res, next) => {
    const cartItems = req.body.cartItems;
    console.log(cartItems)
    let items = [];
    for (const key in cartItems) {
        if (cartItems[key] !== 0) items.push([req.currentUser.id, Number(key), cartItems[key]]);
    }
    console.log(items)
    db.query(format( 'INSERT INTO cart(user_id, product_id, quantity) VALUES %L',
        items),[],
        (err, result) => {
            if (err) {
                console.log(err);
                return res.json({ msg: 'Error in adding card item' });
            }

            return res.json({
                msg: 'Cart Item is added',
                cart: result.rows,
            });
        }
    );
};


exports.getItemsByUser = (req, res, next) => {
    console.log("In cart")
    const userId = req.params.user_id;

    db.query(
        'SELECT product_id, quantity FROM cart JOIN products ON cart.product_id = products.id WHERE cart.user_id = $1 ORDER BY price DESC',
        [userId],
        (err, result) => {
            if (err) {
                console.log(err)
                res.json({
                    msg: "Not able to get user's cart Items",
                });
            } else {
                res.json({
                    msg: 'Get users data',
                    rows: result.rows,
                });
            }
        }
    );
};

exports.deleteItem = (req, res, next) => {

    db.query(
        'DELETE FROM cart WHERE cart.user_id = $1',
        [req.params.user_id],
        (err, result) => {
            if (err) {
                console.log(err);
                return res.json({ msg: 'Error in removing item from cart' });
            }

            return res.json({
                msg: 'Item removed from cart',
                cart: result.rows,
            });
        }
    );
};
