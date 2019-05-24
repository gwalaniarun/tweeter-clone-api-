const express = require('express');
const router = express.Router();
const jsonwt = require('jsonwebtoken')
const passport = require('passport')

//load tweet model
const Tweet = require('../../models/Tweet')

//load Person model
const Person = require('../../models/Person')

//@type GET
//@route /api/tweet/
//@desc getting all tweets
//@access PUBLIC
router.get('/', (req, res) => {
    Tweet.find()
        .sort('-date')
        .then(tweet => res.json(tweet))
        .catch(err => console.log(err))
});

//@type POST
//@route /api/tweet/
//@desc Login as user
//@access PRIVATE
router.post('/',
    passport.authenticate('jwt', {
        session: false
    }),
    (req, res) => {
        const newTweet = new Tweet({
            user: req.user.id,
            title: req.body.title,
            image: req.body.image,
            text: req.body.text,
        });

        newTweet.save()
            .then(tweet => res.json(tweet))
            .catch(err => console.log(err));
    }
);


module.exports = router;