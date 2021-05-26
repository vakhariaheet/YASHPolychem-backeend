const Dealer = require("../Modals/Dealer.modal");
const updateDealers =async (req, res) => {
    const {dealer } = req.body;
    const newDealer = await Dealer.findByIdAndUpdate({_id:dealer._id}, { ...dealer }, { new: true });
    res.status(200).json(newDealer);
};
module.exports = updateDealers