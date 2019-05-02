const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const Wallet = require('../models/wallet');
const User = require('../models/user');

router.post('/addingWalletCodes', (req, res, next) => {

    Wallet.find()
    .select("walletCode")
    .exec()
    .then(docs=>{
        var flag;
        for(var i=0;i<docs.length;i++){
            flag=bcrypt.compareSync(req.body.walletCode,docs[i].walletCode);
            //console.log(flag);
            if(flag)
                break;
        }
        //console.log(flag);
        if(flag){
            return res.status(409).json({
                message: 'Wallet Code already exists'
            });
        }
        else{
            bcrypt.hash(req.body.walletCode, 10, (err, hash) => {
                if (err) {
                    return res.status(500).json({
                        error: "err"
                    });
                }
                else {
                    const wallet = new Wallet({
                        _id: new mongoose.Types.ObjectId(),
                        walletCode: hash
                    });
                    wallet
                        .save()
                        .then(result => {
                            console.log(result);
                            res.status(201).json({
                                message: 'Added Wallet Code'
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

router.post('/redeemWallet', (req, res, next) => {
    Wallet.find()
    .select("walletCode")
    .exec()
    .then(docs=>{
        var flag;
        for(var i=0;i<docs.length;i++){
            flag=bcrypt.compareSync(req.body.walletCode,docs[i].walletCode);
            //console.log(flag);
            if(flag){
                User.updateOne({email: req.body.email},{$inc: {balance: 10000} })
                .exec()
                .then(result =>{
                    return res.status(200).json({
                        message: 'Redeem success'
                    });
                })
                .catch(err=>{
                    console.log(err);
                })
                
                Wallet.deleteOne({ walletCode: docs[i].walletCode })
                .exec()
                .then(result=>{
                    console.log('walletCode deleted');
                })
                .catch(err=>{
                    console.log(err);
                })

                break;
            }
        }
        //console.log(flag);
        if(!flag){
            return res.status(200).json({
                message: 'Invalid Redeem Code'
            });
        }
    })
});
module.exports = router;