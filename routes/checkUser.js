const express = require('express');
const router = express.Router();
const { User } = require('../models/userModel'); // must be required this way with parenthesis { User }, would't work otherwise
const { Tweet } = require('../models/tweetModel'); // must be required this way with parenthesis { Tweet }, would't work otherwise


router.get('/:id', async (req, res, next) => {

  const ckeckIfUserExistsInDb = async () => {
    const existingUser = await User
      .findOne({ username: req.params.id });
    if (existingUser) {
      (console.log("Username: " + " " + req.params.id + " exists in db."));
      (console.log(existingUser));
      const tweetsByUser = await Tweet
        .find({ user: existingUser._id });
      console.log(tweetsByUser);
      console.log(existingUser._id);
      console.log(existingUser.username);
      res.send({ message: "exists in db", tweetsArray: tweetsByUser, user: existingUser });
    } else {
      (console.log("Username: " + " " + req.params.id + " doesn't exist in db."));
      res.send({ message: "doesn't exist in db" });
    }
  } 
  try {
   ckeckIfUserExistsInDb();
  } catch (e) {
   console.log(e);
  }
});

module.exports = router;