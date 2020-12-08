const express = require('express');
const router = express.Router();

router.get('/:id', async (req, res, next) => {
  try {
    //res.send({ message: "image comes here", id: req.params.id });
    res.sendFile(__dirname + '/screenshot.png');
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;