const router = require('express').Router();
const { verifyToken } = require('../utils/auth');
const { resetPassword } = require('../utils/mailer')
const { Op } = require('sequelize');
const { v4: uuidv4 } = require('uuid');

const {
    Post,
    Comment,
    Likes,
    User,
    Friendship,
    FriendRequest,
    ChatRoom,
    UserChatJunc,
    Message,
    TempResetToken
} = require('../models');

// this route is just to check if user is logged in. Used in Navigation
// and other components. no database query
// the 'verifyToken' sets the req.user to have user information
router.get('/', verifyToken, async (req, res) => {
    try {
        const user = await User.findByPk(req.user.data.id, {
            attributes: ['profilePic', 'username', 'id']
        });

        if (!user) {
            res.status(400).json({ error: 'you must log in' })
        }

        res.status(200).json(user)
    } catch (err) {
        res.status(500).json({ error: 'user not found' })
    }
})

// this is for their profile
router.get('/getUserInfo', verifyToken, async (req, res) => {
    try {
        const user = await User.findByPk(req.user.data.id, {
            include: [
                {
                    model: Post,
                    order: [['createdAt', 'DESC']]
                },
            ]
        });
        if (!user) {
            return res.status(400).json({ error: 'no user found' })
        }
        res.status(200).json(user)
    } catch (err) {
        res.status(500).json({ error: 'friend not found' })

    }
})



router.post('/addPost', verifyToken, async (req, res) => {
    try {
        const data = req.body;
        const newPost = await Post.create({
            postText: data.postText.trim(),
            userId: req.user.data.id,
            author: req.user.data.username
        })
        if (!newPost) {
            return res.status(400).json({ error: 'invalid input' })
        }
        res.status(200).json(newPost)
    } catch (err) {
        res.status(500).json({ error: 'post not added' })

    }
})

router.post('/addComment', verifyToken, async (req, res) => {
    try {
        const post = await Post.findByPk(req.body.postId);
        if (!post) {
            return res.status(400).json({ error: 'post is no long available' })
        }
        const newComment = await Comment.create({
            commentText: req.body.commentText,
            userId: req.user.data.id,
            postId: post.id
        })

        if (!newComment) {
            return res.status(400).json({ error: 'comment not added' })
        }
        // increase comment count
        post.commentCount += 1;
        await post.save();
        res.status(200).json(newComment)
    } catch (err) {
        res.status(500).json({ error: 'comment not added' })
    }
})

router.post('/addLike', verifyToken, async (req, res) => {
    try {
        const post = await Post.findByPk(req.body.postId, {
            include: [
                {
                    model: Likes,
                    attributes: ['id'],
                }
            ]
        });
        if (!post) {
            return res.status(400).json({ error: 'post is no long available' })
        }
        const hasUserAlreadyLiked = await Likes.findOne({
            where: {
                postId: req.body.postId,
                userId: req.user.data.id
            }
        })

        if (hasUserAlreadyLiked) {
            return res.status(400).json({ error: 'You can only like a post once' })
        }

        const newLike = await Likes.create({
            userId: req.user.data.id,
            postId: req.body.postId
        })

        if (!newLike) {
            return res.status(400).json({ error: 'comment not added' })
        }
        // increase like count
        post.likeCount += 1;
        await post.save()

        res.status(200).json(newLike)
    } catch (err) {
        res.status(500).json({ error: 'comment not added' })
    }
})

router.put('/updatePost', verifyToken, async (req, res) => {
    try {
        const newText = req.body.updatedPostText;
        const postId = req.body.postId;

        const updatedPost = await Post.findByPk(postId)

        if (!updatedPost) {
            res.status(400).json({ error: 'Post not available to update' })
        }
        updatedPost.postText = newText;
        await updatedPost.save();
        res.status(200).json(updatedPost);
    } catch (err) {
        res.status(500).json({ error: 'error updating post' })

    }
})

router.delete('/deletePost', verifyToken, async (req, res) => {
    try {
        const deletedPost = await Post.findByPk(req.body.postId);
        if (!deletedPost) {
            console.log('Post was not able to delete')
        }
        await deletedPost.destroy();
        res.status(200).json(deletedPost)
    } catch (err) {
        res.status(500).json({ error: 'post not deleted' })
    }
});

