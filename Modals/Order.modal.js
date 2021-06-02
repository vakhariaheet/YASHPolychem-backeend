const mongoose = require("mongoose");
const orderSchema = mongoose.Schema({
  "Order No": Number,
  date: Date,
  id: {
    type: Number,
    unique: true
  },
  time: String,
  TTNO: String,
  Material: Number,
  "Material Name": String,
  "Bill Qty": Number,
  Unit: String,
  "Bill Amt": Number,
  "Db/Cr": String,
  "Doc Type": String,
  Plant: Number,
  CCA: String,
  "Sold to Party": Number,
  "Ship to Party": Number,
  Name: String,
  No: String,
  created_on: { type: Date, default: Date.now },
});

module.exports = mongoose.model("order", orderSchema);
