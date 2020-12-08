const express = require("express");
const router = express.Router();

router.get("/:id", (req, res) => {
  //res.send({ response: "I am alive" }).status(200);
  res.send({ response: req.params }).status(200);
  // res.render('viewTest', function(err, html) {
  //   if(err) {}
  //   res.send(html);
  // });
});

module.exports = router;