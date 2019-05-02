const mongoose=require('mongoose');

const walletSchema=mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    walletCode: { type: String, unique: true, require: true }
});

module.exports=mongoose.model('Wallet',walletSchema);