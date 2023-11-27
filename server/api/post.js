import express from 'express';
import { Post } from '../models/index.js'
import { Comment } from '../models/index.js'
import { User } from '../models/index.js'
import { Likes } from '../models/index.js'
import { verifyToken } from '../utils/auth.js';

const router = express.Router();

// this is for the homeroutes to get the ids to pass to the Post components
router.get('/getAllPosts', async (req, res) => {
    try {
        const posts = await Post.findAll({
            order: [['createdAt', 'DESC']],
            attributes: ['id'],
            include: [
                {
                    model: Comment,
                    attributes: ['id'], // Include only the comment id for counting
                },
                {
                    model: Likes,
                    attributes: ['id'], // Include only the comment id for counting
                },
            ],
        });
        if (!posts) {
            return res.status(400).json({ error: 'could not retrieve posts' })
        }
        res.status(200).json(posts)
    } catch (err) {
        console.log(err)
    }
})

// this is for the posts on the homepage to render their posts
router.get('/getSinglePost/:id', async (req, res) => {
    try {
        const posts = await Post.findByPk(req.params.id, {
            include: [
                {
                    model: Comment,
                    attributes: ['id'], // Include only the comment id for counting
                },
                {
                    model: Likes,
                    attributes: ['id'], // Include only the comment id for counting
                },
                {
                    model: User,
                    attributes: ['profilePic']
                }
            ],
        });
        if (!posts) {
            return res.status(400).json({ error: 'could not retrieve posts' })
        }
        res.status(200).json(posts)
    } catch (err) {
        console.log(err)
    }
})


// This is to get a single view of a post
router.get('/getSingleViewPost/:id', async (req, res) => {
    try {
        const post = await Post.findOne({
            where: { id: req.params.id },
            include: [
                {
                    model: Comment,
                    attributes: ['id', 'commentText', 'createdAt'],
                    order: [['createdAt', 'DESC']],
                    include: [
                        {
                            model: User,
                            attributes: ['username', 'profilePic']
                        }
                    ]
                },
                {
                    model: User,
                    attributes: ['profilePic']
                }
            ],
        });
        if (!post) {
            return res.status(400).json({ error: 'could not retrieve post' })
        }
        res.status(200).json(post)
    } catch (err) {
        console.log(err)
    }
})

// get most lieked posts
router.get('/mostLikedPosts', async (req, res) => {
    try {
        const mostLikedPosts = await Post.findAll({
            order: [['likeCount', 'DESC']],
            limit: 5,
            include: [
                {
                    model: User,
                    attributes: ['profilePic']
                },
            ]
        })
        if(!mostLikedPosts) {
            return res.status(400).json({ error: 'count not retrieve most liked posts'})
        }
        res.status(200).json(mostLikedPosts)
    } catch (err) {
        console.log(err)
    }
})

router.get('/mostCommentedPosts', async (req, res) => {
    try {
        const mostLikedPosts = await Post.findAll({
            order: [['commentCount', 'DESC']],
            limit: 5,
            include: [
                {
                    model: User,
                    attributes: ['profilePic']
                }
            ]
        })
        if(!mostLikedPosts) {
            return res.status(400).json({ error: 'count not retrieve most commented posts'})
        }
        res.status(200).json(mostLikedPosts)
    } catch (err) {
        console.log(err)
    }
});

router.get('/getTotalPostNotifications', verifyToken, async(req, res) => {
    try{ 
        const postNotificationCount = await Post.sum('notifications', {
            where: {
                userId: req.user.data.id, 
            }
        });

        if (!postNotificationCount) {
            return res.status(200).json({ total: 0 })
        }
        res.status(200).json({ total: postNotificationCount})

    } catch(err) {
        res.status(500).json({ error: err })
    }
})

export default router;
