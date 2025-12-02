const Team                      = require("../models/team")
const Fixture                   = require("../models/fixture")
const Result                    = require("../models/result")
const MatchWeek                 = require("../models/matchWeek")
const RemoveMatch               = require("../utils/removeMatch");
const moment                    = require("moment");
const CurrentSeason             = require("../utils/currentSeason");
const FixtureData               = require("../utils/fixtureData")


const shuffle = (arr) => {
    let counter = arr.length-1;
    while (counter > 0){
        let index = Math.floor(Math.random()*counter);
        [arr[counter], arr[index]] = [arr[index], arr[counter]]
        counter--;
    }
}

// if the first two elements are paired, shuffle such that the first element is paired with the third one
const orderedShuffle = (arr) => {
    let counter = arr.length-1;
    let index = 0;
    while(index+2 < counter){
        [arr[index+1], arr[index+2]] = [arr[index+2], arr[index+1]];
        index += 3;
    }
}

module.exports = {
    readFixtures: async (req, res) => {
        let fixtureData = await FixtureData();
        const {fixtures, results, thisMatchWeek, matchWeeks} = fixtureData;
        res.render("fixture/", {fixtures, results, thisMatchWeek, matchWeeks});
    },
    getFixturesByDate: async (req, res) => {
        const fixtures = await Fixture.find({
            date: {
                $gte: moment(req.body.from), 
                $lte: moment(req.body.to).add(24, "hour")
            }
        }).sort({date: -1}).populate("homeTeam awayTeam");
        res.json(fixtures);
    },
    getFixturesByMatchWeek: async (req, res) => {
        const matchWeek = await MatchWeek.findOne({order: req.params.matchWeek});
        const fixtureData = await FixtureData(matchWeek._id);
        const {fixtures, results, thisMatchWeek, matchWeeks} = fixtureData;
        res.render("fixture/auto/id", {fixtures, results, thisMatchWeek, matchWeeks})
    },
    toAutoCreateFixtures: (req, res) => {
        res.render("fixture/auto/new");
    },
    toAutoUpdateFixtures: async (req, res) => {
        const matchWeek = await MatchWeek.findById({_id: req.params.id});
        const fixtures = await Fixture.find({matchWeek: matchWeek._id}).populate("homeTeam awayTeam");
        res.render("fixture/auto/edit", {fixtures, matchWeek});
    },
    autoUpdateFixtures: async (req, res) => {
        const matchWeek = await MatchWeek.findByIdAndUpdate({_id: req.params.id}, {
            date: req.body.date[0],
            start: req.body.date[1],
            end: req.body.date[2],
        }, {new: true});
        const fixtureData = await FixtureData(matchWeek._id);
        const {fixtures, results, thisMatchWeek, matchWeeks} = fixtureData;
        res.redirect(`/fixture/auto/matchWeek/${matchWeek.order}`);
    },
    autoCreateFixtures: async (req, res) => {
        const currentSeason = await CurrentSeason();
        const matchWeeks = await MatchWeek.find({season: currentSeason._id}).sort({order: 1});
        const lastMatchWeek = matchWeeks[matchWeeks.length-1];
        let order;
        let matchDate = req.body.date[0];
        let start = req.body.date[1];
        let end = req.body.date[2];

        // if no matchweek has been created, create one with order of 1. 
        // if we find lastmatchweek, create one with order of 1 + order of lastmatchweek.
        lastMatchWeek ? order = 1 + parseInt(lastMatchWeek.order) : order = 1;
        let matchWeekObject = {
            order,
            season: currentSeason._id,
            start: moment(start).startOf('week'),
            end: moment(end).endOf('week'),
        };
        let matchWeek = await MatchWeek.create(matchWeekObject);
        
        const teams = await Team.find({season: currentSeason._id});
        shuffle(teams);
        const teamNames = teams.map(team => team._id);
        
        // Function that creates fixture / pairings for all provided teams
        const fixtureMaker = (teamNames) => {
            let arr = [];
            let k= 1 //k = difference in the numbers
            let pairToAppend = [];
            while(k < teamNames.length){
                for(let i=0; i<teamNames.length; i++){
                    for(let j=0; j<teamNames.length; j++){
                        if(j-i === k && j!=i){ //Avoids repeat of e.g 0,1 and 1,0  //Avoids repeat of same e.g. 0,0
                            let pairNames = [teamNames[i], teamNames[j]];
                            if(k==1 && j%2 == 0){//Removes consecutive listings for greater diversity
                                pairToAppend.push(pairNames);
                            } else {
                                arr.push(pairNames);
                            }
                        }
                    }
                }
                k++;
            }
            arr.push(...pairToAppend);
            return arr; 
        }
        let fixtureArray = fixtureMaker(teamNames);

        // Swap the first fixture at random
        let randomNumber = Math.floor(Math.random()*2);
        if(randomNumber){
            [fixtureArray[0][0], fixtureArray[0][1]] = [fixtureArray[0][1], fixtureArray[0][0]]
        }

        const teamPairs = [];
        for(let oneFixture of fixtureArray){
            let fixtureObject = {
                matchWeek: matchWeek._id,
                homeTeam: oneFixture[0],
                awayTeam: oneFixture[1],
                season: currentSeason._id,
                date: matchDate,
            }
            teamPairs.push(fixtureObject);
        }

        await Fixture.insertMany(teamPairs);
        res.redirect("/fixture");

    },
        
    readOneFixture: async (req, res) => {
        const fixture = await Fixture.findById({_id: req.params.id}).populate("homeTeam awayTeam");
        res.render("fixture/id", {fixture});
    },
    toCreateFixture: async (req, res) => {
        const teams = await Team.find().sort({name: 1});
        res.render("fixture/new", {teams});
    },
    createFixture: async (req, res)=> {
        // try {
        // //    const newFixture = await Fixture.create(req.body);
        // console.log("to create fixture", req.body);
        //    res.redirect(`fixture/${newFixture._id}`);
        // } catch (e) {
        //     console.log(e)
        // }
    },
    
    updateFixture: async (req, res) => {
        try {
            const fixtureId = req.params.id;
            const fixture = await Fixture.findById({_id: fixtureId}).populate("matchWeek");
            await Fixture.findByIdAndUpdate({_id: fixtureId}, req.body, {new: true});
            res.redirect(`/fixture/auto/matchWeek/${fixture.matchWeek.order}`);
        } catch (e) {
            console.log(e);
        }
    },
    toAutoDeleteFixtures: async (req, res) => {
        try {
            let matchWeek = await MatchWeek.findById({_id: req.params.id});
            res.render("fixture/delete", {matchWeek});
        } catch (e) {
            console.log(e);
        }
    },
    autoDeleteFixtures: async (req, res) => {
        try {
            const matchWeekId = req.params.id;
            // find associated fixtures
            const fixturesToDelete = await Fixture.find({matchWeek: matchWeekId});
            
            // delete corresponding result
            for(let fixture of fixturesToDelete){
                let isDeleted = await Result.deleteOne({fixture: fixture._id})
                console.log("🚀 ~ autoDeleteFixtures: ~ isDeleted:", isDeleted)
            }

            // delete fixtures
            const fixtures = await Fixture.deleteMany({matchWeek: matchWeekId})
            console.log("🚀 ~ autoDeleteFixtures: ~ fixtures:", fixtures)

            // delete matchweek
            const matchWeek = await MatchWeek.deleteOne({_id: matchWeekId});
            console.log("🚀 ~ autoDeleteFixtures: ~ matchWeek:", matchWeek)

            res.redirect("/fixture")
        } catch (e) {
            console.log(e);
        }
    },
    deleteFixture: async (req, res) => {
        const fixtureId = req.params.id;
        console.log("About to Delete")
        const foundResult = await Result.findOne({fixture: fixtureId}).populate("fixture"); // delete corresponding result
        if(foundResult){
            const thisMatch = new RemoveMatch(foundResult.homeTeamScore, foundResult.fixture.homeTeam, foundResult.awayTeamScore, foundResult.fixture.awayTeam);
            const executedMatch = await thisMatch.executeMatch()
            await Result.findByIdAndDelete({_id: foundResult._id});
            await Fixture.findByIdAndDelete({_id: fixtureId});
            res.redirect("/result")
        } else {
            await Fixture.findByIdAndDelete({_id: fixtureId});
            res.redirect("/fixture")
        }
    },
}