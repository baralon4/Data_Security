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

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log("Server is listening on http://localhost:${PORT}");
});
