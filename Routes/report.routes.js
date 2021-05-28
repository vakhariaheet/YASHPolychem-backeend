const Order = require("../Modals/Order.modal");
const Dealer = require("../Modals/Dealer.modal");
const report = async (req, res) => {
  const { lt, gt } = req.query;
  let lowerDate = lt;
  let upperDate = gt;
  const todayDate = new Date();
  const date = todayDate.getDate();
  const month = todayDate.getMonth() + 1;
  const year = todayDate.getFullYear();
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
    const OrdersQ = await Order.find(
      {
        date: {
          $gte: `${year}-${month}-${date}`,
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
  dealer.forEach((dealer) => {
      const dOrders = ordersQ.filter((order) => order.Name === dealer.name);
      let num = 0;
      OrdersQ.filter((order) => order.Name === dealer.name).map(order => {
        return (num += Number(order["Bill Qty"]));
      })
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
      
    tOrders[dealer.name] = num
  });

  res.json({ orders, lowerDate, upperDate,tOrders });
};

module.exports = report;
