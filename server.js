const http = require('http');
const express = require('express');
var cors = require('cors');
const socketIo = require("socket.io");
const socketIndex = require("./routes/index");
const mongoose = require('mongoose');
const app = express();
app.use(express.json());
app.use(cors()); // enables CORS for all requests
app.use(socketIndex);
const server = http.createServer(app);
const io = socketIo(server); // da nismo koristili namespace (nsp), ovde bi bilo global.io kako bi bilo dostupno i u modulu user
global.nsp = io.of('/my-namespace'); // umesto const nsp pisemo global kako bi bilo dostupno i u modulu user

const test = require('./routes/test');
const checkUser = require('./routes/checkUser');
const feed = require('./routes/feed');
const user = require('./routes/user');
app.use('/test', test);
app.use('/checkUser', checkUser);
app.use('/feed', feed);
app.use('/user', user);

//*** Mongoose Schemas and Models ***
// const userSchema = new mongoose.Schema({
//   username: {
//     type: String,
//     unique: true,
//   },
//   createdOn: { type: Date, default: Date.now },
// });
// const User = mongoose.model('User', userSchema);

// const tweetSchema = new mongoose.Schema({
//   text: {
//     type: String,
//     //required: true,
//   },
//   category: String,
//   user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
// });
// const Tweet = mongoose.model('Tweet', tweetSchema);
// *** END of Mongoose Schemas and Models ***

// // SOCKET.IO LISTENER
// nsp.on('connection', function (socket) { // listens to any new connection and executes function
//   // The connection event returns a socket object which will be passed to the callback function.
//   // Use socket to communicate with this particular client only, sending it it's own id
//   socket.emit('welcome', { message: 'This message is from Serverside Socket.IO identifying itself!', id: socket.id });

//   socket.on('i am client', (obj) => console.log(obj.data, obj.id)); // bez ovoga se u konzoli servera ne ispisuje { data: 'I am client and my id is: ', id: '7XETFIsKoe9f0ieGAAAB' } 
//   // sto je poruka koju salje klijent u redu: socket.emit('i am client', {data: 'foo!', id: data.id});
//   // klijent ovde vraca svoj id koji je prethodno dobio od servera
//   socket.on("disconnect", () => console.log(`Client with id: ${socket.id} has disconnected`));
// });
// io.on('connection', function (socket) { // (without a namespace) listens to any new connection and executes function
// The connection event returns a socket object which will be passed to the callback function.
// Use socket to communicate with this particular client only, sending it it's own id
// socket.emit('welcome', { message: 'Welcome!', id: socket.id });


// function extractItems(items) {
//   // const extractedParentElements = document.getElementsByClassName('css-901oao r-1qd0xha r-a023e6 r-16dba41 r-ad9z0x r-bcqeeo r-bnwqim r-qvutc0');                               
//   // prethodni red vazi ukoliko je prvo bio potreban login!!! a uko idemo bez logina onda su klase ovakve:
//   const extractedParentElements = document.getElementsByClassName('TweetTextSize TweetTextSize--normal js-tweet-text tweet-text');
//   for (let parentElement of extractedParentElements) {
//     // items.push(parentElement.firstElementChild.innerText); // ovo vazi za slucaj da je bio izvrsen login
//     items.push(parentElement.innerText); // ovo vazi za slucaj bez prethodnog logovanja
//   }
//   console.log(items);
//   console.log("*********************************************");
//   return items;
// }

// async function scrTweets(page, extractItems) {
//   let items = [];
//   try {
//     for (let i = 0; i < 1; i++) { // podeseno na i < 1 radi brzine testinga, i odredjuje koliko puta ce biti izvrsen scroll
//       items = await page.evaluate(extractItems, items);
//       await page.evaluate('window.scrollTo(0, document.body.scrollHeight)');
//       console.log(i + 1 + '. skrol izvrsen');
//       await page.waitFor(3000);
//     }
//   } catch (e) {
//     console.log(e);
//   }
//   return items;
// }

// PRIMER za screenshot PUPPETEER
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
// KRAJ primera za screenshot PUPPETEER


// app.get('/checkUser/:id', async (req, res, next) => {
//   console.log(req.params.id);
//   console.log(User);
//   console.log(User.findOne);

