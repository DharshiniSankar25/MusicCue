require("dotenv").config();
const express = require("express");
const jwt = require("jsonwebtoken");
const JWT_SECRET = "jsonwebtoken";
const app = express();
const rateLimit=require("express-rate-limit")
const cors = require("cors");
app.use(cors());
app.use(express.json());
const bcrypt = require("bcrypt");
const limiter = rateLimit({
  windowMs:15*60*1000,
  max:500,
  message:"Rate limit exceeded"
});
const { Pool } = require("pg");
const pool = new Pool({
 connectionString:process.env.DATABASE_URL,
 ssl:{
  rejectUnauthorized:false
 }
 });
app.use(limiter)
function auth(req, res, next) {
  try {
   console.log("Authorisation header:", req.headers.authorization);
    const token = req.headers.authorization;

    const decoded = jwt.verify(
      token,
      JWT_SECRET
    );

    req.user = decoded;
    console.log("Decoded JWT payload:", decoded);

    next();

  } catch (err) {
    return res.status(401).send("Unauthorized");
  }
}
app.post("/Register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const hashpass = await bcrypt.hash(password, 10);

    await pool.query(
      "INSERT INTO users(name,email,password) VALUES($1,$2,$3)",
      [name, email, hashpass]
    );

    res.send("User registered successfully");

  } catch (err) {
    console.error(err);

    res.status(500).send("Server error");
  }
});
app.post("/songs" , auth , async (req, res) => {
  try {

    const { song, artist, lat, lon } = req.body;
    console.log(req.body)
    const userId = req.user.id;
    console.log("Authenticated user ID:", userId);

    await pool.query(
      "INSERT INTO songloc (user_id, song_name, artist, latitude, longitude) VALUES ($1, $2, $3, $4, $5)",
      [
        userId ,
        song,
        artist,
        lat,
        lon
      ]
    );

    res.send("Song added successfully");

  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});
app.get("/songs",limiter, async (req, res) => {
  try {
    const result = await pool.query(
     " SELECT songloc.id,songloc.song_name,songloc.artist,songloc.latitude,songloc.longitude, users.name FROM songloc JOIN users ON songloc.user_id = users.id;"
    );

    res.json(result.rows);

  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});
app.post('/login', limiter, async(req,res)=>{
try{

   const {email,password}=req.body;
     const user = await pool.query(
     "SELECT * FROM users WHERE email=$1",
     [email]
   );

   if(user.rows.length===0){
     return res.status(400).send("Invalid email");
   }

   const vpass = await bcrypt.compare(password,user.rows[0].password);
   if(!vpass){

     return res.status(400).send("Invalid password");}
   const token = jwt.sign(
   {
     id:user.rows[0].id,
     email:user.rows[0].email
   },
   JWT_SECRET,
   {
     expiresIn:"1d"
   }
 );
   console.log("Generated JWT:", token);
   res.json({
     message:"Login successful", token
   });
 }
 catch(error){
   console.error(error);
   res.status(500).send("Server error");
 }
});
app.get("/profile", limiter ,auth, (req, res) => {
  res.json(req.user);
});
app.get("/",(req,res)=>{
  res.send("Backend is Working");
});
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});