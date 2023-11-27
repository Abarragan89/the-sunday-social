import User from './User.js';
import Comment from './Comment.js';
import Post from './Post.js';
import Likes from './Likes.js';
import Friendship from './Friendship.js';
import FriendRequest from './FriendRequest.js';
import ChatRoom  from './ChatRoom.js';
import Message from './Message.js';
import UserChatJunc from './UserChatJunc.js';
import TempResetToken from './TempResetToken.js';

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


export
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