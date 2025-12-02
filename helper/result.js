const Team = require("../models/team")
const Fixture = require("../models/fixture")
const Result = require("../models/result");
const AddMatch = require("../utils/addMatch");
const RemoveMatch = require("../utils/removeMatch");
const deleteFixture = require("./fixture").deleteFixture
const moment = require("moment");
const CurrentSeason = require("../utils/currentSeason");

module.exports = {
    readResults: async (req, res) => {
        const currentSeason = await CurrentSeason();
        const fixtures = await Fixture.find({season: currentSeason._id});
        const results = await Result.find({fixture: {$in: fixtures}}).populate({path: "fixture", populate: {path: "homeTeam awayTeam"}}).sort({"fixture.date": -1});
        results.sort((a,b)=>{
            if(b.fixture.date > a.fixture.date){
                return 1;
            } else if (b.fixture.date < a.fixture.date){
                return -1;
            }
        });
        res.render("result/", {results});
    },
    readOneResult: async (req, res) => {
        let resultId = req.params.id
        const result = await Result.findById({_id: resultId}).populate({path: "fixture", populate: {path: "homeTeam awayTeam"}});
        res.render("result/id", {result});
    },
    toCreateResult: async (req, res) => {
        const fixtureId = req.params.id
        const fixture = await Fixture.findById({_id: fixtureId}).sort({date: -1}).populate("homeTeam awayTeam");
        res.render("result/new", {fixture});
    },
    checkResult: async (req, res)=>{
        const fixtureId = req.params.id
        const correspondingResult = await Result.findOne({fixture: fixtureId});
        if(correspondingResult){
            res.redirect(`/result/${correspondingResult._id}`)
        } else {
            res.redirect(`/result/${fixtureId}/new`);
        }
    },
    createResult: async (req, res)=> {
        try {
            Object.assign(req.body, {fixture: req.params.id})
            console.log(req.body);
            const thisResult = await Result.create(req.body);
            const newResult = await Result.findById({_id: thisResult._id}).populate({path: "fixture", populate: {path: "homeTeam awayTeam"}});
            // const thisMatch = new AddMatch(newResult.homeTeamScore, newResult.fixture.homeTeam._id, newResult.awayTeamScore, newResult.fixture.awayTeam._id);
            // thisMatch.executeMatch();
            res.redirect("/fixture")
        } catch (e) {
            console.log(e)
        }
    },
    toUpdateResult: async (req, res) => {
        try {
            const resultId = req.params.id
            const result = await Result.findById({_id: resultId}).populate({path: "fixture", populate: {path: "homeTeam awayTeam"}});
            res.render("result/edit", {result})
        } catch (e) {
            console.log(e);
        }
    },
    updateResult: async (req, res) => {
        try {
            console.log(req.body);
            const resultUpdated = await Result.findByIdAndUpdate({_id: req.params.id}, req.body, {new: true});
            console.log(resultUpdated);
            res.redirect(`/result/${req.params.id}`)

            // const thisMatch = new RemoveMatch(3, teamA._id, 2, teamB._id);
            // const executedMatch = await thisMatch.executeMatch()
            // res.send(executedMatch);
        } catch (e) {
            console.log(e);
        }
    },
    deleteResult: async (req, res) => {
        deleteFixture(req, res);
    },
}