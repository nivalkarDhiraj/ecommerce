const { Router } = require("express");
const router = Router();
const authSignup = require("../Controller/authController");
const checkAuth = require("../middlewares/checkAuth");

router.post("/register", authSignup.signup);
router.post("/login", authSignup.login);
router.get("/user", checkAuth, authSignup.getUser);

module.exports = router;
