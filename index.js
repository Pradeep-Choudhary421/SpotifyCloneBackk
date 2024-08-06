const express = require('express');
const bodyParser = require('body-parser');
const cors = require("cors");
const mysqlConnection = require("./db")
const mysqlConnection2 = require("./db")
const User = require("./Routes/User")
const music = require("./Routes/Music");
const morgan = require("morgan")
require("dotenv").config();
const app = express();

app.use(cors());
app.use(morgan('dev'))
app.use(bodyParser.json({extended: true, limit:"5mb"}))
app.use(bodyParser.urlencoded({extended: true, limit:"5mb"}))
app.use('/user',User)
app.use("/music", music)
app.get('/',(req,res) =>{
    res.send('Server is running ')
})
mysqlConnection.query("SELECT 1").then(()=>{
    console.log("Connected to database")
    app.listen(process.env.PORT,()=>{
        console.log(`server is running on Port ${process.env.PORT} `)
    })
}).catch((err)=>{
    console.log(err)
})
