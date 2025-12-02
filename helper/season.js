const Season = require("../models/season")
const moment = require("moment")

module.exports = {
    readOneSeason: async (req, res) => {
        const season = await Season.findById({_id: req.params.id});
        res.render("season/id", {season})
    },
    readSeasons: async (req, res) => {
        const seasons = await Season.find().sort({name: 1});
        res.render("season/", {seasons});
    },
    toCreateSeason: async (req, res) => {
       res.render("season/new")
    },
    createSeason: async (req, res)=> {
        try {
            console.log(req.body);
            let seasonObj = {
                name: req.body.name,
                description: req.body.description,
                start: moment(req.body.start),
                end: moment(req.body.end),
            }
            const newSeason = await Season.create(seasonObj);
            res.redirect("/");
        } catch (e) {
            console.log(e)
        }
    },
    toUpdateSeason: async (req, res) => {
        const season = await Season.findById({_id: req.params.id});
        res.render("season/edit", {season});
    },
    updateSeason: async (req, res) => {
        const updatedSeason = await Season.findByIdAndUpdate({_id: req.params.id}, req.body, {new: true});
        res.redirect("season/id");
    },
    deleteSeason: async (req, res) => {
        const season = await Season.findById({_id: req.params.id});
        if(season.matchPlayed == 0){
            await Season.findByIdAndDelete({_id: req.params.id});
        }
        res.redirect("/season");
    },
}