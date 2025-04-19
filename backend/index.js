const express = require("express");
const cors = require("cors");
const db = require("./models/db");
const userRoutes = require("./routes/userRoutes");

require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
  res.send("Server is running.");
});

app.listen(3001, () => {
  console.log("Server is listening on http://localhost:3001");
});
