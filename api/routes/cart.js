const express = require("express");
const router = express.Router();
const cartController = require("../Controller/cartController");
const checkAuth = require("../middlewares/checkAuth");

router.get("/", checkAuth, cartController.get_cart_items); //get cart for logged in user
router.post("/", checkAuth, cartController.add_cart_item); //add items in cart 
router.delete("/:id", checkAuth, cartController.delete_item); //delete item in cart

module.exports = router;
