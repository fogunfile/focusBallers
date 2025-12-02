const express           = require("express");
const app               = express();
// const passport          = require("passport");
const session           = require("express-session");
// const LocalStrategy     = require('passport-local').Strategy;
const db                = require("./models");
const rootRoute         = require("./routes/index");
const User              = require("./models/user");
const adminRoute        = require("./routes/admin");
const fixtureRoute      = require("./routes/fixture");
const teamRoute         = require("./routes/team");
const moment            = require("moment");
const resultRoute       = require("./routes/result");
const seasonRoute       = require("./routes/season");
const apiRoute          = require("./api/routes");
const methodOverride    = require("method-override");
moment.locale("en-gb");


app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(express.static(`${__dirname}/public`))
app.use(express.static(`${__dirname}/views`))
app.use(session({
    secret: process.env.secret,
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: true,
        maxAge: 3*60*60*1000,// 3 hours
    }
  }));

// app.use(passport.initialize());
// app.use(passport.session());
// passport.use(new LocalStrategy(User.authenticate()))
// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());


app.set("view engine", "ejs");

app.use(methodOverride('_method'))
app.use((req, res, next) => {
    res.locals.loggedInUser = req.user;
    next();
})

app.use("/", rootRoute)
app.use("/admin", adminRoute)
app.use("/fixture", fixtureRoute)
app.use("/result", resultRoute)
app.use("/season", seasonRoute)
app.use("/team", teamRoute)
app.use("/api", apiRoute)

app.locals.moment = moment;

const port = process.env.PORT;
app.listen(port, ()=>{
    console.log(`Server started on port ${port}`);
})