//   async function ckeckIfUserExistsInDb() {
//     const existingUser = await User
//       .findOne({ username: req.params.id });
//     if (existingUser) {
//       (console.log("Username: " + " " + req.params.id + " postoji u bazi."));
//       (console.log(existingUser));
//       const tweetsByUser = await Tweet
//         .find({ user: existingUser._id });
//       console.log(tweetsByUser);
//       console.log(existingUser._id);
//       console.log(existingUser.username);
//       res.send({ message: "postoji u bazi", tweetsArray: tweetsByUser, user: existingUser });
//     } else {
//       (console.log("Username: " + " " + req.params.id + " ne postoji u bazi."));

//       res.send({ message: "NE postoji u bazi" });
//     }
//   }
//   try {
//     ckeckIfUserExistsInDb();
//   } catch (e) {
//     console.log(e);
//   }
// });

// app.get('/test/:id', async (req, res, next) => { // Test endpoint to use with Postman
//   try {
//     console.log("Primljen je test request sa parametrom", req.params.id);
//     res.send({ message: "Test uspeo", id: req.params.id });
//   } catch (error) {
//     console.log(error);
//   }
// });

// app.get('/user/:id', async (req, res, next) => {
//   console.log(req.params.id);

//   //****** PUPPETEER - otkomentarisati da bi islo na tviter i kupilo tvitove *********
//   // const browser = await puppeteer.launch({ headless: false, }); // zakomentarisano jer ne radi u produkciji na heroku
//   const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});
//   const page = await browser.newPage();
//   page.setViewport({ width: 800, height: 800 });
//   await page.goto(`https://twitter.com/${req.params.id}`); // URL is given by the "user" (your client-side application)

//   await page.waitFor(2000); // tako da sam stavio proizvoljno da saceka 2sec da se ucita stranica

//   function checkIfTwitterAccountExists(twitterUser) {
//     if (document.getElementsByClassName('errorpage-body-content')[0].firstElementChild.innerText == "Sorry, that page doesn’t exist!") {
//       console.log(twitterUser);
//       console.log(`Twitter profil ne postoji!`);
//       return true;
//     };
//   }

//   let accountNonExistent = false;
//   try {
//     accountNonExistent = await page.evaluate(checkIfTwitterAccountExists, req.params.id);
//   } catch (e) { // ceo veliki deo koda koji sledi smesten je u ovaj catch deo jer se izvrsava ukoliko puppeteer nije mogao da ustanovi da twitter profil ne postoji i bacio je gresku tom prilikom
//     console.log(e); // ukoliko je profil pronadjen logovace gresku ("evaluation failed") i nastaviti dalje normalno
//     console.log("Pronadjen je twitter profil!");
//     console.log("kreiramo novog usera");
//   const user = new User({
//     username: req.params.id
//   });
//   let newlyCreatedUser = await user.save()
//     .catch(err => console.error('Greska pri snimanju user dokumenta: ', err)); // ovde ce logovati gresku ukoliko je duplikat tj. user vec postoji u bazi
//   if (newlyCreatedUser) {
//     console.log("stvoren je novi user: ");
//     console.log(newlyCreatedUser);
//     console.log(newlyCreatedUser._id);
//   }

//   const items = await scrTweets(page, extractItems);
//   let uniqueItems = [...new Set(items)];

//   await browser.close();

//   console.log('ispisujem uniqueItems nakon puppeteer-a:');
//   console.log(uniqueItems);
//   //***** KRAJ PUPPETEER ******

//   // MOCK TWEETS ARRAY FOR TESTING
//   // let uniqueItems = [
//   //   'Football is the most popular sport by far',
//   //   'The hurricane center advised that heavy rains from the storm were expected to occur',
//   //   'That was a great tennis match',
//   //   'My computer is using the wrong graphics card',
//   //   'This is a newly addes tweet about sport',
//   //   '2 years ago, when Bruce Gilley published an article on why "colonialism was good," I said he would relish the backlash, and claim he was being persecuted by leftists for independent thought even though his article was an obviously fraudulent and racist piece of pseudoscholarship.',
//   //   'Here is my original article explaining why Gilley work is historically illiterate racist garbage',
//   //   'This is a wholy new basketball tweet'
//   // ];

//   // *** Analysing tweets array uniqueItems locally using "Natural": https://github.com/NaturalNode/natural 
//   let analizedTweets = [];

//   classificator.classifyTweets("./trainedClassifier.json", null, function (err, newClassifier) {
//     if (err) {
//       return console.log(err);
//     }

