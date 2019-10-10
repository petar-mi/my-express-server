// var BrainJSClassifier = require('natural-brain');
// var classifier = new BrainJSClassifier();
const natural = require('natural');
const classifier = new natural.BayesClassifier();
const fs = require('fs');


// classifier.addDocument('reminder: in 1 hour, see tim faust and myself at the Garden District Bookshop in New Orleans!', 'economy, business and finance');
// classifier.addDocument('i insist they are just not trying hard enough', 'arts, culture and entertainment');
// classifier.addDocument('last week we published a parody NYT column by @JasonAdamK in which a conservative blowhard insists that being insulted by Twitter randos signifies the decline of American discourse. This week Bret Stephens is on TV complaining that someone called him a bedbug on Twitter.', 'arts, culture and entertainment');
// classifier.addDocument('companies like Spirit Airlines aren’t just abusing their customers. They abuse their employees, forcing them to be shouted at by people with perfectly legitimate complaints... just there to absorb public outrage, which is a wearying and depressing job', 'social issue');
// classifier.addDocument('Interview will be unlocked for the general public in 2 weeks. Support us on patreon to listen now!', 'politics');
// classifier.addDocument('TONIGHT! come see @crulge and myself at the Garden District Bookshop. His new book Health Justice Now! is exceptionally good and I guarantee this will be the most lively conversation about healthcare financing you have seen all year.', 'arts, culture and entertainment');
// classifier.addDocument('Had the privilege of interviewing @KeeangaYamahtta about her upcoming book Race for Profit: How Banks and the Real Estate Industry Undermined Black Homeownership for the @curaffairs podcast!', 'economy, business and finance');
// classifier.addDocument('It’s hard to describe just what a negative force the #KochBrothers have been in #UnitedStates politics over the past several decades. They have used every means at their disposal to subvert democracy.', 'politics');
// classifier.addDocument('I do not generally celebrate people death, but this is a sobering read by @NathanJRobinson on the negative influence of the Koch Brothers on the planet and American democracy', 'politics');
// classifier.addDocument('Devolving power locally (while not abdicating our responsibility to right international wrongs) and accepting experimentation (within a framework that upholds justice and accountability) are probably the most salient parts of my plan for the future.', 'crime, law and justice');
// classifier.addDocument('crime, law and justice', 'crime, law and justice');
// classifier.addDocument('economics is a death cult', 'economy, business and finance');
// classifier.addDocument('Is the US becoming crueler? Cops smashing disabled people wheelchairs, the gov deporting a schizophrenic man to die on the streets of Baghdad, children coming home from school to find their parents gone... how can people with a shred of humanity do this?', 'social issue');
// classifier.addDocument('I struggle with these injustices every day. “Many public-spirited people turn away from practicing law for this reason: They come to find out that the victories to be won are so small that they feel negligible next to the magnitude of the problem.', 'crime, law and justice');
// classifier.addDocument('we are 100% reader-supported and have zero advertising. every single thing we do is because people who read us believe in us and want to help us.', 'economy, business and finance');
// classifier.addDocument('hundreds of original articles and illustrations. From a tiny kickstarter campaign run from my living room we have now got an office, paid staff, subscribers all over the world. Thank you so much to @curaffairs subscribers for making it possible!', 'arts, culture and entertainment');
// classifier.addDocument('It’s easier to imagine the end of the world than the end of capitalism. But we need to have faith that this shows the limits of our imaginations, not the limits of human possibility.', 'religion and belief');
// classifier.addDocument('Bernie is the only presidential candidate focused on rebuilding a powerful labor movement. If you support @labor4bernie, retweet this article!', 'politics');
// classifier.addDocument('It is very hard to keep up, and means we have an absolutely tiny paid staff. Sometimes I wish some rich funder would come along. But I think in the long run reader-supported publications are the only way to go. We just have to convince people that it is worth paying for.', 'economy, business and finance');
// classifier.addDocument('To launch a successful new magazine in this era is a remarkable enough achievement. To publish a radical magazine incubating powerful new voices and influencing the public discourse is an astonishing achievement. Three cheers for three years & the hope for the future CA inspires.', 'economy, business and finance');
// classifier.addDocument('One thing we are very fortunate to have at @curaffairs magazine is immunity from the whims of billionaires, because all of our money comes from subscriptions and small donations.', 'economy, business and finance');
// classifier.addDocument('my book main target market is people who want to make their relatives angry by giving it to them as a christmas present', 'religion and belief');
// classifier.addDocument('Our own gulag "archipelago." Every prison, jail, and detention center in the U.S. mapped. This is a dysfunctional country.', 'crime, law and justice');
// classifier.addDocument('It cannot be said enough: @TuckerCarlson rhetoric about the need to preserve an "ethnic majority" and the threat of invasion is identical to that of violent white nationalists.', 'politics');

