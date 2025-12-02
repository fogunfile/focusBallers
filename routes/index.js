const express = require("express");
const router = express.Router();
const Team = require("../models/team");
const Fixture = require("../models/fixture");
const moment = require("moment");
const helper = require("../helper");
const Season = require("../models/season");
const CurrentSeason = require("../utils/currentSeason");

// const router = express.Router()

router.get("/", async (req, res)=> {
    console.log("req.session", req.session)
    const currentSeason = await CurrentSeason();
    const seasons = await Season.find();
    const teams = await Team.find({season: currentSeason._id})
    res.render("index", {teams, seasons, currentSeason});
})

router.get("/login", async (req, res)=> {
    res.render("admin/login")
})

router.get("/test", helper.testGround)

module.exports = router;
