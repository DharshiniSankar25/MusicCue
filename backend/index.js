const express = require("express");
const jwt = require("jsonwebtoken");
const JWT_SECRET = "jsonwebtoken";
const app = express();
const rateLimit=require("express-rate-limit")
const cors = require("cors");
app.use(cors());
app.use(express.json());
const bcrypt = require("bcrypt");
const multer = require('multer');
const storage = multer.diskStorage( {
  destination:(req,File,cb)=>{
    cb(null,"uploads/");
  },
  filename:(req,file,cb)=>{
    cb(null,Date.now()+"-"+file.originalname);
  }
}
);
const upload=multer({storage});
const {Pool}=require("pg");
const limiter = rateLimit({
  windowMs:15*60*1000,
  max:500,
  message:"Rate limit exceeded"
});
const pool=new Pool({
  user:'postgres',
  host:'localhost',
  database:'details',
  password  :'postgres',
  port:5432
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
try{
app.post("/Register",async(req,res)=>{
  const{name,email,password}=req.body;
  const hashpass=await bcrypt.hash(password,10);
  await pool.query("INSERT INTO users(name,email,password) VALUES($1,$2,$3)",[name,email,hashpass]);
  res.send("User registered successfully");
  
});
} catch(err){
  console.error(err);
  res.status(500).send("Server error");
}
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
app.get("/songs", async (req, res) => {
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
try{
  app.post('/login',async(req,res)=>{
    const {email,password}=req.body;
    const user = await pool.query("SELECT * FROM users WHERE email=$1",[email]);
    if(user.rows.length===0){
      return res.status(400).send("Invalid email ");
    }
    else{
      const vpass=await bcrypt.compare(password,user.rows[0].password);
      if(!vpass){
        return res.status(400).send("Invalid password");
      }
      else{
          const token = jwt.sign(
  {
    id: user.rows[0].id,
    email: user.rows[0].email
  },
  JWT_SECRET,
  { expiresIn: "1d" }
);
console.log("Generated JWT:", token);

res.json({
  message: "Login successful",
  token
});
        }
      }
    }
   ); }
    
catch(error){
  console.error(error);
  res.status(500).send("Server error");
}
app.get("/profile", auth, (req, res) => {
  res.json(req.user);
});

app.get("/",(req,res)=>{
  res.send("Backend is Working");
});
app.listen(5000, () => {
  console.log("Server running on port 5000");
});