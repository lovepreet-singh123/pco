const express = require("express");
const cors = require("cors"); // <-- Add this line
const bodyParser = require("body-parser");
const connectDB = require("./config/db");
const User = require("./models/User");
const Product = require("./models/Product");

const app = express();
const PORT = 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors()); // <-- Enable CORS for all origins
// app.use(bodyParser.json());
app.use(express.json()); // body-parser is now built-in

app.use((req, res, next) => {
    setTimeout(() => next(), 2000); // delay every request by 2 seconds
});

// Login API
app.post("/login", async (req, res) => {
    const { username, password } = req.body;

    // Simple validation
    if (!username || !password) {
        return res.status(400).json({ msg: "Please provide username and password" });
    }

    try {
        const user = await User.findOne({ username, password });

        if (!user) {
            return res.status(401).json({ msg: "Invalid credentials" });
        }

        // Return user details (without password)
        const { password: pwd, ...userData } = user.toObject();
        res.json({ msg: "Logged in", user: userData });
    } catch (err) {
        res.status(500).json({ msg: "Server error" });
    }
});

app.get("/products", async (req, res) => {
    const {
        categories,
        status,
        is_premium,
        is_in_stock,
        min_price,
        max_price,
        rating,
        tags,
        page = 1,
        limit = 10,
        search,
    } = req.query;

    const query = {};

    if (categories) {
        query.category = { $in: categories.split(",") };
    }

    if (status) {
        query.status = status;
    }

    if (is_premium !== undefined) {
        query.is_premium = is_premium === "true";
    }

    if (is_in_stock !== undefined) {
        query.stock = is_in_stock === "true" ? { $gt: 0 } : 0;
    }

    if (min_price || max_price) {
        query.price = {};
        if (min_price) query.price.$gte = Number(min_price);
        if (max_price) query.price.$lte = Number(max_price);
    }

    if (rating) {
        query.rating = Number(rating);
    }

    if (tags) {
        query.tags = { $in: tags.split(",") };
    }

    if (search) {
        const regex = new RegExp(search, "i"); // Case-insensitive search
        query.$or = [
            { name: regex },
            { description: regex },
            { category: regex },
            { tags: regex },
        ];
    }

    const skip = (Number(page) - 1) * Number(limit);

    try {
        const products = await Product.find(query).skip(skip).limit(Number(limit));
        const count = await Product.countDocuments(query);

        res.json({
            total: count,
            page: Number(page),
            limit: Number(limit),
            products
        });
    } catch (err) {
        res.status(500).json({ msg: "Error fetching products", error: err.message });
    }
});

app.post("/products", async (req, res) => {
    try {
        const product = new Product(req.body);
        const savedProduct = await product.save();
        res.status(201).json(savedProduct);
    } catch (err) {
        res.status(400).json({ msg: "Failed to create product", error: err.message });
    }
});

app.put("/products/:id", async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            { ...req.body, updatedAt: new Date() },
            { new: true, runValidators: true }
        );
        if (!updatedProduct) {
            return res.status(404).json({ msg: "Product not found" });
        }
        res.json(updatedProduct);
    } catch (err) {
        res.status(400).json({ msg: "Failed to update product", error: err.message });
    }
});

app.delete("/products/:id", async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);
        if (!deletedProduct) {
            return res.status(404).json({ msg: "Product not found" });
        }
        res.json({ msg: "Product deleted successfully" });
    } catch (err) {
        res.status(500).json({ msg: "Failed to delete product", error: err.message });
    }
});


app.delete("/products", async (req, res) => {
    const { ids } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({ msg: "Please provide an array of product IDs to delete" });
    }

    try {
        const result = await Product.deleteMany({ _id: { $in: ids } });

        if (result.deletedCount === 0) {
            return res.status(404).json({ msg: "No products found to delete" });
        }

        res.json({ msg: "Products deleted successfully", deletedCount: result.deletedCount });
    } catch (err) {
        res.status(500).json({ msg: "Failed to delete products", error: err.message });
    }
});
// Get single product by ID
app.get("/products/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({ msg: "Product not found" });
        }

        res.json(product);
    } catch (err) {
        res.status(500).json({ msg: "Error fetching product", error: err.message });
    }
});


app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
