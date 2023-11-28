const { User } = require('./User');
const { Comment } = require('./Comment');
const { Post } = require('./Post');
const { Likes } = require('./Likes');
const { Friendship } = require('./Friendship');
const { FriendRequest } = require('./FriendRequest')
const { ChatRoom } = require('./ChatRoom');
const { Message } = require('./Message');
const { UserChatJunc } = require('./UserChatJunc')
const { TempResetToken } = require('./TempResetToken');

// friendships
User.belongsToMany(User, {
    as: 'friends',
    foreignKey: 'user_id',
    through: Friendship,
    onDelete: 'CASCADE'
});

User.belongsToMany(User, {
    as: 'friendships',
    foreignKey: 'friend_id',
    through: Friendship,
    onDelete: 'CASCADE'
});

// Friend Requests
User.belongsToMany(User, {
    as: 'Requestees',
    through: FriendRequest,
    foreignKey: 'requesterId',
    onDelete: 'CASCADE'
})
User.belongsToMany(User, {
    as: 'Requesters',
    through: FriendRequest,
    foreignKey: 'requesteeId',
    onDelete: 'CASCADE'
})


// User Posts
User.hasMany(Post, {
    foreignKey: 'userId',
    onDelete: 'CASCADE'
})

Post.belongsTo(User, {
    foreignKey: 'userId'
})

// User Comments
User.hasMany(Comment, {
    foreignKey: 'userId',
    onDelete: 'CASCADE'
})

Comment.belongsTo(User, {
    foreignKey: 'userId'
})

// User Likes
User.hasMany(Likes, {
    foreignKey: 'userId',
    onDelete: 'CASCADE'
})

Likes.belongsTo(User, {
    foreignKey: 'userId'
})

// Post Comments
Post.hasMany(Comment, {
    foreignKey: 'postId',
    onDelete: 'CASCADE'
})

Comment.hasOne(Post, {
    foreignKey: 'postId'
})

// Post Likes
Post.hasMany(Likes, {
    foreignKey: 'postId',
    onDelete: 'CASCADE'
})

Likes.hasOne(Post, {
    foreignKey: 'postId'
})

ChatRoom.hasMany(Message, {
    foreignKey: 'chatroomId',
    onDelete: 'CASCADE'
})
 

Message.belongsTo(ChatRoom, {
    foreignKey: 'chatroomId'
})

User.belongsToMany(ChatRoom, {
    as: 'ChatRoom',
    through: UserChatJunc,
    foreignKey: 'userId',
})
ChatRoom.belongsToMany(User, {
    as: 'User',
    through: UserChatJunc,
    foreignKey: 'chatRoomId',
})


// Reset token
User.hasMany(TempResetToken, {
    foreignKey: 'userId',
    onDelete: 'CASCADE'
})

TempResetToken.belongsTo(User, {
    foreignKey: 'userId'
})


module.exports =
{
    User,
    Post,
    Comment,
    Likes,
    Friendship,
    FriendRequest,
    ChatRoom,
    Message,
    UserChatJunc,
    TempResetToken
}