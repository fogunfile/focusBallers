const tableDoc = document.querySelector(".table");
const standingsDoc = document.querySelector("#standings");
const tableBodyDoc = document.querySelector("#tbody");

if(tableDoc){
    // get teams
    const teamsFunc = async () => {
        let teamsJson = await fetch("/api/teams", {
            method: 'POST',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify({
                season: "2025",
            })
        })
        let teams = await teamsJson.json();
        return teams;
    }
    const teams = teamsFunc();

    // get fixtures up to the latest
    const resultsGetter = async () => {
        let resultsJson = await fetch("/api/results", {
            method: "GET",
            headers: {"Content-type": "application/json"},
            // body: JSON.stringify({})
        })
        return await resultsJson.json();
    }
    
    // table
    const tableCalc = async () => {
        let results = await resultsGetter();
        let standings = new TableCalculator(results);
        return standings;
    }

    let standings = [];
    teams.then(async (res)=>{
        const standingsObj = await tableCalc();
        for(let team of res.teams){
            standings.push(standingsObj[team._id]);
        }

        // Sort by number of points and goal difference. Points take priority over goalDifference.
        sortBy(standings, ["goalDifference", "points"])
    
        standings.forEach((team, n) => {
            $(tableBodyDoc).append(`<tr>
                <td>${n+1}</td>
                <td>${team.name}</td>
                <td>${team.matchPlayed}</td>
                <td>${team.win}</td>
                <td>${team.draw}</td>
                <td>${team.lose}</td>
                <td>${team.goalsFor}</td>
                <td>${Math.abs(team.goalsAgainst)}</td>
                <td>${team.goalDifference}</td>
                <td>${team.points}</td>
            </tr>`)
        })
    })

}