const mongoose=require('mongoose');

const walletSchema=mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    walletCode: { type: Number}
});

module.exports=mongoose.model('Wallet',walletSchema);