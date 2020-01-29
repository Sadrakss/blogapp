const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require('../models/user')
const user = mongoose.model('users')
const bcrypt = require('bcryptjs')
const passport = require('passport')

router.get('/register', (req, res) => {
    res.render('users/register')
})

router.post('/register', (req, res) => {
    var error = []

    if (!req.body.name || typeof req.body.name == undefined || req.body.name == null) {
        error.push({ text: 'invalid name' })
    }
    if (!req.body.email || typeof req.body.email == undefined || req.body.email == null) {
        error.push({ text: 'invalid email' })
    }
    if (!req.body.password || typeof req.body.password == undefined || req.body.password == null) {
        error.push({ text: 'invalid password' })
    }
    if (req.body.password.length < 4) {
        error.push({ text: 'password too short' })
    }
    if (req.body.password != req.body.password2) {
        error.push({ text: 'passwords do not match' })
    }

    if (error.length > 0) {
        res.render('users/register', { error: error })
    } else {
        user.findOne({ email: req.body.email }).then((users) => {
            if (users) {
                req.flash('error_msg', 'E-mail already registered')
                res.redirect('/users/register')
            } else {
                const newUser = new user({
                    name: req.body.name,
                    email: req.body.email,
                    password: req.body.password
                })

                bcrypt.genSalt(10, (error, salt) => {
                    bcrypt.hash(newUser.password, salt, (error, hash) => {
                        if (error) {
                            req.flash('error_msg', 'there was an error saving the user')
                            res.redirect('/')
                        }

                        newUser.password = hash

                        newUser.save().then(() => {
                            req.flash('success_msg', 'User created successfully')
                            res.redirect('/')
                        }).catch((err) => {
                            req.flash('error_msg', 'there was an error creating the user, try again!')
                            res.redirect('/user/register')
                        })
                    })
                })
            }
        }).catch((err) => {
            req.flash('error_msg', 'there was an  error here')
            res.redirect('/')
        })
    }
})

router.get('/login', (req, res) => {
    res.render('users/login')
})

router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next)
})
module.exports = router