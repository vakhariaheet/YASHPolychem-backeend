//* Pakages import
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const XLSX = require("xlsx");
const { uid } = require("uid");
require("dotenv").config();
//* Modals
const Dealer = require("./Modals/Dealer.modal");
const Order = require("./Modals/Order.modal");
//*Utils

const allDealers = require('./Routes/allDealers.routes');
const updateDealers = require('./Routes/updateDealers.routes');
const report = require('./Routes/report.routes');
const app = express();

app.use(cors());
app.use(express.json({limit:"5mb"}));

mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
});
const convertToDate = (date) => {
  const [day, month, year] = date.split(".");
  return `${year}-${month}-${day}`;
};
app.post("/upload", async (req, res) => {
  const { binaryString } = req.body;
  const workbook = XLSX.read(binaryString, { type: "binary" });
  const json = XLSX.utils.sheet_to_json(
    workbook.Sheets[workbook.SheetNames[0]]
  );
  const orders = [];
  const dealerOrder = {};
  json.map((dat) => {
    const orderProperty = [
      "Order No",
      "Tran. Date",
      "TTNO",
      "Material",
      "Material Name",
      "Bill Qty",
      "Unit",
      "Bill Amt",
      "Db/Cr",
      "Doc Type",
      "Plant",
      "CCA",
      "Sold to Party",
      "Ship to Party",
      "Name",
      "No",
    ];
    const order = {};
    orderProperty.map((orderName) => {
      order[orderName] = dat[orderName];
    });
    order.date = convertToDate(dat["Tran. Date"])
    order.id = dat["Doc. No"];
    orders.push(order);
  });
  try {
  const t =  await Order.insertMany(orders, {
     ordered:false,
  });
    
  }
  catch (err) {
    console.log(err.message);
  }
  
   
  const dealers = await Dealer.find();
  const dealersInfo = {};
  dealers.map(async (dealer,i) => {
    
    const dOrder = orders.filter(order => {
      if (order["Ship to Party"] == dealer.id)
      return order["Ship to Party"] == dealer.id
    });
    
       dealerOrder[dealer.name] = dOrder.map((order) => {
         return {
           TTNO: order.TTNO,
           "Tran. Date": order.date,
           Name: order.Name,
           "Bill Qty": order["Bill Qty"],
           email: dealer.email,
         };
       });
       dealersInfo[dealer.name] = {
         ...dealer._doc,
         order: dOrder.length
       }
    
  });
  
  res.json({ dealerOrder,dealersInfo});
});
app.get("/dealers", allDealers)
app.post("/dealers/update", updateDealers)
app.get("/dealers/:id",async (req,res) => {
  const { id } = req.params;
  const dealer = await Dealer.find({ id });
  res.json(dealer[0]);
})
app.post("/add/dealer", async (req, res) => {
  const { dealer } = req.body;
  
  const newDealer = await Dealer.create(dealer);
  res.sendStatus(200);
})
app.delete("/dealers/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await Dealer.findByIdAndRemove(id);
    res.sendStatus(200)
  } catch (error) {
    res.sendStatus(500)
  }
})
app.get("/report", report)
app.get("/orders", async (req, res) => {
  const ordersQ =await Order.find(
    {},
    {
      TTNO:true,
      date: true,
      Name: true,
      "Bill Qty": true,
      id:true
    }
  );
  const orders = ordersQ.map(order => {
    const date = new Date(order.date)
    return {
      id: order.id,
      TTNO: order.TTNO,
      "Tran. Date": `${date.getDate()}-${date.getMonth() + 1 }-${date.getFullYear()}`,
      Name: order.Name,
      "Bill Qty": order["Bill Qty"],
    };
  })
  res.json(orders)
})
const port = process.env.PORT || 5005;
app.listen(port, () => {
  console.log("listening on port " + port);
});
