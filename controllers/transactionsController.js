const express = require("express");
const transactions = express.Router();
const transactionsArray = require("../models/transaction.js");

// GET / route
transactions.get("/", (req, res) => {
    res.json(transactionsArray);
});

// POST / route
transactions.post("/", (req, res) => {
    transactionsArray.push(req.body);
    res.json(transactionsArray[transactionsArray.length - 1]);
});

// GET /:arrayIndex route
transactions.get("/:arrayIndex", (req, res) => {
    const { arrayIndex } = req.params;
    if(transactionsArray[arrayIndex]) {
        res.json(transactionsArray[arrayIndex]);
    } else {
        res.status(404).send({ error: 'Invalid array index' });
    }
});

// PUT /:arrayIndex route
transactions.put("/:arrayIndex", (req, res) => {
    const { arrayIndex } = req.params;
    if(transactionsArray[arrayIndex]) {
        transactionsArray[arrayIndex] = req.body;
        res.json(transactionsArray[arrayIndex]);
    } else {
        res.status(400).json({ error: 'Invalid array index' });
    }
});

// DELETE /:arrayIndex route
transactions.delete("/:arrayIndex", (req, res) => {
    const { arrayIndex } = req.params;
    if(transactionsArray[arrayIndex]) {
        transactionsArray.splice(arrayIndex, 1);
        res.json(transactionsArray);
    } else {
        res.status(400).json({ error: 'Invalid array index' });
    }
});

module.exports = transactions;
