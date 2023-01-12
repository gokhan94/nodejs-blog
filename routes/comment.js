const express = require('express')
const router = express.Router()
const { commentPost, deleteComment } = require('../controllers/commentController')
const {authorization} = require('../middleware/authentication')


router.post('/:id', authorization, commentPost)
router.get('/:id',  authorization, deleteComment)

module.exports = router