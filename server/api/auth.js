const router = require('express').Router();
const { User } = require('../models');
const { signToken } = require('../utils/auth');


router.post('/login', async (req, res) => {
    try {
        const data = req.body
        const user = await User.findOne({ 
            where: {
                email: data.email
            }
        });
        if (!user) {
            res.status(400).json({ error: 'Wrong Credentials'})
        } else if (!user.checkPassword(data.password)) {
            res.status(400).json({ error: 'Wrong Credentials'})
        } else {
            signToken(user, res)
            res.status(200).json(user)
        }
    } catch(e) {
        res.status(500).json({error: e})
    }
})

router.post('/logout', async (req, res) => {
    res.cookie('token', '', {
        httpOnly: true,
        expires: new Date(0)
    })
    res.status(200).json({ message: 'Logged Out' })
})

router.post('/signup', async (req, res) => {
    try {
        const data = req.body;
        // check if username or email is already taken
        const isEmailTaken = await User.findOne({ where: { email: data.email}})
        const isUsernameTaken = await User.findOne({ where: { username: data.username}})

        if (isEmailTaken || isUsernameTaken) {
            return res.status(400).json({ error: 'Email or Username taken' })
        }

        const newUser = await User.create({
            username: data.username,
            email: data.email,
            password: data.password
        })
        if (!newUser) {
            return res.status(400).json({ error: 'invalid inputs' })
        } else {
            // create JWT and save it to HTTP cookie
            signToken(newUser, res)
            res.status(200).json(res)
        }
    } catch (err) {
        res.status(500).json({ err })
    }
})


module.exports = router;