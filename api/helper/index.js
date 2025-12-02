const MatchWeek = require("./../../models/matchWeek");
const Fixture = require("./../../models/fixture");
const Table = require("./../../utils/table")
const Result = require("./../../models/result");
const Season = require("./../../models/season");
const FixtureData = require("./../../utils/fixtureData")
const CurrentSeason = require("./../../utils/currentSeason");
const Team = require("./../../models/team")

module.exports = {
    getFixturesByMatchWeeks: async (req, res) => {
        try {
            const fixtureData = await FixtureData(req.body.id);
            const {fixtures, results, thisMatchWeek, matchWeeks} = fixtureData;
            res.json({fixtures, results, thisMatchWeek, matchWeeks})
        } catch (e) {
            console.log(e);
        }
    },
    getTeamsInASeason: async (req, res) => {
        try {
            let season = await Season.findOne({name: req.body.season});
            let teams = await Team.find({season: season._id}).sort({name: 1});
            res.json({teams});
        } catch (e) {
            console.log(e)
        }
    },
    getAllResultsInASeason: async (req, res) => {
        try {
            let currentSeason = await CurrentSeason();
            let fixtures = await Fixture.find({season: currentSeason._id});
            const fixturesIds = fixtures.map(fixture => fixture._id);
            let results = await Result.find({fixture: {$in: fixturesIds}}).populate({path: "fixture", populate: {path: "homeTeam awayTeam"}});
            res.json({results})
        } catch (e) {
            console.log(e);
        }
    },
    table: async (req, res) => {
        try {
            console.log(req.body);
            let newTable = await new Table()

        } catch (e) {
            console.log(e)
        }
    }
}