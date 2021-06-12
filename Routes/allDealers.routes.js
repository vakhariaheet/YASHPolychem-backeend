const Dealer = require("../Modals/Dealer.modal");
const allDealers = async (req, res) => {
    const dealer = await Dealer.find();
    res.json(dealer);
}
module.exports = allDealers;