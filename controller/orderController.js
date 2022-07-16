const db = require('../db.js');

exports.createOrder = (req, res, next) => {
  //TODO: create order

  let userOrders = req.body;
  console.log(userOrders);

  let orders = userOrders.map((e1) => {
    return [req.currentUser.id, e1.product_id, e1.address, e1.pincode, e1.city];
  });

  db.query(
    'INSERT INTO ORDERS(user_id, product_id, address, pincode, city) VALUES ?',
    [orders],
    (err, result) => {
      if (err) {
        console.log(err);
        res.json({
          err: 'not able to create order',
        });
      } else {
        db.query(
          'DELETE FROM cart WHERE user_id = ? ',
          [req.currentUser.id],
          (err, result1) => {}
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
    'SELECT orders.id as id, order_date, address, pincode, city, price, discount, name, category, product_id, cover_image FROM orders JOIN products ON products.id = orders.product_id WHERE user_id = ? order by order_date desc',
    req.params.id,
    (err, result) => {
      if (err) {
        res.json({
          err: 'not able to get your orders',
        });
      } else {
        res.json({
          msg: 'orders fetched',
          orders: result,
        });
      }
    }
  );
};
