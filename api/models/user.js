const mongoose=require('mongoose');

const userSchema=mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {type: String, required: true},
    email: {
        type: String,  
        unique: true,
        required: true ,
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },
    password: {type: String, required: true},
    phoneNumber: {type: String, required: true},
    balance: {type: Number, default: 0}
});

module.exports=mongoose.model('User',userSchema);