router.put('/addNotificationToPost', verifyToken, async(req, res) => {
    try {
        const post = await Post.findByPk(req.body.postId);

        if (!post) {
            return res.status(400).json({ error: 'did not add notification to post'})
        }
        post.notifications += 1;
        await post.save();
        res.status(200).json(post)
    } catch(err) {
        res.status(500).json({error: err})
    }
})

router.put('/removeNotificationFromPost', verifyToken, async(req, res) => {
    try {
        const post = await Post.findByPk(req.body.postId);

        if (!post) {
            return res.status(400).json({ error: 'did not add notification to post'})
        }
        post.notifications = 0;
        await post.save();
        res.status(200).json(post)

    } catch(err) {
        res.status(500).json({error: err})
    }
})

router.put('/updateUserInfo', verifyToken, async (req, res) => {
    try {

        const data = req.body;
        const updateUser = await User.findByPk(req.user.data.id);
        if (!updateUser) {
            return res.status(400).json({ error: 'no user found' })
        }
        updateUser.relationshipStatus = data.relationshipStatus;
        updateUser.school = data.school;
        updateUser.work = data.work;
        updateUser.currentlyLearning = data.currentlyLearning;
        updateUser.headline = data.headline;
        updateUser.petPeeve = data.petPeeve;
        updateUser.website = data.website;
        updateUser.hobbies = data.hobbies;

        await updateUser.save();

        res.status(200).json(updateUser)
    } catch (err) {
        res.status(500).json({ error: 'user info not updated' })
    }
})

router.put('/updateProfilePic', verifyToken, async (req, res) => {
    try {
        const updatedUser = await User.findByPk(req.user.data.id);

        if (!updatedUser) {
            return res.status(400).json({ error: 'image not loaded' })
        }
        updatedUser.profilePic = req.body.profilePicURL
        await updatedUser.save();
        res.status(200).json(updatedUser)

    } catch (err) {
        res.status(500).json({ error: 'picture not uploaded' })
    }
})

router.get('/searchNewFriends/:searchBy', verifyToken, async (req, res) => {
    try {
        // first find all friends of current user
        const userFriends = await User.findByPk(req.user.data.id, {
            attributes: ['id'],
            include: [
                {
                    model: User,
                    as: 'friends',
                    through: Friendship,
                    attributes: ['id'],
                },
                {
                    model: User,
                    as: 'Requestees',
                    through: FriendRequest,
                    attributes: ['id'],
                }
            ],
            plain: true
        })
        // retrieve all the ids from current friends to filter search 
        // to only show users that have not been befriended
        const friendIds = userFriends.dataValues.friends.map((friend) => friend.id);
        const friendRequestedIds = userFriends.dataValues.Requestees.map((friend) => friend.id);
        const friendsNotToShowOnFinder = friendIds.concat(friendRequestedIds)


        const foundUsers = await User.findAll({
            attributes: ['id', 'profilePic', 'username'],
            where: {
                [Op.and]: [
                    // this filters through everything
                    {
                        [Op.or]: {
                            username: { [Op.like]: `%${req.params.searchBy}%` },
                            email: { [Op.like]: `%${req.params.searchBy}%` },
                            relationshipStatus: { [Op.like]: `%${req.params.searchBy}%` },
                            school: { [Op.like]: `%${req.params.searchBy}%` },
                            work: { [Op.like]: `%${req.params.searchBy}%` },
                            currentlyLearning: { [Op.like]: `%${req.params.searchBy}%` },
                            petPeeve: { [Op.like]: `%${req.params.searchBy}%` },
                            hobbies: { [Op.like]: `%${req.params.searchBy}%` }
                        },
                    },
                    // this does not allow the self-user to show up
                    {
                        id: { [Op.not]: req.user.data.id }
                    },
                    // don't show users that are already friends with this user
                    {
                        id: { [Op.notIn]: [...friendsNotToShowOnFinder] }
                    }
                ]
            },
        })

        res.status(200).json(foundUsers)
    } catch (err) {
        res.status(500).json({ error: 'friend not found' })
    }
})


