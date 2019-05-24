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

//@type POST
//@route /api/tweet/
//@desc Like by user
//@access PRIVATE

//steps
//1. Find user
//2. Find tweet id
//3. If user has alerady liked?
//4. If not like then like....

router.post('/like/:id', passport.authenticate('jwt', {
        session: false
    }),
    (req, res) => {
        Person.findOne({
                user: req.user.id
            })
            .then(person => {
                Tweet.findById(req.params.id)
                    .then(tweet => {
                        //finding if user alerady liked.
                        if (tweet.likes.filter(
                                likes => likes.user.toString() === req.user.id.toString()
                            ).length > 0) {
                            return res.status(400).json({
                                noupvote: 'user alerady liked'
                            })
                        }

                        tweet.likes.unshift({
                            user: req.user.id
                        });

                        tweet.save()
                            .then(tweet => res.json(
                                tweet
                            )).catch(err => console.log(err));
                    })
                    .catch('Error getting question from Id' + err);
            })
            .catch(err => console.log('Error for finding user' + err))
    });



module.exports = router;