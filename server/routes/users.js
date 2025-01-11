const express = require('express');
const router = express.Router();

const people = [
    { id: 1, name: "Alice", isOnline: true },
    { id: 2, name: "Bob", isOnline: true},
    { id: 3, name: "Charlie", isOnline: true },
    { id: 4, name: "David", isOnline: false },
];

router.get("/people", (req, res)=>{
    res.send(people);
})

module.exports = router;  