const mongoose = require('mongoose');
module.exports = function (req, res, next) {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ success: false, message: "Invalid Object ID Format" });
    } else {
        next();
    }
}