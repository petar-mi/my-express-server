const express = require('express');
const router = express.Router();
const puppeteer = require('puppeteer');
const request = require("request");
var classificator = require('../NaturalLanguageProcessing/brainStorm');
const { User } = require('../models/userModel'); // must be required this way with parenthesis { User }, would't work otherwise


// SOCKET.IO LISTENER
nsp.on('connection', function (socket) { // listens to any new connection and executes function
  // The connection event returns a socket object which will be passed to the callback function.
  // Use socket to communicate with this particular client only, sending it it's own id
  socket.emit('welcome', { message: 'This message is from server-side Socket.IO identifying itself!', id: socket.id });

  socket.on('i am client', (obj) => console.log(obj.data, obj.id)); // logs on server-side console { data: 'I am client and my id is: ', id: '7XETFIsKoe9f0ieGAAAB' } 
  
  socket.on("disconnect", () => console.log(`Client with id: ${socket.id} has disconnected`));
});

function extractTweets(tweets) {
  // const extractedParentElements = document.getElementsByClassName('css-901oao r-1qd0xha r-a023e6 r-16dba41 r-ad9z0x r-bcqeeo r-bnwqim r-qvutc0');                               
  // previous line is for crawling while being logged-in!!! 
  //const extractedParentElements = document.getElementsByClassName('TweetTextSize TweetTextSize--normal js-tweet-text tweet-text'); // when puppeteer crawls w/o logging-in
  // const extractedParentElements = document.getElementsByClassName('css-901oao r-hkyrab r-1qd0xha r-a023e6 r-16dba41 r-ad9z0x r-bcqeeo r-bnwqim r-qvutc0'); // modified on Oct 18 2020 to fit current twitter layout ( also when puppeteer crawls w/o logging-in)
  const extractedParentElements = document.getElementsByClassName('css-901oao r-18jsvk2 r-1qd0xha r-a023e6 r-16dba41 r-ad9z0x r-bcqeeo r-bnwqim r-qvutc0'); // modified on Dec 4 2020 to fit current twitter layout
  for (let element of extractedParentElements) {
    // tweets.push(element.firstElementChild.innerText); // logged-in case
    // tweets.push(element.innerText); // without logging-in  
    tweets.push(element.firstElementChild.innerText); // modified on Oct 18 2020 to fit current twitter layout
  }
  console.log(tweets);
  console.log("*********************************************");
  tweets.push('css-901oao ' + String(document.getElementsByClassName('css-901oao').length));
  tweets.push('css-901oao r-18jsvk2 r-1qd0xha r-a023e6 ' + String(document.getElementsByClassName('css-901oao r-18jsvk2 r-1qd0xha r-a023e6').length));
  tweets.push('css-901oao r-18jsvk2 r-1qd0xha r-a023e6 r-16dba41 r-ad9z0x r-bcqeeo ' + String(document.getElementsByClassName('css-901oao r-18jsvk2 r-1qd0xha r-a023e6 r-16dba41 r-ad9z0x r-bcqeeo').length));
  tweets.push('css-901oao r-18jsvk2 r-1qd0xha r-a023e6 r-16dba41 r-ad9z0x r-bcqeeo r-bnwqim r-qvutc0 ' + String(document.getElementsByClassName('css-901oao r-18jsvk2 r-1qd0xha r-a023e6 r-16dba41 r-ad9z0x r-bcqeeo r-bnwqim r-qvutc0').length));
  document.getElementsByClassName('css-901oao r-18jsvk2 r-1qd0xha r-a023e6 r-16dba41 r-ad9z0x r-bcqeeo').forEach(a => tweets.push(a.innerText));
  for (const el of document.querySelectorAll("span")) {
    if (el.innerText.includes("vegan")) {
      tweets.push("elem : " + el.textContent);
      tweets.push("elem : " + el.className);
      tweets.push("Parent elem: " + el.parentElement);
      tweets.push("Parent elem: " + el.parentElement.className);
    }
  }
  return tweets;
}

async function scrTweets(page, extractTweets) {
  let tweets = [];
  try {
    for (let i = 0; i < 2; i++) { // sets the number of time scrolling will be performed (set to i < 1 for testing purposes only)
      tweets = await page.evaluate(extractTweets, tweets);
      await page.evaluate('window.scrollTo(0, document.body.scrollHeight)');
      console.log(i + 1 + '. scroll performed');
      await page.waitFor(5000); // time set deliberately so that feed is loaded
    }
  } catch (e) {
    console.log("We have an ERROR!");
    console.log(e);
  }
  return tweets;
}