// classifier.train();


// console.log(classifier.getClassifications('pada kisa napolju'));
// console.log('*************');
// console.log(classifier.getClassifications('He has escaped from the jail'));
// console.log('*************');
// console.log(classifier.getClassifications('political crises'));
// console.log('*************');
// console.log(classifier.getClassifications('zakrzljalo pasce'));
// console.log('*************');
// console.log(classifier.getClassifications('nevidjena budalastina prepecene krljusti'));
// console.log('*************');
// console.log(classifier.getClassifications('meso se dobija od jarebice i prepelice'));
// console.log('*************');
// console.log(classifier.getClassifications('moja glava je najpametnija, mozda'));
// console.log('*************');
// console.log(classifier.getClassifications('legality of the elections is yet to be determined. Politics'));
// console.log('*************');
// console.log(classifier.getClassifications('legality of the elections is yet to be determined.'));
// console.log('*************');
// console.log(classifier.getClassifications('lawfull crime'));

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
//     console.log('***');
//     console.log('krpena prtljaga od lepojle');
//     console.log(classifier.classify('krpena prtljaga od lepojle'));
//     console.log(classifier.getClassifications('krpena prtljaga od lepojle'));
//     console.log('***');
//     console.log('legality of the elections is yet to be determined.');
//     console.log(classifier.classify('legality of the elections is yet to be determined.'));
//     console.log(classifier.getClassifications('legality of the elections is yet to be determined.'));
//     console.log('***');
//     console.log('politics and elections');
//     console.log(classifier.classify('politics and elections'));
//     console.log(classifier.getClassifications('politics and elections'));
//     console.log('***');
//     console.log('this is frequently what leftists are referring to when we rant about liberals: people who want to be good but aren’t invested in the political projects that make the world better.');
//     console.log(classifier.classify('this is frequently what leftists are referring to when we rant about liberals: people who want to be good but aren’t invested in the political projects that make the world better.'));
//     console.log(classifier.getClassifications('this is frequently what leftists are referring to when we rant about liberals: people who want to be good but aren’t invested in the political projects that make the world better.'));
//     console.log('***');
//     console.log('Several MPs were also involved in altercation near the Speaker’s chair, as they attempted to prevent him leaving his seat and attending the House of Lords, the next step in the formalities required for the suspension of parliament. One Labour MP threw himself across Bercow’s chair in protest at the shutting down of parliament. Lloyd Russell-Moyle tried to block the Speaker by lying across him momentarily to stop him leaving to the House of Lords in the official ceremony to prorogue parliament. Other Labour colleagues, including the shadow women and equalities minister, Dawn Butler, and the backbencher Clive Lewis held up posters that read “silenced”. As Russell-Moyle was pushed away by a member of Commons staff, the Green party leader, Caroline Lucas, was seen to tumble as MPs still sat in the chamber in the early hours of this morning started heckling and shouting. Lewis tweeted that the group of MPs had been trying to re-enact an event from 1629 when the Speaker was pinned to his chair to prevent the prorogation of parliament.');
//     console.log(classifier.classify('Several MPs were also involved in altercation near the Speaker’s chair, as they attempted to prevent him leaving his seat and attending the House of Lords, the next step in the formalities required for the suspension of parliament. One Labour MP threw himself across Bercow’s chair in protest at the shutting down of parliament. Lloyd Russell-Moyle tried to block the Speaker by lying across him momentarily to stop him leaving to the House of Lords in the official ceremony to prorogue parliament. Other Labour colleagues, including the shadow women and equalities minister, Dawn Butler, and the backbencher Clive Lewis held up posters that read “silenced”. As Russell-Moyle was pushed away by a member of Commons staff, the Green party leader, Caroline Lucas, was seen to tumble as MPs still sat in the chamber in the early hours of this morning started heckling and shouting. Lewis tweeted that the group of MPs had been trying to re-enact an event from 1629 when the Speaker was pinned to his chair to prevent the prorogation of parliament.'));
//     console.log(classifier.getClassifications('Several MPs were also involved in altercation near the Speaker’s chair, as they attempted to prevent him leaving his seat and attending the House of Lords, the next step in the formalities required for the suspension of parliament. One Labour MP threw himself across Bercow’s chair in protest at the shutting down of parliament. Lloyd Russell-Moyle tried to block the Speaker by lying across him momentarily to stop him leaving to the House of Lords in the official ceremony to prorogue parliament. Other Labour colleagues, including the shadow women and equalities minister, Dawn Butler, and the backbencher Clive Lewis held up posters that read “silenced”. As Russell-Moyle was pushed away by a member of Commons staff, the Green party leader, Caroline Lucas, was seen to tumble as MPs still sat in the chamber in the early hours of this morning started heckling and shouting. Lewis tweeted that the group of MPs had been trying to re-enact an event from 1629 when the Speaker was pinned to his chair to prevent the prorogation of parliament.'));
//     console.log('***');
//     console.log('Kako je za 021.rs ispričao jedan od stanara, primetio je da ekipe Zelenila sa cisternom idu redom i zalivaju svako stablo u delu Narodnog fronta, od Bulevara oslobođenja ka Šekspirovoj, mada se čini da je većina mladih stabala osušena. Ovaj Novosađanin se pita zbog čega ovo gradsko preduzeće to radi umesto da zasadi nove mladice. U "Gradskom zelenilu" za 021.rs kažu da tek treba da se utvrdi da li su stabla osušena. Radi se o stablima koja su posađena početkom ove godine. Lišće im jeste opalo, da li zbog visokih temperatura ili se stabla nisu primila, videćemo na proleće. Do tada će biti negovana, a početkom novog perioda vegetacije definitivno će se pokazati da li su stabla suva ili nisu, kažu u ovom JKP.');
//     console.log(classifier.classify('Kako je za 021.rs ispričao jedan od stanara, primetio je da ekipe Zelenila sa cisternom idu redom i zalivaju svako stablo u delu Narodnog fronta, od Bulevara oslobođenja ka Šekspirovoj, mada se čini da je većina mladih stabala osušena. Ovaj Novosađanin se pita zbog čega ovo gradsko preduzeće to radi umesto da zasadi nove mladice. U "Gradskom zelenilu" za 021.rs kažu da tek treba da se utvrdi da li su stabla osušena. Radi se o stablima koja su posađena početkom ove godine. Lišće im jeste opalo, da li zbog visokih temperatura ili se stabla nisu primila, videćemo na proleće. Do tada će biti negovana, a početkom novog perioda vegetacije definitivno će se pokazati da li su stabla suva ili nisu, kažu u ovom JKP.'));
//     console.log(classifier.getClassifications('Kako je za 021.rs ispričao jedan od stanara, primetio je da ekipe Zelenila sa cisternom idu redom i zalivaju svako stablo u delu Narodnog fronta, od Bulevara oslobođenja ka Šekspirovoj, mada se čini da je većina mladih stabala osušena. Ovaj Novosađanin se pita zbog čega ovo gradsko preduzeće to radi umesto da zasadi nove mladice. U "Gradskom zelenilu" za 021.rs kažu da tek treba da se utvrdi da li su stabla osušena. Radi se o stablima koja su posađena početkom ove godine. Lišće im jeste opalo, da li zbog visokih temperatura ili se stabla nisu primila, videćemo na proleće. Do tada će biti negovana, a početkom novog perioda vegetacije definitivno će se pokazati da li su stabla suva ili nisu, kažu u ovom JKP.'));
//     console.log('***');
//     console.log('politics');
//     console.log(classifier.classify('politics'));
//     console.log(classifier.getClassifications('politics'));
// });