router.post('/addFriend', verifyToken, async (req, res) => {
    try {
        const newFriendShip = await Friendship.create({
            user_id: req.user.data.id,
            friend_id: req.body.friendId
        })
        // i have to make the association the other way as well
        const newFriendShipTwo = await Friendship.create({
            user_id: req.body.friendId,
            friend_id: req.user.data.id
        })
        if (!newFriendShip || !newFriendShipTwo) {
            return res.status(400).json({ error: 'friendship not made' })
        }

        await FriendRequest.destroy({ where: { id: req.body.requestId } })

        res.status(200).json(newFriendShip)
    } catch (err) {
        res.status(500).json({ error: 'internal server error', err })
    }
});

router.delete('/deleteFriend', verifyToken, async (req, res) => {
    try {
        const deletedFriendshipOne = await Friendship.destroy({
            where: { user_id: req.body.userId, friend_id: req.body.friendId }
        })

        const deletedFriendshipTwo = await Friendship.destroy({
            where: { user_id: req.body.friendId, friend_id: req.body.userId }
        })

        if (!deletedFriendshipOne || !deletedFriendshipTwo) {
            return res.status(400).json({ error: 'friendship not deleted' })
        }

        res.status(200).json({ message: 'friendship deleted' })

    } catch (err) {
        res.status(500).json(err)
    }
})

router.post('/sendFriendRequest', verifyToken, async (req, res) => {
    try {
        const newFriendShip = await FriendRequest.create({
            requesterId: req.user.data.id,
            requesteeId: req.body.friendId
        })
        if (!newFriendShip) {
            return res.status(400).json({ error: 'friendship not made' })
        }
        res.status(200).json(newFriendShip)
    } catch (err) {
        res.status(500).json({ error: 'internal server error', err })
    }
})

router.delete('/denyFriendRequest', verifyToken, async (req, res) => {
    try {
        const denyFriend = await FriendRequest.destroy({ where: { id: req.body.requestId } })
        if (!denyFriend) {
            res.status(400).json({ error: 'could not deny' })
        }
        res.status(200).json(denyFriend)
    } catch (err) {
        res.status(500).json({ error: 'internal server error', err })
    }
})

router.get('/getUserFriends/:searchBy?', verifyToken, async (req, res) => {
    try {
        // search by optional parameter if it's there, Else:
        if (req.params.searchBy) {
            const user = await User.findByPk(req.user.data.id, {
                attributes: ['id', 'username'],
                include: [
                    {
                        model: User,
                        as: 'friends',
                        through: Friendship,
                        attributes: ['id', 'username', 'profilePic'],
                        where: {
                            [Op.or]: {
                                username: { [Op.like]: `%${req.params.searchBy}%` },
                                email: { [Op.like]: `%${req.params.searchBy}%` },
                                relationshipStatus: { [Op.like]: `%${req.params.searchBy}%` },
                                school: { [Op.like]: `%${req.params.searchBy}%` },
                                work: { [Op.like]: `%${req.params.searchBy}%` },
                                currentlyLearning: { [Op.like]: `%${req.params.searchBy}%` },
                                petPeeve: { [Op.like]: `%${req.params.searchBy}%` },
                                hobbies: { [Op.like]: `%${req.params.searchBy}%` }
                            }
                        },
                    },
                ]
            });
            if (!user) {
                return res.status(400).json({ error: 'no user found' })
            }
            res.status(200).json(user)
            // Else get all friends
        } else {
            const user = await User.findByPk(req.user.data.id, {
                attributes: ['id', 'username'],
                include: [
                    {
                        model: User,
                        as: 'friends',
                        through: Friendship,
                        attributes: ['id', 'username', 'profilePic'],
                    }
                ]
            });
            if (!user) {
                return res.status(400).json({ error: 'no user found' })
            }
            res.status(200).json(user)

        }
    } catch (err) {
        res.status(500).json({ error: 'no user with that Id found' })

    }
})

