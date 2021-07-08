const { Router } = require("express");
const itemcontroller = require("../Controller/itemController");
const checkAuth = require("../middlewares/checkAuth");
const router = Router();

router.get("/", itemcontroller.get_items);
router.post("/", checkAuth, itemcontroller.post_item);
router.put("/:id", checkAuth, itemcontroller.update_items);
router.delete("/:id", checkAuth, itemcontroller.delete_item);

module.exports = router;
