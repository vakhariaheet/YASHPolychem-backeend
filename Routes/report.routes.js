const Order = require("../Modals/Order.modal");
const Dealer = require("../Modals/Dealer.modal");
const report = async (req, res) => {
  const { lt, gt, cd } = req.query;
  let lowerDate = lt;
  let upperDate = gt;
  const todayDate = new Date();
  const date = todayDate.getDate();
  const month = todayDate.getMonth() + 1;
  const year = todayDate.getFullYear();
  let reqDate = `${year}-${month}-${date}`;
  console.log(req.query);
  if (cd) {
    const date = new Date(cd);
    reqDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  }
  if (!lowerDate && !upperDate) {
    lowerDate = `${year}-${month}-01`;
    upperDate = `${year}-${month}-${date}`;
  }
  if (!lowerDate) {
    lowerDate = `${year}-${month}-01`;
  }
  if (!upperDate) {
    upperDate = `${year}-${month}-${date}`;
  }

  const ordersQ = await Order.find(
    {
      date: {
        $gte: lowerDate,
        $lte: upperDate,
      },
    },
    {
      TTNO: true,
      date: true,
      Name: true,
      "Bill Qty": true,
      id: true,
    }
  ).sort({ date: 1 });
  const dealer = await Dealer.find({});
  const orders = {};
  console.log(reqDate);
  const reqDateArr = reqDate.split("-");
  const OrdersQ = await Order.find(
    {
      date: {
        $gte: reqDate,
        $lt: `${Number(reqDateArr[0])}-${reqDateArr[1]}-${Number(reqDateArr[2]) +1}`,
      },
    },
    {
      TTNO: true,
      date: true,
      Name: true,
      "Bill Qty": true,
      id: true,
    }
  );
  const tOrders = {};
  const dealerInfo = {};
  dealer.forEach((dealer) => {
    const dOrders = ordersQ.filter((order) => order.Name === dealer.name);
    let num = 0;
    OrdersQ.filter((order) => order.Name === dealer.name).map((order) => {
      return (num += Number(order["Bill Qty"]));
    });
    if (dOrders.length === 0) return;
    orders[dealer.name] = dOrders.map((order) => {
      return {
        TTNO: order.TTNO,
        date: order.date,
        Name: order.Name,
        "Bill Qty": order["Bill Qty"],
        id: order.id,
      };
    });

    tOrders[dealer.name] = num.toFixed(3);
  });

  res.json({ orders, lowerDate, upperDate, tOrders, reqDate, OrdersQ });
};

module.exports = report;
