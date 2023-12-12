const db = require('../db.js');


exports.getUsers = (req, res, next) => {
    db.query('SELECT id, name, email, created_at FROM users', (err, result) => {
        if (err) {
            res.json({
                msg: 'Not able to get all users',
            });
        } else {
            res.json({
                msg: result.rows,
            });
        }
    });
};





exports.me = (req, res, next) => {
    db.query(
        'SELECT id, name, email, number FROM users WHERE id = $1',
        [req.currentUser.id],
        (err, result) => {
            if (err) {
                res.json({
                    msg: 'Not able to get info',
                });
            } else {
                res.json({
                    msg: result.rows,
                });
            }
        }
    );
};