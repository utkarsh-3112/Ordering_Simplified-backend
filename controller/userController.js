const db = require('../db.js');


exports.getUsers = (req, res, next) => {
  db.query("SELECT id, name, email, created_at FROM USERS", (err, result, fields) => {
    if(err) {
       res.json({
         msg: "Not able to get all users"
       })
     }else{
        res.json({
          msg: result
        })
      }
   })
};




exports.me = (req, res, next) => {
  db.query("SELECT id, name, email, number FROM USERS WHERE id = ?", [req.currentUser.id] , (err, result, fields) =>{
    if(err) {
      res.json({
        msg: "Not able to get info"
      })
    }else{
      res.json({
        msg: result
      })
    }
  })
};
