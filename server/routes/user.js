const express = require('express')
const { loginUser, signupUser } = require('../controllers/userControllers')
const router = express.Router()


// login form 
router.post('/login', loginUser)

// singup form
router.post('/signup', signupUser) 

module.exports = router