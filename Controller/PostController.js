const User = require('../Models/UsersModel');
const Post = require('../Models/PostModel');

const validator = require('validator');

const { Res, errRes } = require('../utils/Res&errRes')



exports.postCreate = async (req, res, next) => {

    if (!req.body.title || validator.isEmpty(req.body.title)) return errRes(res, 400, 'title is Required')
    if (!req.body.text || validator.isEmpty(req.body.text)) return errRes(res, 400, 'text is Required')
    
    
    try {
        const user = await User.findById(req.user.id).select('-password')
        
        let newPost = {
            title: req.body.title,
            text: req.body.text,
            user: req.user.id,
            name: user.name,
            avatar: user.avatar,
        }
        const post = await Post.create(newPost)
        Res(res, 201, post)
        
    } catch (err) {
    //   console.log(err)
      res.status(500).send('Server error creating post')
    }
}


exports.getPosts = async (req, res, next) => {
    
    try {
        const posts = await Post.find().sort({ date: -1 })
        Res(res, 200, posts)

    } catch (err) {
        // console.log(err)
        errRes(res, 500, 'Server error creating post')
    }

}


exports.getPost = async (req, res, next) => {
    
    try {
        const post = await Post.findById(req.params.id)

        if (!post) {
            return errRes(res, 404, 'The post You are looking is not available anymore! 😔')
        }

        Res(res, 200, post)

    } catch (err) {
        // console.log(err)
        if (err.kind === 'ObjectId') {
            return errRes(res, 404, 'The post You are looking is not available anymore! 😔')
        } else {
            errRes(res, 500, 'Server error creating post')
        }
    }

}


exports.deletePost = async (req, res, next) => {
    
    try {
        const post = await Post.findById(req.params.id)
        
        if (!post) {
            return errRes(res, 404, 'The post You are looking is not available anymore! 😔')
        }

        if (post.user != req.user.id) {
            return errRes(res, 400, 'Please make sure that you are the one who created this post !!')
        }
        
        await post.remove()

        // await Post.findByIdAndRemove(req.params.id)


        Res(res, 200, 'null')

    } catch (err) {
        // console.log(err)
        if (err.kind === 'ObjectId') {
            return errRes(res, 404, 'The post You are looking is not available anymore! 😔')
        } else {
            errRes(res, 500, 'Server error deleting post')
        }
    }

}


exports.likePost = async (req, res, next) => {
    
    try {
        const post = await Post.findById(req.params.id)
        
        try {
            let filteredlike = post.likes.filter(likeObj => {
                return likeObj.user.toString() === req.user.id && likeObj.liked === true || likeObj.liked === false
            })
            /* if (filteredlike) {
              console.log(filteredlike[0])
            } */
            
            if (filteredlike[0].liked === true) {
                post.likes.splice(filteredlike[0], 1)
                await post.save()
                return Res(res, 200, post.likes)
            }
    
            if (filteredlike[0].liked === false) {
                filteredlike[0].liked = true
                await post.save()
                return Res(res, 200, post.likes)
            }

            post.likes.unshift({ user: req.user.id, post: post._id, liked: true})
            await post.save()
            return errRes(res, 200, post.likes)
            
        } catch (err) {
            // console.log(err)

            post.likes.unshift({ user: req.user.id, post: post._id, liked: true})
    
            await post.save()
    
            Res(res, 200, post.likes)
        }
        
    } catch (err) {
        // console.log(err)
        errRes(res, 500, 'Server error liking post')
    }
}


exports.unLikePost = async (req, res, next) => {
    
    try {
        const post = await Post.findById(req.params.id)
        
        try {
            let filteredlike = post.unlikes.filter(likeObj => {
                return likeObj.user.toString() === req.user.id && likeObj.unliked === true || likeObj.unliked === false
            })
            // console.log(filteredlike[0])
            
    
            if (filteredlike[0].unliked === true) {
                post.unlikes.splice(filteredlike[0], 1)
                await post.save()
                return Res(res, 200, post.unlikes)
            }
    
            if (filteredlike[0].unliked === false) {
                filteredlike[0].unliked = true
                await post.save()
                return Res(res, 200, post.unlikes)
            }

            post.unlikes.unshift({ user: req.user.id, post: post._id, unliked: true})
            await post.save()
            return Res(res, 200, post.unlikes)
          
        } catch (err) {
            // console.log(err)

            post.unlikes.unshift({ user: req.user.id, post: post._id, unliked: true})

            await post.save()
    
            Res(res, 200, post.unlikes)
        }
        
    } catch (err) {
        // console.log(err)
        errRes(res, 500, 'Server error unliking post')
    }
}



exports.createComment = async (req, res, next) => {

    if (!req.body.description || validator.isEmpty(req.body.description)) return errRes(res, 400, 'description is Required')
    
    
    try {
        const user = await User.findById(req.user.id).select('-password')
        const post = await Post.findById(req.params.id)
        
        let newComment = {
            title: req.body.title,
            description: req.body.description,
            user: req.user.id,
            name: user.name,
            avatar: user.avatar,
        }

        if (req.user.id.toString() === post.user.toString()) {
            return errRes(res, 400, 'The user who created the post cannot comment on their own post')
        }

        post.comments.unshift(newComment)
        await post.save()

        Res(res, 201, post.comments)
        
    } catch (err) {
    //   console.log(err)
      res.status(500).send('Server error creating comment')
    }
}



exports.deleteComment = async (req, res, next) => {

    try {
        const user = await User.findById(req.user.id).select('-password')
        const post = await Post.findById(req.params.id)
        
        let comment = post.comments.find(comment => comment.id === req.params.comment_id)

        if (!comment) {
          return errRes(res, 404, 'Comment not found !')
        }

        if (!(comment.user.toString() === req.user.id.toString())) {
            return errRes(res, 400, 'The user who created the comment can delete the comment')
        }

        post.comments.splice(comment, 1)
        await post.save()

        Res(res, 201, post.comments)
        
    } catch (err) {
    //   console.log(err)
      res.status(500).send('Server error deleting comment')
    }
}