router.get('/getIncomingFriendRequests', verifyToken, async (req, res) => {
    try {
        const incomingRequests = await User.findByPk(req.user.data.id, {
            attributes: ['id'],
            include: [
                {
                    model: User,
                    as: 'Requesters',
                    though: FriendRequest,
                    attributes: ['id', 'username', 'profilePic', 'createdAt']
                }
            ]
        })

        if (!incomingRequests) {
            return res.status(400).json({ error: 'could not get incoming friend requests' })
        }

        res.status(200).json(incomingRequests)

    } catch (err) {
        res.status(500).json({ error: 'could not get requests' })
    }
});
router.get('/getOutgoingFriendRequests', verifyToken, async (req, res) => {
    try {
        const outgoingRequests = await User.findByPk(req.user.data.id, {
            attributes: ['id'],
            include: [
                {
                    model: User,
                    as: 'Requestees',
                    through: FriendRequest,
                    attributes: ['id', 'username', 'profilePic', 'createdAt']
                }
            ]
        })

        if (!outgoingRequests) {
            return res.status(400).json({ error: 'could not get outgoing friend requests' })
        }
        res.status(200).json(outgoingRequests)

    } catch (err) {
        res.status(500).json({ error: 'request not made' })
    }
});

// this is to get friends profile
router.get('/getFriendInfo/:friendId', verifyToken, async (req, res) => {
    try {
        const user = await User.findByPk(req.params.friendId, {
            include: [
                {
                    model: Post,
                    order: [['createdAt', 'DESC']]
                },
            ]
        });
        if (!user) {
            return res.status(400).json({ error: 'no user found' })
        }
        res.status(200).json(user)
    } catch (err) {
        res.status(500).json({ error: 'friend not found' })

    }
})


// Create a chatroom
router.post('/createChatRoom', verifyToken, async (req, res) => {
    try {
        const isGroupChat = req.body.userIdsForChatRoom.length > 1 ? true : false

        const allUsersIds = [...req.body.userIdsForChatRoom, req.user.data.id]

        const allUsers = await User.findAll({
            where: { id: { [Op.in]: allUsersIds } },
            attributes: ['username'],
            raw: true
        })

        const userNamesAsString = allUsers.map(username => username.username).join(', ')

        // Create new chat room
        const newChatRoom = await ChatRoom.create({
            chatRoomName: userNamesAsString,
            isGroupChat: isGroupChat
        });

        if (!newChatRoom) {
            return res.status(400).json({ error: 'chatroom not created' })
        }

        // get all the user ids that will be in here
        const userIdArray = [...req.body.userIdsForChatRoom, req.user.data.id]
        // loop through each userID and create a new row in the User Junc table
        userIdArray.forEach(async (userId) => {
            const newJunc = await UserChatJunc.create({
                chatRoomId: newChatRoom.id,
                userId: userId,
                isGroupChat: isGroupChat
            })

            if (!newJunc) {
                return res.status(400).json({ error: 'chatroom not created' })
            }
        })

        res.status(200).json(newChatRoom)

    } catch (err) {
        res.status(500).json(`error creating chat room `, err)
    }
})

// this route checks to see if two users already have a chatroom going
router.get('/doesChatRoomExist/:friendId', verifyToken, async (req, res) => {
    try {
        // get all the Junction tables that belong to the user
        // and save all the chatroomIds
        const chatRoomsCreatedByUser = await UserChatJunc.findAll({
            where: { userId: req.user.data.id },
        });

        const chatroomIds = chatRoomsCreatedByUser.map((chatroom) => chatroom.chatRoomId)

        // try to find userJunct with friend ID and these chatroomIds
        const isThereChat = await UserChatJunc.findAll({
            where: {
                userId: req.params.friendId,
                chatRoomId: { [Op.in]: chatroomIds },
                isGroupChat: false
            },
        });

        // if there is no chat, creat Chat
        if (isThereChat.length === 0) {
            // return false if there is no match
            return res.status(200).json(false)
        } else {
            // return the chatroom id if it exists
            res.status(200).json(isThereChat[0].chatRoomId)
        }
    } catch (err) {
        res.status(500).json(err)
    }
})

router.get('/getAllChatrooms/:userId', verifyToken, async (req, res) => {
    try {
        const chatRooms = await User.findByPk(req.params.userId, {
            attributes: ['id', 'username'],
            include: [
                {
                    model: ChatRoom,
                    as: 'ChatRoom',
                    attributes: ['id', 'chatRoomName', 'updatedAt', 'isGroupChat'],
                    through: {
                        attributes: ['notifications']
                    },
                    include: [
                        {
                            model: User,
                            as: 'User',
                            through: {
                                attributes: []
                            },
                            attributes: ['id', 'username', 'profilePic']
                        }
                    ]
                },
            ]
        })
        res.status(200).json(chatRooms)
    } catch (err) {
        res.status(500).json(err)
    }
})

