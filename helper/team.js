const Team = require("../models/team")
const Season = require("../models/season")
const moment = require("moment");
const CurrentSeason = require("../utils/currentSeason");

module.exports = {
    readOneTeam: async (req, res) => {
        const team = await Team.findById({_id: req.params.id}).populate("season");
        res.render("team/id", {team})
    },
    readTeams: async (req, res) => {
        let season; 
        if(req.params.id){
            season = await Season.findById({_id: req.params.id});
        } else {
            season = await CurrentSeason();
        }
        const teams = await Team.find({season: season._id}).sort({name: 1});
        res.render("team/", {teams});
    },
    toCreateTeam: async (req, res) => {
        const seasons = await Season.find().sort({date: -1});
        res.render("team/new", {seasons})
    },
    createTeam: async (req, res)=> {
        try {
            console.log(req.body);
            const newTeam = await Team.create(req.body);
            res.redirect("/team");
        } catch (e) {
            console.log(e)
        }
    },
    toUpdateTeam: async (req, res) => {
        const team = await Team.findById({_id: req.params.id}).populate("season");
        const seasons = await Season.find();
        const currentSeason = await CurrentSeason();
        res.render("team/edit", {team, currentSeason, seasons});
    },
    updateTeam: async (req, res) => {
        const updatedTeam = await Team.findByIdAndUpdate({_id: req.params.id}, req.body, {new: true});
        res.redirect(`/team/${updatedTeam._id}`);
    },
    deleteTeam: async (req, res) => {
        const team = await Team.findById({_id: req.params.id});
        if(team.matchPlayed == 0){
            await Team.findByIdAndDelete({_id: req.params.id});
        }
        res.redirect("/team");
    },
}