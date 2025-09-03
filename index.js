const connectToMongo = require("./db");
var cors = require("cors");

connectToMongo();
const express = require("express");
const router = require("./routes/auth");
const app = express();
const port = process.env.PORT || 5000;
var cors = require("cors");
app.use(cors());
app.use(express.json());
app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.use("/api/auth", require("./routes/auth"));
app.use("/api/notes", require("./routes/notes"));

// app.use("/api/notes", require("./routes./notes"));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
module.exports = router;
