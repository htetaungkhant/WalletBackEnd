const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

router.get('/:userEmail',(req,res,next)=>{
    const userEmail=req.params.userEmail;
    User.find({ email: userEmail })
   .select('name email phoneNumber balance _id')
   .exec()
   .then(doc=>{
       console.log("From database",doc);
       if(doc){
        res.status(200).json({
            user: doc
        });
       }
       else{
           res.status(404).json({message: 'No Valid entry found for provided ID'});
       }
   })
   .catch(err =>{
       console.log(err);
       res.status(500).json({error:err});
   });
});


router.post('/checkMailExist', (req, res, next) => {
    User.find({ email: req.body.email })
        .exec()
        .then(user => {
            if (user.length >= 1) {
                return res.status(200).json({
                    message: 'Email already exists'
                });
            }
            else {
                return res.status(401).json({
                message: 'err'
            });
            }
        })
});

router.post('/signup', (req, res, next) => {
    User.find({ email: req.body.email })
        .exec()
        .then(user => {
            if (user.length >= 1) {
                return res.status(409).json({
                    message: 'Mail exists'
                });
            }
            else {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        return res.status(500).json({
                            error: err
                        });
                    }
                    else {
                        const user = new User({
                            _id: new mongoose.Types.ObjectId(),
                            name: req.body.name,
                            email: req.body.email,
                            password: hash,
                            phoneNumber: req.body.phoneNumber
                        });
                        user
                            .save()
                            .then(result => {
                                console.log(result);
                                res.status(201).json({
                                    message: 'User created'
                                });
                            })
                            .catch(err => {
                                console.log(err);
                                res.status(500).json({
                                    error: err
                                });
                            });
                    }
                });
            }
        })
});

router.post('/login', (req, res, next) => {
    //console.log(req.body.email)
    User.find({ email: req.body.email })
        .exec()
        .then(user => {
            if (user.length < 1) {
                //console.log('Auth failed')
                return res.status(401).json({
                    message: 'Auth failed'
                });
            }
            bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                if (err) {
                    //console.log('Auth failed 1')
                    return res.status(401).json({
                        message: 'Auth failed'
                    });
                }
                if (result) {
                    const token = jwt.sign(
                        {
                            email: user[0].email,
                            userId: user[0]._id
                        },
                        "secret",
                        {
                            expiresIn: "1h"
                        }
                    );
                    //console.log('Auth Success')
                    return res.status(200).json({
                        message: 'Auth successful',
                        token: token
                    });
                }
                //console.log('Auth fail 2')
                return res.status(401).json({
                    message: 'Auth failed'
                });
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
})

router.delete('/:userId', (req, res, next) => {
    User.remove({ _id: req.params.userId })
        .exec()
        .then(result => {
            res.status(200).json({
                message: "User deleted"
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
})

module.exports = router;