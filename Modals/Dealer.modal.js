const mongoose = require("mongoose");
const dealerSchema = mongoose.Schema({
    name: String,
    email: String,
    id: {
        type: Number,
        unique: true,
    }
});

module.exports = mongoose.model("dealer", dealerSchema);
