const mongoose=require('mongoose');

const productSchema=mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true},
    price: { type: Number, required: true},
    quantity: { type: Number, default: 0}
});

module.exports=mongoose.model('Product',productSchema);