function classifyTweetsFunc(file_path, stemmer, callback) {
    natural.BayesClassifier.load(file_path, stemmer, callback);
}

function teachClassifier(file_path, tweets, callback) {
    console.log('funkcija teachClassifier je pozvana i izvrsava addDocument za svaki tvit. Ovaj log je iz brainStorm.js');
    tweets.forEach(element => {
        //console.log(element.text + " " + element.category);
        classifier.addDocument(element.text, element.category);
    });
    classifier.train();
    console.log('ovo je log izmedju train i save metode. Ovaj log je iz brainStorm.js');
    classifier.save(file_path, callback);
}


exports.classifyTweets = classifyTweetsFunc;

exports.teach = teachClassifier;













// My initial instinct was to make some smartass joke about how the photo looks like you built your home on a massive hill with no foundation. But honestly that’s a huge accomplishment and you deserve congratulations. You’re doing awesome work. We’ll keep reading/listening. arts, culture and entertainment

// This Friday! We're co-sponsoring author Timothy Faust's stop on his book tour along with @curaffairs. Come listen to @crulge share from his new book on why we need single-payer healthcare and how to achieve it. Join us! https://www.facebook.com/events/458833018302520/ … arts, culture and entertainment

// I'll be talking to @crulge about his new book Health Justice Now! at the Garden District Bookshop in New Orleans this Friday at 6pm. Come and join us! https://www.facebook.com/events/458833018302520 … arts, culture and entertainment