//     analizedTweets = (uniqueItems.map(tweet => {
//       return {
//         text: tweet,
//         category: newClassifier.classify(tweet),
//         classifications: newClassifier.getClassifications(tweet),
//         classificationsJSON: JSON.stringify(newClassifier.getClassifications(tweet)),
//         definiteCategory: newClassifier.getClassifications(tweet)[0].label
//       }
//     }));

//     console.log("ISPISUJEM NATURAL CLASSIFIER: ");
//     //console.log(analizedTweets);
//     // *** END of Analysing tweets array uniqueItems locally using "Natural"


//     // trebalo je da filtrira dobijene kategorije po osnovu verovatnoce, ali je prekompleksno i zato je zakomentarisano:
//     // let filteredAnalizedTweets = analizedTweets.filter(tweet => tweet.classifications.filter(item => Math.floor(item.value * 10) < 1).length == tweet.classifications.length); // filtrira samo one analize koje imaju barem jedan value koji pocinje na drugoj decimali
//     // console.log("ISPISUJEM FILTERED NATURAL CLASSIFIER: ");
//     // console.log(filteredAnalizedTweets);
//   });

//   let toBeSentBack = [];

//   for (let a = 0; a < uniqueItems.length; a++) {

//     var options;

//     classifyCount = function (toBeSentBack) {

//       let artsCultureAndEntertainmentCounter, crimeLawAndJusticeCounter, disasterAndAccidentCounter, economyBusinessAndFinanceCounter, educationCounter,
//         environmentalIssueCounter, healthCounter, humanInterestCounter, labourCounter, lifestyleAndLeisureCounter, politicsCounter, religionAndBeliefCounter,
//         scienceAndTechnologyCounter, socialIssueCounter, sportCounter, unrestConflictsAndWarCounter, weatherCounter;

//       artsCultureAndEntertainmentCounter = crimeLawAndJusticeCounter = disasterAndAccidentCounter = economyBusinessAndFinanceCounter = educationCounter = environmentalIssueCounter = healthCounter = humanInterestCounter = labourCounter = lifestyleAndLeisureCounter = politicsCounter = religionAndBeliefCounter = scienceAndTechnologyCounter = socialIssueCounter = sportCounter = unrestConflictsAndWarCounter = weatherCounter = 0;


//       toBeSentBack.forEach(element => {
//         if (element.category == "arts, culture and entertainment") artsCultureAndEntertainmentCounter++;
//         if (element.category == "crime, law and justice") crimeLawAndJusticeCounter++;
//         if (element.category == "disaster and accident") disasterAndAccidentCounter++;
//         if (element.category == "economy, business and finance") economyBusinessAndFinanceCounter++;
//         if (element.category == "education") educationCounter++;
//         if (element.category == "environmental issue") environmentalIssueCounter++;
//         if (element.category == "health") healthCounter++;
//         if (element.category == "human interest") humanInterestCounter++;
//         if (element.category == "labour") labourCounter++;
//         if (element.category == "lifestyle and leisure") lifestyleAndLeisureCounter++;
//         if (element.category == "politics") politicsCounter++;
//         if (element.category == "religion and belief") religionAndBeliefCounter++;
//         if (element.category == "science and technology") scienceAndTechnologyCounter++;
//         if (element.category == "social issue") socialIssueCounter++;
//         if (element.category == "sport") sportCounter++;
//         if (element.category == "unrest, conflicts and war") unrestConflictsAndWarCounter++;
//         if (element.category == "weather") weatherCounter++;
//       });
//       return {
//         artsCultureAndEntertainmentCounter: artsCultureAndEntertainmentCounter, crimeLawAndJusticeCounter: crimeLawAndJusticeCounter, disasterAndAccidentCounter: disasterAndAccidentCounter,
//         economyBusinessAndFinanceCounter: economyBusinessAndFinanceCounter, educationCounter: educationCounter, environmentalIssueCounter: environmentalIssueCounter,
//         healthCounter: healthCounter, humanInterestCounter: humanInterestCounter, labourCounter: labourCounter, lifestyleAndLeisureCounter: lifestyleAndLeisureCounter,
//         politicsCounter: politicsCounter, religionAndBeliefCounter: religionAndBeliefCounter, scienceAndTechnologyCounter: scienceAndTechnologyCounter,
//         socialIssueCounter: socialIssueCounter, sportCounter: sportCounter, unrestConflictsAndWarCounter: unrestConflictsAndWarCounter, weatherCounter: weatherCounter
//       }
//     }

