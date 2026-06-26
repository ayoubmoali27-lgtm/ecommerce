const sql = require("mssql");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Cart = require("./models/cart");
const Product = require("./models/product");
const config = {
  user: "sa",
  password: "Admin123?",
  server: "localhost",
  database: "ecommerce",
  options: {
    trustServerCertificate: true,
    encrypt: true,
  },
};
let pool;

const connectDB = async () => {
  try {
    pool = await sql.connect(config);
    console.log("sql connected");
  } catch (err) {
    console.log(err);
  }
};

// POST /api/auth/register
async function register(req, res) {
  try {
    const { email, password, name } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // is the email taken?
    const existing = await pool
      .request()
      .input("email", sql.NVarChar, email)
      .query("SELECT id FROM users WHERE email = @email");

    if (existing.recordset.length > 0) {
      return res.status(409).json({ error: "Email already registered" });
    }

    // hash password
    const hashpassword = await bcrypt.hash(password, 10);

    const result = await pool
      .request()
      .input("email", sql.NVarChar, email)
      .input("password", sql.NVarChar, hashpassword)
      .input("name", sql.NVarChar, name || null)
      .input("role", sql.NVarChar, "customer").query(`
        INSERT INTO users (email, password, name, role)
        OUTPUT INSERTED.id, INSERTED.email, INSERTED.role
        VALUES (@email, @password, @name, @role)
      `);

    const user = result.recordset[0];
    res.status(201).json({ user });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "something went wrong" });
  }
}

// POST /api/auth/login
async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const result = await pool
      .request()
      .input("email", sql.NVarChar, email)
      .query(
        `SELECT id,email,password,role,name FROM users WHERE email=@email`,
      );
    const user = result.recordset[0];
    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ error: "Pasword invalid" });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role, name: user.name },
      "my_temporary_secret_123",
      { expiresIn: "1d" },
    );
    res.status(200).json({
      token,
      user: {
        id: user.id,
        role: user.role,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "something went wrong" });
  }
}

//authenthication

function requireAuth(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No token provided" });
  }
  const token = header.split(" ")[1];
  try {
    const payload = jwt.verify(token, "my_temporary_secret_123");
    req.user = payload;
    next();
  } catch (error) {
    return res.status(401).json({ error: "invalid or expired token" });
  }
}

async function me(req, res) {
  try {
    const result = await pool
      .request()
      .input("id", sql.UniqueIdentifier, req.user.id)
      .query(`SELECT id, email, role, name FROM users WHERE id=@id`);
    const user = result.recordset[0];

    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }
    res.json({ user });
  } catch (error) {
    return res.status(401).json({ error: "something went wrong" });
  }
}

function requireAdmin(req, res, next) {
  if (req.user.role !== "admin") {
    res.status(403).json({ error: "Admin acces required" });
  }
  next();
}

async function changeRole(req, res) {
  try {
    const { id } = req.params;
    const { role } = req.body;
    if (role !== "customer" && role !== "admin") {
      return res.status(400).json({ error: "Role must be costumer or admin" });
    }
    const result = await pool
      .request()
      .input("id", sql.UniqueIdentifier, id)
      .input("role", sql.NVarChar, role).query(`
        UPDATE users SET role=@role
        OUTPUT INSERTED.id, INSERTED.email , INSERTED.role
        WHERE id=@id
      `);

    const user = result.recordset[0];
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }
    res.json({ user });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Something went wrong" });
  }
}

async function getAllUsers(req, res) {
  try {
    const result = await pool.request().query(`SELECT * FROM users`);
    res.json({ users: result.recordset });
  } catch (error) {
    res.status(500).json({ error: "something went wrong" });
  }
}

async function deleteUser(req, res) {
  try {
    const { id } = req.params;
    const result = await pool.request().input("id", sql.UniqueIdentifier, id)
      .query(`
        DELETE FROM users
        OUTPUT DELETED.id, DELETED.email
        WHERE id=@id 
      `);
    const user = result.recordset[0];
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ message: "User deleted", user });
  } catch (error) {
    res.status(500).json({ error: "something went wrong" });
  }
}

async function updateMe(req, res) {
  try {
    const { name, email } = req.body;
    if (!name && !email) {
      return res.status(400).json({ error: "Nohing to update" });
    }
    const result = await pool
      .request()
      .input("id", sql.UniqueIdentifier, req.user.id)
      .input("name", sql.NVarChar, name || null)
      .input("email", sql.NVarChar, email || null).query(`UPDATE users
        SET name=COALESCE(@name,name),
            email=COALESCE(@email,email)
        OUTPUT INSERTED.id, INSERTED.email, INSERTED.name, INSERTED.role
        WHERE id=@id
        `);

    const user = result.recordset[0];
    if (!user) {
      return res.status(400).json({ error: "User not Found" });
    }
    res.json({ user });
  } catch (error) {
    return res.status(400).json({ error: "Something went wrong" });
  }
}