router.get('/:id', async (req, res, next) => {
  console.log(req.params.id);

  // ***** PUPPETEER - comment-out if using mock tweets array *********
  // const browser = await puppeteer.launch({ headless: false, }); // only for localhost
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] }); // for Heroku deployment env
  const page = await browser.newPage();
  page.setViewport({ width: 800, height: 1200 });
  page.on('load', () => console.log("Loaded: " + page.url())); // just sets a listener that logs a loaded page

  await page.goto(`https://twitter.com/${req.params.id}`);

  await page.waitFor(5000); // time set deliberately for page to load

  async function abc() {
      try {
        await page.evaluate(checkIfTwitterAccountExists, req.params.id);
        return {found: false};
      } catch (error) {
        return {found: true};
      }
  }

  function checkIfTwitterAccountExists(twitterUser) {
    if (document.getElementsByClassName('errorpage-body-content')[0].firstElementChild.innerText == "Sorry, that page doesn’t exist!") {
      console.log(`${twitterUser}  Twitter account doesn't exist!`);
      return true;
    };
  }

  let accountNonExistent = false;


  //abc.then() // this is most probably just some typo or addition by Vladimir
  try {
    accountNonExistent = await page.evaluate(checkIfTwitterAccountExists, req.params.id); // can become true after evaluation in function checkIfTwitterAccountExists
  } catch (e) { // huge block of code that follows is nested in this catch block and executes if puppeteer throws an error while evaluating if twitter account exists
    console.log(e); // if twitter account is found an error would be logged ("evaluation failed") and continue executing the following block of code
    console.log("Twitter account exists!");
    console.log("A new user is being created");
    const user = new User({
      username: req.params.id
    });
    let newlyCreatedUser = await user.save()
      .catch(err => console.error('Error while saving user document: ', err)); // logs an error if user document to be saved already exists in db (duplicate)
    if (newlyCreatedUser) {
      console.log("User that has just been created: ");
      console.log(newlyCreatedUser);
      console.log(newlyCreatedUser._id);
    }
    
    console.log(page._target._targetInfo.url);
    const tweets = await scrTweets(page, extractTweets);
    let uniqueTweets = [...new Set(tweets)]; // firstly, new Set(tweets) is called and makes a set {"a", "b"} from the tweets array. 
                                             // Then its members are spread with ... spread operator into uniqueTweets array.

    await browser.close();

    console.log('Logging uniqueTweets after puppeteer:');
    console.log(uniqueTweets);
    //***** END of PUPPETEER ******

    // MOCK TWEETS ARRAY FOR TESTING
    // let uniqueTweets = [
    //   'Football is the most popular sport by far',
    //   'The hurricane center advised that heavy rains from the storm were expected to occur',
    //   'That was a great tennis match',
    //   'My computer is using the wrong graphics card',
    //   'This is a newly addes tweet about sport',
    //   '2 years ago, when Bruce Gilley published an article on why "colonialism was good," I said he would relish the backlash, and claim he was being persecuted by leftists for independent thought even though his article was an obviously fraudulent and racist piece of pseudoscholarship.',
    //   'Here is my original article explaining why Gilley work is historically illiterate racist garbage',
    //   'This is a wholy new basketball tweet'
    // ];

    // *** Analysing tweets array uniqueTweets locally using "Natural": https://github.com/NaturalNode/natural 
    let analizedTweets = [];

    classificator.classifyTweets("NaturalLanguageProcessing/trainedClassifier.json", null, function (err, newClassifier) {
      if (err) {
        return console.log(err);
      }

      analizedTweets = (uniqueTweets.map(tweet => {
        return {
          text: tweet,
          category: newClassifier.classify(tweet),
          //classifications: newClassifier.getClassifications(tweet),
          //classificationsJSON: JSON.stringify(newClassifier.getClassifications(tweet)),
          //definiteCategory: newClassifier.getClassifications(tweet)[0].label
        }
      }));

      console.log("Logging tweets analysed by natural classifier: ");
      console.log(analizedTweets);
      // *** END of Analysing tweets array uniqueTweets locally using "Natural"

      // should have filtered categories  on the basis of probability, but it's too complex so it's commented-out:
      // let filteredAnalizedTweets = analizedTweets.filter(tweet => tweet.classifications.filter(item => Math.floor(item.value * 10) < 1).length == tweet.classifications.length); // filters only those that have at least one value starting on 2nd decimal 
      // console.log("Logging FILTERED tweets analysed by natural classifier: ");
      // console.log(filteredAnalizedTweets);
    });

    // SENDING TWEETS FOR ANALYSIS TO meaningcloud.com
    for (let a = 0; a < uniqueTweets.length; a++) {

      var options;

      // every other tweet will be sent via differtent meaningcloud.com account using unique key to workaround 2sec interval between sending request that was set by meaningcloud.com
      if (a % 2 == 0) {
        options = {
          method: 'POST',
          url: 'https://api.meaningcloud.com/class-1.1',
          headers: { 'content-type': 'application/x-www-form-urlencoded' },
          form: {
            key: '246b149fa5d4b95ce592d9b847f238d3', // 1.thing.needed@gmail.com krofnica_987# 
            txt: uniqueTweets[a],
            url: '',
            doc: '',
            model: 'IPTC_en'
          }
        };
      } else {
        options = {
          method: 'POST',
          url: 'https://api.meaningcloud.com/class-1.1',
          headers: { 'content-type': 'application/x-www-form-urlencoded' },
          form: {
            key: '077482e2887f12919c0d55cee4d55537', // bobana linkedin
            txt: uniqueTweets[a],
            url: '',
            doc: '',
            model: 'IPTC_en'
          }
        };
      };
      //console.log(options.form.key);

      function sendToMeaningcloudForAnalysis(options, callback) {
        request(options, callback); // makes a http post request to a remote AI API
      }

      setTimeout(sendToMeaningcloudForAnalysis, 1100 * a, options, function (err, response) { // sets a 1,1sec interval between sending request to meaningcloud.com API (server demands 1sec interval between requests)
        if (err) {
          console.log(err);
        } else {
          let responseObject = JSON.parse(response.body);
          console.log('Text:');
          console.log(uniqueTweets[a]);
          console.log("responseObject");
          console.log(responseObject);
          if (responseObject.status.code == "0") {
            if (responseObject.category_list.length == 0) { // if Meaningcloud DIDN'T manage to find categories in a tweet they will be determined based on already performed local analysis using "natural"
              console.log("No recognized categories");
              console.log("*******************************");
              const locallyAnalizedLabel = analizedTweets.find(item => item.text == uniqueTweets[a]).category;
              console.log("Locally analysed category: " + locallyAnalizedLabel + " will be used.");
              nsp.emit('singleTweetAnalysed', {
                text: uniqueTweets[a],
                category: locallyAnalizedLabel, // category based on already performed local analysis using "natural" Bayes classifier
                id: a
              });
            }
            else { // if Meaningcloud DID manage to find categories in a tweet
              let relevantCategories = responseObject.category_list.filter(category => parseInt(category.relevance) > 80); // filters only categories with relevance > 80
              if (relevantCategories.length > 0) {
                console.log('Relevant categories: ');
                console.log(relevantCategories);
                let maxRelevance = Math.max.apply(Math, relevantCategories.map(function (item) { return item.relevance; })) // if there were multiple categories with relevance > 80, finds the most relevant one among them
                let mostRelevantCategoryObject = relevantCategories.find(item => parseInt(item.relevance) == maxRelevance); // finds 1st object with relevance property that has the value of previously determined max value
                let label = mostRelevantCategoryObject.label;
                if (label.includes("-")) {
                  label = label.split('-')[0].trim();
                }
                console.log("Edited Label: ");
                console.log(label);
                console.log("*******************************");
                nsp.emit('singleTweetAnalysed', {
                  text: uniqueTweets[a], 
                  category: label, 
                  id: a
                });
              }
            }
            if (a == uniqueTweets.length - 1) { // resolves the request with an object when reaches the last array member
              newlyCreatedUser ? console.log(newlyCreatedUser) : console.log("newlyCreatedUser was not created"); // undefined if attempted creation of new user ended in error (user already in database)
              res.send({ newUserObj: newlyCreatedUser, // this property won't be created if newlyCreatedUser was undefined
                         message: "Tweets analysis has just finished!"             
               }); 
            }
          }
        }
      });
    }
  };

  if (accountNonExistent) { // if puppeteer determined that twitter account doesn't exist the value of accountNonExistent was set to true and this code executes
    console.log("Twitter account doesn't exist");
    res.send({ message: "Twitter account doesn't exist" });
  };
});

module.exports = router;
