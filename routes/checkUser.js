const express = require('express');
const router = express.Router();
const { User } = require('../models/userModel'); // mora da se uvozi na taj nacin sa { User }, bez zagrada ne bi radilo
const { Tweet } = require('../models/tweetModel');


router.get('/:id', async (req, res, next) => {
  console.log(req.params.id);
  console.log(User.findOne);
  console.log(JSON.stringify(User));

  const ckeckIfUserExistsInDb = async () => {
    const existingUser = await User
      .findOne({ username: req.params.id });
    if (existingUser) {
      (console.log("Username: " + " " + req.params.id + " postoji u bazi."));
      (console.log(existingUser));
      const tweetsByUser = await Tweet
        .find({ user: existingUser._id });
      console.log(tweetsByUser);
      console.log(existingUser._id);
      console.log(existingUser.username);
      res.send({ message: "postoji u bazi", tweetsArray: tweetsByUser, user: existingUser });
    } else {
      (console.log("Username: " + " " + req.params.id + " ne postoji u bazi."));

      res.send({ message: "NE postoji u bazi" });
    }
  } 
  try {
   ckeckIfUserExistsInDb();
  } catch (e) {
   console.log(e);
  }
});

module.exports = router;