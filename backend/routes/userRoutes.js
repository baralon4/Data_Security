const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");


router.post("/register", userController.registerUser);

router.post("/login", userController.loginUser);

router.post("/request-password-reset", userController.forgotPassword);

router.post("/reset-password/:token", userController.resetPassword);

module.exports = router;


