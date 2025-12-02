const CurrentSeason = require("./currentSeason")
const MatchWeek     = require("./../models/matchWeek")
const Fixture       = require("./../models/fixture")
const Result        = require("./../models/result")

const data = async (matchWeekId) => {
    console.log("🚀 ~ data ~ matchWeekId:", matchWeekId)
    let thisMatchWeek;
    let fixtures;
    const results = [];
    const currentSeason = await CurrentSeason();
    if(!matchWeekId){
        thisMatchWeek = await MatchWeek.findOne({season: currentSeason._id}).sort({order: -1}).limit(1);
    } else {
        thisMatchWeek = await MatchWeek.findById({_id: matchWeekId});
    }
    const matchWeeks = await MatchWeek.find({season: currentSeason._id}).sort({order: -1});
    fixtures = await Fixture.find({matchWeek: thisMatchWeek._id}).sort({"matchWeeks.date": -1}).populate("homeTeam awayTeam");
    for(let fixture of fixtures){
        let result = await Result.findOne({fixture: fixture._id}).populate({path: "fixture", populate: {path: "homeTeam awayTeam"}});
        results.push(result);
    }
    return {fixtures, results, thisMatchWeek, matchWeeks}
}

module.exports = data