const express = require("express");
require("dotenv").config();
const morgan = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose");
const authRouter = require("./api/routes/auth");
const itemRouter = require("./api/routes/item");
const cartRouter = require("./api/routes/cart");
const orderRouter = require("./api/routes/order");
const PORT = process.env.PORT || 3000;

const app = express();

mongoose.connect(
	`mongodb+srv://admin:${process.env.MONGODB_PASSWORD}@cluster0.0zeqs.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`,
	{ useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }
);
mongoose.connection.once("open", () => {
	console.log("Database connected...");
});

app.use(morgan("dev"));
app.use(express.json());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api", authRouter);
app.use("/item", itemRouter);
app.use("/cart", cartRouter);
app.use("/order", orderRouter);

app.get("/", (req, res) => {
	res.send("Hello");
});

app.listen(PORT, () => {
	console.log("listening on port ", PORT);
});
