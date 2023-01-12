const express = require('express')
const router = express.Router()
const { allTags, tagsPost } = require('../controllers/tagsController')

router.get('/', allTags)
router.get('/:tag', tagsPost)

module.exports = router