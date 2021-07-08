const { Router } = require("express");
const orderController = require("../Controller/orderController");
const checkAuth = require("../middlewares/checkAuth");
const router = Router();

router.get("/", checkAuth, orderController.get_order); //get all orders of logged in user
router.post("/", checkAuth, orderController.checkout); //place order for items in cart
router.get("/callback", orderController.callback); //callback after successful payment

module.exports = router;
