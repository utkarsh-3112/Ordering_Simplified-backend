const jwt = require('jsonwebtoken');
const {v4: uuidv4} = require('uuid');
const db = require('../db.js');
const e = require("express");

exports.signUp = async (req, res, next) => {

    try {
        let result = await db.query("SELECT email FROM users where email = $1", [req.body.email]);
        console.log(result);
        if (result.rows.length === 1) {
            return res.json({
                err: "User already exists",
            });
        }
        const user = {
            // id: uuidv4(),
            name: req.body.name,
            number: req.body.number,
            email: req.body.email,
            password: req.body.password,
        };
        result = await db.query("INSERT INTO users(name, number, email, password) values ($1, $2, $3, $4) RETURNING *", [user.name, user.number, user.email, user.password]);
        // console.log(result);
        res.json({
            msg: 'User is added',
            email: result.rows[0].email,
            id: result.rows[0].id,
        });
    } catch (error) {
        console.log(error)
        res.json({
            msg: 'Error in adding user'
        })
    }
};

exports.signIn = async (req, res, next) => {
    console.log(req.body)
    try {
        let { rows } = await db.query("SELECT id, email, password FROM users where email = $1", [req.body.email]);
        console.log(rows)

        if (rows.length === 0) {
            return res.json({
                err: "User doesn't exist",
            });
        }

        if (rows[0].password !== req.body.password) {
            return res.json({
                err: 'Password incorrect',
            });
        } else {
            jwt.sign(
                {email: rows[0].email, id: rows[0].id},
                'This is my private key',
                function (err, token) {
                    if (err) {
                        console.log(err);
                        return res.json({
                            err: 'Unable to logging',
                        });
                    } else {
                        // res.cookie('auth_token', token);
                        res.cookie('authToken', token);
                        // res.headers.authorization = token;
                        res.json({
                            msg: 'logged In',
                            email: rows[0].email,
                            id: rows[0].id,
                        });
                    }
                }
            );
        }
    } catch (err) {
        console.log(err)
        return res.json({
            err: 'Unable to login'
        })
    }
};

exports.protect = (req, res, next) => {
    let token;
    console.log(req)
    console.log(req.cookies);
    console.log(req.headers)
    if (req.cookies && req.cookies.authToken) {
        token = req.cookies.authToken;
    } else if (req.headers
        .authorization) {
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

exports.restrictTo = (req, res, next) => {
    const userId = req.currentUser.id;
    db.query(
        'SELECT id, role FROM users WHERE id = $1',
        [userId],
        (err, result) => {
            if (err) {
                return res.json({
                    msg: 'Not able to get info',
                });
            } else {
                if (result.rows.length === 0 || result.rows[0].role !== 'admin') {
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
