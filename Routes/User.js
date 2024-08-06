const express = require("express");
const router = express.Router();
const {createUser, getUsers, updateUser, deleteUser, loginUser, addProfile, getProfileData, deleteProfile} = require("../Controller/User")
const authenticate = require("../Middleware/Auth")

router.post('/createUser',createUser);
router.get('/getUser', getUsers)
router.put('/updateUser/:id',updateUser)
router.delete('/deleteUser/:id',deleteUser)
router.post("/login",loginUser)
router.post("/addProfile",addProfile)
router.get("/getProfileData/:id",getProfileData)
router.get("/deleteProfile/:id",deleteProfile)

module.exports = router;