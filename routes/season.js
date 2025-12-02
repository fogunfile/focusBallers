const express = require("express");
const router = express.Router();
const AddMatch = require("../utils/addMatch");
const RemoveMatch = require("../utils/removeMatch");
const helper = require("../helper/season")
// import router from express

// const router = express.Router()

router.get("/", helper.readSeasons)
router.post("/", helper.createSeason)
router.get("/new", helper.toCreateSeason)
router.get("/:id/edit", helper.toUpdateSeason)
router.get("/:id", helper.readOneSeason)
router.put("/:id", helper.updateSeason)

module.exports = router;