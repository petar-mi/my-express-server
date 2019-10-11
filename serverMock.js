const puppeteer = require('puppeteer');
const http = require('http');
const express = require('express');
var cors = require('cors');
var classificator = require('./brainStorm.js');
const axios = require('axios');
const request = require("request");
const socketIo = require("socket.io");
const socketIndex = require("./routes/index");
const fs = require('fs');
const mongoose = require('mongoose');

// *** Mongoose ***

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
  },
  createdOn: { type: Date, default: Date.now },
});
const User = mongoose.model('User', userSchema);

const tweetSchema = new mongoose.Schema({
  text: {
    type: String,
    //required: true,
  },
  category: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});
const Tweet = mongoose.model('Tweet', tweetSchema);

// const createUsersWithMessages = async () => {
//   const user1 = new models.User({
//     username: 'rwieruch',
//   });
//   await user1.save();
// };


// *****
const app = express();
app.use(express.json());
app.use(cors()); // this enables CORS for all requests
app.use(socketIndex);
const server = http.createServer(app);
const io = socketIo(server);
const nsp = io.of('/my-namespace');

// function sendTimeToNameSpace() {
//   nsp.emit('time', { time: new Date().toJSON() }); // io.emit je EMITTER
// }

// setInterval(sendTimeToNameSpace, 10000);

nsp.on('connection', function (socket) { // listens to any new connection and executes function
  // The connection event returns a socket object which will be passed to the callback function.
  // Use socket to communicate with this particular client only, sending it it's own id
  socket.emit('welcome', { message: 'Welcome!', id: socket.id });

  socket.on('i am client', console.log); // bez ovoga se u konzoli servera ne ispisuje { data: 'foo!', id: '7XETFIsKoe9f0ieGAAAB' } 
  // sto je poruka koju salje klijent u redu: socket.emit('i am client', {data: 'foo!', id: data.id});
  // klijent ovde vraca svoj id koji je prethodno dobio od servera
  socket.on("disconnect", () => console.log(`Client with id: ${socket.id} has disconnected`));
});

// io.on('connection', function (socket) { // listens to any new connection and executes function
//   // The connection event returns a socket object which will be passed to the callback function.
// // Use socket to communicate with this particular client only, sending it it's own id
// socket.emit('welcome', { message: 'Welcome!', id: socket.id });

// socket.on('i am client', console.log); // bez ovoga se u konzoli servera ne ispisuje { data: 'foo!', id: '7XETFIsKoe9f0ieGAAAB' } 
// // sto je poruka koju salje klijent u redu: socket.emit('i am client', {data: 'foo!', id: data.id});
// // klijent ovde vraca svoj id koji je prethodno dobio od servera
// socket.on("disconnect", () => console.log(`Client with id: ${socket.id} has disconnected`));
// });

const divider = "*******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************";

function extractItems(items) {
  //const extractedParentElements = document.getElementsByClassName('css-901oao r-hkyrab r-1qd0xha r-a023e6 r-16dba41 r-ad9z0x r-bcqeeo r-bnwqim r-qvutc0');
  //const extractedParentElements = document.getElementsByClassName('css-901oao r-jwli3a r-1qd0xha r-a023e6 r-16dba41 r-ad9z0x r-bcqeeo r-bnwqim r-qvutc0');
  // tw menja nazive klasa, ovde konkretno druga klasa je drugacija, pa je treba izbaciti iz pretrage:
  // const extractedParentElements = document.getElementsByClassName('css-901oao r-1qd0xha r-a023e6 r-16dba41 r-ad9z0x r-bcqeeo r-bnwqim r-qvutc0');                               
  // prethodni red vazi ukoliko je prvo bio potreban login!!! a uko idemo bez logina onda su klase ovakve:
  const extractedParentElements = document.getElementsByClassName('TweetTextSize TweetTextSize--normal js-tweet-text tweet-text');
  //const tweetTexts = [];
  for (let parentElement of extractedParentElements) {
    // items.push(parentElement.firstElementChild.innerText); // ovo vazi za slucaj da je bio izvrsen login
    items.push(parentElement.innerText); // ovo vazi za slucaj bez prethodnog logovanja
  }
  console.log(items);
  console.log("*********************************************");
  return items;
}

