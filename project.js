import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import bcrypt from "bcrypt";
import passport from "passport";
import { Strategy } from "passport-local";
import session from "express-session";
import env from "dotenv";
import  {fileURLToPath}  from 'url';
import  path  from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;
const saltRounds = 10;
env.config();

app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
        cookie: {
            maxAge : 1000 * 60 * 60 * 24,
        }
    })
);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(passport.initialize());
app.use(passport.session());

const db = new pg.Client({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT,
});
db.connect();



app.get("/",(req,res)=>{
    res.render("login.ejs");
});

app.get("/register",(req,res)=>{
    res.render("register.ejs");
});
  
app.get("/recommend",(req,res)=>{
    const filePath = path.join(__dirname, 'public', 'r.html');
    res.sendFile(filePath);
});


app.get("/main",async(req,res) =>{

    if(req.isAuthenticated()){
        const result = await db.query("SELECT * FROM footprints WHERE email= $1",[req.user.email]);
        const user = result.rows[0];

        res.render("main.ejs",{outputE : user.energy, outputT: user.travel, outputW: user.waste, outputD: user.diet, outputTC: user.total});
    }
    else{
        res.redirect("/");
    }
});

app.post(
    "/login",
    passport.authenticate("local", {
      successRedirect: "/main",
      failureRedirect: "/",
    })
);

app.post("/register",async(req,res)=>{

    const name = req.body.Name;
    const email = req.body.Email;
    const password = req.body.Password;

    try{
        const Checkresult =await db.query("SELECT * FROM footprints WHERE email = $1",[
            email,
        ]);

        if(Checkresult.rows.length > 0){
            req.redirect("/");
        }
        else{
            
            bcrypt.hash(password,saltRounds, async(err,hash) => {
                if(err){
                    console.log(err);
                }
                else{

                    const result = await db.query("INSERT INTO footprints (name,email,password) VALUES ($1,$2,$3) RETURNING *",[name,email,hash]);

                    const user = result.rows[0];
                    req.login(user, (err) => {
                        console.log("sucess");
                        res.redirect("/main");
                    });
                }
            });
        }
    }catch(err){
        console.log(err);
    }
});

app.post("/E_submit", async(req,res)=>{
    console.log(req.body.tEnergy);
    await db.query("UPDATE footprints SET energy = $1 WHERE email = $2",[req.body.tEnergy, req.user.email]);
    res.redirect("/main");
});

app.post("/T_submit", async(req,res)=>{
    console.log(req.body.tTravel);
    await db.query("UPDATE footprints SET travel = $1 WHERE email = $2",[req.body.tTravel, req.user.email]);
    res.redirect("/main");
});

app.post("/W_submit", async(req,res)=>{
    console.log(req.body.tWaste);
    await db.query("UPDATE footprints SET waste = $1 WHERE email = $2",[req.body.tWaste, req.user.email]);
    res.redirect("/main");
});

app.post("/D_submit", async(req,res)=>{
    console.log(req.body.tDiet);
    await db.query("UPDATE footprints SET diet = $1 WHERE email = $2",[req.body.tDiet, req.user.email]);
    res.redirect("/main");
});

app.get("/logout", (req, res) => {
    req.logout(function (err) {
      if (err) {
        return next(err);
      }
      res.redirect("/");
    });
});

app.post("/C_submit", async(req,res)=>{
    const result =await db.query("SELECT * FROM footprints WHERE email= $1",[req.user.email]);
    const user = result.rows[0];

    const cal1 = parseInt(user.energy);
    const cal2 = parseInt(user.travel);
    const cal_w1 = parseInt(user.waste);
    const cal5 = parseInt(user.diet);

    var total=(parseFloat(cal1+cal2+cal_w1+cal5)/1000).toFixed(2);
    console.log(total);
    await db.query("UPDATE footprints SET total = $1 WHERE email = $2",[total, req.user.email]);
    res.redirect("/main");
});


passport.use(
    new Strategy(async function verify(username,password,cb){
        try {
            const result = await db.query("SELECT * FROM footprints WHERE email = $1",[username]);
            if (result.rows.length > 0){
                const user = result.rows[0];
                const storedHashPassword = user.password;
                console.log(storedHashPassword);
                bcrypt.compare(password,storedHashPassword,(err,valid) => {
                    if(err){
                        console.error("Error Comparing Password: ",err);
                        return cb(err);
                    }
                    else{
                        if(valid){
                            
                            return cb(null,user);
                        }
                        else{
                            
                            return cb(null,false);
                        }
                    }
                });
            }
            else{
                console.log("User not Found");
            }
        }catch(err){ 
            console.log(err);
        }
    })
);

passport.serializeUser((user,cb) => {
    cb(null,user);
});

passport.deserializeUser((user,cb) => {
    cb(null,user);
});

app.listen(port, ()=>{
    console.log(`Server running on port ${port}`);
});