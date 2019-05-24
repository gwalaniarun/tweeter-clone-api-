const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TweetSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'myPerson'
    },
    title: {
        type: String,
        required: true
    },
    image: {
        type: String,
    },
    text: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    likes: [{
        user: {
            type: Schema.Types.ObjectId,
            ref: 'myperson'
        }
    }]
});

module.exports = Tweet = mongoose.model(
    'myTweet', TweetSchema
)