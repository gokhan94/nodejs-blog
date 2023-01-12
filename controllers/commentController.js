const Comment = require('../models/Comment')

const commentPost = async (req, res) => {
    const productId = req.params.id

    const alreadyCommented = await Comment.findOne({
        post: productId,
        user: req.user.userId,
    })

    if (alreadyCommented) {
        res.render('error', {
            message: "already comment user",
        })
        return
       //res.status(404).json({ message: 'already comment user' })
    }

    const newComment = {
        comment: req.body.comment,
        post: productId,
        user: req.user.userId,
    }
  
    await Comment.create(newComment)
    res.redirect('/post/'+ productId)
}

const deleteComment = async (req, res) => {
    const { id: commentId } = req.params
    const comment = await Comment.findOne({ _id: commentId })

    if(req.user.userId === comment.user.toString() || req.user.role == 'admin'){
        await comment.remove()

        res.render('success', {
            message: "Success! comment removed",
        })  
        return
       // res.status(200).json({ msg: 'Success! comment removed' })
    }else {
        res.render('error', {
            message: "no auth",
        })
        return
        //res.status(404).json({ msg: 'no auth' })
    }
}

module.exports = {
    commentPost,
    deleteComment
}