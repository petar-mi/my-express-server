const express = require('express');
const router = express.Router();

router.get('/:id', async (req, res, next) => { // Test endpoint to use with Postman
    try {
      console.log("Test request received with parameter: ", req.params.id);
      res.send({ message: "Test successful", id: req.params.id });
    } catch (error) {
      console.log(error);
    }
  });

module.exports = router;