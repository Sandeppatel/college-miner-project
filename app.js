require('dotenv').config()
const express = require("express");
const path = require("path");
const bcrypt = require('bcrypt')
const DbModel = require('./config/dp.config')
const UserModel = require('./models/user')
const cookieParser = require('cookie-parser')

const jwt = require('jsonwebtoken')



const app = express();

const port = process.env.PORT || 3000;
app.use(cookieParser());

app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.render("index");
});

  app.get("/login", (req, res) => {
    res.render("login");
  });

app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", async (req, res) => {
  let { name, email, password } = req.body ;
   
    const  hash = await bcrypt.hash(password , 10);

  
    
    const user = await UserModel.create({ name, email, password: hash });
    
    const token = jwt.sign({email ,  userId: user._id },  "shhhhh", { expiresIn: '1h' });
   
   
    res.cookie("token", token, { expiresIn: "1h" });
    res.redirect("/profile");

});


app.get('/profile' , (req , res) => {
  const token = req.cookies.token;
  if(!token) return res.redirect('/login');
  jwt.verify(token, "shhhhh", async (err, user) => {
    if(err) return res.redirect('/login');
    const userDetails = await UserModel.findById(user.userId);
    res.render('profile', { userDetails });
    
    
  })
})

app.post("/login", async (req, res) => {
  let { email, password } = req.body;
  
  const user = await  UserModel.findOne({ email });
  
  
  if(!user) return  res.redirect("/login"); //
  const match = await bcrypt.compare(password, user.password);
  if(!match)  return  res.redirect("/login"); //
  const token = jwt.sign({email ,  userId: user._id },  "shhhhh", { expiresIn: '1h' });
  res.cookie("token", token, { expiresIn: "1h" });
  res.redirect("/profile");

})

 app.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.redirect("/");
});

app.get("/recent", (req, res) => {
  res.render("recent");
});

app.get("/upcoming", (req, res) => {
  res.render("upcoming");
});

app.get("/daily", (req, res) => {
  res.render("daily");
});
app.get("/tipsAI", (req, res) => {
  res.render("tipsAI");
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});