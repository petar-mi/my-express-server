const natural = require('natural');
const classifier = new natural.BayesClassifier();

function classifyTweetsFunc(file_path, stemmer, callback) {
    natural.BayesClassifier.load(file_path, stemmer, callback);
}

function teachClassifier(file_path, tweets, callback) {
    console.log('Logging from brainStorm.js... teachClassifier function has been called and executes addDocument for each tweet.');
    tweets.forEach(element => {
        //console.log(element.text + " " + element.category);
        classifier.addDocument(element.text, element.category);
    });
    classifier.train();
    console.log('Logging from brainStorm.js between train and save methods');
    classifier.save(file_path, callback);
}

exports.classifyTweets = classifyTweetsFunc;
exports.teach = teachClassifier;






// classifier.addDocument('reminder: in 1 hour, see tim faust and myself at the Garden District Bookshop in New Orleans!', 'economy, business and finance');
// classifier.addDocument('i insist they are just not trying hard enough', 'arts, culture and entertainment');
// classifier.addDocument('last week we published a parody NYT column by @JasonAdamK in which a conservative blowhard insists that being insulted by Twitter randos signifies the decline of American discourse. This week Bret Stephens is on TV complaining that someone called him a bedbug on Twitter.', 'arts, culture and entertainment');
// classifier.addDocument('companies like Spirit Airlines aren’t just abusing their customers. They abuse their employees, forcing them to be shouted at by people with perfectly legitimate complaints... just there to absorb public outrage, which is a wearying and depressing job', 'social issue');
// classifier.addDocument('Interview will be unlocked for the general public in 2 weeks. Support us on patreon to listen now!', 'politics');

// classifier.train();

// console.log(classifier.getClassifications('He has escaped from the jail'));
// console.log('*************');
// console.log(classifier.getClassifications('political crises'));
// console.log('*************');

//classifier.save('./probniKlassifier.json', function () {});

// natural.BayesClassifier.load('./probniKlassifier2.json', null, function (err, classifier) {
//     console.log('***');
//     console.log('With your help, we will spread joy and destroy the right…');
//     console.log(classifier.classify('With your help, we will spread joy and destroy the right…'));
//     console.log(classifier.getClassifications('With your help, we will spread joy and destroy the right…'));
//     console.log('***');
//     console.log('exhibit no. 86271 of “men are too insecure to know they’re insecure');
//     console.log(classifier.classify('exhibit no. 86271 of “men are too insecure to know they’re insecure'));
//     console.log(classifier.getClassifications('exhibit no. 86271 of “men are too insecure to know they’re insecure'));
// });