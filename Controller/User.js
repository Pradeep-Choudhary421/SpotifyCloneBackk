const bcrypt = require("bcrypt");
const db = require("../db");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(404).json({ message: "Please fill in all fields" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const [existingEmail] = await db.query('SELECT * FROM user_table WHERE email = ?',[email])
    if(existingEmail.length > 0){
      return res.status(400).json({ message: "Email already exists" })
      }
    const data = await db.query(
      "INSERT INTO user_table (name, email, password) VALUES (?, ?, ?)",
      [name, email, hashedPassword]
    );
    if (!data) {
      return res.status(400).json({ error: "Something went wrong!" });
    }
    const createdData = await db.query(
      "SELECT * FROM user_table WHERE email = ? AND name = ?",
      [email, name]
    );
    return res
      .status(200)
      .json({ message: "User created successfully!", data: createdData });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};
const addProfile = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phoneNo,
      currentAdd,
      permanentAdd,
      dob,
      gender,
      userId,
    } = req.body;
    // if (!userId) {
    //   return res.status(404).json({ message: "Please fill in all fields" });
    // }
    const data = await db.query(
      "INSERT INTO profile_table (firstName, lastName, email, phoneNo, currentAdd, permanentAdd, dob, gender, userId) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        firstName,
        lastName,
        email,
        phoneNo,
        currentAdd,
        permanentAdd,
        dob,
        gender,
        userId,
      ]
    );
    if (!data) {
      return res.status(400).json({ error: "Something went wrong!" });
    }
    return res.status(200).json({ message: "Profile Updated successfully!" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getProfileData = async (req, res) => {
  try {
    const  userId  = req.params.id;
    const data = await db.query(
      "SELECT * FROM profile_table WHERE userId = ?",
      [userId]
    );
    if (data.length === 0) {
      return res.status(404).json({ message: "No profile found!" });
    }
    return res
      .status(200)
      .json({ message: "Profile Data Fetched Successfully!", data: data });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await db.query("SELECT * FROM user_table");
    res.status(200).json({
      message: "Users retrieved successfully",
      users: users,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};
const updateUser = async (req, res) => {
  try {
    const id = req.params.id;
    const { name, email } = req.body;
    if (!name || !email) {
      return res.status(400).json({ message: "Please fill in all fields" });
    }
    const data = await db.query(
      "UPDATE user_table SET name = ?, email = ? WHERE id = ?",
      [name, email, id]
    );
    if (!data) {
      return res.status(400).json({ error: "Something went wrong!" });
    }
    return res.status(200).json({ message: "User updated successfully!" });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

const deleteProfile = async(req,res)=>{
  try{
    const userId = req.params.id;
    const data = await db.query("DELETE FROM user_table WHERE id = ?", [userId]);
    if(!data){
      return res.status(400).json({error:"Something went wrong!"});
      }
      return res.status(200).json({message:"Profile deleted successfully!"});

  } catch(err){
    res.status(500).json({message:err.message})
  }
}
const deleteUser = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await db.query("DELETE FROM user_table WHERE id = ?", [id]);
    if (!data) {
      return res.status(400).json({ error: "Something went wrong!" });
    }
    return res.status(200).json({ message: "User deleted successfully!" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const [user] = await db.query("SELECT * FROM user_table WHERE email = ?", [
      email,
    ]);
    if (user.length < 1) {
      return res.status(404).json({ message: "User Not Found" });
    }
    const isValidPassword = await bcrypt.compare(password, user[0].password);
    if (isValidPassword !== true) {
      return res.status(401).json({ message: "Invalid Password" });
    }
    const token = jwt.sign({ _id: user[0].id }, process.env.SECRET_KEY, {
      expiresIn: "24h",
    });
    const loginData = await db.query(
      "SELECT * FROM user_table WHERE email = ? ",
      [email]
    );
    return res.status(200).cookie("token", token).json({
      message: "Login successful",
      token: token,
      success: true,
      data: loginData,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
module.exports = {
  createUser,
  getUsers,
  updateUser,
  deleteUser,
  loginUser,
  addProfile,
  getProfileData,
  deleteProfile
};
