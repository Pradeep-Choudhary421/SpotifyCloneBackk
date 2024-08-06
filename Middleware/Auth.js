require("dotenv").config();
const db = require("../db")
const jwt = require("jsonwebtoken");
const authenticate = async (req, res, next) => {
  try {
    let tokn = req.headers["auth-x-token"];
    if (!tokn) {
      return res.status(401).json({
        success: false,
        message: "you are not authenticated",
      });
    }
    const decoded = await jwt.verify(
      tokn,
      process.env.SECRET_KEY
    );
    req.user = await db.query("SELECT * FROM user_table WHERE id = ?",[decoded.id]);
    next();
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = authenticate;
