const express       = require("express")
const router        = express.Router();
const middleware    = require("../middleware");
const User          = require("../models/user");
const crypto        = require("crypto");
const util          = require("util");
const cryptoSync    = util.promisify(crypto.scrypt)

// const passport      = require("passport")

router.get("/", middleware.isLoggedIn, (req, res)=>{
    res.render("admin/")
})

router.get("/login", (req, res)=>{
    res.render("admin/login")
})

router.post("/login", async (req, res)=>{
    console.log(req.body);
    let foundUser = await User.findOne({username: req.body.username});
    if(!foundUser){
        return res.send("User does not exist");
    }
    const [hash, salt] = foundUser.password.split(".")
    let buf = await cryptoSync(req.body.password, salt, 64);
    let newHash = buf.toString("hex")
    if(hash === newHash){
        console.log("User can login now////////");
        req.session.userId = foundUser._id;
    }
    res.send("You are signed in")
})

router.post("/logout", (req, res)=>{
    req.session = null;
    res.send("You are logged out")
})

router.get("/register", middleware.isLoggedIn, (req, res)=>{
    res.render("admin/register")

})

router.post("/register", middleware.isLoggedIn, async (req, res)=>{
    try {
        console.log(req.body);
        let userObj = {
            username: req.body.username.trim(),
            firstname: req.body.firstname,
            surname: req.body.surname,
            email: req.body.email.trim(),
            password: req.body.password,
        }

        if(req.body.password != req.body['confirm-password']){
            return res.send("Password do not match");
        }

        let salt = crypto.randomBytes(32).toString("hex").toString("hex")
        let hash = await cryptoSync(req.body.password, salt, 64);
        let password = `${hash.toString("hex")}.${salt}`

        const newUser = await User.create({...userObj, password})
        console.log("🚀 ~ router.post ~ newUser:", newUser)
    } catch (e) {
        console.log(e)
    }
})

module.exports = router;