const express = require('express')
const router = express.Router()
const { getAllPost, getPost, postAdd, votesUp, voteDown, searchTags, getEditPost, updatePost, deletePost } = require('../controllers/postController')
const {authorization} = require('../middleware/authentication')


router.get('/' , getAllPost)

router.get('/create', authorization, (req, res) => {
    res.render('addPost', {
        title: 'Post Page'
      })
})
// Post Update
router.get('/edit/:id([0-9a-fA-F]{24})', authorization, getEditPost)
router.post('/edit/:id', authorization, updatePost)
// Single Post
router.get('/:id([0-9a-fA-F]{24})', authorization, getPost)
// Delete Post
router.get('/delete/:id([0-9a-fA-F]{24})', authorization, deletePost)
// Add Post
router.post('/addPost', authorization, postAdd)
// Post votes
router.get('/:id/voteUp', authorization, votesUp)
router.get('/:id/voteDown', authorization, voteDown)



router.post('/searchTags', searchTags)





module.exports = router