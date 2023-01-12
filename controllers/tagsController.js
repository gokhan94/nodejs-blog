const Post = require('../models/Post')

const allTags = async (req, res) => {
 
    const tags = await Post.aggregate([
        { $unwind: "$tags" },
        { $group: { "_id": "$tags", count: { $sum: 1 } } }
    ])

    res.render('tags', {
        title: "tags",
        tags: tags
    })

}

const tagsPost = async (req, res) => {
    const tag = req.params.tag
   
    const posts = await Post.aggregate([
        {
          $lookup: {
            from: "comments",
            localField: "_id",
            foreignField: "post",
            as: "comments"
          }
        },
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
            $match:{
                $and:[{ "tags" : tag }]
            }
        },
          {
            $project:{
                _id : 1,
                title : 1,
                tags:1,
                vote_count:1,
                user:1,
                comments : "$comments",
                role : "$users_detail.role",
                name : "$users_detail.name",
            } 
        }
      ])
      
      res.render('tagsPost', {
        title: "tags",
        posts: posts,
        tag: tag
    })
}

module.exports = { allTags, tagsPost }