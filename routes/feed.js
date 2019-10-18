const express = require('express');
const router = express.Router();
const fs = require('fs');
var classificator = require('../NaturalLanguageProcessing/brainStorm');
const { Tweet } = require('../models/tweetModel');

router.post('/', function (req, res, next) {

    console.log("sledeci user objekat je stigao i tvitovi ce biti arhivirani pod njegovim id-jem");
    console.log(req.body.userDbObj);
  
    fs.readFile('NaturalLanguageProcessing/trainingData.json', (err, file) => {
      let oldArray = JSON.parse(file);
      let newArray = req.body.editedTweets.filter(tweet => tweet.category != 'unknown'); // exclude tweets for which the category is 'unknown'
  
      let updatedArray = oldArray.concat(newArray);
  
  
      function finalMapping(arrayOfObjects) { // pre snimanja stvara novi niz koji se sastoji samo iz jedinstvenih tekstova tvitova
        let arrayOfObjectsMap = [];
        let map = new Map();
        for (let item of arrayOfObjects) {
          if (!map.has(item.text)) {
            // set any value to Map (mogli smo mapirati i pomocu nameString propertija, svejedno je u ovom slucaju)
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
            console.log('training saved!');
          });
        });
  
      });
  
      console.log("////Tvitovi koji su stigli iz Reacta da budu snimljeni u bazu osim ako nisu vec tamo: ///////");
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
              .catch(err => console.error('Greska pri snimanju tweet dokumenta: ', err));
            if (savedTweet) {
              console.log("Snimljen je tweet: ");
              console.log(savedTweet);
            }
          } else {
            console.log("Ovaj tvit vec postoji u bazi i NECE biti snimljen ponovo: ", existingTweet);
          }
        }
        ckeckIfTweetExists();
      });
    });
  
    res.send("Snimanje zavrseno, pozdrav sa serverske strane");
  });

module.exports = router;