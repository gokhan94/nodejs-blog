const User = require('../models/User')
const Post = require('../models/Post')
const Comment = require('../models/Comment')

const getAllUsers = async (req, res) => {
    const users = await User.find({})
    res.render('users', {
        users: users
    })
}

const getSingleUserProfile = async (req, res) => {

    const user  = await User.findById({ _id: req.params.id })
    const posts = await Post.find({ user: req.params.id }).populate({ path: 'user', select: 'name email'})
    const userComments = await Comment.find({ user: req.params.id })

    if(!user){
        res.render('error', {
            message: "The content you were looking for was not found",
        })
    } else {
        res.render('profile', {
            user: user,
            posts: posts,
            userComments:userComments,
            currentUser: req.user
        })
    }
}

const editProfile = async (req, res) => {
    const user = await User.findById({ _id: req.params.id })

    if(req.user.userId === user._id.toString()){
        res.render('editProfile', {
            user: user
        })
    }else {
        res.render('error', {
            message: "The content you were looking for was not found",
        })
    }
}

const updateProfile = async (req, res) => {
    const { id: userId } = req.params
    
    await User.findOneAndUpdate({ _id: userId }, 
      req.body, {
      new: true,
      runValidators: true,
    })

    res.redirect('/user/'+ userId)
}

const currentUser = async (req, res) => {
    res.status(200).json({ user: req.user })
}

module.exports = { getAllUsers, currentUser, getSingleUserProfile, editProfile, updateProfile  }