//     if (a % 2 == 0) {
//       options = {
//         method: 'POST',
//         url: 'https://api.meaningcloud.com/class-1.1',
//         headers: { 'content-type': 'application/x-www-form-urlencoded' },
//         form: {
//           key: '246b149fa5d4b95ce592d9b847f238d3', // 1.thing.needed@gmail.com krofnica_987# 
//           txt: uniqueItems[a],
//           url: '',
//           doc: '',
//           model: 'IPTC_en'
//         }
//       };
//     } else {
//       options = {
//         method: 'POST',
//         url: 'https://api.meaningcloud.com/class-1.1',
//         headers: { 'content-type': 'application/x-www-form-urlencoded' },
//         form: {
//           key: '077482e2887f12919c0d55cee4d55537', // preko bobana linkedin-a
//           txt: uniqueItems[a],
//           url: '',
//           doc: '',
//           model: 'IPTC_en'
//         }
//       };
//     };

//     //console.log(options.form.key);

//     function sendToMeaningcloudForAnalysis(options, callback) {
//       request(options, callback); // makes a http post request to a remote AI API
//     }

//     setTimeout(sendToMeaningcloudForAnalysis, 1100 * a, options, function (err, response) {
//       if (err) {
//         console.log(err);
//       } else {
//         let responseObject = JSON.parse(response.body);
//         console.log('Text:');
//         console.log(uniqueItems[a]);
//         console.log("responseObject");
//         console.log(responseObject);
//         if (responseObject.status.code == "0") {
//           if (responseObject.category_list.length == 0) { // UKOLIKO Meaningcloud NIJE pronasao kategorije u tweet-u one ce biti odredjene vec izvrsenom lokalnom analizom
//             console.log("nema prepoznatih kategorija");
//             console.log("*******************************");
//             const locallyAnalizedLabel = analizedTweets.find(item => item.text == uniqueItems[a]).category;
//             console.log("ubacuje se lokalno dobijena kategorija: " + " " + locallyAnalizedLabel);
//             toBeSentBack.push({ // pushuje u niz koji ce biti poslat tek nakon sto svi tvitovi budu obradjeni
//               text: uniqueItems[a],
//               category: locallyAnalizedLabel, // preuzima kategoriju dobijenu vec izvrsenim upitom lokalnog Bayes classifier-a
//             });
//             nsp.emit('singleTweetAnalysed', {
//               text: uniqueItems[a],
//               category: locallyAnalizedLabel, // preuzima kategoriju dobijenu vec izvrsenim upitom lokalnog Bayes classifier-a
//               id: a
//             });
//           }
//           else { // UKOLIKO Meaningcloud JESTE pronasao kategorije u tweet-u
//             let relevantneKategorije = responseObject.category_list.filter(category => parseInt(category.relevance) > 80); // filtrira samo kategorije sa relevantnoscu > 80
//             if (relevantneKategorije.length > 0) {
//               console.log('Relevantne kategorije');
//               console.log(relevantneKategorije);
//               let maxRelevance = Math.max.apply(Math, relevantneKategorije.map(function (item) { return item.relevance; })) // ako je bilo vise kategorija sa verovatnocom vecom od 80, pronalazi najvecu medju njima
//               let mostRelevantCategoryObject = relevantneKategorije.find(item => parseInt(item.relevance) == maxRelevance); // pronalazi prvi obj koji ima relevance properti == prethodno utvrdjenoj najvecoj vrednosti tog propertija medju svim objektima u nizu
//               let label = mostRelevantCategoryObject.label;
//               if (label.includes("-")) {
//                 label = label.split('-')[0].trim();
//               }
//               console.log("Edited Label: ");
//               console.log(label);
//               console.log("*******************************");
//               toBeSentBack.push({ // pushuje u niz koji ce biti poslat tek nakon sto svi tvitovi budu obradjeni
//                 text: uniqueItems[a], // tako sto spreadujemo postojece propertije objekata dobijenih sa servera
//                 category: label, // i dodajemo jos jedan property
//               });
//               nsp.emit('singleTweetAnalysed', {
//                 text: uniqueItems[a], // tako sto spreadujemo postojece propertije objekata dobijenih sa servera
//                 category: label, // i dodajemo jos jedan property
//                 id: a
//               });
//             }
//           }
//           if (a == uniqueItems.length - 1) { // returns final objekt to client when reaches the last array member
//             console.log("Krajnja vrednost niza: ");
//             console.log(toBeSentBack);
//             console.log(newlyCreatedUser); // undefined if attempted creation of new user ended in error (user already in database)
//             res.send({ newUserObj: newlyCreatedUser, // this property won't be created if newlyCreatedUser was undefined (zakomentarisati samo ako je iskljucen deo sa Puppeteer + kreiranje novog usera koje je odmah posle toga, jer inace puca server)
//                        tweets: toBeSentBack, 
//                        classificationCount: classifyCount(toBeSentBack) });
//           }
//         }
//       }
//     });
//   }
//   };

