const express = require('express')
const router = express.Router()
const { getAllUsers, currentUser, getSingleUserProfile, editProfile, updateProfile  } = require('../controllers/userController')
const {authorization} = require('../middleware/authentication')

router.get('/getAllUsers', authorization, getAllUsers )
router.get('/currentUser', authorization, currentUser )
router.get('/:id([0-9a-fA-F]{24})', authorization, getSingleUserProfile )

router.get('/edit/:id',  authorization, editProfile)
router.post('/edit/:id', authorization, updateProfile )

module.exports = router