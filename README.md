# my-express-server

### Express server for tweets analyzer app. </br>

Scraps tweets from requested twitter user's account, classifies them and sends them to the reactJS frontend to be rendered in 3D in the browser.</br>

This is the backend part of the app, written in nodeJS, that uses [express.js](https://expressjs.com/) server, [mongoose.js](https://mongoosejs.com/) database
as well as: [puppeteer](https://pptr.dev/), web scraping library that runs a headless Chromium browser and enables website testing and scraping,
[Natural](https://github.com/NaturalNode/natural), a natural language processing library as well as [Socket.IO](https://socket.io/) JS library 
that enables real-time, bi-directional communication between web clients and servers.

How it works:
The frontend app prompts for a twitter username. (The only limitation is that the user's tweets are in English, for tweets analysis tools to work correctly.) 
Tweeter username is then sent to the backend, which activates puppeteer, web scraping library that runs a headless Chromium browser on a remote server and
imitates user browsing to visit the user's twitter account and make a collection of unique tweets. It then uses remote MeaningCloud (SaaS product that enables 
text semantic processing) API, to classify the tweets based on their text content. Simultaneously, tweets are analysed in the app itself using Natural javascript
library. If MeaningCloud fails to classify some of the tweets, then this internal classification performed by Natural is used instead. 
Due to MeaningCloud API's limit of accepting only a certain number of requests in a given period of time, as soon a single tweet has been classified it is
immediately sent to the frontend using Socket.IO where it is rendered in 3D using Three.js. </br> 
By clicking on any category, a list of the tweets shows up and if user considers the classification was not done right for any of the tweets,
this can be adjusted manually by selecting a more appropriate category from the drop-down menu, which immediately re-renders the page. 
After all tweets were rendered and possibly classification manually adjusted, "Send all back to server" option appears, which, if clicked, 
will send all the tweets and classifications to backend for Natural classifier training data to be updated and trained so to be ready when another 
analysis is issued. Also, classified tweets will be stored in a Mongo database and can be included in future tweets classifications.</br>

Locally, you can run it by navigating to the project directory:

### node server.js
Runs the app in the development mode.

For the app to work locally, a separate frontend [app](https://github.com/m-petar/tweets-analyzer-react) is required to run as well.