async function changePassword(req, res) {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword && !newPassword) {
      return res
        .status(400)
        .json({ error: "Current password and new password are required" });
    }
    const result = await pool
      .request()
      .input("id", sql.UniqueIdentifier, req.user.id)
      .query(`SELECT id, password FROM users WHERE id=@id`);
    const user = result.recordset[0];
    if (!user) {
      return res.status(400).jspn({ error: "User not found" });
    }
    const match = await bcrypt.compare(currentPassword, user.password);
    if (!match) {
      return res.status(400).json({ error: "Password incorrect" });
    }
    const newHash = await bcrypt.hash(newPassword, 10);
    await pool
      .request()
      .input("id", sql.UniqueIdentifier, req.user.id)
      .input("password", sql.NVarChar, newHash).query(`
        UPDATE users SET password=@password WHERE id=@id
        `);

    res.json({ message: "Password updated" });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: "Something went wrong" });
  }
}

async function createOrder(req, res) {
  try {
    const userID = req.user.id;
    const cart = await Cart.findOne({ user_id: userID });
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ error: "Carte is empty" });
    }
    const lineItems = [];
    let totalsCents = 0;

    for (const item of cart.items) {
      const product = await Product.findById(item.product_id);
      if (!product) {
        return res
          .status(400)
          .json({ error: "A product in your cart no longer exists" });
      }
      const unitePrice = product.price;
      totalsCents += unitePrice * item.quantity;

      lineItems.push({
        product_id: product._id.toString(),
        product_name: product.name,
        quantity: item.quantity,
        price: unitePrice,
      });
    }
    //creatorders 

    const orderResult = await pool
      .request()
      .input("user_id", sql.UniqueIdentifier, userID)
      .input("total", sql.Int, totalsCents).query(`
        INSERT INTO orders (user_id, status, total)
        OUTPUT INSERTED.id, INSERTED.user_id, INSERTED.status, INSERTED.total, INSERTED.created
        VALUES (@user_id, 'pending', @total)
      `);

        const order = orderResult.recordset[0]
      // creat order items

        for ( const li of lineItems){
            await pool
        .request()
        .input("order_id", sql.UniqueIdentifier, order.id)
        .input("product_id", sql.NVarChar, li.product_id)
        .input("product_name", sql.NVarChar, li.product_name)
        .input("quantity", sql.Int, li.quantity)
        .input("price", sql.Int, li.price)
        .query(`
          INSERT INTO order_item (order_id, product_id, product_name, quantity, price)
          VALUES (@order_id, @product_id, @product_name, @quantity, @price)
        `);
    }

    cart.items = [];
    await cart.save();

    res.status(201).json({ order, items: lineItems });
        

  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: "Something went wrong" });
  }
}
async function getOrder(req, res) {
  try {
    const { id } = req.params;
    const userID = req.user.id;

    // Get the order from SQL
    const orderResult = await pool
      .request()
      .input("id", sql.UniqueIdentifier, id)
      .query(`SELECT * FROM orders WHERE id = @id`);

    if (orderResult.recordset.length === 0) {
      return res.status(404).json({ error: "Order not found" });
    }

    const order = orderResult.recordset[0];

    // Security: only the user who created the order can view it
    if (order.user_id.toString() !== userID.toString()) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    // Get the order items
    const itemsResult = await pool
      .request()
      .input("order_id", sql.UniqueIdentifier, id)
      .query(`SELECT * FROM order_item WHERE order_id = @order_id`);

    const items = itemsResult.recordset;

    res.json({
      order: {
        ...order,
        items,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Something went wrong" });
  }
}
async function getAllOrders(req, res) {
  try {
    // Get all orders from SQL
    const ordersResult = await pool
      .request()
      .query(`SELECT * FROM orders ORDER BY created DESC`);

    const orders = ordersResult.recordset;

    // For each order, get its items
    const ordersWithItems = await Promise.all(
      orders.map(async (order) => {
        const itemsResult = await pool
          .request()
          .input("order_id", sql.UniqueIdentifier, order.id)
          .query(`SELECT * FROM order_item WHERE order_id = @order_id`);

        return {
          ...order,
          items: itemsResult.recordset,
        };
      })
    );

    res.json({ orders: ordersWithItems });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Something went wrong" });
  }
}

async function updateOrder(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const userId = req.user.id;  // from requireAuth token

    // Valid statuses
    const validStatuses = ["pending", "processing", "shipped", "delivered", "cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    // Find the order
    const orderResult = await pool
      .request()
      .input("id", sql.UniqueIdentifier, id)
      .query(`SELECT * FROM orders WHERE id = @id`);

    if (orderResult.recordset.length === 0) {
      return res.status(404).json({ error: "Order not found" });
    }

    const order = orderResult.recordset[0];

    // Security: only the user who created the order or admin can update it
    // (for now, just let anyone with token update, or add admin check)
    
    // Update the order status
    const updateResult = await pool
      .request()
      .input("id", sql.UniqueIdentifier, id)
      .input("status", sql.NVarChar, status)
      .query(`
        UPDATE orders 
        SET status = @status
        WHERE id = @id
      `);

    // Get the updated order
    const updatedOrderResult = await pool
      .request()
      .input("id", sql.UniqueIdentifier, id)
      .query(`SELECT * FROM orders WHERE id = @id`);

    const updatedOrder = updatedOrderResult.recordset[0];

    res.json({ order: updatedOrder });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Something went wrong" });
  }
}
module.exports = {
  connectDB,
  register,
  login,
  requireAuth,
  me,
  requireAdmin,
  changeRole,
  getAllUsers,
  updateMe,
  deleteUser,
  changePassword,
  createOrder,
  getOrder,
  getAllOrders,
  updateOrder
};
