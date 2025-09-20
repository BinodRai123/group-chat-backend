const express = require("express");
const {authRegister, authLogin, userActive} = require("../controllers/auth.controller");

const router = express.Router();

router.post("/register",authRegister);
router.post("/login",authLogin);
router.get("/me",userActive);

module.exports = router;