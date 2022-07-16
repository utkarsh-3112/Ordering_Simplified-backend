let express = require("express");
let router = express.Router();
let authentication = require("./../controller/authentication");
const { getUsers, me } = require("../controller/userController");

router.post("/signup", authentication.signUp);
router.post("/signin", authentication.signIn);
router.get("/logout", authentication.logOut);


// router.patch(
//   "/update_password",
//   authentication.protect,
//   authentication.hashPassword,
//   authentication.updatePassword
// );

router.get(
  "/",
  authentication.protect,
  // authentication.restrictTo("admin"),
  getUsers
);

router.get("/me", authentication.protect, me);

module.exports = router;
