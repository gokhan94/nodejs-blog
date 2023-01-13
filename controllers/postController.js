const Post = require('../models/Post')
const Comment = require('../models/Comment')

const getAllPost = async (req, res) => {

const posts = await Post.aggregate([
  // Join with comments table
  {
    $lookup: {
      from: "comments",
      localField: "_id",
      foreignField: "post",
      as: "comments"
    }
  },   
  // Join with users table
  {
      $lookup:{
          from: "users", 
          localField: "user", 
          foreignField: "_id",
          as: "users_detail"
      }
  },
  {   $unwind:"$users_detail" },
    {
      $project:{
          _id : 1,
          title : 1,
          tags:1,
          vote_count:1,
          comments : "$comments",
          role : "$users_detail.role",
          name : "$users_detail.name",
      } 
  }
])
  
  res.render('allPosts', {
      title: "post",
      posts: posts
  })


}

const getPost = async (req, res) => {

    const { id: postId } = req.params

    const post = await Post.findById({ _id: postId }).populate({ path: 'user', select: 'name role description job'})
    const singlePostComments = await Comment.find({ post: postId }).sort({ comment: -1 }).populate({ path: 'user', select: 'name email job'})
    
    if(!post){
      res.render('error', {
        message: "The content you were looking for was not found",
      })
    } else { 
      res.render('singlePost', {
        title: "post",
        post: post,
        comments: singlePostComments,
        currentUser: req.user
      })
    }
 
}

const getEditPost = async (req, res) => {

  const { id: postId } = req.params
  const post = await Post.findById({ _id: postId })

  if(req.user.userId === post.user.toString()){
    res.render('editPost', {
      post: post
    })
  }else{
    res.render('error', {
      message: "The content you were looking for was not found",
    })
  }

}

const updatePost = async (req, res) => {
  const { id: postId } = req.params
  
  await Post.findOneAndUpdate({ _id: postId }, 
    req.body, {
    new: true,
    runValidators: true,
  })

  res.redirect('/post/'+ postId)

}

const deletePost = async (req, res) => {
  const { id: postId } = req.params

  const post = await Post.findOne({ _id: postId })

  if(!post){
    res.render('error', {
      message: "The content you were looking for was not found",
    })
    return
  }

  await post.remove()
  res.redirect('/')
}


const votesUp = async (req, res) => {

  const { id: productId } = req.params
  const userId = req.user.userId

  await Post.updateOne({_id: productId, 
    votes: {'$ne': userId }
  }, 
  {'$push': {'votes': userId }, '$inc': { vote_count: 1 }})

  res.redirect('/post/'+ productId)

}

const voteDown = async (req, res) => {
  const { id: productId } = req.params
  const userId = req.user.userId

  await Post.updateOne({_id: productId, 
     votes: userId 
     },
     {'$pull': {'votes': userId }, '$inc': { vote_count: -1 }})

     res.redirect('/post/'+ productId)
}

const postAdd = async (req, res) => {
  const newPost = {
     user: req.user.userId,
     tags : req.body.newTags,
     title: req.body.title,
     content: req.body.content
  }

  await Post.create(newPost)
  res.json({'msf':"ok"})

  /*if(post){
    res.status(200).json({'message': 'Post created'})
  }*/

}

const searchTags = async (req, res) => {
    let payload = req.body.payload
    let search = await Post.find({ tags: {$regex: new RegExp('^'+ payload + '.*', 'i')} } )
    res.send({ payload: search})
}
  

module.exports = {
    getAllPost,
    getPost,
    postAdd,
    votesUp,
    voteDown,
    getEditPost,
    updatePost,
    deletePost,
    searchTags
}