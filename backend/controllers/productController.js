const Product = require("../models/product");

// product

async function createProduct(req,res) {
    try{
        const {name,slug,description,price,stock,image,category_id} = req.body
            if (!name || !slug || !price ===undefined){
                return res.status(400).json({ error: "Name, slug, and price are required" });
            }
        const product = await Product.create({
            name,slug,description,price,stock,image,category_id
        })    
        res.status(201).json({product})
        
    }catch(error){
        console.log(error)
        return res.status(400).json({error : "Something went wrong"})
    }
    
}

async function getAllProducts(req,res) {
    try{
        const products = await Product.find().populate("category_id");
        res.json({ products });
    }catch(error){
        console.log(error)
        return res.status(400).json({error : "Something went wrong"})
    }
}

async function getOneProduct(req,res) {
    try{
        const {slug} = req.params
        const product = await Product.findOne({slug}).populate("category_id")
        if (!product){
            return res.status(400).json({error : "Product doesn't exist"})
        }
        res.json({product})
    }catch(error){
        return res.status(400).json({error :"Something went wrong"})
    }
}


async function deleteProduct(req,res) {
    try{
        const {id} =req.params
        const product = await Product.findByIdAndDelete(id)
        if (!product){
            return res.status(400).json({error : "User not found"})
        }
        res.json({message: "Product deleted",product})
    }catch(error){
        return res.status(400).json({error :"Something went wrong"})
    }
}


async function updateproduct(req,res) {
    try{
        const {id} = req.params
        const product = await Product.findByIdAndUpdate(id,req.body,{ new: true, runValidators: true })
        if (!product) {
            return res.status(400).json({error : "Product not found"})
        }
        res.json({product})
    }catch(error){
        console.log(error)
        return res.status(400).json({error :"Something went wrong"})
    }
    
}
module.exports = { createProduct, getAllProducts, getOneProduct, deleteProduct, updateproduct}