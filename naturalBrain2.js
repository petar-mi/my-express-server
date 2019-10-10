var BrainJSClassifier = require('natural-brain');
const axios = require('axios');
var classifier = new BrainJSClassifier();


// classifier.addDocument('Kakav bi mindfuck tek imali kada bi znali da eto ja nisam poslodavac, već zaposlen, da na meni 3 države i tri firme skidaju', 'posao');
// classifier.addDocument('U Srbiji je animozitet prema poslodavcima toliki da bi možda za iste bilo najbolje da svoje firme potpuno zatvore ili smanje tako da sami rade', 'posao');
// classifier.addDocument('posao', 'posao');
// classifier.addDocument('poslodavac', 'posao');
// classifier.addDocument('poslodavcem', 'posao');
// classifier.addDocument('rad', 'posao');
// classifier.addDocument('zarada', 'posao');
// classifier.addDocument('zarađujem', 'posao');
// classifier.addDocument('zaposlen', 'posao');
// classifier.addDocument('porez', 'posao');
// classifier.addDocument('doprinos', 'posao');
// classifier.addDocument('firma', 'posao');
// classifier.addDocument('firm', 'posao');
// classifier.addDocument('plata', 'posao');
// classifier.addDocument('platom', 'posao');
// classifier.addDocument('kompanija', 'posao');
// classifier.addDocument('preduzece', 'posao');
// classifier.addDocument('sef', 'posao');
// classifier.addDocument('kapital', 'posao');
// classifier.addDocument('gazda', 'posao');
// classifier.addDocument('radnik', 'posao');
// classifier.addDocument('Radnicima će zajedno sa poslom možda nestati i problemi koje imaju sa poslodavcima.', 'posao');
// classifier.addDocument('U holandskim firmama je plus ako iskreno kazes sefu sve sto mislis  i ako imas sopstvenu inicijativu, ideje i predloge', 'posao');


// classifier.addDocument('U priči oko bojkota se uporno zanemaruje tzv. "Sporazum sa narodom" koji su potpisali manje-više svi opozicioni igrači.', 'politika');
// classifier.addDocument('opozicioni', 'politika');
// classifier.addDocument('politika', 'politika');
// classifier.addDocument('politicki', 'politika');
// classifier.addDocument('opozicija', 'politika');
// classifier.addDocument('vlada', 'politika');
// classifier.addDocument('Italijanski ministar UP Salvini hoće da se izbeglice dave u moru', 'politika');
// classifier.addDocument('ministar', 'politika');
// classifier.addDocument('premijer', 'politika');
// classifier.addDocument('poslanik', 'politika');
// classifier.addDocument('Poslanicke plate su velike', 'politika');
// classifier.addDocument('Opozicioni politicari vrse pritisak na vladu i predsednika', 'politika');
// classifier.addDocument('Fenomen u medijima koji nisu pod kontrolom vlasti: dođu situacije poput ove ispred Predsedništva', 'politika');
// classifier.addDocument('Za razliku od odluke o taksama, koja je najavljena i obrazložena političkim ciljevima, ova odluka Vlade Kosova', 'politika');
// classifier.addDocument('Ko misli da treba da se pregovara pred kamerama ne zna ništa ni o politici ni o medijima', 'politika');
// classifier.addDocument('pregovor', 'politika');
// classifier.addDocument('mediji', 'politika');
// classifier.addDocument('glasanje', 'politika');
// classifier.addDocument('glasao', 'politika');
// classifier.addDocument('glasati', 'politika');
// classifier.addDocument('U nekoliko dana je u Nemačkoj neonacista pucao', 'politika');
// classifier.addDocument('Stvarno bezobrazluk da se politizuje ekonomska politika', 'politika');
// classifier.addDocument('Oduvek mi je bilo odbojno kad se svi koji glasaju za nove desničare proglase "nacistima"', 'politika');
// classifier.addDocument('levica', 'politika');
// classifier.addDocument('levicari', 'politika');
// classifier.addDocument('centar', 'politika');
// classifier.addDocument('desnica', 'politika');
// classifier.addDocument('desnicari', 'politika');
// classifier.addDocument('nacisti', 'politika');
// classifier.addDocument('Najbrže evrointegracije, ako je to sebi cilj, može da ponudi Vučić', 'politika');
// classifier.addDocument('Vučić', 'politika');
// classifier.addDocument('vucic', 'politika');
// classifier.addDocument('evrointegracije', 'politika');
// classifier.addDocument('evropa', 'politika');
// classifier.addDocument('eu', 'politika');
// classifier.addDocument('nato', 'politika');
// classifier.addDocument('savez', 'politika');
// classifier.addDocument('On je hteo da napusti stranku, da bude predsednik svih građana', 'politika');
// classifier.addDocument('stranka', 'politika');
// classifier.addDocument('partija', 'politika');
// classifier.addDocument('građani', 'politika');
// classifier.addDocument('gradjani', 'politika');
// classifier.addDocument('predsednik', 'politika');
// classifier.addDocument('izbori', 'politika');

// classifier.train();
//function done(result) { console.log( result)};
//classifier.save('./probniKlassifier.json', function () {});
// const classifyTweets  = async (testTweets) => {
function classifyTweets(testTweets) {
    //let analysedTweets = [];
    function done(result) { 
        console.log(result)
        return result;
    };
    
    let res = BrainJSClassifier.load('./probniKlassifier.json', null, null,
        function (err, newClassifier) {
            if (err) {
                return done(err);
            }
            else return done(testTweets.map(tweet => { // stvaramo novi niz objekata
                //console.log(tweet + " " + newClassifier.classify(tweet))
                return {
                    text: tweet, // tako sto spreadujemo postojece propertije objekata dobijenih sa servera
                    category: newClassifier.classify(tweet), // i dodajemo jos jedan property
                }
            }));

            //console.log(analysedTweets);
            // console.log(newClassifier.classify('Moji vode firmu, ja zarađujem samostalno, na osnovu svog znanja i sposobnosti.'));
            // console.log(newClassifier.classify('nije lepo opozicione neistomišljenike proglašavati Vučićevim igračima'));
            // console.log(newClassifier.classify('Novinar, čak i ako misli da je Vučić najgori vladalac na svetu'));
            // console.log(newClassifier.classify('umetnik političkog preživljavanja'));
            // console.log(newClassifier.classify('Kod nas još nisu izbrojali zaposlene u javnom sektoru ali svi redovno dobiju platu početkom meseca'));
            // console.log(newClassifier.classify('Ovako će izgledati Vučićeva koska: ispuni NEŠTO MALO od izbornih uslova i to će biti dovoljno da deo opozicije ide na izbore'));
            // console.log(newClassifier.classify('Srpska opozicija nije načisto sa bojkotom izbora'));
            // console.log(newClassifier.classify('Iskreno ja sam zadovoljan trenutnim poslodavcem i platom'));
            // console.log(newClassifier.classify('Pa retko ko ovde može da živi pristojno bez kapitala i veština od 40h rada nedeljno. I to ima samo delimično veze sa poslodavcima.'));
        }
    )
    setTimeout(() => {
        console.log(res)
      }, 500);

     console.log(res);
     
    }

//module.exports = classifyTweets;

async function getData() {
    return await axios.get('https://jsonplaceholder.typicode.com/posts');
  }
module.exports.getData = getData;

module.exports.classifyTweets = classifyTweets;

// module.exports = async function(testTweets) {
//     await classifyTweets(testTweets);
// }