//   if (accountNonExistent) { // ukoliko je puppeteer ustanovio da tw profil ne postoji setovao je vrednost accountNonExistent na true i onda se ivrsava ovaj kod
//     console.log("Ne postoji takav twitter profil");
//     res.send({ message: "Ne postoji takav twitter profil" });
//   };
// });


// app.post('/feed', function (req, res, next) {

//   console.log("sledeci user objekat je stigao i tvitovi ce biti arhivirani pod njegovim id-jem");
//   console.log(req.body.userDbObj);

//   fs.readFile('./trainingData.json', (err, file) => {
//     let oldArray = JSON.parse(file);
//     let newArray = req.body.editedTweets.filter(tweet => tweet.category != 'unknown'); // exclude tweets for which the category is 'unknown'

//     let updatedArray = oldArray.concat(newArray);


//     function finalMapping(arrayOfObjects) { // pre snimanja stvara novi niz koji se sastoji samo iz jedinstvenih tekstova tvitova
//       let arrayOfObjectsMap = [];
//       let map = new Map();
//       for (let item of arrayOfObjects) {
//         if (!map.has(item.text)) {
//           // set any value to Map (mogli smo mapirati i pomocu nameString propertija, svejedno je u ovom slucaju)
//           map.set(item.text, true); // set any value to Map
//           arrayOfObjectsMap.push({
//             text: item.text,
//             category: item.category
//           });
//         }
//       }
//       return arrayOfObjectsMap;
//     };

//     let mappedArray = finalMapping(updatedArray);


//     fs.writeFile('./trainingData.json', JSON.stringify(mappedArray), (err) => {
//       if (err) throw err;
//       console.log('The file has been saved!');

//       fs.readFile('./trainingData.json', (err, file) => {
//         let trainingData = JSON.parse(file);
//         classificator.teach("./trainedClassifier.json", trainingData, function (err, newClassifier) {
//           if (err) {
//             return console.log(err);
//           }
//           console.log('training saved!');
//         });
//       });

//     });

//     console.log("////Tvitovi koji su stigli iz Reacta da budu snimljeni u bazu osim ako nisu vec tamo: ///////");
//     console.log(req.body.editedTweets);
//     console.log("///////////");


//     req.body.editedTweets.forEach(tweet => {
//       async function ckeckIfTweetExists() {
//         const existingTweet = await Tweet
//           .findOne({ text: tweet.text });
//         if (!existingTweet) {
//           const newTweetToSave = new Tweet({
//             text: tweet.text,
//             category: tweet.category,
//             user: req.body.userDbObj._id
//           });

//           let savedTweet = await newTweetToSave.save()
//             .catch(err => console.error('Greska pri snimanju tweet dokumenta: ', err));
//           if (savedTweet) {
//             console.log("Snimljen je tweet: ");
//             console.log(savedTweet);
//           }
//         }
//       }
//       ckeckIfTweetExists();
//     });
//   });

//   res.send("Puno pozdrava");
// });

mongoose.connect('mongodb://localhost:27017/tweetsDB', { useNewUrlParser: true })
//mongoose.connect('mongodb://psmokvic:novasifra1@ds052978.mlab.com:52978/tweets_db', { useNewUrlParser: true }) // psmokvic i novasifra1 kreirani su kao User na sajtu mLab-a i treba ih ubaciti u connection string
  .then(() => console.log("Connected to MongoDB..."))
  .catch(err => console.error('Could not connect to MongoDB...', err));

const PORT = process.env.PORT || 8080;

server.listen(PORT, () => console.log(`my-server listening on port ${PORT}!`));


