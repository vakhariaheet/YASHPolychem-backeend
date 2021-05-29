const Dealer = require("../Modals/Dealer.modal");
const updateDealers =async (req, res) => {
    const { dealer } = req.body;
    try {
        const newDealer = await Dealer.findByIdAndUpdate(
          { _id: dealer._id },
          { ...dealer },
          { new: true }
        );
    } catch (error) {
        res.status(500).json({ err });
    }
    
    res.status(200).json(newDealer);
};
module.exports = updateDealers