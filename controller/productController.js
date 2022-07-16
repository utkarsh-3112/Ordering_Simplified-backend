const db = require('../db.js');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.cloud_name,
  api_key: process.env.api_key,
  api_secret: process.env.api_secret,
});

exports.getProducts = (req, res, next) => {
  db.query(
    'SELECT id, name, cover_image FROM products',
    [],
    function (err, rows, fields) {
      // Connection is automatically released when query resolves
      if (err) {
        return res.json({
          err: 'Unable to get Products',
        });
      }

      res.json({
        items: rows,
      });
    }
  );
};

exports.createProduct = (req, res, next) => {
  //TODO: Create new product

  console.log(req.body);
  const file = req.files.cover_image;

  cloudinary.uploader.upload(file.tempFilePath, (err, result) => {
    if (err) {
      return res.json({
        err,
      });
    }

    db.query(
      'INSERT INTO products(name, description, category, shopkeeper_id, price, discount, cover_image, images) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [
        req.body.name,
        req.body.description,
        req.body.category,
        req.body.shopkeeper_id,
        req.body.price,
        req.body.discount,
        result.url,
        null,
      ],
      (err, rows) => {
        if (err) {
          console.log(err);
          return res.json({ msg: 'Error in adding user' });
        }

        return res.json({
          msg: rows,
        });
      }
    );
  });
};

exports.getProductsDetails = (req, res, next) => {
  db.query(
    'SELECT * FROM products WHERE id=?',
    [req.params.id],
    function (err, rows, fields) {
      // Connection is automatically released when query resolves
      if (err) {
        return res.json({
          msg: 'Unable to get Products',
        });
      }

      res.json({
        msg: rows,
      });
    }
  );
};
