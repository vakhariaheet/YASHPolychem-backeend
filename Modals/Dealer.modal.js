const mongoose = require("mongoose");
const dealerSchema = mongoose.Schema({
    name: String,
    email: String,
    id: String
});

module.exports = mongoose.model("dealer", dealerSchema);
