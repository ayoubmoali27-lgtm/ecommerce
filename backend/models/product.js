const mongoose = require("mongoose")

const productSchema = new mongoose.Schema({
    name : {
        type : String,
        required: true
    },slug:{
        type : String,
        required: true,
        unique: true
    },description:{
        type : String
    },price : {
        type : Number,
        required: true
    },stock : {
        type : Number,
        default : 0
    },image:{
        type : [String],
        default : []
    },category_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
  },
}, {
  timestamps: true,
});

const Product = mongoose.model("Product", productSchema)
module.exports= Product