const express = require('express');
const router = express.Router();
const fs = require('fs');
var classificator = require('../NaturalLanguageProcessing/brainStorm');
const { Tweet } = require('../models/tweetModel'); // must be required this way with parenthesis { Tweet }, would't work otherwise

router.post('/', function (req, res, next) {

    console.log("The following object has arrived and tweets will be stored with it's id");
    console.log(req.body.userDbObj);
  
    fs.readFile('NaturalLanguageProcessing/trainingData.json', (err, file) => {
      let oldArray = JSON.parse(file);
      let newArray = req.body.editedTweets.filter(tweet => tweet.category != 'unknown'); // exclude tweets for which the category is 'unknown'
  
      let updatedArray = oldArray.concat(newArray);
  
      function finalMapping(arrayOfObjects) { // creates an array of unique tweets
        let arrayOfObjectsMap = [];
        let map = new Map();
        for (let item of arrayOfObjects) {
          if (!map.has(item.text)) {
            map.set(item.text, true); // set any value to Map
            arrayOfObjectsMap.push({
              text: item.text,
              category: item.category
            });
          }
        }
        return arrayOfObjectsMap;
      };
  
      let mappedArray = finalMapping(updatedArray);
  
  
      fs.writeFile('NaturalLanguageProcessing/trainingData.json', JSON.stringify(mappedArray), (err) => {
        if (err) throw err;
        console.log('The file has been saved!');
  
        fs.readFile('NaturalLanguageProcessing/trainingData.json', (err, file) => {
          let trainingData = JSON.parse(file);
          classificator.teach("NaturalLanguageProcessing/trainedClassifier.json", trainingData, function (err, newClassifier) {
            if (err) {
              return console.log(err);
            }
            console.log('Training saved!');
          });
        });
  
      });
  
      console.log("//// Tweets that arrived from React to be saved in db (if they aren't saved already): ////");
      console.log(req.body.editedTweets);
      console.log("///////////");
  
      req.body.editedTweets.forEach(tweet => {
        async function ckeckIfTweetExists() {
          const existingTweet = await Tweet
            .findOne({ text: tweet.text });
          if (!existingTweet) {
            const newTweetToSave = new Tweet({
              text: tweet.text,
              category: tweet.category,
              user: req.body.userDbObj._id
            });
  
            let savedTweet = await newTweetToSave.save()
              .catch(err => console.error('Error while saving tweet document: ', err));
            if (savedTweet) {
              console.log("Tweet that has been saved: ");
              console.log(savedTweet);
            }
          } else {
            console.log("This tweet exists in db and will NOT be saved: ", existingTweet);
          }
        }
        ckeckIfTweetExists();
      });
    });
  
    res.send("Saving finished, greetings from the server-side!");
  });

module.exports = router;