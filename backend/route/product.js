const { createProduct, getAllProducts, getOneProduct, deleteProduct, updateproduct } = require("../controllers/productController");
const express=require("express")
const router = express.Router()

router.post("/",createProduct);
router.get("/",getAllProducts);
router.get("/:slug",getOneProduct)
router.put("/:id", updateproduct);       
router.delete("/:id", deleteProduct);    

module.exports = router;