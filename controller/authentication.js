const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const db = require('../db.js');

exports.signUp = (req, res, next) => {
  db.query(
    'SELECT email FROM users where email = ?',
    [req.body.email],
    function (err, rows, fields) {
      // Connection is automatically released when query resolves
      if (rows.length === 1) {
        return res.json({
          err: 'User already exists',
        });
      }

      const user = {
        // id: uuidv4(),
        name: req.body.name,
        number: req.body.number,
        email: req.body.email,
        password: req.body.password,
      };

      db.query(
        'INSERT INTO users(name, number, email, password) values (?, ?, ?, ?)',
        [user.name, user.number, user.email, user.password],
        (err, rows) => {
          if (err) {
            console.log(err);
            return res.json({ msg: 'Error in adding user' });
          }

          console.log(rows);
          return res.json({
            msg: 'User is added',
            email: user.email,
            id: rows.insertId,
          });
        }
      );
    }
  );
};

exports.signIn = (req, res, next) => {
  db.query(
    'SELECT id, email, password FROM users where email = ?',
    [req.body.email],
    function (err, user, fields) {
      // Connection is automatically released when query resolves
      if (user.length === 0) {
        return res.json({
          err: "User doesn't exist",
        });
      }

      if (user[0].password !== req.body.password) {
        return res.json({
          err: 'Password incorrect',
        });
      } else {
        jwt.sign(
          { email: user[0].email, id: user[0].id },
          'This is my private key',
          function (err, token) {
            if (err) {
              console.log(err);
              return res.json({
                err: 'Unable to loggin',
              });
            } else {
              res.cookie('auth_token', token);
              // res.headers.authorization = token;
              return res.json({
                msg: 'logged In',
                email: user[0].email,
                id: user[0].id,
                token,
              });
            }
          }
        );
      }
    }
  );
};

exports.protect = (req, res, next) => {
  let token;
  console.log(req.cookies);
  if (req.cookies && req.cookies.auth_token) {
    token = req.cookies.auth_token;
  } else if (req.headers.authorization) {
    token = req.headers.authorization;
  }

  if (!token) {
    return res.json({
      err: 'You are not authenticated',
    });
  }

  jwt.verify(token, 'This is my private key', function (err, decoded) {
    if (err) {
      console.log(err);
      return res.json({
        msg: 'Unable to authenticate',
      });
    }
    req.currentUser = decoded;
    next();
  });
};

// TODO: Update this function
exports.restrictTo = (req, res, next) => {
  db.query(
    'SELECT id, role FROM USERS WHERE id = ?',
    [req.currentUser.id],
    (err, result, fields) => {
      if (err) {
        return res.json({
          msg: 'Not able to get info',
        });
      } else {
        if (result[0].role != 'admin') {
          return res.json({
            err: 'You are not authorized',
          });
        }

        next();
      }
    }
  );
};

exports.logOut = (req, res, next) => {
  res.clearCookie('auth_token');
  console.log(req.cookies);
  res.json({
    msg: 'Logged Out',
  });
};
