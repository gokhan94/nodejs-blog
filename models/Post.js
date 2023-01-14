const mongoose = require('mongoose')

const PostSchema = new mongoose.Schema({
 title : { 
    type: String,     
    minlength: 5,
    maxlength: 50,
},
content : { 
    type: String,     
    minlength: 5,
},
tags: Array,
vote_count: {
    type: Number,
    default: 0
},
votes: [],
user: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, 
{ timestamps: true },
)

// Deletion of comments on the post
PostSchema.virtual('comments', {
    ref: 'Comment',
    localField: 'post',
    foreignField: '_id',
    justOne: true
})

PostSchema.pre('remove', async function (next) {
    await this.model('Comment').deleteMany({ post: this._id })
})

module.exports = mongoose.model('Post', PostSchema)