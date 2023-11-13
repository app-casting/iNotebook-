const jwt = require("jsonwebtoken");
const JWT_SECRET = "Hey welcome to your note's";

const fetchUser=async (req,res,next)=>{
    // get the user form the jwt token and add id to req obj
    const token = req.header('auth-token')
    if(!token){
        res.status(401).send({error: "Please Authenticate using a vaild token"});
    }
    try {
        const data =  jwt.verify(token, JWT_SECRET)
       req.user = data.user;
        next();
        
    } catch (error) {
        console.log(error.message);
        res.status(401).send({error: "Please Authenticate using a vaild token"});
      }
}
module.exports=fetchUser;
