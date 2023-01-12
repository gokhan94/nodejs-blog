const mongoose = require('mongoose')

const CommentSchema = new mongoose.Schema({
comment: {
    type: String,
    minlength: 5,
    maxlength: 200
},
post: {
    type: mongoose.Types.ObjectId,
    ref: 'Post',
    required: true,
},
user: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: true,
  },
})

CommentSchema.index({ post: 1, user: 1 }, { unique: true })

module.exports = mongoose.model('Comment', CommentSchema)