class TableCalculator {
    constructor(resultsArray){
        this.resultsArray = resultsArray.results;
        for(let result of this.resultsArray){
            this.homeTeam = result.fixture.homeTeam._id;
            this.awayTeam = result.fixture.awayTeam._id;
            this.homeTeamScore = result.homeTeamScore;
            this.awayTeamScore = result.awayTeamScore;
            if(!this[this.homeTeam]){
                this[this.homeTeam] = {
                    id: this.homeTeam,
                    name: result.fixture.homeTeam.name,
                    matchPlayed: 0,
                    win: 0,
                    draw: 0,
                    lose: 0,
                    goalsFor: 0,
                    goalsAgainst: 0,
                    goalDifference: 0,
                    points: 0,
                };
            }
            if(!this[this.awayTeam]){
                this[this.awayTeam] = {
                    id: this.awayTeam,
                    name: result.fixture.awayTeam.name,
                    matchPlayed: 0,
                    win: 0,
                    draw: 0,
                    lose: 0,
                    goalsFor: 0,
                    goalsAgainst: 0,
                    goalDifference: 0,
                    points: 0,
                }
            }
            this.executeMatch();
        }
    }

    matchPlayed(){
        this[this.homeTeam].matchPlayed++;
        this[this.awayTeam].matchPlayed++;
    }

    isHomeTeamWin(){
        if(this.homeTeamScore > this.awayTeamScore){
            return true
        } else if(this.awayTeamScore > this.homeTeamScore){
            return false
        } else {
            return null;
        }
    }

    winLoseOrDraw(){
        if(this.isHomeTeamWin() === null){
            this[this.homeTeam].draw++;
            this[this.awayTeam].draw++;
        } else if(this.isHomeTeamWin()){
            this[this.homeTeam].win++;
            this[this.awayTeam].lose++;
        } else {
            this[this.homeTeam].lose++;
            this[this.awayTeam].win++;
        }
    }

    goalsFor(){
        this[this.homeTeam].goalsFor += this.homeTeamScore;
        this[this.awayTeam].goalsFor += this.awayTeamScore;
    }

    goalsAgainst(){
        this[this.homeTeam].goalsAgainst -= this.awayTeamScore;
        this[this.awayTeam].goalsAgainst -= this.homeTeamScore;
    }

    goalDifference(){
        this[this.homeTeam].goalDifference = this[this.homeTeam].goalsFor + this[this.homeTeam].goalsAgainst;
        this[this.awayTeam].goalDifference = this[this.awayTeam].goalsFor + this[this.awayTeam].goalsAgainst;
    }

    points(){
        if(this.isHomeTeamWin() == null){
            this[this.homeTeam].points++;
            this[this.awayTeam].points++;
        } else if(this.isHomeTeamWin()){
            this[this.homeTeam].points += 3;
        } else {
            this[this.awayTeam].points += 3;
        }
    }

    executeMatch(){
        this.matchPlayed();
        this.isHomeTeamWin();
        this.winLoseOrDraw();
        this.goalsFor(); //
        this.goalsAgainst(); //
        this.goalDifference(); //
        this.points();
        // return (this[this.homeTeam], this[this.awayTeam]);
        return this;
    }
    // execute match
    // add 
}