router.get('/getChatMessages/:chatId', verifyToken, async (req, res) => {
    try {
        const allMessages = await Message.findAll({ where: { chatroomId: req.params.chatId } });

        res.status(200).json(allMessages)
    } catch (err) {
        console.log(err)
    }
})

router.post('/createNewMessage', verifyToken, async (req, res) => {
    try {
        const newMessage = await Message.create({
            messageText: req.body.messageText,
            sender: req.body.sender,
            chatroomId: req.body.chatroomId
        })
        // update chatroom so it filter to top of list
        const chatroom = await ChatRoom.findByPk(req.body.chatroomId);

        if (chatroom) {
            chatroom.updateBoolean = false
            await chatroom.save();
        }

        res.status(200).json(newMessage)
    } catch (err) {
        res.status(500).json(err)
    }
})

// add the chatroom Notification for only one user
// notification property will be on the UserChatJunc table
router.put('/addNotification', verifyToken, async (req, res) => {
    try {
        const UserChatJuncRow = await UserChatJunc.findAll({
            where: {
                userId: {
                    [Op.not]: req.body.userId
                },
                chatRoomId: req.body.chatId
            }
        })

        if (!UserChatJuncRow) {
            return res.status(400).json({ error: 'could not add notification' })
        }
        UserChatJuncRow.forEach(async (row) => {
            row.notifications += 1;
            await row.save();
        })
        res.status(200).json(UserChatJuncRow)
    } catch (err) {
        res.status(500).json(err)
    }
})

// this will run when a user opens a chat. We can get the chatID and 
// use it with the logged in user to remove all notifications everytime 
// they view that channel
router.put('/removeAllNotificationsFromUserChat', verifyToken, async (req, res) => {
    try {
        const UserChatJuncRow = await UserChatJunc.findOne({
            where: { userId: req.body.userId, chatRoomId: req.body.chatId }
        })

        if (!UserChatJuncRow) {
            return res.status(400).json({ error: 'could not add notification' })
        }

        UserChatJuncRow.notifications = 0;
        await UserChatJuncRow.save();
        res.status(200).json(UserChatJuncRow)
    } catch (err) {
        console.log(err)
    }
})

router.get('/getTotalMessageNotifications', verifyToken, async(req, res) => {
    try{ 
        const UserChatRows = await UserChatJunc.sum('notifications', {
            where: {
                userId: req.user.data.id, 
            }
        });

        if (!UserChatRows) {
            return res.status(200).json({ total: 0 })
        }
        res.status(200).json({ total: UserChatRows})

    } catch(err) {
        res.status(500).json({ error: err })
    }
});

router.post('/resetPasswordEmail', async(req, res) => {
    try {   
        const findUser = await User.findOne({
            attributes: ['username', 'email', 'id'],
            where: {
                email: req.body.email
            }
        })

        if (!findUser) {
            return res.status(400).json({ error: 'no user found'})
        }
        const tempToken = await TempResetToken.create({
            userId: findUser.id,
            tokenId: uuidv4()
        })
        resetPassword(findUser, tempToken);
        res.status(200).json(findUser);

    }catch(err) {
        res.status(500).json({error: err})
    }
})

router.put('/resetPassword', async(req, res) => {
    try {   
        const findUser = await User.findByPk(req.body.userData.id)

        if (!findUser) {
            return res.status(400).json({ error: 'no user found'})
        }

        findUser.password = req.body.password;
        await findUser.save();

        res.status(200).json(findUser);
    }catch(err) {
        res.status(500).json({err})
    }
})

router.get('/verifyUserByToken/:tokenId', async(req, res) => {
    try {
        const userByToken = await TempResetToken.findOne({
            where: {
                tokenId: req.params.tokenId
            },
            include: [
                {
                    model: User,
                    attributes: ['id', 'email']
                }
            ]
        })
        if (!userByToken) {
            res.status(400).json({error: 'no user found'})
        }
        res.status(200).json(userByToken.User);

    } catch(err) {
        res.status(500).json(err)
    }
});

module.exports = router;