const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: String,
    status: { type: String, enum: ["ACTIVE", "INACTIVE", "ARCHIVED"], default: "ACTIVE" },
    stock: { type: Number, default: 0 },
    is_premium: { type: Boolean, default: false },
    rating: { type: Number, min: 1, max: 5 },
    price: { type: Number, required: true },
    category: {
        type: String,
        enum: ["ELECTRONICS", "CLOTHING", "BOOKS", "HOME", "SPORTS"],
        required: true
    },
    tags: [{ type: String }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Product", ProductSchema);