// also yes there are only 19 issues in the photo, #20 is rolling off the presses right now crime, law and justice

// I'm still pretty proud of this essay in which I demolish all of the National Review's arguments against socialism one by one: politics

// Cover art by Aleksandra Waliszewska! https://www.facebook.com/pages/category/Artist/Aleksandra-Waliszewska-152642531244/ … arts, culture and entertainment

// this map from the @nytimes seems almost completely useless if i'm interpreting right, a place could be dark green if it went from a .01 percent foreign-born to .02 percent. it could literally be one guy! but this can/will be used to "prove" immigrants flooding the heartland social issue

// Love this. @curaffairs has been formative to me - I especially appreciate @NathanJRobinson's articles that break down political phenomena in a way that's both rigorous and entertaining. A left antidote to the Vox explainer. politics

// wonderful article arts, culture and entertainment

// the secret is that i basically never leave the @curaffairs office economy, business and finance

// An amazing piece: 'It’s "easier to imagine the end of the world than the end of capitalism." But we need to have faith that this shows the limits of our imaginations, not the limits of human possibility.' religion and belief

// Looking forward to reading this. Am not a socialist by any measure but if anyone can convince me it's @NathanJRobinson human interest

// Seriously, this paragraph from @NathanJRobinson likely resonates with a heck of a lot of us who've done both direct services work and advocacy work. labour

// Galley copies of "Why You Should Be A Socialist" have arrived!! On sale in December. Makes an irrefutable case for socialism. If you are a member of the Media and would like an Advance Review Copy, do let me know and I can send one. economy, business and finance

// Reading @curaffairs has actually changed my views on several topics, to the point where I'm now toying with socialism (admittedly from an already very left wing position). Everyone should read this article, and all free Current Affairs articles. politics

// i've got a great candidate out of missouri running for ag 2020 @BigElad http://www.eladgross.org  most transparent campaign in america. shares every single receipt down to the gas. economy, business and finance

// Is there a good list/map of left/socialist candidates in local, state, and congressional races in 2020, especially those challenging incumbents? I can't find one and we want to cover these candidacies in @curaffairs politics

// Excellent recap of #DSACon19 from @NathanJRobinson—#ecobloc was ready! “There is lots of literature from the Ecosocialists on why a Green New Deal is needed and what it should consist of. (The Ecosocialists warn: “The Oceans Are Rising And So Are We!”)” environmental issue






