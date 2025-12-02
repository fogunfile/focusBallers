const Season            = require("../models/season");
const moment            = require("moment");

module.exports = async () => {
    let currentSeason = await Season.findOne({
        start: {$gte: moment().startOf("year"), $lte: moment().endOf("year")},
        end: {$gte: moment().startOf("year"), $lte: moment().endOf("year")},
    });
    return currentSeason;
};
