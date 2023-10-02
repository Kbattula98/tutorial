const express= require("express");
const app= express();

const path=require("path");
const dbpath=path.join(__dirname,"userData.db");

const {open}=require("sqlite");
const sqlite3=require("sqlite3");
let db=null;
app.use(express.json());

const bcrypt=require("bcrypt");

const initialisedbandserver= async()=>{
    try{
        app.listen("3000",()=>{
    console.log("Server Running at https://localhost:3000/");
})
        db= await open({
        filename:dbpath,
        driver:sqlite3.Database,
    })
    }catch(e){
        console.log(`dberror :${e.message}`);
        process.exit();
    }
}
initialisedbandserver();

app.post("/register",async(request,response)=>{
    const {username,name,password,gender,location}=request.body;
    const hashedpassword=await bcrypt.hash(password,10);
    const compareuser=
    `SELECT * FROM user WHERE username='${username}';`;

    const dbuser= await db.get(compareuser);
    if(dbuser===undefined){
        const insertrow=
        `INSERT INTO user (username,name,password,gender,location)
        VALUES ('${username}','${name}','${hashedpassword}','${gender}','${location}');`;

        if((password.length)>5){
            await db.run(insertrow);
            response.status(200);
            response.send("User created successfully");
        }else{
            response.status(400);
            response.send("Password is too short");
        }
    }
    else{
        response.status(400);
        response.send("User already exists");
    }

})
module.exports=app;