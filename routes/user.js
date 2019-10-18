const express = require('express');
const router = express.Router();
const puppeteer = require('puppeteer');
const request = require("request");
var classificator = require('../NaturalLanguageProcessing/brainStorm');
const { User } = require('../models/userModel'); // mora da se uvozi na taj nacin sa { User }, bez zagrada ne bi radilo


// SOCKET.IO LISTENER
nsp.on('connection', function (socket) { // listens to any new connection and executes function
  // The connection event returns a socket object which will be passed to the callback function.
  // Use socket to communicate with this particular client only, sending it it's own id
  socket.emit('welcome', { message: 'This message is from Serverside Socket.IO identifying itself!', id: socket.id });

  socket.on('i am client', (obj) => console.log(obj.data, obj.id)); // bez ovoga se u konzoli servera ne ispisuje { data: 'I am client and my id is: ', id: '7XETFIsKoe9f0ieGAAAB' } 
  // sto je poruka koju salje klijent u redu: socket.emit('i am client', {data: 'foo!', id: data.id});
  // klijent ovde vraca svoj id koji je prethodno dobio od servera
  socket.on("disconnect", () => console.log(`Client with id: ${socket.id} has disconnected`));
});


function extractItems(items) {
  // const extractedParentElements = document.getElementsByClassName('css-901oao r-1qd0xha r-a023e6 r-16dba41 r-ad9z0x r-bcqeeo r-bnwqim r-qvutc0');                               
  // prethodni red vazi ukoliko je prvo bio potreban login!!! a uko idemo bez logina onda su klase ovakve:
  const extractedParentElements = document.getElementsByClassName('TweetTextSize TweetTextSize--normal js-tweet-text tweet-text');
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
    for (let i = 0; i < 1; i++) { // podeseno na i < 1 radi brzine testinga, i odredjuje koliko puta ce biti izvrsen scroll
      items = await page.evaluate(extractItems, items);
      await page.evaluate('window.scrollTo(0, document.body.scrollHeight)');
      console.log(i + 1 + '. skrol izvrsen');
      await page.waitFor(3000);
    }
  } catch (e) {
    console.log(e);
  }
  return items;
}

