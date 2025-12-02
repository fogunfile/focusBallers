
const fromDateFixtures = document.querySelector("#fixtures-date-from");
const toDateFixtures = document.querySelector("#fixtures-date-to");
const matchDateDoc = document.querySelector("#matchdate");
const matchWeekDoc = document.querySelector("#matchWeek");
const auto = document.querySelector("auto");
const fixturesDoc = document.querySelector(".fixtures");



const setToDate = ()=>{
    // get the date from the 'fromDatefixtures'
    let fromDate = fromDateFixtures.value;
    // add six days to the above date
    let fromDatePlus6 = moment(fromDate).add(6, 'days').format("YYYY-MM-DD")
    // make it date of the 'to fixtures'
    toDateFixtures.value = fromDatePlus6;
}

if(auto){
    matchDateDoc.addEventListener("change", ()=>{
        // get the date from matchDate
        let matchDate = matchDateDoc.value;
        // take the beginning of the week of matchDate
        let beginningOfMatchDateWeek = moment(matchDate).startOf('isoWeek').format("YYYY-MM-DD");
        // set 'fromDateFixtures' to value above
        fromDateFixtures.value = beginningOfMatchDateWeek;
        setToDate();
    })
    fromDateFixtures.addEventListener("change", setToDate)

    // const getFixtures = (requestType) => {
    //     $.ajax({
    //         type: "POST",
    //         url: `/${requestType}/date`,
    //         data: {
    //             from: fromDateFixtures.value,
    //             to: toDateFixtures.value,
    //         },
    //         success: (fixtures)=>{
    //             let main = document.querySelector("main");
    //             $(main).html("")
    //             let list = $(main).html("<ol></ol>")
    //             fixtures.forEach((fixture)=>{
    //                 $("ol").append(`
    //                     <form action="/fixture/${fixture._id}?_method=DELETE" method="POST">
    //                         <li class="h6">
    //                             <span class="h6">
    //                                 ${ fixture.homeTeam.name}
    //                             </span>
    //                             <span class="h6 mx-3">
    //                                 VS
    //                             </span>
    //                             <span class="h6">
    //                                 ${ fixture.awayTeam.name}
    //                             </span>
    //                             <div class="h6">
    //                                 (${moment(fixture.date).format("DD-MM-YYYY")})
    //                             </div>
    //                             <div class="d-flex">
    //                                 <a href="/result/${fixture._id}/check" class="btn btn-sm btn-outline-primary mr-2">Set or view Result</a>
    //                             </div>
    //                         </li>
    //                     </form>
    //                 `)
    //             })
    //         }
    //     })
    // }
    
    // fromDateFixtures.addEventListener("input", ()=>{
    //     getFixtures("fixture")
    // })
    // toDateFixtures.addEventListener("input", ()=>{
    //     getFixtures("fixture")
    // })    
}

if(fixturesDoc){
    matchWeekDoc.addEventListener("change", async ()=>{
        // get matchWeek id and query database for new matchweek data
        const dataJson = await fetch('/api/fixtures/matchweek', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
              },
            body: JSON.stringify({id: matchWeekDoc.value})
        })
        let data = await dataJson.json();
        let {fixtures, results, thisMatchWeek} = data;
    
        // Clear the document for old matchweek data
        // $('main').html("<ol></ol>")
        $("#homeTeamName").text("");
        $("#awayTeamName").text("");
        $("#homeTeamScore").text("");
        $("#awayTeamScore").text("");
        $("#medianValue").text("");
        let url;
        let homeTeamName;
        let homeTeamScore;
        let awayTeamScore;
        let awayTeamName;
        let medianValue;
    
    
        // Change the matchweek order and date
        let matchWeekOrderDoc = document.querySelector("#matchWeekOrder");
        matchWeekOrderDoc.innerHTML = thisMatchWeek.order;
        let matchWeekDateDoc = document.querySelector("#matchWeekDate");
        matchWeekDateDoc.innerHTML = `(${moment(thisMatchWeek.start).format("DD-MM-YYYY")} to ${moment(thisMatchWeek.end).format("DD-MM-YYYY")})`;
    
        // Populate fixtures html
        results.forEach((result, i)=>{
            if(result){
                url = `/result/${result._id}`
                homeTeamName = result.fixture.homeTeam.name;
                awayTeamName = result.fixture.awayTeam.name;
                homeTeamScore = result.homeTeamScore;
                awayTeamScore = result.awayTeamScore;
                medianValue = '-';
            } else {
                result = fixtures[i];
                url = `/result/${result._id}/check`;
                homeTeamName = result.homeTeam.name;
                awayTeamName = result.awayTeam.name;
                homeTeamScore = "";
                awayTeamScore = "";
                medianValue = 'vs';
            }
    
            let urlDoc = document.querySelector(`#url${i}`);
            $(`#homeTeamName${i}`).text(homeTeamName);
            $(`#awayTeamName${i}`).text(awayTeamName);
            $(`#homeTeamScore${i}`).text(homeTeamScore);
            $(`#awayTeamScore${i}`).text(awayTeamScore);
            $(`#medianValue${i}`).text(medianValue);
            $(urlDoc).attr("href", url)
        })
    
        // Update the matchweek links
        $("#thisMatchWeekLink").attr("href", `/fixture/auto/${thisMatchWeek._id}`);
        $("#thisMatchWeekEditLink").attr("href", `/fixture/auto/${thisMatchWeek._id}/edit`);
        $(".thisMatchWeekOrder").text(thisMatchWeek.order);
    })
}

