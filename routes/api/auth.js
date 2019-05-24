const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jsonwt = require('jsonwebtoken')
const passport = require('passport')
const key = require('../../setup/myurl')

//@type    GET
//@route   /api/auth
//@desc    just for testing auth
//@access  PUBLIC
router.get('/', (req, res) => {
    res.send('Auth api connected.');
});

//importing Person Model
const Person = require('../../models/Person');

//@type POST
//@route /api/auth/register
//@desc Register new user
//@access PUBLIC
router.post('/register', (req, res) => {
    Person.findOne({
            email: req.body.email
        })
        .then(person => {
            if (person) {
                return res.status(400)
                    .json({
                        emailerror: 'Email is alerady registered.'
                    })
            } else {
                const newPerson = new Person({
                    name: req.body.name,
                    email: req.body.email,
                    password: req.body.password
                });

                //Encrypt password using bcrypt
                bcrypt.genSalt(10, (err, salt) => {
                    if (err) console.log('Error for generating salt')
                    bcrypt.hash(newPerson.password, salt, (err, hash) => {
                        //handle error
                        if (err) throw err

                        // Store hash in your password DB.
                        newPerson.password = hash
                        newPerson
                            .save()
                            .then(person => res.json(person))
                            .catch(err => console.log(err))
                    })
                })
            }
        })
        .catch();
});

//@type POST
//@route /api/auth/login
//@desc Login as user
//@access PUBLIC
router.post('/login', (req, res) => {
    const email = req.body.email
    const password = req.body.password

    Person.findOne({
            email: req.body.email
        })
        .then(person => {
                if (!person) {
                    return res
                        .status(400)
                        .json({
                            emailerror: 'User not found in system.'
                        })
                }

                bcrypt
                    .compare(password, person.password)
                    .then(isCorrect => {
                        if (isCorrect) {

                            //use payload and create token for user
                            const payload = {
                                id: person.id,
                                name: person.name,
                                email: person.email
                            }
                            jsonwt.sign(
                                payload,
                                key.secret, {
                                    expiresIn: 3600
                                },
                                (err, token) => {
                                    if (err) throw err

                                    res.json({
                                        success: true,
                                        token: 'Bearer ' + token,
                                        name: person.name
                                    })
                                }
                            )
                        } else {
                            res.status(400).json({
                                passworderror: 'password is not correct'
                            })
                        }

                    })
                    .catch(err => console.log(err))
            }

        )
        .catch(err => console.log('error in getting email registered or not'))
});


module.exports = router;