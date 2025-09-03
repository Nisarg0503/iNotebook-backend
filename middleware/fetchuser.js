var jwt = require("jsonwebtoken");

const jWT_secret = "nisargisagood$boy";

const fetchuser = (req, res, next) => {
  const token = req.header("auth-token");
  if (!token) {
    return res.status(401).send({ error: "User not authenticated" });
  }
  try {
    const data = jwt.verify(token, jWT_secret);
    if (!data) {
      return res.status(400).send({ error: "User not verified" });
    }
    req.user = data.user;
    next();
  } catch (err) {
    res.status(401).send({ error: "User not authenticated" });
  }
};
module.exports = fetchuser;
