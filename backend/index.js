const express=require("express")
const router = express.Router()
const {connectDB, register,login, me, requireAuth, requireAdmin, changeRole, getAllUsers, updateMe, deleteUser, changePassword}= require("./data.js")
const { connectMongo, createProduct, getAllProducts, getOneProduct } = require("./config/mongo");
const cors = require("cors");

const app = express()
app.use(cors());
app.use(express.json());

app.get("/1212", (req, res) => {
    res.send("API is running...");
});

connectDB()
connectMongo()
router.post("/login",login)
router.post('/register',register)
router.get('/me',requireAuth,me)
router.put('/me',requireAuth,updateMe)
router.get('/users',requireAuth,requireAdmin,getAllUsers)
router.put("/users/:id/role",requireAuth, requireAdmin, changeRole);
router.delete("/users/:id",requireAuth,requireAdmin,deleteUser)
router.put("/me/password", requireAuth, changePassword);
app.use("/api/auth", router); 
app.use("/api/products", require("./route/product"));
app.use("/api/categories", require("./route/category"))
app.use("/api/reviews", require("./route/review"));
app.use("/api/cart", require("./route/cart"));
app.use("/api/orders", require("./route/order"));
app.listen(3000, ()=>{
    console.log("rani nsmae")
})