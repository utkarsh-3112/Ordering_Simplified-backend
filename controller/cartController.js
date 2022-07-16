const db = require('../db.js');

exports.addItem = (req, res, next) => {
  //TODO: Add item to the Cart

  console.log(req.body);

  db.query(
    'INSERT INTO cart(user_id, product_id) values (?, ?)',
    [req.currentUser.id, req.body.product_id],
    (err, rows) => {
      if (err) {
        console.log(err);
        return res.json({ msg: 'Error in adding card item' });
      }

      return res.json({
        msg: 'Cart Item is added',
        cart: rows,
      });
    }
  );
};

exports.getItemsByUser = (req, res, next) => {
  //TODO: Get USERS items

  db.query(
    'SELECT cart.id as id, product_id, user_id, cover_image, category, price, discount, name FROM cart JOIN products on cart.product_id = products.id WHERE cart.user_id = ? ORDER BY price DESC',
    [req.params.user_id],
    (err, rows) => {
      if (err) {
        res.json({
          msg: "Not able to get user's cart Items",
        });
      } else {
        res.json({
          msg: 'Get users data',
          rows,
        });
      }
    }
  );
};

exports.deleteItem = (req, res, next) => {
  //TODO: Delete item from cart
  db.query('DELETE FROM cart WHERE id=?', [req.params.id], (err, rows) => {
    if (err) {
      console.log(err);
      return res.json({ msg: 'Error in removing item from card' });
    }

    return res.json({
      msg: 'Item removed from cart',
      cart: rows,
    });
  });
};
