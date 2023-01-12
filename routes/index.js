const express = require('express')
const router = express.Router()
const { homePage } = require('../controllers/indexController')

router.get('/', homePage)

module.exports = router