router.get('/:id', async (req, res, next) => {
  console.log(req.params.id);

  //****** PUPPETEER - otkomentarisati da bi islo na tviter i kupilo tvitove *********
  //const browser = await puppeteer.launch({ headless: false, }); // zakomentarisano jer ne radi u produkciji na heroku
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  page.setViewport({ width: 800, height: 800 });
  await page.goto(`https://twitter.com/${req.params.id}`); // URL is given by the "user" (your client-side application)

  await page.waitFor(2000); // tako da sam stavio proizvoljno da saceka 2sec da se ucita stranica

  function checkIfTwitterAccountExists(twitterUser) {
    if (document.getElementsByClassName('errorpage-body-content')[0].firstElementChild.innerText == "Sorry, that page doesn’t exist!") {
      console.log(`${twitterUser}  Twitter profil ne postoji!`);
      return true;
    };
  }

  let accountNonExistent = false;

  try {
    accountNonExistent = await page.evaluate(checkIfTwitterAccountExists, req.params.id); // eventualno postaje true nakon evaluacije u funkciji checkIfTwitterAccountExists
  } catch (e) { // ceo veliki deo koda koji sledi smesten je u ovaj catch deo jer se izvrsava ukoliko puppeteer nije mogao da ustanovi da twitter profil ne postoji i bacio je gresku tom prilikom
    console.log(e); // ukoliko je profil pronadjen logovace gresku ("evaluation failed") i nastaviti dalje normalno
    console.log("Pronadjen je twitter profil!");
    console.log("kreiramo novog usera");
    const user = new User({
      username: req.params.id
    });
    let newlyCreatedUser = await user.save()
      .catch(err => console.error('Greska pri snimanju user dokumenta: ', err)); // ovde ce logovati gresku ukoliko je duplikat tj. user vec postoji u bazi
    if (newlyCreatedUser) {
      console.log("stvoren je novi user: ");
      console.log(newlyCreatedUser);
      console.log(newlyCreatedUser._id);
    }

    const items = await scrTweets(page, extractItems);
    let uniqueItems = [...new Set(items)];

    await browser.close();

    console.log('ispisujem uniqueItems nakon puppeteer-a:');
    console.log(uniqueItems);
    //***** END of PUPPETEER ******

    // MOCK TWEETS ARRAY FOR TESTING
    // let uniqueItems = [
    //   'Football is the most popular sport by far',
    //   'The hurricane center advised that heavy rains from the storm were expected to occur',
    //   'That was a great tennis match',
    //   'My computer is using the wrong graphics card',
    //   'This is a newly addes tweet about sport',
    //   '2 years ago, when Bruce Gilley published an article on why "colonialism was good," I said he would relish the backlash, and claim he was being persecuted by leftists for independent thought even though his article was an obviously fraudulent and racist piece of pseudoscholarship.',
    //   'Here is my original article explaining why Gilley work is historically illiterate racist garbage',
    //   'This is a wholy new basketball tweet'
    // ];

    // *** Analysing tweets array uniqueItems locally using "Natural": https://github.com/NaturalNode/natural 
    let analizedTweets = [];

    classificator.classifyTweets("NaturalLanguageProcessing/trainedClassifier.json", null, function (err, newClassifier) {
      if (err) {
        return console.log(err);
      }

      analizedTweets = (uniqueItems.map(tweet => {
        return {
          text: tweet,
          category: newClassifier.classify(tweet),
          //classifications: newClassifier.getClassifications(tweet),
          //classificationsJSON: JSON.stringify(newClassifier.getClassifications(tweet)),
          //definiteCategory: newClassifier.getClassifications(tweet)[0].label
        }
      }));

      console.log("ISPISUJEM NATURAL CLASSIFIER: ");
      console.log(analizedTweets);
      // *** END of Analysing tweets array uniqueItems locally using "Natural"

      // trebalo je da filtrira dobijene kategorije po osnovu verovatnoce, ali je prekompleksno i zato je zakomentarisano:
      // let filteredAnalizedTweets = analizedTweets.filter(tweet => tweet.classifications.filter(item => Math.floor(item.value * 10) < 1).length == tweet.classifications.length); // filtrira samo one analize koje imaju barem jedan value koji pocinje na drugoj decimali
      // console.log("ISPISUJEM FILTERED NATURAL CLASSIFIER: ");
      // console.log(filteredAnalizedTweets);
    });

    // SENDING TWEETS FOR ANALYSIS TO meaningcloud.com
    for (let a = 0; a < uniqueItems.length; a++) {

      var options;

      // every other tweet will be sent via differtent meaningcloud.com account using unique key to workaround 2sec interval between sending request that was set by meaningcloud.com
      if (a % 2 == 0) {
        options = {
          method: 'POST',
          url: 'https://api.meaningcloud.com/class-1.1',
          headers: { 'content-type': 'application/x-www-form-urlencoded' },
          form: {
            key: '246b149fa5d4b95ce592d9b847f238d3', // 1.thing.needed@gmail.com krofnica_987# 
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
            txt: uniqueItems[a],
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

      setTimeout(sendToMeaningcloudForAnalysis, 1100 * a, options, function (err, response) { // sets a 1,1sec interval between sending request to meaningcloud.com API
        if (err) {
          console.log(err);
        } else {
          let responseObject = JSON.parse(response.body);
          console.log('Text:');
          console.log(uniqueItems[a]);
          console.log("responseObject");
          console.log(responseObject);
          if (responseObject.status.code == "0") {
            if (responseObject.category_list.length == 0) { // ukoliko Meaningcloud NIJE pronasao kategorije u tweet-u one ce biti odredjene vec izvrsenom lokalnom analizom
              console.log("nema prepoznatih kategorija");
              console.log("*******************************");
              const locallyAnalizedLabel = analizedTweets.find(item => item.text == uniqueItems[a]).category;
              console.log("ubacuje se lokalno dobijena kategorija: " + " " + locallyAnalizedLabel);
              nsp.emit('singleTweetAnalysed', {
                text: uniqueItems[a],
                category: locallyAnalizedLabel, // preuzima kategoriju dobijenu vec izvrsenim upitom lokalnog Bayes classifier-a
                id: a
              });
            }
            else { // ukoliko Meaningcloud JESTE pronasao kategorije u tweet-u
              let relevantneKategorije = responseObject.category_list.filter(category => parseInt(category.relevance) > 80); // filtrira samo kategorije sa relevantnoscu > 80
              if (relevantneKategorije.length > 0) {
                console.log('Relevantne kategorije');
                console.log(relevantneKategorije);
                let maxRelevance = Math.max.apply(Math, relevantneKategorije.map(function (item) { return item.relevance; })) // ako je bilo vise kategorija sa verovatnocom vecom od 80, pronalazi najvecu medju njima
                let mostRelevantCategoryObject = relevantneKategorije.find(item => parseInt(item.relevance) == maxRelevance); // pronalazi prvi obj koji ima relevance properti == prethodno utvrdjenoj najvecoj vrednosti tog propertija medju svim objektima u nizu
                let label = mostRelevantCategoryObject.label;
                if (label.includes("-")) {
                  label = label.split('-')[0].trim();
                }
                console.log("Edited Label: ");
                console.log(label);
                console.log("*******************************");
                nsp.emit('singleTweetAnalysed', {
                  text: uniqueItems[a], // tako sto spreadujemo postojece propertije objekata dobijenih sa servera
                  category: label, // i dodajemo jos jedan property
                  id: a
                });
              }
            }
            if (a == uniqueItems.length - 1) { // returns final objekt to client when reaches the last array member
              newlyCreatedUser ? console.log(newlyCreatedUser) : console.log("newlyCreatedUser was not created"); // undefined if attempted creation of new user ended in error (user already in database)
              res.send({ newUserObj: newlyCreatedUser, // this property won't be created if newlyCreatedUser was undefined (zakomentarisati samo ako je iskljucen deo sa Puppeteer + kreiranje novog usera koje je odmah posle toga, jer inace puca server)
                         message: "Tweets analysis has just finished!"             
               }); 
            }
          }
        }
      });
    }
  };

  if (accountNonExistent) { // ukoliko je puppeteer ustanovio da tw profil ne postoji setovao je vrednost accountNonExistent na true i onda se ivrsava ovaj kod
    console.log("Ne postoji takav twitter profil");
    res.send({ message: "Ne postoji takav twitter profil" });
  };
});

module.exports = router;
