const express = require('express');
const router = express.Router();
const customers = require('../models/customer');
const Joi = require('joi');


router.get('/', async function (req, res, next) {

    const result = await customers.find({});
    res.status(200).send(result);
});



router.post('/', async function (req, res) {
    const { error } = validateCustomers(req.body);
    if (error) return res.status(400).json({ error: error.message });
    let data = new customers({
        name: req.body.name,
        isGold: req.body.isGold,
        phone: req.body.phone,
    });
    const result = await data.save()
    if (result) res.status(201).json({ message: "Record Saved", result: result })

});

router.put('/:id', async function (req, res) {
    const { error } = validateCustomers(req.body);
    if (error) return res.status(400).json({ error: error.message });
    let updateObject = req.body;
    const user = await customers.findById(req.params.id);

    if (!user) res.status(404).send("Record Not Found")
    else {
        const result = await customers.updateOne({ _id: req.params.id }, updateObject);
        console.log(result);
        if (result.n > 0) res.status(201).json({ message: "Record Updated", result: result });
        else res.status(404).json({ message: "Record Not Updated" });
    }
});

router.delete('/:id', async function (req, res) {

    const result = await customers.deleteOne({ _id: req.params.id });
    console.log(result);
    if (result.deletedCount > 0)
        res.status(200).send("Record Deleted")
    else
        res.status(404).send("Record Not Found")
});

// JOI validate function
function validateCustomers(customer) {
    const schema = {
        name: Joi.string().min(5).required(),
        phone: Joi.number().integer().min(1000000000).max(9999999999).required(),
        isGold: Joi.boolean().required()
    };

    return Joi.validate(customer, schema);
}
module.exports = router;