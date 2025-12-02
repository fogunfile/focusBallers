// Calculate table based on each fixture
const AddMatch = require("./addMatch");

// {
//     teamA: {
//         matchPlayed,
//         win,
//         draw,
//         lose,
//         goalsFor,
//         goalsAgainst,
//         goalDifference,
//         points,
//     },

// }

class tableCalculator {
    constructor(resultsArray){
        this.resultsArray = resultsArray;

    }

    executeMatch(){
        for(result of this.resultsArray){
            let newMatch = new AddMatch(result["homeTeamScore"], result["fixture"]["homeTeamId"], result["awayTeamScore"], result["fixture"]["awayTeamId"])
            console.log(newMatch.executeMatch());
        }
    }
}