var express = require('express');
const bodyparser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');

const app = express()

//bring all routes
const auth = require('./routes/api/auth');
const tweet = require('./routes/api/tweet');

//Middleware for bodyparser
app.use(bodyparser.urlencoded({
    extended: false
}))
app.use(bodyparser.json());

//Monggose configuration
const db = require('./setup/myurl').mongoURL;

//attempt to connect database
mongoose
    .connect(
        db, {
            useNewUrlParser: true
        }
    )
    .then(() => console.log('Mongoose connected succesfully'))
    .catch(err => console.log(err));

//Passport middleware
app.use(passport.initialize())

//config for jwt Strategy
require('./strategies/jsonwtStrategy')(passport)


//port
let port = process.env.PORT || 5500;

//actual routes
app.use('/api/auth', auth);
app.use('/api/tweet', tweet);


//just for testing
app.get('/', (req, res) => {
    res.send('hey there Blog app');
})

app.listen(port, () => console.log(`app is running on ${port}`));