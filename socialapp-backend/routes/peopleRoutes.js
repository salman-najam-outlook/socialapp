const express = require("express");
const router = express.Router();

const PeopleCtrl = require("../controllers/people");
const AuthHelper = require("../helpers/authHelper");

router.get("/people", AuthHelper.VerifyToken, PeopleCtrl.GetAllPeople);
router.get("/people/:id", AuthHelper.VerifyToken, PeopleCtrl.GetUserById);
router.get("/people/username/:username", AuthHelper.VerifyToken, PeopleCtrl.GetUserByUsername);

module.exports = router;