const express = require("express");
const router = express.Router();
const helper = require("./../helper")

router.post("/fixtures/matchweek", helper.getFixturesByMatchWeeks);
router.post("/teams", helper.getTeamsInASeason);
router.post("/table", helper.table);
router.get("/results", helper.getAllResultsInASeason);

module.exports = router;