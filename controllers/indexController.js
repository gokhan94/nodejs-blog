const User = require('../models/User')
const Post = require('../models/Post')

const homePage = async  (req, res) => {

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
        //{   $unwind:"$comments" },     
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
                userId:"$users_detail._id"
            } 
        }
      ])

      const tags = await Post.distinct("tags")

      res.render('index', {
            title: "post",
            posts: posts,
            tags: tags
      })
}

module.exports = { homePage }