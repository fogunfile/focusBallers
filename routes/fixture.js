const express = require("express");
const router = express.Router();
const helper = require("../helper/fixture")

router.get("/", helper.readFixtures);
router.get("/new", helper.toCreateFixture);
router.post("/", helper.createFixture);
router.get("/auto/:id/", helper.toAutoDeleteFixtures);
router.delete("/auto/:id/", helper.autoDeleteFixtures);
router.get("/auto", helper.toAutoCreateFixtures);
router.post("/auto", helper.autoCreateFixtures);
router.get("/auto/matchWeek/:matchWeek", helper.getFixturesByMatchWeek)
router.get("/auto/:id/edit", helper.toAutoUpdateFixtures);
router.put("/auto/:id/", helper.autoUpdateFixtures);
router.post("/date", helper.getFixturesByDate);
router.get("/:id", helper.readOneFixture);
router.put("/:id", helper.updateFixture);
router.delete("/:id", helper.deleteFixture);

module.exports = router;