async function scrTweets(page, extractItems) {
  let items = [];
  try {
    //let previousHeight;
    //while (items.length < itemTargetCount) {
    for (let i = 0; i < 3; i++) { // podeseno na i < 1 radi brzine testinga, i odredjuje koliko puta ce biti izvrsen scroll
      items = await page.evaluate(extractItems, items);
      //items.push(oneCycleItems);
      await page.evaluate('window.scrollTo(0, document.body.scrollHeight)');
      console.log(i + 1 + '. skrol izvrsen');
      await page.waitFor(3000);
    }
  } catch (e) {
    console.log(e);
  }
  return items;
}


// app.get('/screenshot', async (req, res, next) => {
//   const browser = await puppeteer.launch({
//     headless: false,
//   });
//   const page = await browser.newPage();
//   await page.goto(req.query.url); // URL is given by the "user" (your client-side application)
//   const screenshotBuffer = await page.screenshot();

//   // Respond with the image
//   res.writeHead(200, {
//     'Content-Type': 'image/png',
//     'Content-Length': screenshotBuffer.length
//   });
//   res.end(screenshotBuffer);

//   //await browser.close();
// })


app.get('/checkUser/:id', async (req, res, next) => {
  console.log(req.params.id);

  async function ckeckIfUserExistsInDb() {
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
  ckeckIfUserExistsInDb();
});

app.get('/user/:id', async (req, res, next) => {
  console.log(req.params.id);
  // let userDatabaseObject = req.query.userDbObj;
  // console.log(userDatabaseObject);

  // if (userDatabaseObject) { // ukoliko je stigao prazan obj. user-a, stvara novi user dokument u bazi
  //   async function createUser() {
  //     console.log("usli smo u async f. za kreiranje usera");
  //   console.log("stigao je prazan objekat user-a, dakle kreiramo novog");
  //     const user = new User({
  //       username: req.params.id
  //     });
  //     userDatabaseObject = await user.save()
  //       .catch(err => console.error('Greska pri snimanju user dokumenta: ', err));
  //     if (userDatabaseObject) {
  //       console.log("stvoren je novi user: "); 
  //       console.log(userDatabaseObject);
  //       console.log(userDatabaseObject._id);
  //     }
  //   };
  //   createUser();
  // }


  //*** Mongoose kreiranje user-a ***

  // async function createDoc() {
  //   const user = new User({
  //     username: req.params.id
  //   });
  //   const result = await user.save()
  //     .catch(err => console.error('Greska pri snimanju user dokumenta: ', err));
  //   if (result) {
  //     console.log(result);
  //     console.log(result._id);
  //   }
  // }

  // createDoc();

  // ****

  //******   VAZNO   *******
  //****** PUPPETEER - otkomentarisati da bi islo na tviter i kupilo tvitove *********
  // const browser = await puppeteer.launch({
  //   headless: false,
  // });
  // const page = await browser.newPage();
  // page.setViewport({ width: 800, height: 800 });
  // await page.goto(`https://twitter.com/${req.params.id}`); // URL is given by the "user" (your client-side application)

  // await page.waitFor(2000); // tako da sam stavio proizvoljno da saceka 2sec da se ucita stranica

  // function checkIfTwitterAccountExists(twitterUser) {
  //   if (document.getElementsByClassName('errorpage-body-content')[0].firstElementChild.innerText == "Sorry, that page doesn’t exist!") {
  //     console.log(twitterUser);
  //     console.log(`Twitter profil ne postoji!`);
  //     return true;
  //   };
  // }

  // let accountNonExistent = false;
  // try {
  //   accountNonExistent = await page.evaluate(checkIfTwitterAccountExists, req.params.id);
  // } catch (e) {
  //   console.log(e); // ukoliko je profil pronadjen logovace gresku ("evaluation failed") i nastaviti dalje normalno
  // };

  // if (accountNonExistent) {
  //   console.log("Ne postoji takav twitter profil");
  //   res.send({ message: "Ne postoji takav twitter profil" });
  // };

  // console.log("kreiramo novog usera");
  // const user = new User({
  //   username: req.params.id
  // });
  // let newlyCreatedUser = await user.save()
  //   .catch(err => console.error('Greska pri snimanju user dokumenta: ', err));
  // if (newlyCreatedUser) {
  //   console.log("stvoren je novi user: ");
  //   console.log(newlyCreatedUser);
  //   console.log(newlyCreatedUser._id);
  // }

  // const items = await scrTweets(page, extractItems);
  // let uniqueItems = [...new Set(items)];

  // await browser.close();

  // console.log('ispisujem uniqueItems nakon puppeteer-a:');
  // console.log(uniqueItems);
  //***** KRAJ PUPPETEER ******

  let uniqueItems = [
    'Football is the most popular sport by far',
    'The hurricane center advised that heavy rains from the storm were expected to occur',
    'That was a great tennis match',
    'My computer is using the wrong graphics card',
    'This is a newly addes tweet about sport',
    '2 years ago, when Bruce Gilley published an article on why "colonialism was good," I said he would relish the backlash, and claim he was being persecuted by leftists for independent thought even though his article was an obviously fraudulent and racist piece of pseudoscholarship.',
    'Here is my original article explaining why Gilley work is historically illiterate racist garbage',
    'This is a wholy new basketball tweet'
  ];
  let analizedTweets = [];

  classificator.classifyTweets("./probniKlassifier2.json", null, function (err, newClassifier) {
    if (err) {
      return console.log(err);
    }

    analizedTweets = (uniqueItems.map(tweet => {
      return {
        text: tweet,
        category: newClassifier.classify(tweet),
        classifications: newClassifier.getClassifications(tweet),
        classificationsJSON: JSON.stringify(newClassifier.getClassifications(tweet)),
        definiteCategory: newClassifier.getClassifications(tweet)[0].label
      }
    }));

    console.log("ISPISUJEM NATURAL CLASSIFIER: ");
    console.log(analizedTweets);


    // trebalo je da filtrira dobijene kategorije po osnovu verovatnoce, ali je prekompleksno i zato je zakomentarisano:
    // let filteredAnalizedTweets = analizedTweets.filter(tweet => tweet.classifications.filter(item => Math.floor(item.value * 10) < 1).length == tweet.classifications.length); // filtrira samo one analize koje imaju barem jedan value koji pocinje na drugoj decimali

    // console.log("ISPISUJEM FILTERED NATURAL CLASSIFIER: ");
    // console.log(filteredAnalizedTweets);
  });

  let toBeSentBack = [];

  for (let a = 0; a < uniqueItems.length; a++) {

    var options;

    classifyCount = function (toBeSentBack) {

      let artsCultureAndEntertainmentCounter, crimeLawAndJusticeCounter, disasterAndAccidentCounter, economyBusinessAndFinanceCounter, educationCounter,
        environmentalIssueCounter, healthCounter, humanInterestCounter, labourCounter, lifestyleAndLeisureCounter, politicsCounter, religionAndBeliefCounter,
        scienceAndTechnologyCounter, socialIssueCounter, sportCounter, unrestConflictsAndWarCounter, weatherCounter;

      artsCultureAndEntertainmentCounter = crimeLawAndJusticeCounter = disasterAndAccidentCounter = economyBusinessAndFinanceCounter = educationCounter = environmentalIssueCounter = healthCounter = humanInterestCounter = labourCounter = lifestyleAndLeisureCounter = politicsCounter = religionAndBeliefCounter = scienceAndTechnologyCounter = socialIssueCounter = sportCounter = unrestConflictsAndWarCounter = weatherCounter = 0;


      toBeSentBack.forEach(element => {
        if (element.category == "arts, culture and entertainment") artsCultureAndEntertainmentCounter++;
        if (element.category == "crime, law and justice") crimeLawAndJusticeCounter++;
        if (element.category == "disaster and accident") disasterAndAccidentCounter++;
        if (element.category == "economy, business and finance") economyBusinessAndFinanceCounter++;
        if (element.category == "education") educationCounter++;
        if (element.category == "environmental issue") environmentalIssueCounter++;
        if (element.category == "health") healthCounter++;
        if (element.category == "human interest") humanInterestCounter++;
        if (element.category == "labour") labourCounter++;
        if (element.category == "lifestyle and leisure") lifestyleAndLeisureCounter++;
        if (element.category == "politics") politicsCounter++;
        if (element.category == "religion and belief") religionAndBeliefCounter++;
        if (element.category == "science and technology") scienceAndTechnologyCounter++;
        if (element.category == "social issue") socialIssueCounter++;
        if (element.category == "sport") sportCounter++;
        if (element.category == "unrest, conflicts and war") unrestConflictsAndWarCounter++;
        if (element.category == "weather") weatherCounter++;
      });
      return {
        artsCultureAndEntertainmentCounter: artsCultureAndEntertainmentCounter, crimeLawAndJusticeCounter: crimeLawAndJusticeCounter, disasterAndAccidentCounter: disasterAndAccidentCounter,
        economyBusinessAndFinanceCounter: economyBusinessAndFinanceCounter, educationCounter: educationCounter, environmentalIssueCounter: environmentalIssueCounter,
        healthCounter: healthCounter, humanInterestCounter: humanInterestCounter, labourCounter: labourCounter, lifestyleAndLeisureCounter: lifestyleAndLeisureCounter,
        politicsCounter: politicsCounter, religionAndBeliefCounter: religionAndBeliefCounter, scienceAndTechnologyCounter: scienceAndTechnologyCounter,
        socialIssueCounter: socialIssueCounter, sportCounter: sportCounter, unrestConflictsAndWarCounter: unrestConflictsAndWarCounter, weatherCounter: weatherCounter
      }
    }


    if (a % 2 == 0) {
      options = {
        method: 'POST',
        url: 'https://api.meaningcloud.com/class-1.1',
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        form: {
          //key: '077482e2887f12919c0d55cee4d55537', // preko bobana linkedin-a
          key: '246b149fa5d4b95ce592d9b847f238d3', // 1.thing.needed@gmail.com krofnica_987# 
          //txt: 'It is very hard to keep up, and means we have an absolutely tiny paid staff. Sometimes I wish some rich funder would come along. But I think in the long run reader-supported publications are the only way to go. We just have to convince people that it is worth paying for.',
          //txt: 'aaa',
          txt: uniqueItems[a],
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
          key: '077482e2887f12919c0d55cee4d55537', // preko bobana linkedin-a
          //key: '246b149fa5d4b95ce592d9b847f238d3', // 1.thing.needed@gmail.com krofnica_987# 
          //txt: 'It is very hard to keep up, and means we have an absolutely tiny paid staff. Sometimes I wish some rich funder would come along. But I think in the long run reader-supported publications are the only way to go. We just have to convince people that it is worth paying for.',
          //txt: 'aaa',
          txt: uniqueItems[a],
          url: '',
          doc: '',
          model: 'IPTC_en'
        }
      };
    };

    console.log(options.form.key);

    function getMyBody(options, callback) {
      request(options, callback);
    }

    setTimeout(getMyBody, 1100 * a, options, function (err, response) {
      if (err) {
        console.log(err);
      } else {
        let responseObject = JSON.parse(response.body);
        console.log('Text:');
        console.log(uniqueItems[a]);
        console.log("responseObject");
        console.log(responseObject);
        if (responseObject.status.code == "0") {
          if (responseObject.category_list.length == 0) {
            console.log("nema prepoznatih kategorija");
            console.log("*******************************");
            const locallyAnalizedLabel = analizedTweets.find(item => item.text == uniqueItems[a]).category;
            console.log("ubacuje se lokalno dobijena kategorija: " + " " + locallyAnalizedLabel);
            toBeSentBack.push({
              text: uniqueItems[a],
              category: locallyAnalizedLabel, // preuzima kategoriju dobijenu vec izvrsenim upitom lokalnog Bayes classifier-a
              //id: a
              //user: '5d79ff15444f3c20ce69c700'
            });
            nsp.emit('singleTweetAnalysed', {
              text: uniqueItems[a],
              category: locallyAnalizedLabel, // preuzima kategoriju dobijenu vec izvrsenim upitom lokalnog Bayes classifier-a
              id: a
            });
          }
          else {
            let relevantneKategorije = responseObject.category_list.filter(category => parseInt(category.relevance) > 80);
            if (relevantneKategorije.length > 0) {
              console.log('Relevantne kategorije');
              console.log(relevantneKategorije);
              let maxRelevance = Math.max.apply(Math, relevantneKategorije.map(function (item) { return item.relevance; }))
              let mostRelevantCategoryObject = relevantneKategorije.find(item => parseInt(item.relevance) == maxRelevance); // pronalazi prvi obj koji ima relevance properti == prethodno utvrdjenoj najvecoj vrednosti tog propertija medju svim objektima u nizu
              let label = mostRelevantCategoryObject.label;
              if (label.includes("-")) {
                label = label.split('-')[0].trim();
              }
              console.log("Edited Label: ");
              console.log(label);
              console.log("*******************************");
              toBeSentBack.push({
                text: uniqueItems[a], // tako sto spreadujemo postojece propertije objekata dobijenih sa servera
                category: label, // i dodajemo jos jedan property
                //id: a
                //user: '5d79ff15444f3c20ce69c700'
              });
              nsp.emit('singleTweetAnalysed', {
                text: uniqueItems[a], // tako sto spreadujemo postojece propertije objekata dobijenih sa servera
                category: label, // i dodajemo jos jedan property
                id: a
              });
            }
          }
          // console.log(`ispisujem niz toBeSentBack. brojac: ${a} / ${uniqueItems.length - 1}`);
          // console.log(toBeSentBack);
          if (a == uniqueItems.length - 1) {
            console.log("Krajnja vrednost niza: ");
            console.log(toBeSentBack);

            // Tweet.insertMany(toBeSentBack)
            //   .then(function (docs) {
            //     //response.json(docs);
            //     console.log(docs);
            //   })
            //   .catch(function (err) {
            //     //response.status(500).send(err);
            //     console.log(err);
            //   });

            res.send({ //newUserObj: newlyCreatedUser, // zakomentarisati samo ako je iskljucen deo sa Puppeteer + kreiranje novog usera koje je odmah posle toga, jer inace puca server
                       tweets: toBeSentBack, 
                       classificationCount: classifyCount(toBeSentBack) });
          }
        }
      }
    });
  }


  /*
    classifyCount = function (toBeSentBack) {
      let politikaCounter = 0;
      let posaoCounter = 0;
      toBeSentBack.forEach(element => {
        if (element.category == "social issue") politikaCounter++;
        if (element.category == "sport") posaoCounter++;
      });
      return { politikaCounter: politikaCounter, posaoCounter: posaoCounter }
    }
  
  
    let toBeSentBack = uniqueItems.map((tweet, index) => { // stvaramo novi niz objekata
  
      function getMyBody(options, callback) {
        request(options, callback);
      }
  
      var options;
      if (index % 2 == 0) {
        options = {
          method: 'POST',
          url: 'https://api.meaningcloud.com/class-1.1',
          headers: { 'content-type': 'application/x-www-form-urlencoded' },
          form: {
            //key: '077482e2887f12919c0d55cee4d55537', // preko bobana linkedin-a
            key: '246b149fa5d4b95ce592d9b847f238d3', // 1.thing.needed@gmail.com krofnica_987# 
            //txt: 'It is very hard to keep up, and means we have an absolutely tiny paid staff. Sometimes I wish some rich funder would come along. But I think in the long run reader-supported publications are the only way to go. We just have to convince people that it is worth paying for.',
            //txt: 'aaa',
            txt: uniqueItems[index],
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
            key: '077482e2887f12919c0d55cee4d55537', // preko bobana linkedin-a
            //key: '246b149fa5d4b95ce592d9b847f238d3', // 1.thing.needed@gmail.com krofnica_987# 
            //txt: 'It is very hard to keep up, and means we have an absolutely tiny paid staff. Sometimes I wish some rich funder would come along. But I think in the long run reader-supported publications are the only way to go. We just have to convince people that it is worth paying for.',
            //txt: 'aaa',
            txt: uniqueItems[index],
            url: '',
            doc: '',
            model: 'IPTC_en'
          }
        };
      };
  
      return {
        text: tweet, // tako sto spreadujemo postojece propertije objekata dobijenih sa servera
        category: setTimeout(getMyBody, 1100 * index, options, function (err, response) {
          if (err) {
            console.log(err);
          } else {
            let responseObject = JSON.parse(response.body);
            console.log('Text:');
            console.log(uniqueItems[index]);
            console.log("responseObject");
            console.log(responseObject);
            if (responseObject.status.code == "0") {
              if (responseObject.category_list.length == 0) {
                console.log("nema prepoznatih kategorija");
                console.log("*******************************");
                return;
              }
              else {
                let relevantneKategorije = responseObject.category_list.filter(category => parseInt(category.relevance) > 80);
                if (relevantneKategorije.length > 0) {
                  console.log('Relevantne kategorije');
                  console.log(relevantneKategorije);
                  let maxRelevance = Math.max.apply(Math, relevantneKategorije.map(function (item) { return item.relevance; }))
                  let mostRelevantCategoryObject = relevantneKategorije.find(item => parseInt(item.relevance) == maxRelevance); // pronalazi prvi obj koji ima relevance properti == prethodno utvrdjenoj najvecoj vrednosti tog propertija medju svim objektima u nizu
                  let label = mostRelevantCategoryObject.label;
                  if (label.includes("-")) {
                    label = label.split('-')[0].trim();
                  }
                  console.log("Edited Label: ");
                  console.log(label);
                  console.log("*******************************");
                  return label;
                }
              }
              //res.send(response.body);
            }
          }
        }), // i dodajemo jos jedan property
        id: index
      }
    });*/
  //res.send({ tweets: toBeSentBack, classificationCount: classifyCount(toBeSentBack) });
});
//classifyTweets(uniqueItems);

//res.send(uniqueItems);


// app.get('/meaningcloud', async (req, res, next) => {
//   console.log("radiiii");
//   try{
//     // axios({
//     //   method: 'post',
//     //   url: 'https://api.meaningcloud.com/class-1.1',
//     //   data: {
//     //     key: '077482e2887f12919c0d55cee4d55537',
//     //     model: 'IPTC_en',
//     //     text: 'very hard to keep up, and means we have an absolutely tiny paid staff. Sometimes I wish some rich funder would come along. But I think in the long run reader-supported publications are the only way to go. We just have to convince people that it is worth paying for.'
//     //   }
//     // })
//     // .then(function (response) {
//     //       console.log("ODGOVOR           " + response.data);
//     //       res.send(response.data);
//     //     })
//     //     .catch(function (error) {
//     //       console.log(error);
//     //     });
//   axios.post('https://api.meaningcloud.com/class-1.1', {
//     key: '077482e2887f12919c0d55cee4d55537',
//     txt: 'It is very hard to keep up, and means we have an absolutely tiny paid staff. Sometimes I wish some rich funder would come along. But I think in the long run reader-supported publications are the only way to go. We just have to convince people that it is worth paying for.',
//     url: '',
//     doc: '',
//     model: 'IPTC_en'
//   }, {
//     headers: {
//       'content-type': 'application/x-www-form-urlencoded',
//     }
//   })
//     .then(function (response) {
//       console.log("ODGOVOR           " + response.body);
//       res.send(response.body);
//     })
//     .catch(function (error) {
//       console.log(error);
//     });
//   }
//   catch(err){
//     console.log(err);
//  }

// });
/*
app.get('/meaningcloud', (req, res, next) => {

  let uniqueItemsMock = ['Here is my original article explaining why Gilley work is historically illiterate racist garbage',
    //'He kindly gifted me some new lingerie.',
    //'Google proposed privacy sandbox would similarly restrict tracking technology',
    'Revolutions are the locomotives of history',
    'Football is the most popular sport by far'
  ];


  for (let a = 0; a < uniqueItemsMock.length; a++) {
    var options;
    if (a % 2 == 0) {
      options = {
        method: 'POST',
        url: 'https://api.meaningcloud.com/class-1.1',
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        form: {
          //key: '077482e2887f12919c0d55cee4d55537', // preko bobana linkedin-a
          key: '246b149fa5d4b95ce592d9b847f238d3', // 1.thing.needed@gmail.com krofnica_987# 
          //txt: 'It is very hard to keep up, and means we have an absolutely tiny paid staff. Sometimes I wish some rich funder would come along. But I think in the long run reader-supported publications are the only way to go. We just have to convince people that it is worth paying for.',
          //txt: 'aaa',
          txt: uniqueItemsMock[a],
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
          key: '077482e2887f12919c0d55cee4d55537', // preko bobana linkedin-a
          //key: '246b149fa5d4b95ce592d9b847f238d3', // 1.thing.needed@gmail.com krofnica_987# 
          //txt: 'It is very hard to keep up, and means we have an absolutely tiny paid staff. Sometimes I wish some rich funder would come along. But I think in the long run reader-supported publications are the only way to go. We just have to convince people that it is worth paying for.',
          //txt: 'aaa',
          txt: uniqueItemsMock[a],
          url: '',
          doc: '',
          model: 'IPTC_en'
        }
      };
    };

    console.log(options.form.key);


    function getMyBody(options, callback) {
      request(options, callback);
    }

    setTimeout(getMyBody, 1100 * a, options, function (err, response) {
      if (err) {
        console.log(err);
      } else {
        let responseObject = JSON.parse(response.body);
        console.log('Text:');
        console.log(uniqueItemsMock[a]);
        console.log("responseObject");
        console.log(responseObject);
        if (responseObject.status.code == "0") {
          if (responseObject.category_list.length == 0) {
            console.log("nema prepoznatih kategorija");
            console.log("*******************************");
          }
          else {
            let relevantneKategorije = responseObject.category_list.filter(category => parseInt(category.relevance) > 80);
            if (relevantneKategorije.length > 0) {
              console.log('Relevantne kategorije');
              console.log(relevantneKategorije);
              let maxRelevance = Math.max.apply(Math, relevantneKategorije.map(function (item) { return item.relevance; }))
              let mostRelevantCategoryObject = relevantneKategorije.find(item => parseInt(item.relevance) == maxRelevance); // pronalazi prvi obj koji ima relevance properti == prethodno utvrdjenoj najvecoj vrednosti tog propertija medju svim objektima u nizu
              let label = mostRelevantCategoryObject.label;
              if (label.includes("-")) {
                label = label.split('-')[0].trim();
              }
              console.log("Edited Label: ");
              console.log(label);
              console.log("*******************************");
            }
          }
          //res.send(response.body);
        }
      }
    });

  }

});
*/

app.post('/feed', function (req, res, next) {
  //console.log(req.body.editedTweets);

  console.log("sledeci user objekat je stigao i tvitovi ce biti arhivirani pod njegovim id-jem");
  console.log(req.body.userDbObj);

  fs.readFile('./trainingData.json', (err, file) => {
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


    fs.writeFile('./trainingData.json', JSON.stringify(mappedArray), (err) => {
      if (err) throw err;
      console.log('The file has been saved!');

      fs.readFile('./trainingData.json', (err, file) => {
        let trainingData = JSON.parse(file);
        classificator.teach("./probniKlassifier2.json", trainingData, function (err, newClassifier) {
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
        }
      }
      ckeckIfTweetExists();
    });
  });



  // fs.appendFile('./message.json', JSON.stringify(req.body.editedTweets), function (err) {
  //   if (err) throw err;
  //   console.log('Saved!');
  // });

  // classificator.classifyTweets("./probniKlassifier.json", null, function (err, newClassifier) {
  //   if (err) {
  //     return console.log(err);
  //   }
  //   console.log(testTweets.map(tweet => { // stvaramo novi niz objekata
  //     //console.log(tweet + " " + newClassifier.classify(tweet))
  //     return {
  //       text: tweet, // tako sto spreadujemo postojece propertije objekata dobijenih sa servera
  //       category: newClassifier.classify(tweet), // i dodajemo jos jedan property
  //       classifications: JSON.stringify(newClassifier.getClassifications(tweet))
  //     }
  //   }))
  // });


  res.send("Puno pozdrava");
});

//mongoose.connect('mongodb://localhost:27017/tweetsDB', { useNewUrlParser: true })
mongoose.connect('mongodb://<dbuser>:<dbpassword>@ds052978.mlab.com:52978/tweets_db', { useNewUrlParser: true })
  .then(() => console.log("Connected to MongoDB..."))
  .catch(err => console.error('Could not connect to MongoDB...', err));

const PORT = process.env.PORT || 8080;

server.listen(PORT, () => console.log(`my-server listening on port ${PORT}!`));


